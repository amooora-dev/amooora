-- =====================================================
-- CORREÇÃO RÁPIDA: GARANTIR SELECT PÚBLICO
-- Execute este SQL para corrigir visualização de conteúdo
-- =====================================================

-- =====================================================
-- PLACES: SELECT PÚBLICO (TODOS PODEM VER)
-- =====================================================

-- Remover todas as políticas de SELECT antigas
DROP POLICY IF EXISTS "Public can view places" ON places;
DROP POLICY IF EXISTS "Anyone can view places" ON places;

-- Criar política pública de SELECT
CREATE POLICY "Public can view places"
ON places FOR SELECT
TO public
USING (true);

-- =====================================================
-- SERVICES: SELECT PÚBLICO (TODOS PODEM VER)
-- =====================================================

-- Remover todas as políticas de SELECT antigas
DROP POLICY IF EXISTS "Public can view services" ON services;
DROP POLICY IF EXISTS "Anyone can view services" ON services;

-- Criar política pública de SELECT
CREATE POLICY "Public can view services"
ON services FOR SELECT
TO public
USING (true);

-- =====================================================
-- EVENTS: SELECT PÚBLICO (TODOS PODEM VER)
-- =====================================================

-- Remover todas as políticas de SELECT antigas
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Anyone can view events" ON events;

-- Criar política pública de SELECT
CREATE POLICY "Public can view events"
ON events FOR SELECT
TO public
USING (true);

-- =====================================================
-- PROFILES: SELECT PÚBLICO (TODOS PODEM VER)
-- =====================================================

-- Remover todas as políticas de SELECT antigas
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
DROP POLICY IF EXISTS "Perfis públicos são visíveis para todos" ON profiles;
DROP POLICY IF EXISTS "Usuários podem ver perfis conectados" ON profiles;

-- Criar política pública de SELECT
CREATE POLICY "Public can view profiles"
ON profiles FOR SELECT
TO public
USING (true);

-- =====================================================
-- VERIFICAÇÃO: Ver se as políticas foram criadas
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
ORDER BY tablename;
