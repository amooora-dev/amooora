# Prompt para Criar Schema no Supabase - Amooora

## Instruções para o Supabase AI/Assistant

Preciso criar um schema completo no Supabase para a aplicação **Amooora** (plataforma de comunidade LGBTQIA+ para descobrir locais seguros, serviços, eventos e conectar pessoas).

Use o MCP do Supabase para criar todas as tabelas, relacionamentos, políticas RLS, índices e triggers necessários conforme especificado abaixo.

---

## 1. Tabela: profiles (Perfis de Usuário)

**Descrição:** Extensão da tabela `auth.users` do Supabase para armazenar dados do perfil do usuário.

**Campos:**
```sql
- id: uuid (PRIMARY KEY, REFERENCES auth.users(id))
- name: text (NOT NULL)
- email: text (UNIQUE, NOT NULL)
- avatar: text (URL da imagem)
- phone: text
- bio: text
- created_at: timestamptz (DEFAULT now())
- updated_at: timestamptz (DEFAULT now())
- is_verified: boolean (DEFAULT false)
- pronouns: text (ex: "ela/dela", "ele/dele", "elu/delu")
- city: text
- interests: text[] (array de interesses)
- relationship_type: text (ex: "Amizades e networking")
- privacy_level: text (DEFAULT 'public') -- 'public' ou 'connected'
```

**Políticas RLS:**
- SELECT: Qualquer um pode ver perfis públicos. Apenas membros conectados podem ver perfis privados.
- UPDATE: Usuário só pode atualizar seu próprio perfil
- INSERT: Criado automaticamente via trigger quando usuário se registra
- DELETE: Usuário pode deletar seu próprio perfil (soft delete recomendado)

---

## 2. Tabela: places (Locais Seguros)

**Descrição:** Locais LGBTQIA+ friendly (cafés, bares, restaurantes, praias, parques, etc.)

**Campos:**
```sql
- id: uuid (PRIMARY KEY, DEFAULT gen_random_uuid())
- name: text (NOT NULL)
- description: text
- image: text (NOT NULL) -- URL da imagem principal
- address: text
- category: text (NOT NULL) -- 'Café', 'Bar', 'Praia', 'Parque', etc.
- latitude: numeric(10, 8)
- longitude: numeric(11, 8)
- is_safe: boolean (DEFAULT true)
- rating: numeric(3, 2) (DEFAULT 0) -- Média calculada automaticamente
- review_count: integer (DEFAULT 0) -- Contagem calculada automaticamente
- created_at: timestamptz (DEFAULT now())
- updated_at: timestamptz (DEFAULT now())
- created_by: uuid (REFERENCES profiles(id))
```

**Índices:**
- `idx_places_category` em `category`
- `idx_places_location` em `(latitude, longitude)` -- Para buscas geográficas
- `idx_places_rating` em `rating DESC`
- `idx_places_is_safe` em `is_safe`

**Políticas RLS:**
- SELECT: Todos podem ver locais
- INSERT: Apenas usuários autenticados
- UPDATE: Apenas o criador ou admins
- DELETE: Apenas o criador ou admins

---

## 3. Tabela: services (Serviços)

**Descrição:** Serviços oferecidos por profissionais da comunidade (massagem, guia turístico, aulas, etc.)

**Campos:**
```sql
- id: uuid (PRIMARY KEY, DEFAULT gen_random_uuid())
- name: text (NOT NULL)
- description: text (NOT NULL)
- image: text (NOT NULL)
- price: numeric(10, 2)
- category: text (NOT NULL) -- 'Bem-estar', 'Turismo', 'Esporte', 'Fotografia', etc.
- category_slug: text (NOT NULL) -- 'bem-estar', 'turismo', etc.
- provider: text -- Nome do provedor do serviço
- rating: numeric(3, 2) (DEFAULT 0)
- review_count: integer (DEFAULT 0)
- created_at: timestamptz (DEFAULT now())
- updated_at: timestamptz (DEFAULT now())
- created_by: uuid (REFERENCES profiles(id))
- is_active: boolean (DEFAULT true)
```

