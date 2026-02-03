# Detalhamento de Perfis de Acesso - Amooora

## 📋 Índice

1. [Tipos de Perfis](#tipos-de-perfis)
2. [Status de Acesso](#status-de-acesso)
3. [Permissões por Perfil](#permissões-por-perfil)
4. [Matriz de Permissões](#matriz-de-permissões)
5. [Regras de Acesso (RLS)](#regras-de-acesso-rls)
6. [Menu Admin por Perfil](#menu-admin-por-perfil)
7. [Observações Importantes](#observações-importantes)

---

## 🔐 Tipos de Perfis

O sistema Amooora possui **5 tipos de perfis (roles)**:

1. **`admin_geral`** - Administrador Geral
2. **`user_viewer`** - Usuária Comum (padrão)
3. **`admin_locais`** - Administradora de Locais
4. **`admin_eventos`** - Administradora de Eventos
5. **`admin_servicos`** - Administradora de Serviços

### Perfil Padrão

Quando um novo usuário se cadastra no sistema, ele recebe automaticamente:
- **Role**: `user_viewer`
- **Status**: `active`

Isso é feito através do trigger `handle_new_user()` no Supabase.

---

## 🚦 Status de Acesso

Cada usuário possui um **status** que controla se ela pode ou não usar o sistema:

| Status | Descrição | Pode Usar o App? |
|--------|-----------|------------------|
| `active` | Usuária ativa | ✅ Sim |
| `blocked` | Usuária bloqueada | ❌ Não |
| `inactive` | Usuária inativa | ❌ Não |

**Importante**: Apenas usuárias com `status = 'active'` podem acessar o sistema. Usuárias bloqueadas ou inativas são redirecionadas para uma tela de "Acesso indisponível".

---

## 👥 Permissões por Perfil

### 1. `admin_geral` - Administrador Geral

**Acesso total ao sistema** - Pode fazer tudo.

#### 👤 Gerenciamento de Usuárias
- ✅ Ver todos os usuários cadastrados
- ✅ Alterar role e status de qualquer usuário
- ✅ Deletar usuários do sistema
- ✅ Criar novos usuários manualmente

#### 📍 Locais
- ✅ Criar novos locais
- ✅ Editar qualquer local (próprios ou de outros)
- ✅ Deletar qualquer local
- ✅ Visualizar todos os locais

#### 📅 Eventos
- ✅ Criar novos eventos
- ✅ Editar qualquer evento (próprios ou de outros)
- ✅ Deletar qualquer evento
- ✅ Visualizar todos os eventos

#### ✂️ Serviços
- ✅ Criar novos serviços
- ✅ Editar qualquer serviço (próprios ou de outros)
- ✅ Deletar serviços
- ✅ Visualizar todos os serviços

#### 👥 Comunidades
- ✅ Criar novas comunidades
- ✅ Editar qualquer comunidade (próprias ou de outros)
- ✅ Deletar comunidades
- ✅ Visualizar todas as comunidades

#### ⭐ Reviews
- ✅ Criar reviews
- ✅ Editar qualquer review
- ✅ Deletar qualquer review
- ✅ Visualizar todas as reviews

#### 📝 Posts de Comunidade
- ✅ Criar posts
- ✅ Editar qualquer post
- ✅ Deletar qualquer post
- ✅ Visualizar todos os posts

#### 📊 Reports
- ✅ Ver todos os reports
- ✅ Resolver reports
- ✅ Atualizar status de reports

---

### 2. `user_viewer` - Usuária Comum

**Acesso de visualização e interação básica** - Pode ver tudo e criar alguns conteúdos.

#### 📍 Locais
- ❌ Criar locais
- ❌ Editar locais
- ❌ Deletar locais
- ✅ Visualizar todos os locais

#### 📅 Eventos
- ✅ Criar eventos próprios
- ✅ Editar próprios eventos
- ✅ Deletar próprios eventos
- ✅ Visualizar todos os eventos

#### ✂️ Serviços
- ❌ Criar serviços
- ❌ Editar serviços
- ❌ Deletar serviços
- ✅ Visualizar todos os serviços

#### 👥 Comunidades
- ✅ Criar comunidades
- ✅ Editar próprias comunidades
- ❌ Deletar comunidades (apenas admin_geral pode)
- ✅ Visualizar todas as comunidades

#### 📝 Posts de Comunidade
- ✅ Criar posts em comunidades
- ✅ Editar próprios posts
- ✅ Deletar próprios posts
- ✅ Visualizar todos os posts

#### ⭐ Reviews
- ✅ Criar reviews
- ✅ Editar próprias reviews
- ✅ Deletar próprias reviews
- ✅ Visualizar todas as reviews

#### 💜 Interações
- ✅ Curtir posts
- ✅ Salvar lugares favoritos
- ✅ Participar de eventos
- ✅ Participar de comunidades
- ✅ Criar reports

---

### 3. `admin_locais` - Administradora de Locais

**Foco em gerenciar locais seguros** - Pode criar e gerenciar locais.

#### 📍 Locais
- ✅ Criar novos locais
- ✅ Editar próprios locais
- ✅ Deletar próprios locais
- ✅ Visualizar todos os locais

#### 📅 Eventos
- ✅ Criar eventos próprios (como user_viewer)
- ✅ Editar próprios eventos
- ✅ Deletar próprios eventos
- ✅ Visualizar todos os eventos

#### ✂️ Serviços
- ❌ Criar serviços
- ❌ Editar serviços
- ❌ Deletar serviços
- ✅ Visualizar todos os serviços

#### 👥 Comunidades
- ✅ Criar comunidades (como user_viewer)
- ✅ Editar próprias comunidades
- ❌ Deletar comunidades
- ✅ Visualizar todas as comunidades

#### ⭐ Reviews
- ✅ Criar reviews
- ✅ Editar próprias reviews
- ✅ Deletar próprias reviews
- ✅ Visualizar todas as reviews

#### 📝 Posts de Comunidade
- ✅ Criar posts
- ✅ Editar próprios posts
- ✅ Deletar próprios posts
- ✅ Visualizar todos os posts

---

### 4. `admin_eventos` - Administradora de Eventos

**Foco em gerenciar eventos** - Pode criar e gerenciar eventos.

#### 📅 Eventos
- ✅ Criar novos eventos
- ✅ Editar próprios eventos
- ✅ Deletar próprios eventos
- ✅ Visualizar todos os eventos

#### 📍 Locais
- ❌ Criar locais
- ❌ Editar locais
- ❌ Deletar locais
- ✅ Visualizar todos os locais

#### ✂️ Serviços
- ❌ Criar serviços
- ❌ Editar serviços
- ❌ Deletar serviços
- ✅ Visualizar todos os serviços

#### 👥 Comunidades
- ✅ Criar comunidades (como user_viewer)
- ✅ Editar próprias comunidades
- ❌ Deletar comunidades
- ✅ Visualizar todas as comunidades

#### ⭐ Reviews
- ✅ Criar reviews
- ✅ Editar próprias reviews
- ✅ Deletar próprias reviews
- ✅ Visualizar todas as reviews

#### 📝 Posts de Comunidade
- ✅ Criar posts
- ✅ Editar próprios posts
- ✅ Deletar próprios posts
- ✅ Visualizar todos os posts

---

### 5. `admin_servicos` - Administradora de Serviços

**Foco em gerenciar serviços** - Pode criar e editar serviços.

#### ✂️ Serviços
- ✅ Criar novos serviços
- ✅ Editar próprios serviços
- ❌ Deletar serviços (apenas admin_geral pode deletar)
- ✅ Visualizar todos os serviços

#### 📍 Locais
- ❌ Criar locais
- ❌ Editar locais
- ❌ Deletar locais
- ✅ Visualizar todos os locais

#### 📅 Eventos
- ✅ Criar eventos próprios (como user_viewer)
- ✅ Editar próprios eventos
- ✅ Deletar próprios eventos
- ✅ Visualizar todos os eventos

#### 👥 Comunidades
- ✅ Criar comunidades (como user_viewer)
- ✅ Editar próprias comunidades
- ❌ Deletar comunidades
- ✅ Visualizar todas as comunidades

#### ⭐ Reviews
- ✅ Criar reviews
- ✅ Editar próprias reviews
- ✅ Deletar próprias reviews
- ✅ Visualizar todas as reviews

#### 📝 Posts de Comunidade
- ✅ Criar posts
- ✅ Editar próprios posts
- ✅ Deletar próprios posts
- ✅ Visualizar todos os posts

---

## 📊 Matriz de Permissões por Conteúdo

### Locais (Places)

| Perfil | Criar | Editar | Deletar | Visualizar |
|--------|-------|--------|---------|------------|
| `admin_geral` | ✅ | ✅ (todos) | ✅ (todos) | ✅ |
| `admin_locais` | ✅ | ✅ (próprios) | ✅ (próprios) | ✅ |
| `admin_eventos` | ❌ | ❌ | ❌ | ✅ |
| `admin_servicos` | ❌ | ❌ | ❌ | ✅ |
| `user_viewer` | ❌ | ❌ | ❌ | ✅ |

### Eventos (Events)

| Perfil | Criar | Editar | Deletar | Visualizar |
|--------|-------|--------|---------|------------|
| `admin_geral` | ✅ | ✅ (todos) | ✅ (todos) | ✅ |
| `admin_eventos` | ✅ | ✅ (próprios) | ✅ (próprios) | ✅ |
| `admin_locais` | ✅ | ✅ (próprios) | ✅ (próprios) | ✅ |
| `admin_servicos` | ✅ | ✅ (próprios) | ✅ (próprios) | ✅ |
| `user_viewer` | ✅ | ✅ (próprios) | ✅ (próprios) | ✅ |

**Nota**: Todos os perfis autenticados podem criar, editar e deletar seus próprios eventos.

### Serviços (Services)

| Perfil | Criar | Editar | Deletar | Visualizar |
|--------|-------|--------|---------|------------|
| `admin_geral` | ✅ | ✅ (todos) | ✅ | ✅ |
| `admin_servicos` | ✅ | ✅ (próprios) | ❌ | ✅ |
| `admin_locais` | ❌ | ❌ | ❌ | ✅ |
| `admin_eventos` | ❌ | ❌ | ❌ | ✅ |
| `user_viewer` | ❌ | ❌ | ❌ | ✅ |

**Nota**: Apenas `admin_geral` pode deletar serviços.

### Comunidades (Communities)

| Perfil | Criar | Editar | Deletar | Visualizar |
|--------|-------|--------|---------|------------|
| `admin_geral` | ✅ | ✅ (todos) | ✅ | ✅ |
| `admin_locais` | ✅ | ✅ (próprias) | ❌ | ✅ |
| `admin_eventos` | ✅ | ✅ (próprias) | ❌ | ✅ |
| `admin_servicos` | ✅ | ✅ (próprias) | ❌ | ✅ |
| `user_viewer` | ✅ | ✅ (próprias) | ❌ | ✅ |

**Nota**: Todos os perfis autenticados podem criar e editar suas próprias comunidades, mas apenas `admin_geral` pode deletar.

### Reviews (Avaliações)

| Perfil | Criar | Editar | Deletar | Visualizar |
|--------|-------|--------|---------|------------|
| `admin_geral` | ✅ | ✅ (todos) | ✅ (todos) | ✅ |
| Todos os outros | ✅ | ✅ (próprias) | ✅ (próprias) | ✅ |

**Nota**: Todos os perfis autenticados podem criar, editar e deletar suas próprias reviews. `admin_geral` pode editar/deletar qualquer review.

### Posts de Comunidade

| Perfil | Criar | Editar | Deletar | Visualizar |
|--------|-------|--------|---------|------------|
| `admin_geral` | ✅ | ✅ (todos) | ✅ (todos) | ✅ |
| Todos os outros | ✅ | ✅ (próprios) | ✅ (próprios) | ✅ |

**Nota**: Todos os perfis autenticados podem criar, editar e deletar seus próprios posts. `admin_geral` pode editar/deletar qualquer post.

### Reports (Denúncias)

| Perfil | Criar | Visualizar | Resolver |
|--------|-------|------------|----------|
| `admin_geral` | ✅ | ✅ (todos) | ✅ |
| Todos os outros | ✅ | ✅ (próprios) | ❌ |

**Nota**: Todos podem criar reports, mas apenas `admin_geral` pode visualizar todos e resolver.

---

## 🔒 Regras de Acesso (RLS - Row Level Security)

### Site Fechado (MVP)

O sistema Amooora é um **site fechado**, o que significa:

- ✅ Apenas usuários **autenticados** podem acessar o site
- ❌ Usuários não autenticados são **redirecionados** para a página `welcome`
- ❌ Usuários com `status = 'blocked'` ou `status = 'inactive'` **não podem usar o app**

### Ownership (Propriedade)

A regra de **ownership** garante que:

- ✅ Usuários podem **editar/deletar apenas conteúdos que criaram** (`created_by = auth.uid()`)
- ✅ Cada conteúdo tem um campo `created_by` que identifica quem o criou
- ✅ Admins específicos podem editar apenas seus próprios conteúdos na área de atuação

### Admin Override

A regra de **admin override** permite que:

- ✅ `admin_geral` pode **editar/deletar qualquer conteúdo**, independente de quem criou
- ✅ Admins específicos (`admin_locais`, `admin_eventos`, `admin_servicos`) podem editar apenas seus próprios conteúdos na área de atuação

### Políticas RLS por Tabela

#### Profiles
- **SELECT**: Qualquer usuário autenticada pode ver perfis
- **UPDATE**: Usuário pode atualizar seu próprio perfil OU `admin_geral` pode atualizar qualquer perfil
- **Role/Status**: Apenas via RPC `admin_set_profile_access` (apenas `admin_geral`)

#### Places
- **SELECT**: Qualquer usuário autenticada
- **INSERT**: Qualquer usuário autenticada (com `created_by = auth.uid()`)
- **UPDATE**: Próprio criador OU `admin_geral`
- **DELETE**: `admin_geral` OU `admin_locais` (apenas próprios)

#### Events
- **SELECT**: Qualquer usuário autenticada
- **INSERT**: Qualquer usuário autenticada (com `created_by = auth.uid()`)
- **UPDATE**: Próprio criador OU `admin_geral`
- **DELETE**: Próprio criador OU `admin_geral`

#### Services
- **SELECT**: Qualquer usuário autenticada
- **INSERT**: `admin_geral` OU `admin_servicos` (com `created_by = auth.uid()`)
- **UPDATE**: Próprio criador (se `admin_servicos`) OU `admin_geral`
- **DELETE**: Apenas `admin_geral`

#### Communities
- **SELECT**: Qualquer usuário autenticada
- **INSERT**: Qualquer usuário autenticada (com `created_by = auth.uid()`)
- **UPDATE**: Próprio criador OU `admin_geral`
- **DELETE**: Apenas `admin_geral`

#### Reviews
- **SELECT**: Qualquer usuário autenticada
- **INSERT**: Qualquer usuário autenticada (com `user_id = auth.uid()`)
- **UPDATE**: Próprio criador OU `admin_geral`
- **DELETE**: Próprio criador OU `admin_geral`

#### Community Posts
- **SELECT**: Qualquer usuário autenticada
- **INSERT**: Qualquer usuário autenticada (com `user_id = auth.uid()`)
- **UPDATE**: Próprio criador OU `admin_geral`
- **DELETE**: Próprio criador OU `admin_geral`

---

## 🎛️ Menu Admin por Perfil

### `admin_geral`

Menu completo com todas as opções:

1. **🛡️ Gerenciar Usuárias**
   - Alterar perfis de acesso (role) e status
   - Deletar usuários

2. **➕ Cadastrar Usuário**
   - Criar novo usuário no sistema (MVP)

3. **✏️ Editar Conteúdos**
   - Editar locais, eventos, serviços e comunidades cadastrados

4. **📍 Cadastrar Local**
   - Adicionar novo local seguro ao sistema

5. **✂️ Cadastrar Serviço**
   - Adicionar novo serviço ao catálogo

6. **📅 Cadastrar Evento**
   - Criar novo evento na plataforma

7. **👥 Cadastrar Comunidade**
   - Criar nova comunidade na plataforma

---

### `admin_locais`

Menu limitado:

1. **✏️ Editar Conteúdos**
   - Editar locais próprios

2. **📍 Cadastrar Local**
   - Adicionar novo local seguro ao sistema

---

### `admin_eventos`

Menu limitado:

1. **✏️ Editar Conteúdos**
   - Editar eventos próprios

2. **📅 Cadastrar Evento**
   - Criar novo evento na plataforma

---

### `admin_servicos`

Menu limitado:

1. **✏️ Editar Conteúdos**
   - Editar serviços próprios

2. **✂️ Cadastrar Serviço**
   - Adicionar novo serviço ao catálogo

---

### `user_viewer`

**Sem acesso ao menu Admin**

---

## ⚠️ Observações Importantes

### 1. Status Obrigatório

- Usuário precisa ter `status = 'active'` para usar o app
- Usuários com `status = 'blocked'` ou `status = 'inactive'` são bloqueados

### 2. Deleção de Serviços

- **Apenas `admin_geral` pode deletar serviços**
- `admin_servicos` pode criar e editar, mas não deletar

### 3. Deleção de Comunidades

- **Apenas `admin_geral` pode deletar comunidades**
- Todos os outros perfis podem criar e editar suas próprias comunidades, mas não deletar

### 4. Gerenciamento de Usuárias

- **Apenas `admin_geral` pode:**
  - Alterar role e status de usuários
  - Deletar usuários
  - Ver lista completa de usuários

### 5. Site Fechado

- Todas as páginas (exceto `welcome`, `login`, `cadastro`, `splash`) exigem autenticação
- Usuários não autenticados são redirecionados para `welcome`

### 6. Onboarding Automático

- Quando um novo usuário se cadastra, um perfil é criado automaticamente com:
  - `role = 'user_viewer'`
  - `status = 'active'`
- Isso é feito pelo trigger `handle_new_user()` no Supabase

### 7. RPCs Admin

- `admin_list_profiles()`: Lista todos os perfis (apenas `admin_geral`)
- `admin_set_profile_access()`: Altera role e status (apenas `admin_geral`)
- `admin_delete_users()`: Deleta usuários (apenas `admin_geral`)

---

## 📝 Resumo Visual

```
admin_geral
├── 👥 Gerenciar Usuárias
├── ➕ Cadastrar Usuário
├── ✏️ Editar Conteúdos (todos)
├── 📍 Cadastrar Local
├── ✂️ Cadastrar Serviço
├── 📅 Cadastrar Evento
└── 👥 Cadastrar Comunidade

admin_locais
├── ✏️ Editar Conteúdos (locais próprios)
└── 📍 Cadastrar Local

admin_eventos
├── ✏️ Editar Conteúdos (eventos próprios)
└── 📅 Cadastrar Evento

admin_servicos
├── ✏️ Editar Conteúdos (serviços próprios)
└── ✂️ Cadastrar Serviço

user_viewer
└── (sem acesso ao menu Admin)
```

---

## 🔧 Como Alterar Perfis

### Via SQL (Supabase)

```sql
-- Tornar usuária admin_geral
UPDATE public.profiles
SET role = 'admin_geral', status = 'active'
WHERE email = 'email@exemplo.com';

-- Tornar usuária admin_locais
UPDATE public.profiles
SET role = 'admin_locais', status = 'active'
WHERE email = 'email@exemplo.com';

-- Tornar usuária admin_eventos
UPDATE public.profiles
SET role = 'admin_eventos', status = 'active'
WHERE email = 'email@exemplo.com';

-- Tornar usuária admin_servicos
UPDATE public.profiles
SET role = 'admin_servicos', status = 'active'
WHERE email = 'email@exemplo.com';

-- Bloquear usuária
UPDATE public.profiles
SET status = 'blocked'
WHERE email = 'email@exemplo.com';
```

### Via Interface (Admin Geral)

1. Fazer login como `admin_geral`
2. Ir em **Admin** → **Gerenciar Usuárias**
3. Selecionar a usuária
4. Alterar role e/ou status
5. Clicar em **Salvar**

---

## 📚 Referências

- **SQL de Configuração**: `MD/ACCESS_MANAGEMENT_SUPABASE.sql`
- **Hook de Admin**: `src/app/shared/hooks/useAdmin.ts`
- **Página Admin**: `src/app/pages/Admin.tsx`
- **Serviço de Admin**: `src/app/shared/services/adminUsers.ts`

---

**Última atualização**: Dezembro 2024
