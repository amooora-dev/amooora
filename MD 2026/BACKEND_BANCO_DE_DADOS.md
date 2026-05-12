# Backend e Banco de Dados — Instruções e Referências

**Última atualização:** Maio 2026  
**Projeto:** Amooora — Plataforma LGBTQIA+ brasileira

---

## Visão Geral da Arquitetura de Dados

O Amooora utiliza **duas camadas de backend**:

1. **Supabase (BaaS)** — Backend principal do frontend React
   - PostgreSQL gerenciado
   - Auth (email/senha)
   - Storage (imagens)
   - Row Level Security (RLS)
   - Funções RPC

2. **Spring Boot (login_back)** — Microserviço Java auxiliar
   - API REST para gestão de usuários
   - Storage de fotos (MinIO / AWS S3)
   - MySQL como banco dedicado

---

## 1. Supabase (Backend Principal)

### Configuração do Cliente

Arquivo: `src/app/infra/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
```

Variáveis necessárias:
- `VITE_SUPABASE_URL` — URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` — Chave pública (anon key)

### Tabelas Principais

#### `profiles`
Perfil de cada usuário, criado automaticamente via trigger `handle_new_user()`.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID (PK, FK → auth.users) | ID do usuário |
| `email` | text | Email |
| `name` | text | Nome de exibição |
| `pronouns` | text | Pronomes |
| `avatar` | text | URL do avatar |
| `phone` | text | Telefone |
| `bio` | text | Biografia |
| `role` | enum | `admin_geral`, `user_viewer`, `admin_locais`, `admin_eventos`, `admin_servicos` |
| `status` | enum | `active`, `blocked`, `inactive` |
| `city` | text | Cidade |
| `whatsapp` | text | WhatsApp |

#### `places`
Locais seguros LGBTQIA+.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID (PK) | — |
| `name` | text | Nome do local |
| `description` | text | Descrição |
| `image` / `imageUrl` | text | URL da imagem |
| `address` | text | Endereço |
| `category` | text | Categoria (bar, restaurante, etc.) |
| `rating` | numeric | Avaliação média |
| `latitude` / `longitude` | numeric | Coordenadas |
| `tags` | text[] | Tags (vegano, acessível, etc.) |
| `isSafe` / `is_active` | boolean | Ativo/seguro |
| `created_by` | UUID (FK) | Criador |

#### `events`
Eventos da comunidade.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID (PK) | — |
| `name` | text | Nome |
| `description` | text | Descrição |
| `image` / `imageUrl` | text | URL da imagem |
| `date` | text/date | Data |
| `time` / `endTime` | text | Horário início/fim |
| `location` | text | Local |
| `category` | text | Categoria |
| `price` | numeric | Preço |
| `participants` | integer | Número de participantes |
| `is_active` | boolean | Ativo |
| `created_by` | UUID (FK) | Criador |

#### `services`
Serviços profissionais LGBTQIA+-friendly.

Categorias: Terapia, Advocacia, Saúde, Carreira, entre outras.

#### `communities`
Comunidades de discussão.

#### `community_posts`
Posts dentro de comunidades.

#### `post_replies`
Respostas a posts.

#### `reviews`
Avaliações de locais, serviços, eventos e comunidades.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID (PK) | — |
| `place_id` | UUID (FK, nullable) | Local avaliado |
| `service_id` | UUID (FK, nullable) | Serviço avaliado |
| `event_id` | UUID (FK, nullable) | Evento avaliado |
| `community_id` | UUID (FK, nullable) | Comunidade avaliada |
| `user_id` | UUID (FK) | Autor |
| `rating` | integer | Nota (1-5) |
| `comment` | text | Comentário |
| `created_at` | timestamp | Data de criação |

#### `event_interests`
Eventos que usuários têm interesse.

| Coluna | Tipo |
|---|---|
| `id` | UUID (PK) |
| `user_id` | UUID (FK) |
| `event_id` | UUID (FK) |
| `created_at` | timestamp |

#### `event_participants`
Eventos que usuários participaram.

Mesma estrutura de `event_interests`.

#### `friend_requests`
Solicitações de amizade.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID (PK) | — |
| `requester_id` | UUID (FK) | Quem enviou |
| `addressee_id` | UUID (FK) | Quem recebeu |
| `status` | enum | `pending`, `accepted`, `rejected`, `cancelled` |
| `pair_key` | text | Chave única do par |
| `created_at` | timestamp | — |
| `responded_at` | timestamp | — |

#### `messages`
Mensagens de chat entre amigos.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID (PK) | — |
| `connection_pair_key` | text | Par de conexão |
| `sender_id` | UUID (FK) | Remetente |
| `receiver_id` | UUID (FK) | Destinatário |
| `body` | text | Conteúdo |
| `created_at` | timestamp | — |
| `expires_at` | timestamp | Expiração |

---

### Autenticação (Supabase Auth)

- **Método:** Email + Senha
- **Fluxo de cadastro:**
  1. `supabase.auth.signUp()` cria o usuário em `auth.users`
  2. Trigger `handle_new_user()` cria o perfil em `profiles`
  3. Upsert adicional garante dados extras (name, pronouns)
- **Fluxo de login:**
  1. `supabase.auth.signInWithPassword()`
  2. Sessão persistida em `localStorage`
  3. Auto-refresh de token habilitado
- **Verificação de email:** Supabase detecta tokens na URL automaticamente

### Row Level Security (RLS)

Políticas implementadas:

| Tabela | Regra |
|---|---|
| `profiles` | Usuário vê/edita apenas seu próprio perfil |
| `events` | Leitura pública para ativos; escrita para admins/criador |
| `places` | Leitura pública para seguros; escrita para admins/criador |
| `communities` | Leitura pública para ativos; escrita para admins/criador |
| `event_interests` | Usuário gerencia apenas seus próprios registros |
| `event_participants` | Usuário gerencia apenas suas próprias participações |
| `reviews` | Leitura pública; escrita para autores |

### Funções RPC (Stored Procedures)

| Função | Permissão | Descrição |
|---|---|---|
| `admin_change_user_role(target_user_id, new_role)` | `admin_geral` | Altera role de usuário |
| `admin_change_user_status(target_user_id, new_status)` | `admin_geral` | Altera status de usuário |
| `admin_delete_users(target_user_ids)` | `admin_geral` | Deleta múltiplos usuários |
| `admin_delete_user_single(target_user_id)` | `admin_geral` | Deleta um usuário |

### Storage (Supabase Storage)

Buckets utilizados:
- `places` — Imagens de locais
- `services` — Imagens de serviços
- `events` — Imagens de eventos
- `communities` — Imagens de comunidades
- `photos` — Fotos de usuários / genérico

Regras de upload:
- Tipos aceitos: JPEG, JPG, PNG, WEBP, GIF
- Tamanho máximo: 5MB
- Nomes gerados: `{timestamp}-{randomString}.{ext}`
- URLs públicas via `getPublicUrl()`

---

## 2. Spring Boot — Microserviço (`login_back/`)

### Stack

| Tecnologia | Versão | Função |
|---|---|---|
| Java | 21 | Runtime |
| Spring Boot | 3.4.5 | Framework |
| Spring Data JPA | — | ORM |
| Spring Data REST | — | API REST auto |
| MySQL | 8 | Banco de dados |
| Lombok | — | Boilerplate reduction |
| MinIO | 8.1.0 | Object storage (S3-compatible) |
| AWS SDK S3 | 2.20.36 | AWS S3 nativo |
| ModelMapper | 2.4.2 | DTO ↔ Entity |
| JUnit 5 | — | Testes |

### Estrutura de Pacotes

```
login_back/src/main/java/br/com/amooora/users/
├── UsersApplication.java           # Main class
├── config/
│   ├── AwsS3Config.java            # Configuração AWS S3
│   └── MinioConfig.java            # Configuração MinIO
├── controller/
│   ├── UserController.java         # CRUD de usuários
│   ├── PhotoController.java        # Upload/download genérico de fotos
│   └── UserPhotoController.java    # Fotos por usuário (avatar, galeria)
├── database/
│   ├── model/
│   │   └── User.java               # Entidade JPA
│   └── repository/
│       └── UserRepository.java     # Spring Data JPA repository
├── dto/
│   ├── PhotoMetadata.java          # Metadados de foto
│   └── PhotoInfoDto.java           # Info de foto
├── exceptions/
│   ├── BusinessException.java      # Exceção de negócio
│   └── MinioException.java         # Exceção MinIO
└── service/
    ├── UserService.java            # Interface de serviço
    ├── impl/
    │   └── UserServiceImpl.java    # Implementação
    ├── UserPhotoService.java       # Serviço de fotos
    ├── AwsS3Service.java           # AWS S3 service
    ├── MinioService.java           # MinIO service
    ├── storage/
    │   └── StorageService.java     # Interface de storage
    └── util/
        ├── MinioClient.java        # Utilitário MinIO
        └── S3ClientUtil.java       # Utilitário S3
