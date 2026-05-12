# Frontend — Referências e Instruções

**Última atualização:** Maio 2026  
**Projeto:** Amooora — Plataforma LGBTQIA+ brasileira

---

## Stack Frontend

| Tecnologia | Versão | Função |
|---|---|---|
| React | 18.3.1 | Biblioteca UI |
| Vite | 6.4.1+ | Build tool e dev server |
| TypeScript | (via Vite/React plugin) | Tipagem estática |
| Tailwind CSS | 4.1.12 | Estilização utility-first |
| Radix UI | Diversos | Primitivos acessíveis (Dialog, Select, Tabs, etc.) |
| shadcn/ui (padrão) | — | Componentes UI baseados em Radix + CVA |
| Lucide React | 0.487.0 | Ícones SVG |
| Supabase JS | 2.90.1+ | Cliente BaaS (auth, DB, storage) |
| Motion (Framer) | 12.23.24 | Animações |
| React Hook Form | 7.55.0 | Formulários |
| Sonner | 2.0.3 | Toasts/notificações |
| Recharts | 2.15.2 | Gráficos (admin/analytics) |
| date-fns | 3.6.0 | Manipulação de datas |
| Google Maps API | 2.20.8+ | Mapas interativos |

---

## Estrutura de Diretórios

```
src/
├── app/
│   ├── App.tsx                    # Entry point, roteamento por estado
│   ├── pages/                     # Páginas de nível raiz (~44 telas)
│   ├── features/                  # Módulos por domínio
│   │   ├── communities/           # Comunidades (pages, components, hooks, services, types)
│   │   ├── events/                # Eventos
│   │   ├── friends/               # Amigos e chat
│   │   ├── places/                # Locais seguros
│   │   ├── services/              # Serviços profissionais
│   │   └── shared/                # Tipos compartilhados entre features
│   ├── components/                # Componentes genéricos (~89 arquivos)
│   │   └── ui/                    # Primitivos shadcn (Button, Input, Card, etc.)
│   ├── shared/                    # Camada compartilhada global
│   │   ├── components/            # Header, BottomNav, EmptyState, etc.
│   │   ├── hooks/                 # useAuth, useAdmin, useFavorites, useUser
│   │   ├── services/              # reviews, geocoding, profile, adminUsers
│   │   ├── contexts/              # FavoritesContext
│   │   ├── types/                 # User, Review, Event, etc.
│   │   └── utils/                 # share, helpers
│   ├── hooks/                     # Hooks legados (migração parcial para features/)
│   ├── services/                  # Services legados (migração parcial para features/)
│   ├── layouts/                   # AppLayout, AuthLayout
│   ├── infra/                     # supabase.ts, auth.ts, storage.ts
│   └── dev/                       # Utilitários de desenvolvimento
├── lib/                           # supabase.ts (legado — usar src/app/infra/)
├── styles/
│   ├── index.css                  # Ponto de entrada CSS
│   ├── tailwind.css               # Config Tailwind + utilitários
│   ├── theme.css                  # Tokens de cor, tipografia, animações
│   └── fonts.css                  # (vazio — usa fonte do sistema)
└── assets/                        # Imagens estáticas (logo, etc.)
```

---

## Navegação / Roteamento

O app **não usa React Router**. A navegação é baseada em **estado** (`useState`) no `App.tsx`:

- `currentPage` controla a tela ativa
- `handleNavigate(page: string)` é passada como prop `onNavigate` para todas as telas
- Suporte a IDs via formato `page:id` (ex: `place-details:uuid`, `event-details:uuid`)
- Deep links via hash (`#/event-details/id`) e pathname (`/event-details/id`)

### Páginas registradas (~50+ telas)

**Públicas (navegação livre):**
- `welcome`, `login`, `cadastro`, `home`
- `places`, `place-details`, `services`, `service-details`
- `events`, `event-details`, `event-participants`
- `community`, `todas-comunidades`, `community-details`, `post-details`
- `mapa`, `perfil`, `edit-profile`, `configuracoes`, `notificacoes`
- `favoritos`, `busca`, `friends`, `friend-chat`
- `sobre-amooora`, `fale-conosco`, `view-profile`, `perfil-profissional`

**Admin (requer role):**
- `admin`, `admin-cadastrar-*`, `admin-editar-*`, `admin-gerenciar-usuarios`
- `admin-conteudos-desativados`, `curadoria`

---

## Features (Módulos por Domínio)

Cada feature segue a estrutura:

```
features/<nome>/
├── pages/          # Telas específicas da feature
├── components/     # Componentes visuais da feature
├── hooks/          # Custom hooks (dados, interações)
├── services/       # Chamadas ao Supabase
├── types/          # Interfaces TypeScript
└── index.ts        # Barrel exports
```

### Communities
- Listagem, detalhes, posts, respostas, likes
- Criar/editar comunidades (admin)
- Seguir/deixar comunidades
- Componentes: `CommunityCard`, `CommunityPostCard`, `CreatePostForm`, `CommunityStats`

### Events
- Listagem, detalhes, participantes
- Interesse ("Tenho interesse") e participação ("Fui!!")
- Mapa de eventos
- CRUD admin

### Friends
- Solicitações de amizade (enviar, aceitar, rejeitar)
- Busca de usuários
- Chat em tempo real com mensagens efêmeras

### Places
- Locais seguros LGBTQIA+
- Filtros por categoria, avaliação, tags
- Seguir/salvar locais
- Interações (curtir, compartilhar)

### Services
- Serviços profissionais por categoria (Terapia, Advocacia, Saúde, Carreira)
- Listagem em grid, detalhes, avaliações

---

