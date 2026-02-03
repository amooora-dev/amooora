# Documentação do Supabase - Versão 1.0.0
## Amooora - Estado do Banco de Dados

**Data de Documentação:** 21 de Janeiro de 2025  
**Versão do Projeto:** V1.0.0  
**Projeto Supabase:** Amooora-Dev

---

## 📋 Informações do Projeto

### Detalhes do Projeto
- **ID do Projeto:** `btavwaysfjpsuqxdfguw`
- **Nome:** Amooora-Dev
- **Região:** us-west-2 (Oregon, EUA)
- **Status:** ACTIVE_HEALTHY
- **Criado em:** 18 de Janeiro de 2025
- **Database Host:** `db.btavwaysfjpsuqxdfguw.supabase.co`
- **Versão PostgreSQL:** 17.6.1.063
- **Engine:** PostgreSQL 17 (GA)

### Organização
- **ID da Organização:** `sigmsxxeitwwqhcbkaab`
- **Slug da Organização:** `sigmsxxeitwwqhcbkaab`

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### 1. `profiles` (Perfis de Usuários)
**RLS Habilitado:** ✅ Sim  
**Total de Registros:** 9

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

---

#### 2. `places` (Locais Seguros)
**RLS Habilitado:** ✅ Sim  
**Total de Registros:** 6

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

**Foreign Keys:**
- `places.created_by` → `profiles.id`

---

#### 3. `events` (Eventos)
**RLS Habilitado:** ✅ Sim  
**Total de Registros:** 5

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | NO | gen_random_uuid() | Primary Key |
| `name` | text | NO | - | Nome do evento |
| `description` | text | NO | - | Descrição |
| `image` | text | YES | - | URL da imagem |
| `date` | timestamptz | NO | - | Data do evento |
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

---

#### 4. `services` (Serviços)
**RLS Habilitado:** ✅ Sim  
**Total de Registros:** 4

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

**Foreign Keys:**
- `services.created_by` → `profiles.id`

---

#### 5. `reviews` (Avaliações)
**RLS Habilitado:** ✅ Sim  
**Total de Registros:** 0

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | NO | gen_random_uuid() | Primary Key |
| `place_id` | uuid | YES | - | FK para places.id |
| `service_id` | uuid | YES | - | FK para services.id |
| `event_id` | uuid | YES | - | FK para events.id |
| `user_id` | uuid | NO | - | FK para profiles.id |
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
- `reviews.user_id` → `profiles.id`

---

#### 6. `saved_places` (Locais Favoritos)
**RLS Habilitado:** ✅ Sim  
**Total de Registros:** 0

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
**Total de Registros:** 0

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
**Total de Registros:** 0

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
**Total de Registros:** 0

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
**Total de Registros:** 0

| Coluna | Tipo | Nullable | Default | Descrição |
|--------|------|----------|---------|-----------|
| `id` | uuid | NO | gen_random_uuid() | Primary Key |
| `post_id` | uuid | NO | - | FK para community_posts.id |
| `user_id` | uuid | NO | - | FK para profiles.id |
| `content` | text | NO | - | Conteúdo da resposta |
| `parent_reply_id` | uuid | YES | - | FK para post_replies.id (thread) |
| `created_at` | timestamptz | YES | now() | Data de criação |
| `updated_at` | timestamptz | YES | now() | Data de atualização |

**Foreign Keys:**
- `post_replies.post_id` → `community_posts.id`
- `post_replies.user_id` → `profiles.id`
- `post_replies.parent_reply_id` → `post_replies.id` (auto-referência para threads)

---

## 🔒 Políticas RLS (Row Level Security)

Todas as tabelas têm RLS habilitado. Segue o resumo das políticas:

### `profiles`
1. **Public SELECT profiles** - Todos podem ver perfis
2. **Authenticated INSERT profiles** - Usuários autenticados podem criar perfis
3. **Authenticated UPDATE profiles** - Usuários autenticados podem atualizar perfis
4. **Authenticated DELETE profiles** - Usuários autenticados podem deletar perfis

### `places`
1. **Public SELECT places** - Todos podem ver lugares
2. **Authenticated INSERT places** - Usuários autenticados podem criar lugares
3. **Authenticated UPDATE places** - Usuários autenticados podem atualizar lugares
4. **Authenticated DELETE places** - Usuários autenticados podem deletar lugares

### `events`
1. **Public SELECT events** - Todos podem ver eventos
2. **Authenticated INSERT events** - Usuários autenticados podem criar eventos
3. **Authenticated UPDATE events** - Usuários autenticados podem atualizar eventos
4. **Authenticated DELETE events** - Usuários autenticados podem deletar eventos

### `services`
1. **Public SELECT services** - Todos podem ver serviços
2. **Authenticated INSERT services** - Usuários autenticados podem criar serviços
3. **Authenticated UPDATE services** - Usuários autenticados podem atualizar serviços
4. **Authenticated DELETE services** - Usuários autenticados podem deletar serviços