```

### Endpoints REST

#### Usuários (`/users`)

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/users` | Lista todos os usuários |
| GET | `/users/id` | Busca por ID (header `userId`) |
| GET | `/users/email` | Busca por email (header `email`) |
| POST | `/users` | Cria usuário |
| PUT | `/users` | Atualiza usuário |
| DELETE | `/users` | Deleta usuário (header `userId`) |

#### Fotos genéricas (`/api/photos`)

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/photos/upload` | Upload de foto |
| GET | `/api/photos/download/{name}` | Download direto |
| GET | `/api/photos/url/{name}` | URL pré-assinada (expiry configurable) |
| GET | `/api/photos/list` | Lista fotos (com prefix) |
| GET | `/api/photos/exists/{name}` | Verifica existência |
| GET | `/api/photos/info/{name}` | Metadados da foto |

#### Fotos de usuário (`/api/users/{userId}/photos`)

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/users/{userId}/photos` | Upload de foto do usuário |
| POST | `/api/users/{userId}/photos/avatar` | Upload/replace do avatar |
| GET | `/api/users/{userId}/photos/{name}` | Download foto específica |
| GET | `/api/users/{userId}/photos/avatar` | Download avatar |
| GET | `/api/users/{userId}/photos/{name}/url` | URL pré-assinada |
| GET | `/api/users/{userId}/photos` | Lista fotos do usuário |
| GET | `/api/users/{userId}/photos/{name}/exists` | Verifica existência |
| GET | `/api/users/{userId}/photos/{name}/info` | Metadados |
| GET | `/api/users/{userId}/photos/urls` | URLs de todas as fotos |

