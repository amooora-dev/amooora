# Arquitetura Geral e Funcionalidades

**Última atualização:** Maio 2026  
**Projeto:** Amooora — Plataforma LGBTQIA+ brasileira

---

## O que é o Amooora

Plataforma web mobile-first voltada à comunidade LGBTQIA+ no Brasil, oferecendo:

- **Locais seguros** — Estabelecimentos LGBTQIA+-friendly verificados
- **Serviços profissionais** — Terapia, advocacia, saúde, carreira
- **Eventos** — Encontros, festas, atividades culturais
- **Comunidades** — Espaços de discussão e suporte
- **Rede social** — Perfis, amigos, chat, favoritos

---

## Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIO (Browser)                     │
│                    Mobile-first SPA                      │
└────────────────┬────────────────────────────┬────────────┘
                 │                            │
                 ▼                            ▼
┌────────────────────────────┐  ┌─────────────────────────┐
│      Vercel (CDN)          │  │    Supabase (BaaS)      │
│  • Build estático (Vite)   │  │  • PostgreSQL           │
│  • Edge network            │  │  • Auth (email/senha)   │
│  • Env vars                │  │  • Storage (imagens)    │
│                            │  │  • RLS + RPC            │
└────────────────────────────┘  │  • Realtime (futuro)    │
                                └─────────────────────────┘
                                          │
                                          ▼
                                ┌─────────────────────────┐
                                │  Spring Boot (login_back)│
                                │  • API REST (users)     │
                                │  • MinIO / AWS S3       │
                                │  • MySQL 8              │
                                │  • Docker               │
                                └─────────────────────────┘