**Índices:**
- `idx_services_category` em `category`
- `idx_services_category_slug` em `category_slug`
- `idx_services_rating` em `rating DESC`
- `idx_services_is_active` em `is_active`

**Políticas RLS:**
- SELECT: Todos podem ver serviços ativos
- INSERT: Apenas usuários autenticados
- UPDATE: Apenas o criador ou admins
- DELETE: Apenas o criador ou admins (soft delete com is_active)

---

## 4. Tabela: events (Eventos)

**Descrição:** Eventos da comunidade (festivais, feiras, corridas, workshops, etc.)

**Campos:**
```sql
- id: uuid (PRIMARY KEY, DEFAULT gen_random_uuid())
- name: text (NOT NULL)
- description: text (NOT NULL)
- image: text -- URL da imagem
- date: timestamptz (NOT NULL) -- Data e hora do evento
- location: text (NOT NULL)
- category: text (NOT NULL) -- 'Música', 'Artesanato', 'Esporte', 'Cinema', etc.
- price: numeric(10, 2) (DEFAULT 0) -- 0 = gratuito
- participants_count: integer (DEFAULT 0) -- Contagem de participantes
- rating: numeric(3, 2) (DEFAULT 0)
- review_count: integer (DEFAULT 0)
- created_at: timestamptz (DEFAULT now())
- updated_at: timestamptz (DEFAULT now())
- created_by: uuid (REFERENCES profiles(id))
- is_active: boolean (DEFAULT true)
```

**Índices:**
- `idx_events_date` em `date`
- `idx_events_category` em `category`
- `idx_events_location` em `location`
- `idx_events_is_active` em `is_active`

**Políticas RLS:**
- SELECT: Todos podem ver eventos ativos
- INSERT: Apenas usuários autenticados
- UPDATE: Apenas o criador ou admins
- DELETE: Apenas o criador ou admins

---

## 5. Tabela: reviews (Avaliações)

**Descrição:** Avaliações de locais, serviços e eventos

**Campos:**
```sql
- id: uuid (PRIMARY KEY, DEFAULT gen_random_uuid())
- place_id: uuid (REFERENCES places(id) ON DELETE CASCADE)
- service_id: uuid (REFERENCES services(id) ON DELETE CASCADE)
- event_id: uuid (REFERENCES events(id) ON DELETE CASCADE)
- user_id: uuid (NOT NULL, REFERENCES profiles(id))
- rating: integer (NOT NULL, CHECK (rating >= 1 AND rating <= 5))
- comment: text (NOT NULL)
- created_at: timestamptz (DEFAULT now())
- updated_at: timestamptz (DEFAULT now())
- CONSTRAINT check_single_reference CHECK (
  (place_id IS NOT NULL)::integer + 
  (service_id IS NOT NULL)::integer + 
  (event_id IS NOT NULL)::integer = 1
)
```

**Índices:**
- `idx_reviews_place_id` em `place_id`
- `idx_reviews_service_id` em `service_id`
- `idx_reviews_event_id` em `event_id`
- `idx_reviews_user_id` em `user_id`
- `idx_reviews_created_at` em `created_at DESC`

**Políticas RLS:**
- SELECT: Todos podem ver avaliações
- INSERT: Apenas usuários autenticados (um usuário só pode avaliar uma vez por item)
- UPDATE: Apenas o autor da avaliação
- DELETE: Apenas o autor da avaliação

**Triggers:**
- Trigger para atualizar `rating` e `review_count` em `places`, `services` e `events` quando uma review é inserida/atualizada/deletada

---

## 6. Tabela: saved_places (Locais Favoritos)

**Descrição:** Locais salvos/favoritados pelos usuários

**Campos:**
```sql
- id: uuid (PRIMARY KEY, DEFAULT gen_random_uuid())
- user_id: uuid (NOT NULL, REFERENCES profiles(id) ON DELETE CASCADE)
- place_id: uuid (NOT NULL, REFERENCES places(id) ON DELETE CASCADE)
- created_at: timestamptz (DEFAULT now())
- UNIQUE(user_id, place_id)
```

**Índices:**
- `idx_saved_places_user_id` em `user_id`
- `idx_saved_places_place_id` em `place_id`

