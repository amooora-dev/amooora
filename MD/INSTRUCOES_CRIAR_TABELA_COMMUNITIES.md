# Instruções para Criar Tabela de Comunidades

## Passo a Passo

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Clique em **New Query**
5. Cole o conteúdo do arquivo `SQL/SQL_CREATE_COMMUNITIES_TABLE.sql`
6. Clique em **Run** para executar

## O que será criado:

- **Tabela `communities`**: Armazena as comunidades
  - `id`: UUID único
  - `name`: Nome da comunidade
  - `description`: Descrição
  - `image`: URL da imagem
  - `icon`: Nome do ícone (opcional)
  - `category`: Categoria (Apoio, Dicas, Eventos, Geral)
  - `members_count`: Contador de membros
  - `posts_count`: Contador de posts
  - `is_active`: Se está ativa
  - `created_at` e `updated_at`: Timestamps

- **Tabela `community_members`**: Associação usuário-comunidade
  - `id`: UUID único
  - `community_id`: ID da comunidade
  - `user_id`: ID do usuário
  - `joined_at`: Data de entrada

- **Políticas RLS**: Segurança de dados
  - Leitura pública de comunidades ativas
  - Inserção/atualização apenas para autenticados
  - Membros podem ver suas próprias associações

- **Funções RPC**: Para gerenciar contadores
  - `increment_community_members`: Incrementa contador de membros
  - `decrement_community_members`: Decrementa contador de membros

## Próximos Passos

Após criar a tabela, você pode:
1. Cadastrar comunidades pelo painel administrativo
2. Usuários poderão se associar a comunidades (quando login estiver ativo)
3. Posts podem ser vinculados a comunidades através da categoria
