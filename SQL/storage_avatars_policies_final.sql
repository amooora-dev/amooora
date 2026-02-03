-- ============================================
-- POLÍTICAS DE ACESSO PARA BUCKET 'avatars'
-- ============================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- Este script configura as políticas RLS para permitir upload de fotos de perfil

-- Remover políticas antigas se existirem (para evitar conflitos)
DROP POLICY IF EXISTS "Public Access for avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- 1. POLÍTICA DE LEITURA PÚBLICA
-- Qualquer pessoa pode ver as imagens de avatar (necessário para exibir fotos de perfil)
CREATE POLICY "Public Access for avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- 2. POLÍTICA DE UPLOAD (INSERT)
-- Apenas usuários autenticados podem fazer upload de avatares
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- 3. POLÍTICA DE ATUALIZAÇÃO (UPDATE)
-- Usuários autenticados podem atualizar avatares
-- (Por enquanto, qualquer usuário autenticado pode atualizar qualquer avatar)
-- Para restringir apenas ao próprio usuário, descomente a versão comentada abaixo
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- Versão restrita (apenas o dono pode atualizar):
-- CREATE POLICY "Users can update their own avatars"
-- ON storage.objects
-- FOR UPDATE
-- USING (
--   bucket_id = 'avatars' 
--   AND auth.uid()::text = (storage.foldername(name))[1]
-- )
-- WITH CHECK (
--   bucket_id = 'avatars' 
--   AND auth.uid()::text = (storage.foldername(name))[1]
-- );

-- 4. POLÍTICA DE DELEÇÃO (DELETE)
-- Usuários autenticados podem deletar avatares
-- (Por enquanto, qualquer usuário autenticado pode deletar qualquer avatar)
-- Para restringir apenas ao próprio usuário, descomente a versão comentada abaixo
CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- Versão restrita (apenas o dono pode deletar):
-- CREATE POLICY "Users can delete their own avatars"
-- ON storage.objects
-- FOR DELETE
-- USING (
--   bucket_id = 'avatars' 
--   AND auth.uid()::text = (storage.foldername(name))[1]
-- );

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Após executar, verifique se as políticas foram criadas:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%avatars%';
