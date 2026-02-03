# Documentação do Supabase - Versão 2.0.0
## Amooora - Estado do Banco de Dados

**Data de Documentação:** Janeiro de 2025  
**Versão do Projeto:** V2.0.0  
**Projeto Supabase:** Amooora-Dev

---

## 📋 Informações do Projeto

### Detalhes do Projeto
- **ID do Projeto:** `btavwaysfjpsuqxdfguw`
- **Nome:** Amooora-Dev
- **Região:** us-west-2 (Oregon, EUA)
- **Status:** ACTIVE_HEALTHY
- **Database Host:** `db.btavwaysfjpsuqxdfguw.supabase.co`
- **Versão PostgreSQL:** 17.6.1.063
- **Engine:** PostgreSQL 17 (GA)

---

## 🗄️ Estrutura do Banco de Dados - V2.0.0

### Tabelas Principais

#### 1. `profiles` (Perfis de Usuários)
**RLS Habilitado:** ✅ Sim

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | NO | - | PK, FK para auth.users |
| `name` | text | NO | - | Nome do usuário |
| `email` | text | NO | - | Email (único) |
| `avatar` | text | YES | - | URL do avatar |
| `phone` | text | YES | - | Telefone |
| `bio` | text | YES | - | Biografia |
| `created_at` | timestamptz | YES | now() | Data de criação |
| `updated_at` | timestamptz | YES | now() | Data de atualização |
| `is_verified` | boolean | YES | false | Verificado |
| `pronouns` | text | YES | - | Pronomes |
| `city` | text | YES | - | Cidade |
| `interests` | text[] | YES | - | Array de interesses |
| `relationship_type` | text | YES | - | Tipo de relacionamento |
| `privacy_level` | text | YES | 'public' | 'public' ou 'connected' |
| `is_admin` | boolean | YES | false | É admin |
| `role` | text | YES | 'user' | Papel do usuário |
| `username` | text | YES | - | Nome de usuário |

---

#### 2. `places` (Locais Seguros)
**RLS Habilitado:** ✅ Sim

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | NO | gen_random_uuid() | Primary Key |
| `name` | text | NO | - | Nome do local |
| `description` | text | YES | - | Descrição |
| `image` | text | NO | - | URL da imagem |
| `address` | text | YES | - | Endereço |
| `category` | text | NO | - | Categoria |
| `latitude` | numeric | YES | - | Latitude |
| `longitude` | numeric | YES | - | Longitude |
| `is_safe` | boolean | YES | true | É lugar seguro |
| `rating` | numeric | YES | 0 | Avaliação |
| `review_count` | integer | YES | 0 | Número de avaliações |
| `created_at` | timestamptz | YES | now() | Data de criação |
| `updated_at` | timestamptz | YES | now() | Data de atualização |
| `created_by` | uuid | YES | - | FK para profiles.id |
| `tags` | text[] | YES | - | Array de tags (vegano, aceita-pets, etc.) |

**Foreign Keys:**
- `places.created_by` → `profiles.id`

---

#### 3. `events` (Eventos)
**RLS Habilitado:** ✅ Sim

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | NO | gen_random_uuid() | Primary Key |
| `name` | text | NO | - | Nome do evento |
| `description` | text | NO | - | Descrição |
| `image` | text | YES | - | URL da imagem |
| `date` | timestamptz | NO | - | Data do evento |
| `end_time` | timestamptz | YES | - | **NOVO V2.0.0** - Horário de término |
| `location` | text | NO | - | Localização |
| `category` | text | NO | - | Categoria |
| `price` | numeric | YES | 0 | Preço |
| `participants_count` | integer | YES | 0 | Contador de participantes |
| `rating` | numeric | YES | 0 | Avaliação |
| `review_count` | integer | YES | 0 | Número de avaliações |
| `created_at` | timestamptz | YES | now() | Data de criação |
| `updated_at` | timestamptz | YES | now() | Data de atualização |
| `created_by` | uuid | YES | - | FK para profiles.id |
| `is_active` | boolean | YES | true | Evento ativo |

**Foreign Keys:**
- `events.created_by` → `profiles.id`

**Mudanças V2.0.0:**
- ✅ Adicionada coluna `end_time` (TIMESTAMPTZ) para horário de término do evento

---

