-- =====================================================
-- VERIFICAR POLÍTICAS RLS ATUAIS
-- Execute este SQL para ver quais políticas estão ativas
-- =====================================================

-- Verificar políticas da tabela places
SELECT 
  tablename,
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'places'
ORDER BY policyname;

-- Verificar políticas da tabela services
SELECT 
  tablename,
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'services'
ORDER BY policyname;

-- Verificar políticas da tabela events
SELECT 
  tablename,
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'events'
ORDER BY policyname;

-- Verificar políticas da tabela profiles
SELECT 
  tablename,
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles'
ORDER BY policyname;

-- Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('places', 'services', 'events', 'profiles')
ORDER BY tablename;
