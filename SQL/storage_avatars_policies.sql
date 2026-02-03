-- Políticas de acesso para o bucket 'avatars' no Supabase Storage
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Permitir leitura pública (SELECT) - qualquer pessoa pode ver as imagens
CREATE POLICY "Public Access for avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- 2. Permitir upload (INSERT) apenas para usuários autenticados
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

-- 3. Permitir atualização (UPDATE) apenas para o dono do arquivo
CREATE POLICY "Users can update their own avatars"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Permitir deleção (DELETE) apenas para o dono do arquivo
CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Nota: Se as políticas já existirem, você pode precisar removê-las primeiro:
-- DROP POLICY IF EXISTS "Public Access for avatars" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
