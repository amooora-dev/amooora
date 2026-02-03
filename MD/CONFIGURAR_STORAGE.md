# Configurar Storage do Supabase para Upload de Imagens

Para que o upload de imagens funcione nos formulários de cadastro (Local, Serviço, Evento), você precisa configurar os buckets no Supabase Storage.

## 📋 Passo a Passo

### 1. Acessar o Dashboard do Supabase

Acesse: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw

### 2. Criar os Buckets

Vá em **Storage** → **Create bucket** e crie os seguintes buckets:

#### Bucket: `places`
- **Nome**: `places`
- **Público**: ✅ Marque como público (para leitura de imagens)
- **File size limit**: 5MB (ou mais se preferir)
- **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp, image/gif`

#### Bucket: `services`
- **Nome**: `services`
- **Público**: ✅ Marque como público
- **File size limit**: 5MB
- **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp, image/gif`

#### Bucket: `events`
- **Nome**: `events`
- **Público**: ✅ Marque como público
- **File size limit**: 5MB
- **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp, image/gif`

#### Bucket: `communities`
- **Nome**: `communities`
- **Público**: ✅ Marque como público
- **File size limit**: 5MB
- **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp, image/gif`

### 3. Configurar Políticas RLS (Row Level Security)

Para cada bucket criado, você precisa configurar políticas RLS:

#### Política de Leitura (SELECT)
- **Nome**: `Public Access`
- **Target roles**: `anon`, `authenticated`
- **Allowed operation**: `SELECT`
- **USING expression**: `true` (permite leitura pública)

#### Política de Upload (INSERT)
- **Nome**: `Authenticated Upload`
- **Target roles**: `authenticated`
- **Allowed operation**: `INSERT`
- **WITH CHECK expression**: `true` (permite upload para usuários autenticados)

#### Política de Atualização (UPDATE)
- **Nome**: `Authenticated Update`
- **Target roles**: `authenticated`
- **Allowed operation**: `UPDATE`
- **USING expression**: `true`
- **WITH CHECK expression**: `true`

#### Política de Exclusão (DELETE)
- **Nome**: `Authenticated Delete`
- **Target roles**: `authenticated`
- **Allowed operation**: `DELETE`
- **USING expression**: `true`

### 4. Configuração via SQL (Alternativa)

Se preferir, você pode executar o SQL abaixo no **SQL Editor** do Supabase:

```sql
-- Criar bucket places
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('places', 'places', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

-- Criar bucket services
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('services', 'services', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

-- Criar bucket events
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('events', 'events', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

-- Políticas para bucket places
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'places');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'places' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE USING (bucket_id = 'places' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'places' AND auth.role() = 'authenticated');

-- Políticas para bucket services
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'services');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'services' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE USING (bucket_id = 'services' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'services' AND auth.role() = 'authenticated');

-- Políticas para bucket events
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'events');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'events' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE USING (bucket_id = 'events' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'events' AND auth.role() = 'authenticated');

-- Criar bucket communities
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('communities', 'communities', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

-- Políticas para bucket communities
CREATE POLICY "Public Access communities" ON storage.objects FOR SELECT USING (bucket_id = 'communities');
CREATE POLICY "Authenticated Upload communities" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'communities' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update communities" ON storage.objects FOR UPDATE USING (bucket_id = 'communities' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Delete communities" ON storage.objects FOR DELETE USING (bucket_id = 'communities' AND auth.role() = 'authenticated');
```

## ✅ Verificar se está funcionando

1. Acesse o painel administrativo na aplicação
2. Tente cadastrar um Local/Serviço/Evento com uma imagem
3. Se funcionar, você verá a mensagem de sucesso
4. Verifique no **Storage** → **places/services/events/communities** se a imagem foi enviada

## 🔧 Solução de Problemas

### Erro: "Bucket not found"
- Verifique se os buckets foram criados corretamente
- Confirme que os nomes são exatamente: `places`, `services`, `events`, `communities`
- **Solução rápida**: Execute o arquivo `SQL/SQL_CREATE_BUCKET_COMMUNITIES.sql` no SQL Editor do Supabase

### Erro: "new row violates row-level security policy"
- Verifique se as políticas RLS foram configuradas
- Confirme que você está autenticado no Supabase

### Erro: "File size limit exceeded"
- Verifique o limite de tamanho do bucket (deve ser pelo menos 5MB)
- Reduza o tamanho da imagem antes de fazer upload

### Imagem não aparece após upload
- Verifique se o bucket está marcado como público
- Confira se a política de SELECT está configurada corretamente

## 📝 Notas

- Os uploads são feitos para o Supabase Storage
- As imagens ficam públicas por padrão (configurável)
- O tamanho máximo de cada arquivo é 5MB
- Formatos aceitos: JPG, PNG, WEBP, GIF
