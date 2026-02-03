-- =====================================================
-- CONFIGURAÇÃO COMPLETA DE STORAGE - SUPABASE
-- =====================================================
-- Execute este SQL no SQL Editor do Supabase Dashboard
-- Dashboard: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
-- =====================================================

-- 1. Criar bucket 'places' para imagens de locais
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'places',
  'places',
  true,
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar bucket 'services' para imagens de serviços
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'services',
  'services',
  true,
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Criar bucket 'events' para imagens de eventos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'events',
  'events',
  true,
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- POLÍTICAS RLS PARA BUCKET 'places'
-- =====================================================

-- Política de Leitura Pública (SELECT)
CREATE POLICY "Public Access - places"
ON storage.objects FOR SELECT
USING (bucket_id = 'places');

-- Política de Upload para Usuários Autenticados (INSERT)
CREATE POLICY "Authenticated Upload - places"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'places' AND
  auth.role() = 'authenticated'
);

-- Política de Atualização para Usuários Autenticados (UPDATE)
CREATE POLICY "Authenticated Update - places"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'places' AND
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'places' AND
  auth.role() = 'authenticated'
);

-- Política de Exclusão para Usuários Autenticados (DELETE)
CREATE POLICY "Authenticated Delete - places"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'places' AND
  auth.role() = 'authenticated'
);

-- =====================================================
-- POLÍTICAS RLS PARA BUCKET 'services'
-- =====================================================

-- Política de Leitura Pública (SELECT)
CREATE POLICY "Public Access - services"
ON storage.objects FOR SELECT
USING (bucket_id = 'services');

-- Política de Upload para Usuários Autenticados (INSERT)
CREATE POLICY "Authenticated Upload - services"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'services' AND
  auth.role() = 'authenticated'
);

-- Política de Atualização para Usuários Autenticados (UPDATE)
CREATE POLICY "Authenticated Update - services"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'services' AND
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'services' AND
  auth.role() = 'authenticated'
);

-- Política de Exclusão para Usuários Autenticados (DELETE)
CREATE POLICY "Authenticated Delete - services"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'services' AND
  auth.role() = 'authenticated'
);

-- =====================================================
-- POLÍTICAS RLS PARA BUCKET 'events'
-- =====================================================

-- Política de Leitura Pública (SELECT)
CREATE POLICY "Public Access - events"
ON storage.objects FOR SELECT
USING (bucket_id = 'events');

-- Política de Upload para Usuários Autenticados (INSERT)
CREATE POLICY "Authenticated Upload - events"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'events' AND
  auth.role() = 'authenticated'
);

-- Política de Atualização para Usuários Autenticados (UPDATE)
CREATE POLICY "Authenticated Update - events"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'events' AND
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'events' AND
  auth.role() = 'authenticated'
);

-- Política de Exclusão para Usuários Autenticados (DELETE)
CREATE POLICY "Authenticated Delete - events"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'events' AND
  auth.role() = 'authenticated'
);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se os buckets foram criados
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id IN ('places', 'services', 'events');

-- Verificar se as políticas foram criadas
SELECT policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%places%' OR policyname LIKE '%services%' OR policyname LIKE '%events%'
ORDER BY policyname;