**Políticas RLS:**
- SELECT: Usuário só pode ver seus próprios favoritos
- INSERT: Usuário autenticado pode salvar lugares
- DELETE: Usuário só pode remover seus próprios favoritos

---

## 7. Tabela: event_participants (Participantes de Eventos)

**Descrição:** Usuários que vão participar de eventos

**Campos:**
```sql
- id: uuid (PRIMARY KEY, DEFAULT gen_random_uuid())
- event_id: uuid (NOT NULL, REFERENCES events(id) ON DELETE CASCADE)
- user_id: uuid (NOT NULL, REFERENCES profiles(id) ON DELETE CASCADE)
- created_at: timestamptz (DEFAULT now())
- UNIQUE(event_id, user_id)
```

**Índices:**
- `idx_event_participants_event_id` em `event_id`
- `idx_event_participants_user_id` em `user_id`

**Políticas RLS:**
- SELECT: Usuário pode ver participantes de eventos públicos
- INSERT: Usuário autenticado pode se inscrever em eventos
- DELETE: Usuário pode cancelar sua participação

**Triggers:**
- Trigger para atualizar `participants_count` em `events` automaticamente

---

## 8. Tabela: community_posts (Posts da Comunidade)

**Descrição:** Posts da comunidade (feed, dicas, apoio, eventos, etc.)

**Campos:**
```sql
- id: uuid (PRIMARY KEY, DEFAULT gen_random_uuid())
- user_id: uuid (NOT NULL, REFERENCES profiles(id))
- title: text (NOT NULL)
- content: text (NOT NULL)
- category: text (NOT NULL) -- 'Apoio', 'Dicas', 'Eventos', 'Geral'
- image: text -- URL da imagem (opcional)
- likes_count: integer (DEFAULT 0)
- replies_count: integer (DEFAULT 0)
- is_trending: boolean (DEFAULT false)
- created_at: timestamptz (DEFAULT now())
- updated_at: timestamptz (DEFAULT now())
```

**Índices:**
- `idx_community_posts_user_id` em `user_id`
- `idx_community_posts_category` em `category`
- `idx_community_posts_created_at` em `created_at DESC`
- `idx_community_posts_is_trending` em `is_trending`

**Políticas RLS:**
- SELECT: Todos podem ver posts públicos
- INSERT: Apenas usuários autenticados
- UPDATE: Apenas o autor do post
- DELETE: Apenas o autor do post

---

## 9. Tabela: post_likes (Curtidas em Posts)

**Descrição:** Curtidas dos usuários em posts da comunidade

**Campos:**
```sql
- id: uuid (PRIMARY KEY, DEFAULT gen_random_uuid())
- post_id: uuid (NOT NULL, REFERENCES community_posts(id) ON DELETE CASCADE)
- user_id: uuid (NOT NULL, REFERENCES profiles(id) ON DELETE CASCADE)
- created_at: timestamptz (DEFAULT now())
- UNIQUE(post_id, user_id)
```

**Índices:**
- `idx_post_likes_post_id` em `post_id`
- `idx_post_likes_user_id` em `user_id`

**Políticas RLS:**
- SELECT: Todos podem ver curtidas (ou apenas se curtiu)
- INSERT: Apenas usuários autenticados
- DELETE: Usuário pode remover sua própria curtida

**Triggers:**
- Trigger para atualizar `likes_count` em `community_posts`

---

## 10. Tabela: post_replies (Respostas/Comentários em Posts)

**Descrição:** Comentários/respostas nos posts da comunidade

**Campos:**
```sql
- id: uuid (PRIMARY KEY, DEFAULT gen_random_uuid())
- post_id: uuid (NOT NULL, REFERENCES community_posts(id) ON DELETE CASCADE)
- user_id: uuid (NOT NULL, REFERENCES profiles(id))
- content: text (NOT NULL)
- parent_reply_id: uuid (REFERENCES post_replies(id) ON DELETE CASCADE) -- Para replies de replies
- created_at: timestamptz (DEFAULT now())
- updated_at: timestamptz (DEFAULT now())
```

