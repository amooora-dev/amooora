-- Políticas simplificadas para o bucket 'avatars'
-- Execute este script no SQL Editor do Supabase Dashboard

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Public Access for avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- 1. Permitir leitura pública (qualquer pessoa pode ver as imagens)
CREATE POLICY "Public Access for avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- 2. Permitir upload para qualquer usuário autenticado
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- 3. Permitir atualização para qualquer usuário autenticado (pode ser restrito depois)
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

-- 4. Permitir deleção para qualquer usuário autenticado (pode ser restrito depois)
CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);
