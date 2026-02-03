-- =========================================================
-- Tabelas para interações de usuários com eventos
-- =========================================================

-- Tabela para eventos que o usuário tem interesse
CREATE TABLE IF NOT EXISTS public.event_interests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, event_id)
);

-- Tabela para eventos que o usuário participou (já deve existir, mas garantindo)
CREATE TABLE IF NOT EXISTS public.event_participants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, event_id)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_event_interests_user_id ON public.event_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_event_interests_event_id ON public.event_interests(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user_id ON public.event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON public.event_participants(event_id);

-- RLS (Row Level Security) para event_interests
ALTER TABLE public.event_interests ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Users can view their own interests" ON public.event_interests;
DROP POLICY IF EXISTS "Users can insert their own interests" ON public.event_interests;
DROP POLICY IF EXISTS "Users can delete their own interests" ON public.event_interests;

-- Política: usuários podem ver seus próprios interesses
CREATE POLICY "Users can view their own interests"
  ON public.event_interests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: usuários podem inserir seus próprios interesses
CREATE POLICY "Users can insert their own interests"
  ON public.event_interests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: usuários podem deletar seus próprios interesses
CREATE POLICY "Users can delete their own interests"
  ON public.event_interests
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS (Row Level Security) para event_participants
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Users can view their own participations" ON public.event_participants;
DROP POLICY IF EXISTS "Users can insert their own participations" ON public.event_participants;
DROP POLICY IF EXISTS "Users can delete their own participations" ON public.event_participants;

-- Política: usuários podem ver suas próprias participações
CREATE POLICY "Users can view their own participations"
  ON public.event_participants
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: usuários podem inserir suas próprias participações
CREATE POLICY "Users can insert their own participations"
  ON public.event_participants
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: usuários podem deletar suas próprias participações
CREATE POLICY "Users can delete their own participations"
  ON public.event_participants
  FOR DELETE
  USING (auth.uid() = user_id);

-- Comentários nas tabelas
COMMENT ON TABLE public.event_interests IS 'Eventos que usuários têm interesse';
COMMENT ON TABLE public.event_participants IS 'Eventos que usuários participaram';