## Camada de Infraestrutura (`src/app/infra/`)

### `supabase.ts`
Cliente Supabase configurado com:
- Persistência de sessão via `localStorage`
- Auto-refresh de tokens
- Detecção de sessão via URL (verificação de email)

### `auth.ts`
Funções de autenticação:
- `signUp(data)` — Cria conta + perfil via upsert
- `signIn(data)` — Login com mensagens de erro amigáveis em PT-BR
- `signOut()` — Logout
- `getCurrentAuthUser()` — Usuário atual
- `getSession()` — Sessão ativa

### `storage.ts`
Upload/delete de imagens no Supabase Storage:
- Validação de tipo (JPEG, PNG, WEBP, GIF) e tamanho (max 5MB)
- Nome único por timestamp + random string
- Retorna URL pública

---

## Hooks Principais

| Hook | Local | Função |
|---|---|---|
| `useAuth` | `shared/hooks/` | Estado de autenticação (isAuthenticated, loading) |
| `useAdmin` | `shared/hooks/` | Roles e permissões (isAdmin, canManagePlaces, etc.) |
| `useUser` | `shared/hooks/` | Dados do perfil do usuário logado |
| `useFavorites` | `shared/hooks/` | Favoritos via Supabase |
| `useReviews` | `shared/hooks/` | Reviews por tipo (place, service, event, community) |
| `useEvents` | `features/events/` | Listagem de eventos |
| `useCommunities` | `features/communities/` | Listagem de comunidades |
| `usePlaces` | `features/places/` | Listagem de locais |
| `useServices` | `features/services/` | Listagem de serviços |
| `useFriends` | `features/friends/` | Lista de amigos e solicitações |
| `useConnectionStatus` | `features/friends/` | Status de conexão entre usuários |

---

## Componentes UI (shadcn/ui)

Localizados em `src/app/components/ui/`, seguem o padrão shadcn:
- Baseados em **Radix UI** para acessibilidade
- Estilizados com **CVA** (class-variance-authority) + **Tailwind**
- `cn()` helper para merge de classes (`clsx` + `tailwind-merge`)

### Componentes disponíveis:
`Accordion`, `AlertDialog`, `AspectRatio`, `Avatar`, `Badge`, `Breadcrumb`, `Button`, `Calendar`, `Card`, `Carousel`, `Chart`, `Checkbox`, `Collapsible`, `Command`, `ContextMenu`, `Dialog`, `Drawer`, `DropdownMenu`, `Form`, `HoverCard`, `Input`, `InputOTP`, `Label`, `Menubar`, `NavigationMenu`, `Pagination`, `Popover`, `Progress`, `RadioGroup`, `ResizablePanel`, `ScrollArea`, `Select`, `Separator`, `Sheet`, `Sidebar`, `Skeleton`, `Slider`, `Sonner`, `Switch`, `Table`, `Tabs`, `Textarea`, `Toggle`, `ToggleGroup`, `Tooltip`

---

## Contextos (React Context)

### `FavoritesContext`
- Gerencia favoritos (places, events, services) via `localStorage`
- Provider wraps todo o app em `App.tsx`
- Funções: `toggleFavorite`, `isFavorite`, `getFavoritesByType`, `clearFavorites`

---

## Scripts de Desenvolvimento

```bash
npm run dev           # Vite dev server (porta 5173)
npm run dev:5174      # Porta alternativa 5174
npm run dev:5175      # Porta alternativa 5175
npm run dev:3000      # Porta 3000
npm run build         # Build de produção
npm run deploy        # Deploy Vercel (preview)
npm run deploy:prod   # Deploy Vercel (produção)
npm run screenshots:export  # Captura automática de telas (Playwright)
```

---

## Configuração Vite

- Plugin React + Tailwind CSS
- Alias `@` → `./src`
- HMR habilitado com overlay de erros
- Otimização de dependências (React, React DOM)
- Porta configurável via `VITE_PORT`

---

## Variáveis de Ambiente

```env
VITE_SUPABASE_URL=<url-do-projeto-supabase>
VITE_SUPABASE_ANON_KEY=<chave-publica-supabase>
VITE_PORT=5173  # opcional
```

---

## Deploy

- **Plataforma:** Vercel
- **Build command:** `vite build`
- **Output:** `dist/`
- Variáveis de ambiente configuradas no dashboard Vercel

---

## Padrões e Convenções

1. **Componentes:** PascalCase, um componente por arquivo
2. **Hooks:** prefixo `use`, retornam objetos ou tuplas
3. **Services:** funções async que encapsulam chamadas ao Supabase
4. **Types:** interfaces exportadas, re-exportadas via barrel (`index.ts`)
5. **Imports:** usar alias `@/` para caminhos absolutos a partir de `src/`
6. **Textos UI:** sempre em português brasileiro (pt-BR)
7. **Ícones:** exclusivamente Lucide React, tamanho padrão `w-5 h-5`
8. **Layout mobile-first:** coluna `max-w-md` centralizada, `bg-white`, `shadow-xl`
9. **Toasts:** via Sonner, posição `top-center`, `richColors`

---

## Possíveis Melhorias / Trade-offs

- **Roteamento:** Migrar para React Router ou TanStack Router para suporte nativo a URL/history
- **State management:** Considerar Zustand ou Jotai para estado global mais complexo
- **Code splitting:** Implementar lazy loading de páginas com `React.lazy` + `Suspense`
- **Testes:** Adicionar testes unitários (Vitest) e E2E (Playwright — já instalado como dev dep)
- **PWA:** Adicionar service worker para funcionalidades offline
- **i18n:** Preparar para internacionalização caso o app expanda além do Brasil