#### 4. `services` (Serviços)
**RLS Habilitado:** ✅ Sim

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | NO | gen_random_uuid() | Primary Key |
| `name` | text | NO | - | Nome do serviço |
| `description` | text | NO | - | Descrição |
| `image` | text | NO | - | URL da imagem |
| `price` | numeric | YES | - | Preço |
| `category` | text | NO | - | Categoria |
| `category_slug` | text | NO | - | Slug da categoria |
| `provider` | text | YES | - | Prestador |
| `rating` | numeric | YES | 0 | Avaliação |
| `review_count` | integer | YES | 0 | Número de avaliações |
| `created_at` | timestamptz | YES | now() | Data de criação |
| `updated_at` | timestamptz | YES | now() | Data de atualização |
| `created_by` | uuid | YES | - | FK para profiles.id |
| `is_active` | boolean | YES | true | Serviço ativo |
| `phone` | text | YES | - | **NOVO V2.0.0** - Telefone |
| `whatsapp` | text | YES | - | **NOVO V2.0.0** - WhatsApp |
| `address` | text | YES | - | **NOVO V2.0.0** - Endereço |
| `specialties` | jsonb | YES | - | **NOVO V2.0.0** - Especialidades (array) |
| `hours` | jsonb | YES | - | **NOVO V2.0.0** - Horários de funcionamento |

**Foreign Keys:**
- `services.created_by` → `profiles.id`

**Mudanças V2.0.0:**
- ✅ Adicionada coluna `phone` (TEXT)
- ✅ Adicionada coluna `whatsapp` (TEXT)
- ✅ Adicionada coluna `address` (TEXT)
- ✅ Adicionada coluna `specialties` (JSONB) - Array de especialidades
- ✅ Adicionada coluna `hours` (JSONB) - Horários por dia da semana

---

#### 5. `reviews` (Avaliações)
**RLS Habilitado:** ✅ Sim

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | NO | gen_random_uuid() | Primary Key |
| `place_id` | uuid | YES | - | FK para places.id |
| `service_id` | uuid | YES | - | FK para services.id |
| `event_id` | uuid | YES | - | FK para events.id |
| `user_id` | uuid | YES | - | **ALTERADO V2.0.0** - FK para profiles.id (agora nullable) |
| `author_name` | text | YES | - | **NOVO V2.0.0** - Nome do autor (para comentários anônimos) |
| `rating` | integer | NO | - | Nota 1-5 (constraint) |
| `comment` | text | NO | - | Comentário |
| `created_at` | timestamptz | YES | now() | Data de criação |
| `updated_at` | timestamptz | YES | now() | Data de atualização |

**Constraints:**
- `rating >= 1 AND rating <= 5`

**Foreign Keys:**
- `reviews.place_id` → `places.id`
- `reviews.service_id` → `services.id`
- `reviews.event_id` → `events.id`
- `reviews.user_id` → `profiles.id` (nullable)

**Mudanças V2.0.0:**
- ✅ Adicionada coluna `author_name` (TEXT) - Permite comentários anônimos
- ✅ Coluna `user_id` alterada para nullable - Permite reviews sem autenticação

---

#### 6. `saved_places` (Locais Favoritos)
**RLS Habilitado:** ✅ Sim

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | NO | gen_random_uuid() | Primary Key |
| `user_id` | uuid | NO | - | FK para profiles.id |
| `place_id` | uuid | NO | - | FK para places.id |
| `created_at` | timestamptz | YES | now() | Data de criação |

**Foreign Keys:**
- `saved_places.user_id` → `profiles.id`
- `saved_places.place_id` → `places.id`

---

#### 7. `event_participants` (Participantes de Eventos)
**RLS Habilitado:** ✅ Sim

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | NO | gen_random_uuid() | Primary Key |
| `event_id` | uuid | NO | - | FK para events.id |
| `user_id` | uuid | NO | - | FK para profiles.id |
| `created_at` | timestamptz | YES | now() | Data de criação |

**Foreign Keys:**
- `event_participants.event_id` → `events.id`
- `event_participants.user_id` → `profiles.id`

---

#### 8. `community_posts` (Posts da Comunidade)
**RLS Habilitado:** ✅ Sim

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | NO | gen_random_uuid() | Primary Key |
| `user_id` | uuid | NO | - | FK para profiles.id |
| `title` | text | NO | - | Título |
| `content` | text | NO | - | Conteúdo |
| `category` | text | NO | - | Categoria |
| `image` | text | YES | - | URL da imagem |
| `likes_count` | integer | YES | 0 | Contador de curtidas |
| `replies_count` | integer | YES | 0 | Contador de respostas |
| `is_trending` | boolean | YES | false | Em alta |
| `created_at` | timestamptz | YES | now() | Data de criação |
| `updated_at` | timestamptz | YES | now() | Data de atualização |

**Foreign Keys:**
- `community_posts.user_id` → `profiles.id`

---