### Modelo de Dados (MySQL)

#### Tabela `user`

| Coluna | Tipo | Constraints |
|---|---|---|
| `id` | BIGINT (PK, auto) | — |
| `name` | VARCHAR | NOT BLANK |
| `email` | VARCHAR | NOT BLANK, @Email |
| `phone_number` | VARCHAR | NOT BLANK |
| `open_network` | BOOLEAN | — |
| `cep` | VARCHAR | NOT BLANK |
| `birthday` | DATE | NOT NULL, @Past |
| `biography` | TEXT | — |
| `url_picture` | VARCHAR | — |

### Docker Compose

```yaml
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_DATABASE: amooora
      MYSQL_ROOT_PASSWORD: p@ssw0rd
    ports:
      - "3306:3306"
  app:
    build: .
    depends_on:
      - mysql
    ports:
      - "8080:8080"
```

### Variáveis de Ambiente (Spring Boot)

```properties
# Database
DATABASE_USER_URL=jdbc:mysql://localhost:3306/amooora
DATABASE_USER_USER=root
DATABASE_USER_PASSWORD=p@ssw0rd

# Storage provider: minio ou s3
STORAGE_PROVIDER=minio

# MinIO
MINIO_URL=http://localhost:9000
MINIO_ACCESS_KEY=<key>
MINIO_SECRET_KEY=<secret>
MINIO_BUCKET_NAME=photos

# AWS S3
AWS_S3_REGION=us-east-1
AWS_S3_ACCESS_KEY=<key>
AWS_S3_SECRET_KEY=<secret>
AWS_S3_BUCKET_NAME=photos
```

### Build e Execução

```bash
cd login_back

# Build
./gradlew build

# Rodar com Docker
docker-compose up

# Rodar local
./gradlew bootRun

# Testes
./gradlew test
```

---

## Scripts SQL Importantes

| Arquivo | Descrição |
|---|---|
| `MD/ACCESS_MANAGEMENT_SUPABASE.sql` | Setup completo de roles, RLS e triggers |
| `MD/PROMPT_SUPABASE_SCHEMA.md` | Schema do Supabase documentado |
| `MD/SUPABASE_V1_DOCUMENTATION.md` | Documentação V1 do schema |
| `MD/SUPABASE_V2_DOCUMENTATION.md` | Documentação V2 do schema |
| `MD/INSTRUCOES_CRIAR_TABELA_COMMUNITIES.md` | Setup da tabela communities |
| `MD/INSTRUCOES_CORRIGIR_RLS_EVENTS.md` | Correções de RLS para events |
| `MD/INSTRUCOES_RPC_COMMUNITY.md` | RPCs para communities |

---

## Possíveis Melhorias / Trade-offs

- **Unificar backends:** Avaliar migrar funcionalidades do Spring Boot para Supabase Edge Functions
- **Cache:** Implementar cache client-side (React Query / SWR) para reduzir chamadas ao Supabase
- **Realtime:** Utilizar Supabase Realtime para chat e notificações em vez de polling
- **Migrations:** Adotar ferramenta de migrations (Supabase CLI ou Flyway para MySQL)
- **Tipagem do banco:** Gerar tipos TypeScript automaticamente com `supabase gen types`
- **Segurança:** Implementar rate limiting e validação mais rigorosa nos endpoints REST
