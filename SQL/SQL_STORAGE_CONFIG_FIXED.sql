-- =====================================================
-- CONFIGURAÇÃO DE STORAGE - CORRIGIDA
-- Permite upload sem autenticação (temporário para admin)
-- =====================================================
-- Execute este SQL no SQL Editor do Supabase Dashboard
-- Dashboard: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
-- =====================================================

-- Primeiro, remover políticas antigas se existirem
DROP POLICY IF EXISTS "Public Access - places" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload - places" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update - places" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete - places" ON storage.objects;
DROP POLICY IF EXISTS "Public Access - services" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload - services" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update - services" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete - services" ON storage.objects;
DROP POLICY IF EXISTS "Public Access - events" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload - events" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update - events" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete - events" ON storage.objects;

-- 1. Criar bucket 'places' para imagens de locais
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'places',
  'places',
  true,
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Criar bucket 'services' para imagens de serviços
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'services',
  'services',
  true,
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- 3. Criar bucket 'events' para imagens de eventos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'events',
  'events',
  true,
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- =====================================================
-- POLÍTICAS RLS PARA BUCKET 'places'
-- =====================================================

-- Leitura pública (qualquer um pode ver)
CREATE POLICY "Public Access - places"
ON storage.objects FOR SELECT
USING (bucket_id = 'places');

-- Upload público (temporário para admin - remover depois)
CREATE POLICY "Public Upload - places"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'places');

-- Atualização pública (temporário)
CREATE POLICY "Public Update - places"
ON storage.objects FOR UPDATE
USING (bucket_id = 'places')
WITH CHECK (bucket_id = 'places');

-- Exclusão pública (temporário)
CREATE POLICY "Public Delete - places"
ON storage.objects FOR DELETE
USING (bucket_id = 'places');

-- =====================================================
-- POLÍTICAS RLS PARA BUCKET 'services'
-- =====================================================

-- Leitura pública
CREATE POLICY "Public Access - services"
ON storage.objects FOR SELECT
USING (bucket_id = 'services');

-- Upload público (temporário para admin)
CREATE POLICY "Public Upload - services"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'services');

-- Atualização pública (temporário)
CREATE POLICY "Public Update - services"
ON storage.objects FOR UPDATE
USING (bucket_id = 'services')
WITH CHECK (bucket_id = 'services');

-- Exclusão pública (temporário)
CREATE POLICY "Public Delete - services"
ON storage.objects FOR DELETE
USING (bucket_id = 'services');

-- =====================================================
-- POLÍTICAS RLS PARA BUCKET 'events'
-- =====================================================

-- Leitura pública
CREATE POLICY "Public Access - events"
ON storage.objects FOR SELECT
USING (bucket_id = 'events');

-- Upload público (temporário para admin)
CREATE POLICY "Public Upload - events"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'events');

-- Atualização pública (temporário)
CREATE POLICY "Public Update - events"
ON storage.objects FOR UPDATE
USING (bucket_id = 'events')
WITH CHECK (bucket_id = 'events');

-- Exclusão pública (temporário)
CREATE POLICY "Public Delete - events"
ON storage.objects FOR DELETE
USING (bucket_id = 'events');

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar buckets criados
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id IN ('places', 'services', 'events')
ORDER BY id;

-- Verificar políticas criadas
SELECT policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND (
    policyname LIKE '%places%' OR 
    policyname LIKE '%services%' OR 
    policyname LIKE '%events%'
  )
ORDER BY policyname;
