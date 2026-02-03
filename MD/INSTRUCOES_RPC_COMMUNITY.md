# Instruções para Criar Funções RPC de Comunidade

## Problema
Os comentários não estão sendo salvos corretamente ou o contador de replies não está sendo atualizado quando um comentário é criado em um post da comunidade.

## Solução
Execute o script SQL para criar as funções RPC necessárias para gerenciar os contadores de likes e replies.

## Passos

1. **Acesse o Supabase Dashboard**
   - Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New Query**

3. **Execute o Script**
   - Copie e cole o conteúdo do arquivo `SQL/SQL_FUNCOES_RPC_COMMUNITY.sql`
   - Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)

4. **Verifique as Funções Criadas**
   - O script criará 4 funções RPC:
     - `increment_likes_count`
     - `decrement_likes_count`
     - `increment_replies_count`
     - `decrement_replies_count`
   - Você deve ver uma mensagem de sucesso confirmando que as funções foram criadas

## Verificação

Após executar o script, teste criar um comentário em um post da comunidade e verifique:

1. O comentário aparece na lista de comentários
2. O contador de "respostas" no post é incrementado
3. O comentário permanece após recarregar a página

## Troubleshooting

Se ainda houver problemas:

1. **Verifique os logs do console do navegador**
   - Abra o DevTools (F12)
   - Vá para a aba Console
   - Procure por mensagens de erro ou logs de debug (começam com 📝, ✅, ❌)

2. **Verifique as políticas RLS**
   - No Supabase Dashboard, vá em **Authentication** → **Policies**
   - Certifique-se de que a tabela `post_replies` tem políticas de INSERT públicas

3. **Verifique se a tabela `post_replies` existe**
   - Vá em **Table Editor** no Supabase Dashboard
   - Certifique-se de que a tabela `post_replies` existe e tem as colunas:
     - `id` (UUID, primary key)
     - `post_id` (UUID, foreign key para `community_posts`)
     - `user_id` (UUID, nullable, foreign key para `profiles`)
     - `author_name` (TEXT, nullable)
     - `content` (TEXT)
     - `parent_reply_id` (UUID, nullable)
     - `created_at` (TIMESTAMPTZ)
