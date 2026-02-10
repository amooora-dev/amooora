-- ============================================================
-- Correção RLS: aceitar/recusar/cancelar pedido de conexão
-- Erro: "new row violates row-level security policy"
-- Causa: a política de UPDATE só tinha USING; a nova linha (status = 'accepted')
--        não satisfazia USING, então o UPDATE era bloqueado.
-- Solução: adicionar WITH CHECK para permitir a nova linha.
-- Executar no Supabase SQL Editor (Dashboard > SQL Editor > New query).
-- ============================================================

DROP POLICY IF EXISTS "friend_requests_update_addressee_accept_reject" ON public.friend_requests;

CREATE POLICY "friend_requests_update_addressee_accept_reject" ON public.friend_requests
  FOR UPDATE
  USING (
    (addressee_id = auth.uid() AND status = 'pending')
    OR (requester_id = auth.uid() AND status = 'pending')
  )
  WITH CHECK (requester_id = auth.uid() OR addressee_id = auth.uid());