```

### Fluxo de dados

1. **Frontend React** faz chamadas diretamente ao **Supabase** (auth, queries, storage)
2. **Supabase** gerencia autenticação, banco PostgreSQL e storage de imagens
3. **Spring Boot** (opcional) provê API REST para gestão de usuários e fotos via MinIO/S3
4. **Vercel** serve o build estático e gerencia variáveis de ambiente

---

## Módulos Funcionais

### 1. Autenticação e Autorização

**Status:** Implementado

| Funcionalidade | Detalhes |
|---|---|
| Cadastro | Email + senha + nome + pronomes |
| Login | Email + senha, mensagens em PT-BR |
| Logout | Limpa sessão e redireciona |
| Verificação de email | Via link (Supabase detecta token na URL) |
| Persistência de sessão | localStorage com auto-refresh |
| Roles | `admin_geral`, `user_viewer`, `admin_locais`, `admin_eventos`, `admin_servicos` |
| Status de conta | `active`, `blocked`, `inactive` |
| Conta bloqueada | Tela de aviso + botão sair |

**Telas:** `Welcome`, `Login`, `Cadastro`

### 2. Home

**Status:** Implementado

Página principal com:
- Barra de busca (navega para busca global)
- Preview do mapa
- Seções de destaque (locais, eventos, serviços)
- Atalhos por categoria de serviço (Terapia, Advocacia, Saúde, Carreira)
- Cards em carrossel

**Tela:** `Home`

### 3. Locais (Lugares Seguros)

**Status:** Implementado

| Funcionalidade | Detalhes |
|---|---|
| Listagem | Cards com imagem, nome, categoria, avaliação |
| Filtros | Categoria, avaliação, tags |
| Detalhes | Imagem, descrição, endereço, avaliações, mapa |
| Avaliações | Criar review com nota (1-5) e comentário |
| Favoritar | Salvar no perfil |
| Seguir | Seguir local para atualizações |
| Compartilhar | Web Share API + fallback copiar link |
| Admin | Cadastrar, editar, desativar locais |

**Telas:** `Locais`, `PlaceDetails`, `AdminCadastrarLocal`, `AdminEditarLocal`

### 4. Serviços Profissionais

**Status:** Implementado

| Funcionalidade | Detalhes |
|---|---|
| Listagem | Grid de cards por categoria |
| Categorias | Terapia, Advocacia, Saúde, Carreira (extensível) |
| Lista por categoria | Tela dedicada |
| Detalhes | Informações do profissional, avaliações |
| Avaliações | Review com nota e comentário |
| Favoritar | Salvar no perfil |
| Admin | Cadastrar, editar serviços |

**Telas:** `Servicos`, `ServiceDetails`, `ServiceCategoryList`, `AdminCadastrarServico`, `AdminEditarServico`

### 5. Eventos

**Status:** Implementado

| Funcionalidade | Detalhes |
|---|---|
| Listagem | Cards com imagem, data, local |
| Detalhes | Informações completas, mapa, participantes |
| Interesse | Botão "Tenho interesse" |
| Participação | Botão "Fui!!" (exclusivo com interesse) |
| Participantes | Lista de participantes do evento |
| Mapa de eventos | Visualização no mapa |
| Avaliações | Review com nota e comentário |
| Admin | Cadastrar, editar eventos |

**Telas:** `Eventos`, `EventDetails`, `EventParticipants`, `AdminCadastrarEvento`, `AdminEditarEvento`

### 6. Comunidades

**Status:** Implementado

| Funcionalidade | Detalhes |
|---|---|
| Hub | Lista de todas as comunidades |
| Detalhes | Feed de posts, about, regras, stats |
| Posts | Criar, visualizar, curtir |
| Respostas | Comentários em posts |
| Seguir | Entrar/sair de comunidades |
| Minhas comunidades | Lista das que o usuário segue |
| Admin | Cadastrar, editar comunidades |

**Telas:** `TodasComunidades`, `CommunityDetails`, `PostDetails`, `MinhasComunidades`, `AdminCadastrarComunidade`, `AdminEditarComunidade`

### 7. Mapa

**Status:** Implementado

| Funcionalidade | Detalhes |
|---|---|
| Mapa interativo | Google Maps com pins |
| Pins | Locais e eventos com marcadores |
| Navegação | Clique no pin → detalhes |

**Tela:** `Mapa`

### 8. Perfil e Social

**Status:** Implementado

| Funcionalidade | Detalhes |
|---|---|
| Perfil pessoal | Avatar, nome, bio, pronomes, cidade |
| Editar perfil | Formulário completo |
| Perfil profissional | Visão e edição de perfil profissional |
| Ver perfil de outros | ViewProfile com avatar, bio, botão conectar |
| Favoritos | Locais, eventos, serviços salvos |
| Meus eventos | Eventos com interesse/participação |
| Minhas publicações | Conteúdo criado pelo usuário |
| Configurações | Tela de configurações (em desenvolvimento) |
| Notificações | Centro de notificações com badge |

**Telas:** `Perfil`, `EditarPerfil`, `PerfilProfissional`, `EditarPerfilProfissional`, `ViewProfile`, `MeusFavoritos`, `PerfilMeusEventos`, `PerfilLocaisFavoritos`, `PerfilServicosFavoritos`, `MinhasPublicacoes`, `Configuracoes`, `Notificacoes`

### 9. Amigos e Chat

**Status:** Implementado

| Funcionalidade | Detalhes |
|---|---|
| Busca de usuários | Pesquisa por nome |
| Solicitações | Enviar, aceitar, rejeitar, cancelar |
| Lista de amigos | Com status online (futuro) |
| Chat | Mensagens em tempo real (efêmeras com expiração) |

**Telas:** `Amigos` (com abas), `AmigosSearch`, `FriendChat`

### 10. Busca Global

**Status:** Implementado

| Funcionalidade | Detalhes |
|---|---|
| Busca unificada | Locais, eventos, serviços, comunidades |
| Resultados agrupados | Por tipo de conteúdo |
| Navegação direta | Clique → detalhes |

**Tela:** `Busca`

### 11. Admin / Moderação

**Status:** Implementado

| Funcionalidade | Permissão necessária |
|---|---|
| Painel admin | `admin_*` (qualquer role admin) |
| Cadastrar/editar locais | `admin_geral` ou `admin_locais` |
| Cadastrar/editar eventos | `admin_geral` ou `admin_eventos` |
| Cadastrar/editar serviços | `admin_geral` ou `admin_servicos` |
| Gerenciar usuários | `admin_geral` |
| Cadastrar usuário | `admin_geral` |
| Conteúdos desativados | `admin_*` |
| Curadoria | Roles com permissão específica |

**Telas:** `Admin`, `AdminGerenciarUsuarios`, `AdminCadastro`, `AdminEditarConteudos`, `AdminConteudosDesativados`, `CuradoriaConteudo`

### 12. Institucional

**Status:** Implementado

| Funcionalidade | Detalhes |
|---|---|
| Sobre Amooora | Missão, valores, equipe |
| Fale conosco | Formulário de contato |

**Telas:** `SobreAmooora`, `FaleConosco`

### 13. Reviews / Avaliações

**Status:** Implementado (transversal)

- Componente `CreateReview` polimórfico (funciona para locais, serviços, eventos, comunidades)
- Nota de 1 a 5 estrelas + comentário
- Hooks específicos: `usePlaceReviews`, `useServiceReviews`, `useEventReviews`, `useCommunityReviews`

---

## Padrões Arquiteturais

### Separação de Responsabilidades

```
Telas (pages/)
    ↓ usa
Componentes (components/, features/*/components/)
    ↓ usa
Hooks (hooks/, features/*/hooks/)
    ↓ chama