#### 9. `post_likes` (Curtidas em Posts)
**RLS Habilitado:** ✅ Sim

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | NO | gen_random_uuid() | Primary Key |
| `post_id` | uuid | NO | - | FK para community_posts.id |
| `user_id` | uuid | NO | - | FK para profiles.id |
| `created_at` | timestamptz | YES | now() | Data de criação |

**Foreign Keys:**
- `post_likes.post_id` → `community_posts.id`
- `post_likes.user_id` → `profiles.id`

---

#### 10. `post_replies` (Respostas em Posts)
**RLS Habilitado:** ✅ Sim

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | NO | gen_random_uuid() | Primary Key |
| `post_id` | uuid | NO | - | FK para community_posts.id |
| `user_id` | uuid | YES | - | **ALTERADO V2.0.0** - FK para profiles.id (agora nullable) |
| `author_name` | text | YES | - | **NOVO V2.0.0** - Nome do autor (para comentários anônimos) |
| `content` | text | NO | - | Conteúdo da resposta |
| `parent_reply_id` | uuid | YES | - | FK para post_replies.id (thread) |
| `created_at` | timestamptz | YES | now() | Data de criação |
| `updated_at` | timestamptz | YES | now() | Data de atualização |

**Foreign Keys:**
- `post_replies.post_id` → `community_posts.id`
- `post_replies.user_id` → `profiles.id` (nullable)
- `post_replies.parent_reply_id` → `post_replies.id` (auto-referência para threads)

**Mudanças V2.0.0:**
- ✅ Adicionada coluna `author_name` (TEXT) - Permite comentários anônimos
- ✅ Coluna `user_id` alterada para nullable - Permite replies sem autenticação

---

## 🔧 Funções RPC (Remote Procedure Calls) - V2.0.0

### Funções para Comunidade

#### `increment_likes_count(post_id_param UUID)`
- **Descrição:** Incrementa o contador de likes de um post
- **Parâmetros:** `post_id_param` (UUID)
- **Retorno:** VOID
- **Uso:** Chamado quando um usuário curte um post

#### `decrement_likes_count(post_id_param UUID)`
- **Descrição:** Decrementa o contador de likes de um post (mínimo 0)
- **Parâmetros:** `post_id_param` (UUID)
- **Retorno:** VOID
- **Uso:** Chamado quando um usuário remove a curtida

#### `increment_replies_count(post_id_param UUID)`
- **Descrição:** Incrementa o contador de replies de um post
- **Parâmetros:** `post_id_param` (UUID)
- **Retorno:** VOID
- **Uso:** Chamado quando uma nova resposta é criada

#### `decrement_replies_count(post_id_param UUID)`
- **Descrição:** Decrementa o contador de replies de um post (mínimo 0)
- **Parâmetros:** `post_id_param` (UUID)
- **Retorno:** VOID
- **Uso:** Chamado quando uma resposta é deletada

---

## 🔒 Políticas RLS (Row Level Security) - V2.0.0

Todas as tabelas têm RLS habilitado. As políticas permitem:

### `profiles`
- ✅ **SELECT público** - Todos podem ver perfis
- ✅ **INSERT autenticado** - Usuários autenticados podem criar perfis
- ✅ **UPDATE autenticado** - Usuários autenticados podem atualizar seus próprios perfis
- ✅ **DELETE autenticado** - Usuários autenticados podem deletar seus próprios perfis

### `places`
- ✅ **SELECT público** - Todos podem ver lugares
- ✅ **INSERT autenticado** - Usuários autenticados podem criar lugares
- ✅ **UPDATE autenticado** - Usuários autenticados podem atualizar lugares
- ✅ **DELETE autenticado** - Usuários autenticados podem deletar lugares

### `events`
- ✅ **SELECT público** - Todos podem ver eventos
- ✅ **INSERT autenticado** - Usuários autenticados podem criar eventos
- ✅ **UPDATE autenticado** - Usuários autenticados podem atualizar eventos
- ✅ **DELETE autenticado** - Usuários autenticados podem deletar eventos

### `services`
- ✅ **SELECT público** - Todos podem ver serviços
- ✅ **INSERT autenticado** - Usuários autenticados podem criar serviços
- ✅ **UPDATE autenticado** - Usuários autenticados podem atualizar serviços
- ✅ **DELETE autenticado** - Usuários autenticados podem deletar serviços

### `reviews`
- ✅ **SELECT público** - Todos podem ver avaliações
- ✅ **INSERT autenticado/anônimo** - Permite criar reviews com ou sem autenticação (via `author_name`)
- ✅ **UPDATE autenticado** - Apenas autor pode atualizar avaliação
- ✅ **DELETE autenticado** - Apenas autor pode deletar avaliação

