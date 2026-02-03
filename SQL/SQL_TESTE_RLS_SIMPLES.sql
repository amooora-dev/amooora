-- =====================================================
-- TESTE SIMPLES DE RLS - VERIFICAR POLÍTICAS ATIVAS
-- Execute este SQL para ver o status atual das políticas
-- =====================================================

-- Verificar se RLS está habilitado nas tabelas
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('places', 'services', 'events', 'profiles')
ORDER BY tablename;

-- Verificar todas as políticas SELECT ativas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('places', 'services', 'events', 'profiles')
  AND cmd = 'SELECT'
ORDER BY tablename, policyname;

-- Testar uma query simples
SELECT COUNT(*) as total_places FROM places;
SELECT COUNT(*) as total_services FROM services;
SELECT COUNT(*) as total_events FROM events;
SELECT COUNT(*) as total_profiles FROM profiles;

-- =====================================================
-- SE AS QUERIES ACIMA FUNCIONAREM, O PROBLEMA NÃO É RLS
-- SE DEREM ERRO DE PERMISSÃO, EXECUTE SQL/SQL_FIX_SELECT_PUBLICO.sql
-- =====================================================