### `reviews`
1. **Todos podem ver avaliações** - SELECT público
2. **Apenas usuários autenticados podem criar avaliações** - INSERT com verificação de `user_id = auth.uid()`
3. **Apenas autor pode atualizar avaliação** - UPDATE com verificação de `user_id = auth.uid()`
4. **Apenas autor pode deletar avaliação** - DELETE com verificação de `user_id = auth.uid()`

### `saved_places`
1. **Usuário só pode ver seus próprios favoritos** - SELECT com verificação de `user_id = auth.uid()`
2. **Usuário autenticado pode salvar lugares** - INSERT com verificação de `user_id = auth.uid()`
3. **Usuário só pode remover seus próprios favoritos** - DELETE com verificação de `user_id = auth.uid()`

### `event_participants`
1. **Todos podem ver participantes de eventos** - SELECT público
2. **Usuário autenticado pode se inscrever em eventos** - INSERT com verificação de `user_id = auth.uid()`
3. **Usuário pode cancelar sua participação** - DELETE com verificação de `user_id = auth.uid()`

### `community_posts`
1. **Todos podem ver posts** - SELECT público
2. **Apenas usuários autenticados podem criar posts** - INSERT com verificação de `user_id = auth.uid()`
3. **Apenas autor pode atualizar post** - UPDATE com verificação de `user_id = auth.uid()`
4. **Apenas autor pode deletar post** - DELETE com verificação de `user_id = auth.uid()`

### `post_likes`
1. **Todos podem ver curtidas** - SELECT público
2. **Apenas usuários autenticados podem curtir** - INSERT com verificação de `user_id = auth.uid()`
3. **Usuário pode remover sua própria curtida** - DELETE com verificação de `user_id = auth.uid()`

### `post_replies`
1. **Todos podem ver respostas** - SELECT público
2. **Apenas usuários autenticados podem responder** - INSERT com verificação de `user_id = auth.uid()`
3. **Apenas autor pode atualizar resposta** - UPDATE com verificação de `user_id = auth.uid()`
4. **Apenas autor pode deletar resposta** - DELETE com verificação de `user_id = auth.uid()`

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

## 📦 Migrations Aplicadas

| Versão | Nome | Descrição |
|--------|------|-----------|
| `20260118203508` | `create_extensions_and_profiles` | Cria extensões e tabela de perfis |
| `20260118203532` | `create_places_services_events` | Cria tabelas principais (places, services, events) |
| `20260118203553` | `create_relationship_tables` | Cria tabelas de relacionamento (reviews, saved_places, event_participants) |
| `20260118203610` | `create_community_tables` | Cria tabelas da comunidade (posts, likes, replies) |
| `20260118203655` | `create_functions_and_triggers_fixed` | Cria funções e triggers do sistema |
| `20260118203731` | `fix_security_and_performance` | Corrige segurança e performance |

---

## 🔐 Configurações de Segurança

### Row Level Security (RLS)
- ✅ Todas as tabelas têm RLS habilitado
- ✅ Políticas configuradas para garantir segurança
- ✅ SELECT público para visualização de conteúdos
- ✅ INSERT/UPDATE/DELETE apenas para usuários autenticados
- ✅ Verificação de propriedade para operações sensíveis

### Autenticação
- Integração com `auth.users` do Supabase
- Tabela `profiles` vinculada via `id = auth.uid()`
- Tokens JWT para autenticação

---

## 📊 Estatísticas de Dados (V1.0.0)

| Tabela | Registros |
|--------|-----------|
| `profiles` | 9 |
| `places` | 6 |
| `events` | 5 |
| `services` | 4 |
| `reviews` | 0 |
| `saved_places` | 0 |
| `event_participants` | 0 |
| `community_posts` | 0 |
| `post_likes` | 0 |
| `post_replies` | 0 |

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

## 📝 Observações Importantes

### Para Recriar este Ambiente:

1. **Criar novo projeto Supabase** (ou usar o existente)
2. **Aplicar migrations na ordem:**
   - `create_extensions_and_profiles`
   - `create_places_services_events`
   - `create_relationship_tables`
   - `create_community_tables`
   - `create_functions_and_triggers_fixed`
   - `fix_security_and_performance`
3. **Configurar variáveis de ambiente:**
   ```
   VITE_SUPABASE_URL=https://btavwaysfjpsuqxdfguw.supabase.co
   VITE_SUPABASE_ANON_KEY=[chave anon do projeto]
   ```
4. **Verificar RLS habilitado** em todas as tabelas
5. **Validar políticas RLS** estão corretas

### Limitações Conhecidas:

- Algumas tabelas ainda não têm dados (reviews, saved_places, etc.)
- Sistema de autenticação pode precisar de ajustes futuros
- Storage buckets não estão documentados aqui (verificar no Supabase Dashboard)

---

## 🔄 Versionamento

**Este documento reflete o estado do Supabase na versão V1.0.0 do Amooora.**

Para versões futuras, atualizar este documento com:
- Novas tabelas criadas
- Alterações nas políticas RLS
- Novas migrations aplicadas
- Mudanças na estrutura de dados

---

**Última Atualização:** 21 de Janeiro de 2025  
**Versão do Documento:** 1.0  
**Status:** Completo para V1.0.0