### `saved_places`
- ✅ **SELECT privado** - Usuário só pode ver seus próprios favoritos
- ✅ **INSERT autenticado** - Usuário autenticado pode salvar lugares
- ✅ **DELETE autenticado** - Usuário só pode remover seus próprios favoritos

### `event_participants`
- ✅ **SELECT público** - Todos podem ver participantes
- ✅ **INSERT autenticado** - Usuário autenticado pode se inscrever
- ✅ **DELETE autenticado** - Usuário pode cancelar sua participação

### `community_posts`
- ✅ **SELECT público** - Todos podem ver posts
- ✅ **INSERT autenticado** - Apenas usuários autenticados podem criar posts
- ✅ **UPDATE autenticado** - Apenas autor pode atualizar post
- ✅ **DELETE autenticado** - Apenas autor pode deletar post

### `post_likes`
- ✅ **SELECT público** - Todos podem ver curtidas
- ✅ **INSERT autenticado** - Apenas usuários autenticados podem curtir
- ✅ **DELETE autenticado** - Usuário pode remover sua própria curtida

### `post_replies`
- ✅ **SELECT público** - Todos podem ver respostas
- ✅ **INSERT autenticado/anônimo** - Permite criar replies com ou sem autenticação (via `author_name`)
- ✅ **UPDATE autenticado** - Apenas autor pode atualizar resposta
- ✅ **DELETE autenticado** - Apenas autor pode deletar resposta

---

## 📦 Migrations Aplicadas (V1.0.0 → V2.0.0)

### Migrations Base (V1.0.0)
1. `create_extensions_and_profiles` - Cria extensões e tabela de perfis
2. `create_places_services_events` - Cria tabelas principais
3. `create_relationship_tables` - Cria tabelas de relacionamento
4. `create_community_tables` - Cria tabelas da comunidade
5. `create_functions_and_triggers_fixed` - Cria funções e triggers
6. `fix_security_and_performance` - Corrige segurança e performance

### Migrations V2.0.0
7. **`add_author_name_to_reviews`** - Adiciona coluna `author_name` em `reviews` e torna `user_id` nullable
8. **`add_fields_to_services`** - Adiciona `phone`, `whatsapp`, `address`, `specialties`, `hours` em `services`
9. **`add_end_time_to_events`** - Adiciona coluna `end_time` em `events`
10. **`add_author_name_to_post_replies`** - Adiciona coluna `author_name` em `post_replies` e torna `user_id` nullable
11. **`create_rpc_functions_community`** - Cria funções RPC para gerenciar contadores de likes e replies

---

## 🔌 Extensões Instaladas

| Extensão | Schema | Versão | Descrição |
|----------|--------|--------|-----------|
| `pgcrypto` | extensions | 1.3 | Funções criptográficas |
| `pg_stat_statements` | extensions | 1.11 | Estatísticas de execução SQL |
| `supabase_vault` | vault | 0.3.1 | Supabase Vault Extension |
| `pg_graphql` | graphql | 1.5.11 | Suporte GraphQL |
| `uuid-ossp` | extensions | 1.1 | Geração de UUIDs |
| `plpgsql` | pg_catalog | 1.0 | Linguagem procedural PL/pgSQL |

---

## 📊 Estrutura de Dados JSONB

### `services.specialties` (JSONB)
Formato esperado:
```json
["Terapia LGBTQIA+", "Ansiedade", "Depressão"]
```

### `services.hours` (JSONB)
Formato esperado:
```json
{
  "monday": "09:00 - 18:00",
  "tuesday": "09:00 - 18:00",
  "wednesday": "09:00 - 18:00",
  "thursday": "09:00 - 18:00",
  "friday": "09:00 - 18:00",
  "saturday": "09:00 - 13:00",
  "sunday": ""
}
```

### `places.tags` (TEXT[])
Array de strings:
```sql
['vegano', 'aceita-pets', 'acessivel', 'drag-shows', 'wifi-gratis', 'estacionamento', 'musica-ao-vivo', 'ar-livre']
```

---

## 🔗 Relacionamentos entre Tabelas

```
profiles (1) ──┬──> places (N)
               ├──> events (N)
               ├──> services (N)
               ├──> reviews (N)
               ├──> saved_places (N)
               ├──> event_participants (N)
               ├──> community_posts (N)
               ├──> post_likes (N)
               └──> post_replies (N)

places (1) ──┬──> reviews (N)
             └──> saved_places (N)

events (1) ──┬──> reviews (N)
             └──> event_participants (N)

services (1) ──> reviews (N)

community_posts (1) ──┬──> post_likes (N)
                      └──> post_replies (N)

post_replies (1) ──> post_replies (N) [parent_reply_id - threads]
```

