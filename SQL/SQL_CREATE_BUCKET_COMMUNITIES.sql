-- Criar bucket communities
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('communities', 'communities', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Remover políticas existentes (se houver) antes de criar novas
DROP POLICY IF EXISTS "Public Access communities" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload communities" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update communities" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete communities" ON storage.objects;

-- Políticas para bucket communities
-- Política de leitura pública
CREATE POLICY "Public Access communities" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'communities');

-- Política de upload para usuários autenticados
CREATE POLICY "Authenticated Upload communities" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'communities' AND 
  auth.role() = 'authenticated'
);

-- Política de atualização para usuários autenticados
CREATE POLICY "Authenticated Update communities" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'communities' AND 
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'communities' AND 
  auth.role() = 'authenticated'
);

-- Política de exclusão para usuários autenticados
CREATE POLICY "Authenticated Delete communities" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'communities' AND 
  auth.role() = 'authenticated'
);
