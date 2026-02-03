-- =====================================================
-- FLEXIBILIZAR STORAGE TEMPORARIAMENTE - PERMITIR ACESSO TOTAL
-- ATENÇÃO: Esta é uma configuração temporária para testes!
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =====================================================

-- =====================================================
-- REMOVER POLÍTICAS ANTIGAS DE STORAGE
-- =====================================================

-- Remover políticas do bucket 'places'
DROP POLICY IF EXISTS "Public can view places images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload places images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update places images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete places images" ON storage.objects;

-- Remover políticas do bucket 'services'
DROP POLICY IF EXISTS "Public can view services images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload services images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update services images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete services images" ON storage.objects;

-- Remover políticas do bucket 'events'
DROP POLICY IF EXISTS "Public can view events images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload events images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update events images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete events images" ON storage.objects;

-- =====================================================
-- CRIAR POLÍTICAS PERMISSIVAS TEMPORÁRIAS PARA STORAGE
-- =====================================================

-- PLACES: Acesso TOTAL para todos
CREATE POLICY "temp_public_all_places_storage"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'places')
WITH CHECK (bucket_id = 'places');

-- SERVICES: Acesso TOTAL para todos
CREATE POLICY "temp_public_all_services_storage"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'services')
WITH CHECK (bucket_id = 'services');

-- EVENTS: Acesso TOTAL para todos
CREATE POLICY "temp_public_all_events_storage"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'events')
WITH CHECK (bucket_id = 'events');

-- =====================================================
-- VERIFICAR POLÍTICAS DE STORAGE CRIADAS
-- =====================================================

SELECT 
  policyname,
  cmd,
  roles,
  CASE 
    WHEN roles::text LIKE '%public%' OR roles IS NULL THEN '✅ PÚBLICO'
    ELSE '❌ RESTRITO'
  END as status
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE 'temp_%'
ORDER BY policyname;
