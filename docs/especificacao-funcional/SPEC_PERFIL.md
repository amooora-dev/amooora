# Especificação funcional – Página de Perfil

**Última atualização:** 09/02/2025

Este documento descreve o que foi implementado **funcionalmente** na página de Perfil do app Amooora.

---

## 1. Visão geral

A página de Perfil exibe dados do usuário logado (avatar, nome, bio), botões para Editar perfil e Minhas publicações, e módulos em formato de carrossel: Ver amigos, Locais Favoritos, Meus Eventos, Serviços favoritados e Comunidades que Sigo. Pedidos de conexão recebidos aparecem quando houver itens.

---

## 2. Rota

| Rota | Componente |
|------|------------|
| `perfil` | `Perfil` (`pages/Perfil.tsx`) |

---

## 3. Condições de exibição

- **Carregando:** enquanto `profileLoading` ou `loading` é true, exibe "Carregando perfil...".
- **Sem perfil:** se `useProfile()` retorna `profile` null (ex.: não logado), exibe "Perfil não encontrado".
- **Com perfil:** exibe header do perfil e os módulos abaixo.

---

## 4. Cabeçalho do perfil

- **Avatar:** foto do perfil ou iniciais em círculo com gradiente.
- **Nome** e **Bio** (se houver).
- **Botões em linha:** "Editar Perfil" → `edit-profile`; "Minhas publicações" → `minhas-publicacoes`.

---

## 5. Pedidos de conexão

- Se existem pedidos recebidos (`getRequestsReceived()`), exibe bloco "Pedidos de conexão" com até 3 cards (`RequestCard`); ações Aceitar/Recusar; "Ver todos" → `friends-requests`.

---

## 6. Módulos (carrosséis)

Todos os módulos seguem o mesmo padrão visual: ícone em círculo, título, subtítulo (contagem ou texto padrão), carrossel horizontal de cards, e link "Ver mais" à direita.

### 6.1 Ver amigos

- **Dados:** `getFriends(profile.id)`; exibe até 4 amigos (avatar, nome). Clique no card → `view-profile:<friendId>`. "Ver mais" → `friends`.

### 6.2 Locais Favoritos

- **Dados:** IDs de `getFavoritesByType('places')`; até 4 locais carregados com `getPlaceById(id)`. Cards com imagem e categoria/nome. Clique → `place-details:<id>`. "Ver mais" → `perfil-locais-favoritos`.

### 6.3 Meus Eventos

- **Dados:** IDs de `getFavoritesByType('events')`; até 4 eventos com `getEventById(id)`. Cards com imagem, data e nome. Clique → `event-details:<id>`. "Ver mais" → `perfil-meus-eventos`.

### 6.4 Serviços favoritados

- **Dados:** IDs de `getFavoritesByType('services')`; até 4 serviços com `getServiceById(id)`. Cards no mesmo padrão visual dos eventos (imagem ou ícone, categoria, nome). Clique → `service-details:<id>`. "Ver mais" → `perfil-servicos-favoritos`.

### 6.5 Comunidades que Sigo

- **Dados:** `getFollowedCommunities(profile.id)`. Carrossel horizontal com cards (imagem, nome). Clique → `community-details:<community_id>`. "Ver mais" → `minhas-comunidades`.

---

## 7. Carregamento dos dados

- Um único `useEffect` (dependente de `profile?.id`) chama `loadProfileData`:
  - Estatísticas do perfil (`getProfileStats`).
  - Comunidades seguidas (`getFollowedCommunities`).
  - Pedidos recebidos (`getRequestsReceived`).
  - Lista de amigos (`getFriends`).
  - Conteúdo do usuário para publicações (`getUserContent`).
  - IDs de favoritos (places, events, services) e busca por ID dos primeiros 4 de cada tipo para os carrosséis.
- Todas as chamadas são protegidas com `.catch()` para não quebrar a tela; valores padrão (listas vazias, stats zerados) são usados em caso de falha.

---

## 8. Contagens exibidas

- **Locais:** quantidade de favoritos (places).
- **Eventos:** soma de eventos do perfil (stats) e favoritos (events).
- **Amigos:** `stats.friendsCount` (conexões aceitas).

---

## 9. Integrações

- **Favoritos:** estado global (`FavoritesContext`); os carrosséis leem `getFavoritesByType` no momento do carregamento. Ao favoritar/desfavoritar em outras telas, ao reabrir o Perfil os dados são recarregados (ou refletidos se o contexto for lido novamente).
- **Evento de atualização:** escuta `profile-updated` para chamar `refetchProfile()`.

---

## 10. Arquivos principais

| Função | Caminho |
|--------|---------|
| Página Perfil | `pages/Perfil.tsx` |
| Estatísticas / comunidades | `services/profile.ts` |
| Amigos | `features/friends` (`getFriends`, `RequestCard`) |
| Conteúdo do usuário | `shared/services/userContent.ts` |
| Favoritos | `shared/contexts/FavoritesContext.tsx` |

---

*Documento para referência da equipe de desenvolvimento.*