---

## 📝 Scripts SQL para Recriar Estrutura V2.0.0

### Scripts Disponíveis em `/SQL/`:

1. **`SQL_ADICIONAR_AUTHOR_NAME_REVIEWS.sql`**
   - Adiciona `author_name` em `reviews`
   - Torna `user_id` nullable em `reviews`

2. **`SQL_ADICIONAR_CAMPOS_SERVICOS_EVENTOS.sql`**
   - Adiciona campos em `services`: `phone`, `whatsapp`, `address`, `specialties`, `hours`
   - Adiciona campo `end_time` em `events`

3. **`SQL_FUNCOES_RPC_COMMUNITY.sql`**
   - Cria funções RPC para gerenciar contadores de likes e replies

4. **`SQL_CORRIGIR_RLS_DEFINITIVO.sql`**
   - Ajusta políticas RLS para permitir operações públicas de SELECT

---

## 🔄 Mudanças da V1.0.0 para V2.0.0

### Novas Colunas Adicionadas:
- ✅ `reviews.author_name` - Permite comentários anônimos
- ✅ `reviews.user_id` - Agora nullable
- ✅ `post_replies.author_name` - Permite comentários anônimos
- ✅ `post_replies.user_id` - Agora nullable
- ✅ `services.phone` - Telefone de contato
- ✅ `services.whatsapp` - WhatsApp de contato
- ✅ `services.address` - Endereço do serviço
- ✅ `services.specialties` - Especialidades (JSONB)
- ✅ `services.hours` - Horários de funcionamento (JSONB)
- ✅ `events.end_time` - Horário de término do evento
- ✅ `places.tags` - Array de tags para categorização

### Novas Funções RPC:
- ✅ `increment_likes_count()` - Incrementa likes
- ✅ `decrement_likes_count()` - Decrementa likes
- ✅ `increment_replies_count()` - Incrementa replies
- ✅ `decrement_replies_count()` - Decrementa replies

### Melhorias de Funcionalidade:
- ✅ Suporte a comentários anônimos (reviews e replies)
- ✅ Informações de contato completas para serviços
- ✅ Horários de funcionamento para serviços
- ✅ Horário de término para eventos
- ✅ Sistema de tags para lugares

---

## 🔐 Configurações de Segurança

### Row Level Security (RLS)
- ✅ Todas as tabelas têm RLS habilitado
- ✅ Políticas configuradas para garantir segurança
- ✅ SELECT público para visualização de conteúdos
- ✅ INSERT/UPDATE/DELETE apenas para usuários autenticados (ou anônimos via `author_name`)
- ✅ Verificação de propriedade para operações sensíveis

### Autenticação
- Integração com `auth.users` do Supabase
- Tabela `profiles` vinculada via `id = auth.uid()`
- Tokens JWT para autenticação
- Suporte a comentários anônimos via `author_name`

---

## 📝 Observações Importantes

### Para Recriar este Ambiente (V2.0.0):

1. **Criar novo projeto Supabase** (ou usar o existente)
2. **Aplicar migrations base (V1.0.0):**
   - `create_extensions_and_profiles`
   - `create_places_services_events`
   - `create_relationship_tables`
   - `create_community_tables`
   - `create_functions_and_triggers_fixed`
   - `fix_security_and_performance`
3. **Aplicar migrations V2.0.0:**
   - `SQL_ADICIONAR_AUTHOR_NAME_REVIEWS.sql`
   - `SQL_ADICIONAR_CAMPOS_SERVICOS_EVENTOS.sql`
   - `SQL_FUNCOES_RPC_COMMUNITY.sql`
4. **Configurar variáveis de ambiente:**
   ```
   VITE_SUPABASE_URL=https://btavwaysfjpsuqxdfguw.supabase.co
   VITE_SUPABASE_ANON_KEY=[chave anon do projeto]
   ```
5. **Verificar RLS habilitado** em todas as tabelas
6. **Validar políticas RLS** estão corretas

---

## 🔄 Versionamento

**Este documento reflete o estado do Supabase na versão V2.0.0 do Amooora.**

**Tag Git:** `v2.0.0`

**Mudanças principais em relação à V1.0.0:**
- Novos campos em `services` e `events`
- Suporte a comentários anônimos
- Funções RPC para comunidade
- Sistema de tags para lugares

---

**Última Atualização:** Janeiro de 2025  
**Versão do Documento:** 2.0  
**Status:** Completo para V2.0.0
