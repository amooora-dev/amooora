-- =====================================================
-- CORRIGIR RLS: REMOVER POLÍTICAS PERMISSIVAS E CRIAR SEGURAS
-- Este SQL remove políticas muito permissivas e cria políticas seguras
-- =====================================================

-- =====================================================
-- 1. REMOVER TODAS AS POLÍTICAS ANTIGAS (incluindo as permissivas)
-- =====================================================

-- PLACES: Remover todas as políticas
DROP POLICY IF EXISTS "Public SELECT places" ON places;
DROP POLICY IF EXISTS "Public can view places" ON places;
DROP POLICY IF EXISTS "Anyone can view places" ON places;
DROP POLICY IF EXISTS "Todos podem ver locais" ON places;
DROP POLICY IF EXISTS "Permitir SELECT público em places" ON places;
DROP POLICY IF EXISTS "temp_public_all_places" ON places;
DROP POLICY IF EXISTS "Public can insert places" ON places;
DROP POLICY IF EXISTS "Public can update places" ON places;
DROP POLICY IF EXISTS "Public can delete places" ON places;

-- SERVICES: Remover todas as políticas
DROP POLICY IF EXISTS "Public SELECT services" ON services;
DROP POLICY IF EXISTS "Public can view services" ON services;
DROP POLICY IF EXISTS "Anyone can view services" ON services;
DROP POLICY IF EXISTS "Todos podem ver serviços" ON services;
DROP POLICY IF EXISTS "Permitir SELECT público em services" ON services;
DROP POLICY IF EXISTS "temp_public_all_services" ON services;
DROP POLICY IF EXISTS "Public can insert services" ON services;
DROP POLICY IF EXISTS "Public can update services" ON services;
DROP POLICY IF EXISTS "Public can delete services" ON services;

-- EVENTS: Remover todas as políticas (incluindo a problemática)
DROP POLICY IF EXISTS "Public SELECT events" ON events;
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Todos podem ver eventos" ON events;
DROP POLICY IF EXISTS "Permitir SELECT público em events" ON events;
DROP POLICY IF EXISTS "temp_public_all_events" ON events; -- Esta é a problemática!
DROP POLICY IF EXISTS "Public can insert events" ON events;
DROP POLICY IF EXISTS "Public can update events" ON events;
DROP POLICY IF EXISTS "Public can delete events" ON events;

-- PROFILES: Remover todas as políticas
DROP POLICY IF EXISTS "Public SELECT profiles" ON profiles;
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
DROP POLICY IF EXISTS "Perfis públicos são visíveis para todos" ON profiles;
DROP POLICY IF EXISTS "Usuários podem ver perfis conectados" ON profiles;
DROP POLICY IF EXISTS "Permitir SELECT público em profiles" ON profiles;
DROP POLICY IF EXISTS "temp_public_all_profiles" ON profiles;
DROP POLICY IF EXISTS "Public can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Public can update profiles" ON profiles;
DROP POLICY IF EXISTS "Public can delete profiles" ON profiles;

-- =====================================================
-- 2. CRIAR POLÍTICAS SEGURAS: SELECT PÚBLICO, WRITE RESTRITO
-- =====================================================

-- PLACES: SELECT público, INSERT/UPDATE/DELETE apenas para autenticados
-- Usar CREATE OR REPLACE ou remover antes de criar
DROP POLICY IF EXISTS "Public SELECT places" ON places;
CREATE POLICY "Public SELECT places"
ON places FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated INSERT places" ON places;
CREATE POLICY "Authenticated INSERT places"
ON places FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated UPDATE places" ON places;
CREATE POLICY "Authenticated UPDATE places"
ON places FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated DELETE places" ON places;
CREATE POLICY "Authenticated DELETE places"
ON places FOR DELETE
TO authenticated
USING (true);

-- SERVICES: SELECT público, INSERT/UPDATE/DELETE apenas para autenticados
DROP POLICY IF EXISTS "Public SELECT services" ON services;
CREATE POLICY "Public SELECT services"
ON services FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated INSERT services" ON services;
CREATE POLICY "Authenticated INSERT services"
ON services FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated UPDATE services" ON services;
CREATE POLICY "Authenticated UPDATE services"
ON services FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated DELETE services" ON services;
CREATE POLICY "Authenticated DELETE services"
ON services FOR DELETE
TO authenticated
USING (true);

-- EVENTS: SELECT público, INSERT/UPDATE/DELETE apenas para autenticados
DROP POLICY IF EXISTS "Public SELECT events" ON events;
CREATE POLICY "Public SELECT events"
ON events FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated INSERT events" ON events;
CREATE POLICY "Authenticated INSERT events"
ON events FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated UPDATE events" ON events;
CREATE POLICY "Authenticated UPDATE events"
ON events FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated DELETE events" ON events;
CREATE POLICY "Authenticated DELETE events"
ON events FOR DELETE
TO authenticated
USING (true);

-- PROFILES: SELECT público, INSERT/UPDATE/DELETE apenas para autenticados
DROP POLICY IF EXISTS "Public SELECT profiles" ON profiles;
CREATE POLICY "Public SELECT profiles"
ON profiles FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated INSERT profiles" ON profiles;
CREATE POLICY "Authenticated INSERT profiles"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated UPDATE profiles" ON profiles;
CREATE POLICY "Authenticated UPDATE profiles"
ON profiles FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated DELETE profiles" ON profiles;
CREATE POLICY "Authenticated DELETE profiles"
ON profiles FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- 3. VERIFICAÇÃO: Listar todas as políticas criadas
-- =====================================================

SELECT 
  tablename,
  policyname,
  cmd,
  roles,
  CASE 
    WHEN cmd = 'SELECT' AND (roles::text LIKE '%public%' OR roles IS NULL) THEN '✅ SELECT PÚBLICO'
    WHEN cmd IN ('INSERT', 'UPDATE', 'DELETE') AND roles::text LIKE '%authenticated%' THEN '✅ WRITE AUTENTICADO'
    ELSE '⚠️ VERIFICAR'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('places', 'services', 'events', 'profiles')
ORDER BY tablename, cmd;

-- =====================================================
-- 4. TESTE: Verificar se SELECT funciona para público
-- =====================================================

-- Essas queries devem funcionar (SELECT público)
SELECT COUNT(*) as total_places FROM places;
SELECT COUNT(*) as total_services FROM services;
SELECT COUNT(*) as total_events FROM events;
SELECT COUNT(*) as total_profiles FROM profiles;

-- =====================================================
-- RESULTADO ESPERADO:
-- ✅ SELECT público funciona (dados aparecem no app)
-- ✅ INSERT/UPDATE/DELETE requerem autenticação (seguro)
-- ✅ Avisos de segurança do Supabase devem desaparecer
-- =====================================================
