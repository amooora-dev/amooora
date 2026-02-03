# Configurar Bucket de Storage para Comunidades

## Erro: "Bucket not found"

Se você está recebendo o erro "Bucket not found" ao cadastrar uma comunidade, significa que o bucket `communities` não foi criado no Supabase Storage.

## ⚡ Solução Rápida (Recomendada)

### Via SQL Editor (Mais Rápido)

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Clique em **New Query**
5. Abra o arquivo `SQL/SQL_CREATE_BUCKET_COMMUNITIES.sql` e cole o conteúdo
6. Clique em **Run** para executar

Isso criará o bucket e todas as políticas necessárias automaticamente!

## 📋 Passo a Passo Manual (Alternativa)

### 1. Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Selecione seu projeto

### 2. Navegue até Storage
- No menu lateral, clique em **Storage**
- Você verá a lista de buckets existentes

### 3. Criar Novo Bucket
- Clique no botão **New bucket** (ou "Novo bucket")
- Configure o bucket com os seguintes dados:

**Nome do bucket:** `communities`

**Configurações:**
- ✅ **Public bucket**: Marque esta opção (para que as imagens sejam acessíveis publicamente)
- ✅ **File size limit**: 5 MB (ou o tamanho máximo que você deseja)
- ✅ **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp, image/gif`

### 4. Configurar Políticas RLS (Row Level Security)

Após criar o bucket, você precisa configurar as políticas de acesso:

#### Opção 1: Via SQL Editor (Recomendado)

1. Vá em **SQL Editor** no menu lateral
2. Clique em **New Query**
3. Cole o seguinte SQL:

```sql
-- Política para permitir upload de imagens para usuários autenticados
CREATE POLICY "Allow authenticated upload to communities bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'communities' AND
  (storage.foldername(name))[1] = 'communities'
);

-- Política para permitir leitura pública de imagens
CREATE POLICY "Allow public read from communities bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'communities');

-- Política para permitir atualização de imagens para usuários autenticados
CREATE POLICY "Allow authenticated update to communities bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'communities');

-- Política para permitir exclusão de imagens para usuários autenticados
CREATE POLICY "Allow authenticated delete from communities bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'communities');
```

4. Clique em **Run** para executar

#### Opção 2: Via Interface do Storage

1. Clique no bucket `communities` que você acabou de criar
2. Vá na aba **Policies**
3. Clique em **New Policy**
4. Configure as políticas manualmente (mais trabalhoso)

### 5. Verificar Configuração

Após criar o bucket e as políticas:

1. Tente cadastrar uma nova comunidade novamente
2. O upload da imagem deve funcionar agora

## Buckets Existentes no Projeto

O projeto usa os seguintes buckets de storage:
- `places` - Imagens de locais
- `events` - Imagens de eventos
- `services` - Imagens de serviços
- `communities` - Imagens de comunidades (precisa ser criado)

## Troubleshooting

### Erro persiste após criar o bucket?

1. **Verifique se o bucket está público:**
   - Vá em Storage > communities
   - Verifique se "Public bucket" está marcado

2. **Verifique as políticas RLS:**
   - Vá em Storage > communities > Policies
   - Certifique-se de que as políticas foram criadas corretamente

3. **Verifique as variáveis de ambiente:**
   - Certifique-se de que `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas

4. **Limpe o cache do navegador:**
   - Às vezes o navegador pode estar usando dados em cache

## Próximos Passos

Após configurar o bucket:
1. ✅ Cadastrar comunidades pelo painel administrativo
2. ✅ Fazer upload de imagens para as comunidades
3. ✅ As imagens aparecerão na página de Comunidade
