-- ============================================================
-- Módulo Amigos & Conexões - Amooora
-- Executar no Supabase SQL Editor (ou via migration)
-- ============================================================

-- 1) Coluna opcional whatsapp em profiles (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'whatsapp'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN whatsapp text NULL;
    COMMENT ON COLUMN public.profiles.whatsapp IS 'Telefone WhatsApp E.164 (ex: +5511999999999), opcional';
  END IF;
END $$;

-- 2) Tabela friend_requests (solicitações/conexões)
CREATE TABLE IF NOT EXISTS public.friend_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz NULL,
  CONSTRAINT no_self_request CHECK (requester_id != addressee_id)
);

-- pair_key para unicidade do par (evitar duplicidade em qualquer direção)
ALTER TABLE public.friend_requests
  ADD COLUMN IF NOT EXISTS pair_key text NULL;

-- Preencher pair_key para registros existentes e trigger para novos
CREATE OR REPLACE FUNCTION public.friend_requests_set_pair_key()
RETURNS trigger AS $$
BEGIN
  NEW.pair_key := LEAST(NEW.requester_id::text, NEW.addressee_id::text) || ':' || GREATEST(NEW.requester_id::text, NEW.addressee_id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_friend_requests_pair_key ON public.friend_requests;
CREATE TRIGGER tr_friend_requests_pair_key
  BEFORE INSERT OR UPDATE OF requester_id, addressee_id ON public.friend_requests
  FOR EACH ROW EXECUTE FUNCTION public.friend_requests_set_pair_key();

UPDATE public.friend_requests SET pair_key = LEAST(requester_id::text, addressee_id::text) || ':' || GREATEST(requester_id::text, addressee_id::text) WHERE pair_key IS NULL;
ALTER TABLE public.friend_requests ALTER COLUMN pair_key SET NOT NULL;

-- Índice único: um único pending ou accepted por par
CREATE UNIQUE INDEX IF NOT EXISTS idx_friend_requests_pair_active
  ON public.friend_requests (pair_key)
  WHERE status IN ('pending', 'accepted');

CREATE INDEX IF NOT EXISTS idx_friend_requests_requester ON public.friend_requests (requester_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_addressee ON public.friend_requests (addressee_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_status ON public.friend_requests (status);

-- 3) Tabela messages (chat entre amigos, TTL 7 dias)
CREATE TABLE IF NOT EXISTS public.friend_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_pair_key text NOT NULL,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days')
);

CREATE INDEX IF NOT EXISTS idx_friend_messages_pair ON public.friend_messages (connection_pair_key);
CREATE INDEX IF NOT EXISTS idx_friend_messages_expires ON public.friend_messages (expires_at);

-- 4) RLS friend_requests
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "friend_requests_select_own" ON public.friend_requests;
CREATE POLICY "friend_requests_select_own" ON public.friend_requests
  FOR SELECT USING (requester_id = auth.uid() OR addressee_id = auth.uid());

DROP POLICY IF EXISTS "friend_requests_insert_requester" ON public.friend_requests;
CREATE POLICY "friend_requests_insert_requester" ON public.friend_requests
  FOR INSERT WITH CHECK (requester_id = auth.uid());

-- USING: quem pode atualizar (só linhas onde o usuário é destinatário ou remetente e está pending)
-- WITH CHECK: como pode ficar a nova linha (após aceitar/recusar/cancelar, status muda; a nova linha
--   deve continuar tendo o usuário como requester ou addressee, senão o UPDATE é bloqueado)
DROP POLICY IF EXISTS "friend_requests_update_addressee_accept_reject" ON public.friend_requests;
CREATE POLICY "friend_requests_update_addressee_accept_reject" ON public.friend_requests
  FOR UPDATE
  USING (
    (addressee_id = auth.uid() AND status = 'pending')
    OR (requester_id = auth.uid() AND status = 'pending')
  )
  WITH CHECK (requester_id = auth.uid() OR addressee_id = auth.uid());

-- 5) RLS friend_messages
ALTER TABLE public.friend_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "friend_messages_select_participant" ON public.friend_messages;
CREATE POLICY "friend_messages_select_participant" ON public.friend_messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

DROP POLICY IF EXISTS "friend_messages_insert_sender" ON public.friend_messages;
CREATE POLICY "friend_messages_insert_sender" ON public.friend_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- 6) Função para limpar mensagens expiradas (chamar no app ou via cron)
CREATE OR REPLACE FUNCTION public.cleanup_expired_friend_messages()
RETURNS integer AS $$
DECLARE deleted_count integer;
BEGIN
  WITH deleted AS (
    DELETE FROM public.friend_messages WHERE expires_at < now() RETURNING id
  )
  SELECT count(*)::integer INTO deleted_count FROM deleted;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permissão para usuário autenticado executar a limpeza
GRANT EXECUTE ON FUNCTION public.cleanup_expired_friend_messages() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_friend_messages() TO service_role;
