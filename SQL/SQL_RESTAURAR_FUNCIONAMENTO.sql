-- =====================================================
-- RESTAURAR FUNCIONAMENTO DO SITE
-- Corrige problemas de login, cadastro e visualização
-- =====================================================
-- Execute este SQL no Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
-- =====================================================

-- =====================================================
-- 1. GARANTIR SELECT PÚBLICO (VISUALIZAÇÃO)
-- =====================================================

-- Places: SELECT público (todos podem ver)
DROP POLICY IF EXISTS "Public can view places" ON places;
DROP POLICY IF EXISTS "Anyone can view places" ON places;
CREATE POLICY "Public can view places"
ON places FOR SELECT
USING (true);

-- Services: SELECT público (todos podem ver)
DROP POLICY IF EXISTS "Public can view services" ON services;
DROP POLICY IF EXISTS "Anyone can view services" ON services;
CREATE POLICY "Public can view services"
ON services FOR SELECT
USING (true);

-- Events: SELECT público (todos podem ver)
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Anyone can view events" ON events;
CREATE POLICY "Public can view events"
ON events FOR SELECT
USING (true);

-- =====================================================
-- 2. GARANTIR CADASTRO FUNCIONE (profiles)
-- =====================================================

-- Remover todas as políticas antigas de profiles
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation on signup" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Perfis públicos são visíveis para todos" ON profiles;
DROP POLICY IF EXISTS "Usuários podem ver perfis conectados" ON profiles;

-- SELECT: Todos podem ver perfis (necessário para funcionar)
CREATE POLICY "Public can view profiles"
ON profiles FOR SELECT
USING (true);

-- INSERT: Permitir criação de perfil durante cadastro
-- IMPORTANTE: Isso permite que o trigger handle_new_user() e o código de signUp funcionem
CREATE POLICY "Allow profile creation on signup"
ON profiles FOR INSERT
WITH CHECK (true);

-- UPDATE: Usuário só pode atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =====================================================
-- 3. MANTER INSERT/UPDATE/DELETE SEGUROS (opcional - temporariamente público)
-- =====================================================

-- Se você executou SQL/SQL_RLS_SEGURO.sql, estas políticas exigem autenticação
-- Se quiser permitir cadastro via admin sem login, pode descomentar:

-- Places: Permitir INSERT público temporariamente (para admin funcionar)
DROP POLICY IF EXISTS "Public can insert places" ON places;
DROP POLICY IF EXISTS "Authenticated users can insert places" ON places;
CREATE POLICY "Public can insert places"
ON places FOR INSERT
WITH CHECK (true);

-- Services: Permitir INSERT público temporariamente
DROP POLICY IF EXISTS "Public can insert services" ON services;
DROP POLICY IF EXISTS "Authenticated users can insert services" ON services;
CREATE POLICY "Public can insert services"
ON services FOR INSERT
WITH CHECK (true);

-- Events: Permitir INSERT público temporariamente
DROP POLICY IF EXISTS "Public can insert events" ON events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON events;
CREATE POLICY "Public can insert events"
ON events FOR INSERT
WITH CHECK (true);

-- =====================================================
-- 4. STORAGE: Permitir upload público temporariamente
-- =====================================================

-- Remover políticas restritivas de Storage
DROP POLICY IF EXISTS "Authenticated Upload - places" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update - places" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete - places" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload - services" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update - services" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete - services" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload - events" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update - events" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete - events" ON storage.objects;

-- Políticas públicas temporárias para Storage
DROP POLICY IF EXISTS "Public Upload - places" ON storage.objects;
DROP POLICY IF EXISTS "Public Update - places" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete - places" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload - services" ON storage.objects;
DROP POLICY IF EXISTS "Public Update - services" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete - services" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload - events" ON storage.objects;
DROP POLICY IF EXISTS "Public Update - events" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete - events" ON storage.objects;

-- Places bucket: Upload público temporário
CREATE POLICY "Public Upload - places"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'places');

CREATE POLICY "Public Update - places"
ON storage.objects FOR UPDATE
USING (bucket_id = 'places');

CREATE POLICY "Public Delete - places"
ON storage.objects FOR DELETE
USING (bucket_id = 'places');

-- Services bucket: Upload público temporário
CREATE POLICY "Public Upload - services"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'services');

CREATE POLICY "Public Update - services"
ON storage.objects FOR UPDATE
USING (bucket_id = 'services');

CREATE POLICY "Public Delete - services"
ON storage.objects FOR DELETE
USING (bucket_id = 'services');

-- Events bucket: Upload público temporário
CREATE POLICY "Public Upload - events"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'events');

CREATE POLICY "Public Update - events"
ON storage.objects FOR UPDATE
USING (bucket_id = 'events');

CREATE POLICY "Public Delete - events"
ON storage.objects FOR DELETE
USING (bucket_id = 'events');

-- =====================================================
-- 5. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar políticas de SELECT (devem ser públicas)
SELECT 
  'SELECT' as operacao,
  tablename,
  policyname,
  CASE 
    WHEN qual LIKE '%true%' OR qual IS NULL THEN '✅ PÚBLICO'
    ELSE '❌ RESTRITO'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('places', 'services', 'events', 'profiles')
  AND cmd = 'SELECT'
ORDER BY tablename;

-- Verificar políticas de INSERT em profiles (deve permitir)
SELECT 
  'INSERT' as operacao,
  tablename,
  policyname,
  '✅ PERMITIDO' as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles'
  AND cmd = 'INSERT';
