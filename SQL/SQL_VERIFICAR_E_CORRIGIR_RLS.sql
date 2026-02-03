-- =====================================================
-- VERIFICAR E CORRIGIR RLS - GARANTIR QUE DADOS APARECAM
-- Execute este SQL no Supabase Dashboard
-- =====================================================

-- =====================================================
-- 1. VERIFICAR POLÍTICAS ATUAIS
-- =====================================================

SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('places', 'services', 'events', 'profiles')
ORDER BY tablename, cmd;

-- =====================================================
-- 2. REMOVER TODAS AS POLÍTICAS ANTIGAS
-- =====================================================

-- PLACES
DROP POLICY IF EXISTS "Public can view places" ON places;
DROP POLICY IF EXISTS "Anyone can view places" ON places;
DROP POLICY IF EXISTS "Public can insert places" ON places;
DROP POLICY IF EXISTS "Public can update places" ON places;
DROP POLICY IF EXISTS "Public can delete places" ON places;

-- SERVICES
DROP POLICY IF EXISTS "Public can view services" ON services;
DROP POLICY IF EXISTS "Anyone can view services" ON services;
DROP POLICY IF EXISTS "Public can insert services" ON services;
DROP POLICY IF EXISTS "Public can update services" ON services;
DROP POLICY IF EXISTS "Public can delete services" ON services;

-- EVENTS
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Public can insert events" ON events;
DROP POLICY IF EXISTS "Public can update events" ON events;
DROP POLICY IF EXISTS "Public can delete events" ON events;

-- PROFILES
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
DROP POLICY IF EXISTS "Perfis públicos são visíveis para todos" ON profiles;
DROP POLICY IF EXISTS "Usuários podem ver perfis conectados" ON profiles;
DROP POLICY IF EXISTS "Public can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Public can update profiles" ON profiles;
DROP POLICY IF EXISTS "Public can delete profiles" ON profiles;

-- =====================================================
-- 3. CRIAR POLÍTICAS PÚBLICAS DE SELECT (LEITURA)
-- =====================================================

-- PLACES: SELECT PÚBLICO (TODOS PODEM VER)
CREATE POLICY "Public can view places"
ON places FOR SELECT
TO public
USING (true);

-- SERVICES: SELECT PÚBLICO (TODOS PODEM VER)
CREATE POLICY "Public can view services"
ON services FOR SELECT
TO public
USING (true);

-- EVENTS: SELECT PÚBLICO (TODOS PODEM VER)
CREATE POLICY "Public can view events"
ON events FOR SELECT
TO public
USING (true);

-- PROFILES: SELECT PÚBLICO (TODOS PODEM VER)
CREATE POLICY "Public can view profiles"
ON profiles FOR SELECT
TO public
USING (true);

-- =====================================================
-- 4. VERIFICAR DADOS NO BANCO
-- =====================================================

-- Verificar quantos locais existem (incluindo is_safe = false)
SELECT 
  COUNT(*) as total_locais,
  COUNT(*) FILTER (WHERE is_safe = true) as locais_seguros,
  COUNT(*) FILTER (WHERE is_safe = false OR is_safe IS NULL) as locais_nao_seguros
FROM places;

-- Verificar quantos serviços existem (incluindo is_active = false)
SELECT 
  COUNT(*) as total_servicos,
  COUNT(*) FILTER (WHERE is_active = true) as servicos_ativos,
  COUNT(*) FILTER (WHERE is_active = false OR is_active IS NULL) as servicos_inativos
FROM services;

-- Verificar quantos eventos existem (incluindo is_active = false e passados)
SELECT 
  COUNT(*) as total_eventos,
  COUNT(*) FILTER (WHERE is_active = true) as eventos_ativos,
  COUNT(*) FILTER (WHERE is_active = false OR is_active IS NULL) as eventos_inativos,
  COUNT(*) FILTER (WHERE date >= CURRENT_DATE) as eventos_futuros,
  COUNT(*) FILTER (WHERE date < CURRENT_DATE) as eventos_passados
FROM events;

-- =====================================================
-- 5. VERIFICAR SE HÁ DADOS COM OS FILTROS APLICADOS
-- =====================================================

-- Locais seguros (filtro usado no código)
SELECT COUNT(*) as locais_seguros_encontrados
FROM places
WHERE is_safe = true;

-- Serviços ativos (filtro usado no código)
SELECT COUNT(*) as servicos_ativos_encontrados
FROM services
WHERE is_active = true;

-- Eventos ativos e futuros (filtro usado no código)
SELECT COUNT(*) as eventos_ativos_futuros_encontrados
FROM events
WHERE is_active = true
  AND date >= CURRENT_DATE;

-- =====================================================
-- 6. VERIFICAR POLÍTICAS CRIADAS
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