**Índices:**
- `idx_post_replies_post_id` em `post_id`
- `idx_post_replies_user_id` em `user_id`
- `idx_post_replies_parent_reply_id` em `parent_reply_id`
- `idx_post_replies_created_at` em `created_at DESC`

**Políticas RLS:**
- SELECT: Todos podem ver respostas
- INSERT: Apenas usuários autenticados
- UPDATE: Apenas o autor da resposta
- DELETE: Apenas o autor da resposta

**Triggers:**
- Trigger para atualizar `replies_count` em `community_posts`

---

## 11. Funções e Triggers Necessários

### Função: update_place_rating()
Atualiza automaticamente o rating e review_count da tabela `places` quando uma review é adicionada/atualizada/removida.

### Função: update_service_rating()
Atualiza automaticamente o rating e review_count da tabela `services`.

### Função: update_event_rating()
Atualiza automaticamente o rating e review_count da tabela `events`.

### Função: update_event_participants_count()
Atualiza automaticamente o `participants_count` na tabela `events`.

### Função: update_post_likes_count()
Atualiza automaticamente o `likes_count` na tabela `community_posts`.

### Função: update_post_replies_count()
Atualiza automaticamente o `replies_count` na tabela `community_posts`.

### Função: handle_new_user()
Trigger que cria automaticamente um perfil na tabela `profiles` quando um novo usuário se registra em `auth.users`.

### Trigger: update_updated_at()
Trigger genérico para atualizar o campo `updated_at` em todas as tabelas que o possuem.

---

## 12. Extensões Necessárias

```sql
-- Habilitar extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Habilitar extensão para PostGIS (se quiser buscas geográficas avançadas)
CREATE EXTENSION IF NOT EXISTS "postgis";
```

---

## 13. Políticas RLS - Resumo

- **Perfis públicos**: Visíveis para todos
- **Perfis privados**: Visíveis apenas para membros conectados
- **Locais, Serviços, Eventos**: Todos podem ver, apenas autenticados podem criar
- **Avaliações**: Todos podem ver, apenas autenticados podem criar (uma por item)
- **Posts da Comunidade**: Todos podem ver e interagir
- **Favoritos/Participações**: Apenas o próprio usuário pode ver seus dados

---

## 14. Ordem de Criação

1. Criar tabela `profiles`
2. Criar tabela `places`
3. Criar tabela `services`
4. Criar tabela `events`
5. Criar tabela `reviews`
6. Criar tabela `saved_places`
7. Criar tabela `event_participants`
8. Criar tabela `community_posts`
9. Criar tabela `post_likes`
10. Criar tabela `post_replies`
11. Criar funções de atualização de ratings e contadores
12. Criar triggers
13. Criar índices
14. Criar políticas RLS
15. Criar trigger para auto-criar perfil ao registrar usuário

---

## Instruções Finais

Use o MCP do Supabase para:
1. Executar todas as migrações SQL necessárias
2. Configurar Row Level Security (RLS) para todas as tabelas
3. Criar todas as funções e triggers
4. Criar todos os índices para performance
5. Verificar se há problemas de segurança ou performance após a criação

Ao final, me forneça:
- Resumo das tabelas criadas
- Resumo das políticas RLS configuradas
- Resumo dos triggers criados
- Quaisquer avisos ou recomendações de segurança/performance

---

## Exemplo de Uso das Tabelas

**Buscar locais próximos:**
```sql
SELECT * FROM places 
WHERE is_safe = true 
ORDER BY rating DESC 
LIMIT 20;
```

**Buscar serviços por categoria:**
```sql
SELECT * FROM services 
WHERE category_slug = 'bem-estar' 
AND is_active = true 
ORDER BY rating DESC;
```

**Buscar eventos futuros:**
```sql
SELECT * FROM events 
WHERE date > NOW() 
AND is_active = true 
ORDER BY date ASC;
```

**Buscar avaliações de um local:**
```sql
SELECT r.*, p.name as user_name, p.avatar as user_avatar
FROM reviews r
JOIN profiles p ON r.user_id = p.id
WHERE r.place_id = 'uuid-do-local'
ORDER BY r.created_at DESC;
```