-- =====================================================
-- CORREÇÃO DEFINITIVA DE RLS - PERMITIR SELECT PÚBLICO
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- Este SQL remove TODAS as políticas antigas e cria novas
-- =====================================================

-- =====================================================
-- 1. PLACES - GARANTIR SELECT PÚBLICO
-- =====================================================

-- Remover TODAS as políticas de SELECT existentes
DROP POLICY IF EXISTS "Public can view places" ON places;
DROP POLICY IF EXISTS "Anyone can view places" ON places;
DROP POLICY IF EXISTS "Todos podem ver locais" ON places;
DROP POLICY IF EXISTS "Permitir SELECT público em places" ON places;

-- Criar política pública de SELECT
CREATE POLICY "Public can view places"
ON places FOR SELECT
TO public
USING (true);

-- Verificar se foi criada
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'places' AND cmd = 'SELECT';

-- =====================================================
-- 2. SERVICES - GARANTIR SELECT PÚBLICO
-- =====================================================

-- Remover TODAS as políticas de SELECT existentes
DROP POLICY IF EXISTS "Public can view services" ON services;
DROP POLICY IF EXISTS "Anyone can view services" ON services;
DROP POLICY IF EXISTS "Todos podem ver serviços" ON services;
DROP POLICY IF EXISTS "Permitir SELECT público em services" ON services;

-- Criar política pública de SELECT
CREATE POLICY "Public can view services"
ON services FOR SELECT
TO public
USING (true);

-- Verificar se foi criada
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'services' AND cmd = 'SELECT';

-- =====================================================
-- 3. EVENTS - GARANTIR SELECT PÚBLICO
-- =====================================================

-- Remover TODAS as políticas de SELECT existentes
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Todos podem ver eventos" ON events;
DROP POLICY IF EXISTS "Permitir SELECT público em events" ON events;

-- Criar política pública de SELECT
CREATE POLICY "Public can view events"
ON events FOR SELECT
TO public
USING (true);

-- Verificar se foi criada
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'events' AND cmd = 'SELECT';

-- =====================================================
-- 4. PROFILES - GARANTIR SELECT PÚBLICO
-- =====================================================

-- Remover TODAS as políticas de SELECT existentes
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
DROP POLICY IF EXISTS "Perfis públicos são visíveis para todos" ON profiles;
DROP POLICY IF EXISTS "Usuários podem ver perfis conectados" ON profiles;
DROP POLICY IF EXISTS "Permitir SELECT público em profiles" ON profiles;

-- Criar política pública de SELECT
CREATE POLICY "Public can view profiles"
ON profiles FOR SELECT
TO public
USING (true);

-- Verificar se foi criada
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'profiles' AND cmd = 'SELECT';

-- =====================================================
-- 5. VERIFICAÇÃO FINAL - TODAS AS POLÍTICAS
-- =====================================================

SELECT 
  tablename,
  policyname,
  cmd,
  roles,
  CASE 
    WHEN roles::text LIKE '%public%' OR roles IS NULL THEN '✅ PÚBLICO'
    ELSE '❌ RESTRITO'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('places', 'services', 'events', 'profiles')
  AND cmd = 'SELECT'
ORDER BY tablename, policyname;

-- =====================================================
-- 6. TESTE DE QUERY - DEVE FUNCIONAR AGORA
-- =====================================================

-- Testar queries simples (deve retornar dados)
SELECT COUNT(*) as total_places FROM places;
SELECT COUNT(*) as total_services FROM services;
SELECT COUNT(*) as total_events FROM events;
SELECT COUNT(*) as total_profiles FROM profiles;

-- =====================================================
-- IMPORTANTE: Após executar este SQL
-- 1. Recarregue a página do app
-- 2. Verifique o console do navegador
-- 3. Os dados devem aparecer agora
-- =====================================================
