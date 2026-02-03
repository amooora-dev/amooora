-- =====================================================
-- CONFIGURAÇÃO DE STORAGE - BUCKET 'avatars'
-- =====================================================
-- Execute este SQL no SQL Editor do Supabase Dashboard
-- Este script cria o bucket e configura as políticas RLS
-- =====================================================

-- Criar bucket 'avatars' se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB em bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Remover políticas existentes (se houver) antes de criar novas
DROP POLICY IF EXISTS "Public Access avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete avatars" ON storage.objects;

-- =====================================================
-- POLÍTICAS RLS PARA BUCKET 'avatars'
-- =====================================================

-- Política de leitura pública (qualquer pessoa pode ver as imagens)
CREATE POLICY "Public Access avatars" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

-- Política de upload para usuários autenticados
CREATE POLICY "Authenticated Upload avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- Política de atualização para usuários autenticados
CREATE POLICY "Authenticated Update avatars" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- Política de exclusão para usuários autenticados
CREATE POLICY "Authenticated Delete avatars" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se o bucket foi criado
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'avatars';

-- Verificar se as políticas foram criadas
SELECT policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%avatars%'
ORDER BY policyname;