Services (services/, features/*/services/)
    ↓ acessa
Infraestrutura (infra/) → Supabase
```

### Comunicação entre Features

- Features são **independentes** entre si
- Compartilham tipos via `shared/types/`
- Compartilham componentes via `shared/components/`
- Compartilham hooks via `shared/hooks/`
- Navegação entre features via `onNavigate` prop (callback do App.tsx)

### Gerenciamento de Estado

| Tipo | Solução |
|---|---|
| Estado de tela/UI | `useState` local |
| Estado de autenticação | `useAuth` hook (Supabase listener) |
| Estado de permissões | `useAdmin` hook |
| Favoritos | Context API (`FavoritesContext`) |
| Dados do servidor | Custom hooks com `useEffect` + `useState` |
| Navegação | `useState` no App.tsx (currentPage) |

### Layout e UX

- **Mobile-first:** `max-w-md` (448px) centralizado
- **App shell:** Header fixo + conteúdo scrollável + BottomNav fixo
- **5 tabs principais:** Home, Locais, Serviços, Eventos, Comunidade
- **Copy:** Sempre em português brasileiro

---

## Inventário de Telas (~50+)

### Onboarding (3)
`Welcome`, `Login`, `Cadastro`

### Descoberta (12)
`Home`, `Locais`, `PlaceDetails`, `Servicos`, `ServiceDetails`, `ServiceCategoryList`, `Eventos`, `EventDetails`, `EventParticipants`, `Mapa`, `Busca`, `CreateReview`

### Comunidades (5)
`TodasComunidades`, `Comunidade`, `CommunityDetails`, `MinhasComunidades`, `PostDetails`

### Perfil e Social (13)
`Perfil`, `EditarPerfil`, `ViewProfile`, `PerfilProfissional`, `EditarPerfilProfissional`, `Configuracoes`, `Notificacoes`, `MeusFavoritos`, `MinhasPublicacoes`, `PerfilLocaisFavoritos`, `PerfilMeusEventos`, `PerfilServicosFavoritos`, `Amigos`/`AmigosSearch`/`FriendChat`

### Institucional (2)
`SobreAmooora`, `FaleConosco`

### Admin (10+)
`Admin`, `AdminCadastro`, `AdminGerenciarUsuarios`, `AdminCadastrarLocal`, `AdminEditarLocal`, `AdminCadastrarServico`, `AdminEditarServico`, `AdminCadastrarEvento`, `AdminEditarEvento`, `AdminCadastrarComunidade`, `AdminEditarComunidade`, `AdminEditarConteudos`, `AdminConteudosDesativados`, `CuradoriaConteudo`

### Sistema (2)
`Splash`, `EmDesenvolvimento`

---

## Documentação Existente

### Especificações Funcionais (`docs/especificacao-funcional/`)

| Documento | Área |
|---|---|
| `SPEC_HOME.md` | Home |
| `SPEC_LOCAIS.md` | Locais |
| `SPEC_SERVICOS.md` | Serviços |
| `SPEC_EVENTOS.md` | Eventos |
| `SPEC_COMUNIDADE.md` | Comunidade |
| `SPEC_PERFIL.md` | Perfil |
| `SPEC_MAPA.md` | Mapa |
| `SPEC_LOGIN.md` | Login |
| `SPEC_SOBRE_AMOORA.md` | Sobre |
| `SPEC_FALE_CONOSCO.md` | Fale Conosco |

### MDs Operacionais (`MD/`)

Mais de 50 documentos cobrindo:
- Configuração de Supabase, Storage, RLS
- Deploy na Vercel
- Diagnósticos e troubleshooting
- Instruções de setup e admin
- Planos de evolução e releases
- Auditorias de segurança
- Guias de teste

---

## Evolução e Roadmap

### Implementado (V4+)
- Sistema completo de autenticação com roles
- CRUD de locais, serviços, eventos, comunidades
- Sistema de avaliações (reviews)
- Favoritos (localStorage + Supabase)
- Amigos, chat, busca de usuários
- Busca global
- Mapa com Google Maps
- Admin com perfis de acesso
- Deploy na Vercel

### Próximos Passos (planejados)
- Sistema de notificações push
- Melhorias no chat (realtime via Supabase)
- Analytics e métricas
- Sistema de badges/conquistas
- Integração com redes sociais
- PWA (offline-first)
- Testes automatizados (Vitest + Playwright)
- Migração para roteamento baseado em URL

---

## Possíveis Melhorias / Trade-offs

- **Dois backends:** Avaliar consolidação (Supabase como backend único vs Spring Boot para funcionalidades específicas)
- **Roteamento:** Migrar de state-based para URL-based traz SEO, deep links nativos e back button
- **Server-side rendering:** Considerar Next.js ou Remix para SEO em conteúdo público
- **Testes:** Cobertura atual é mínima; priorizar testes em hooks e services críticos
- **Monitoramento:** Implementar error tracking (Sentry) e analytics (Posthog/Mixpanel)
- **Acessibilidade:** Auditar com lighthouse e garantir WCAG 2.1 AA
