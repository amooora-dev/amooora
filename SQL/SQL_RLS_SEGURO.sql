-- =====================================================
-- POLÍTICAS RLS SEGURAS - PRODUÇÃO
-- Substitui as políticas públicas temporárias
-- =====================================================
-- IMPORTANTE: Execute isto ANTES de ir para produção
-- =====================================================

-- =====================================================
-- TABELA: places
-- =====================================================

-- Remover políticas públicas temporárias
DROP POLICY IF EXISTS "Public can insert places" ON places;
DROP POLICY IF EXISTS "Public can update places" ON places;
DROP POLICY IF EXISTS "Public can delete places" ON places;

-- Política de SELECT (leitura pública - OK)
-- Manter como está: CREATE POLICY "Public can view places" ON places FOR SELECT USING (true);

-- Política de INSERT (apenas autenticados)
CREATE POLICY "Authenticated users can insert places"
ON places FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Política de UPDATE (apenas o criador)
CREATE POLICY "Creator can update places"
ON places FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Política de DELETE (apenas o criador)
CREATE POLICY "Creator can delete places"
ON places FOR DELETE
USING (auth.uid() = created_by);

-- =====================================================
-- TABELA: services
-- =====================================================

-- Remover políticas públicas temporárias
DROP POLICY IF EXISTS "Public can insert services" ON services;
DROP POLICY IF EXISTS "Public can update services" ON services;
DROP POLICY IF EXISTS "Public can delete services" ON services;

-- Política de SELECT (leitura pública - OK)
-- Manter como está: CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);

-- Política de INSERT (apenas autenticados)
CREATE POLICY "Authenticated users can insert services"
ON services FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Política de UPDATE (apenas o criador)
CREATE POLICY "Creator can update services"
ON services FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Política de DELETE (apenas o criador)
CREATE POLICY "Creator can delete services"
ON services FOR DELETE
USING (auth.uid() = created_by);

-- =====================================================
-- TABELA: events
-- =====================================================

-- Remover políticas públicas temporárias
DROP POLICY IF EXISTS "Public can insert events" ON events;
DROP POLICY IF EXISTS "Public can update events" ON events;
DROP POLICY IF EXISTS "Public can delete events" ON events;

-- Política de SELECT (leitura pública - OK)
-- Manter como está: CREATE POLICY "Public can view events" ON events FOR SELECT USING (true);

-- Política de INSERT (apenas autenticados)
CREATE POLICY "Authenticated users can insert events"
ON events FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Política de UPDATE (apenas o criador)
CREATE POLICY "Creator can update events"
ON events FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Política de DELETE (apenas o criador)
CREATE POLICY "Creator can delete events"
ON events FOR DELETE
USING (auth.uid() = created_by);

-- =====================================================
-- STORAGE: Corrigir políticas de upload
-- =====================================================

-- Remover políticas públicas de upload temporárias
DROP POLICY IF EXISTS "Public Upload - places" ON storage.objects;
DROP POLICY IF EXISTS "Public Update - places" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete - places" ON storage.objects;

DROP POLICY IF EXISTS "Public Upload - services" ON storage.objects;
DROP POLICY IF EXISTS "Public Update - services" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete - services" ON storage.objects;

DROP POLICY IF EXISTS "Public Upload - events" ON storage.objects;
DROP POLICY IF EXISTS "Public Update - events" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete - events" ON storage.objects;

-- Políticas seguras para Storage

-- Places bucket
CREATE POLICY "Authenticated Upload - places"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'places');

CREATE POLICY "Authenticated Update - places"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'places');

CREATE POLICY "Authenticated Delete - places"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'places');

-- Services bucket
CREATE POLICY "Authenticated Upload - services"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'services');

CREATE POLICY "Authenticated Update - services"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'services');

CREATE POLICY "Authenticated Delete - services"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'services');

-- Events bucket
CREATE POLICY "Authenticated Upload - events"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'events');

CREATE POLICY "Authenticated Update - events"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'events');

CREATE POLICY "Authenticated Delete - events"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'events');

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar políticas criadas para places
SELECT policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'places'
ORDER BY policyname;

-- Verificar políticas de Storage
SELECT policyname, cmd
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%places%' OR policyname LIKE '%services%' OR policyname LIKE '%events%'
ORDER BY policyname;
