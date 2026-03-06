# Especificação funcional – Área de Eventos

**Última atualização:** 09/02/2025

Este documento descreve o que foi implementado **funcionalmente** na área de Eventos do app Amooora, para apoio a desenvolvedores e manutenção futura.

---

## 1. Visão geral

A área de eventos permite:

- Listar, filtrar e buscar eventos aprovados.
- Ver detalhes de um evento (informações, mapa, participantes, avaliações).
- Interagir com eventos: favoritar, "Tenho interesse", "Fui!!", avaliar e compartilhar.
- Ver lista de participantes e perfis.
- Para administradores: cadastrar, editar e desativar eventos.
- Integração com perfil: carrossel "Meus Eventos" e favoritos.

---

## 2. Rotas e páginas

| Rota / Navegação | Componente | Descrição |
|------------------|------------|-----------|
| `events` | `Eventos` | Listagem de eventos com filtros, busca e mapa |
| `event-details:<id>` | `EventDetails` | Detalhe do evento (dados, mapa, ações, avaliações, participantes) |
| `event-participants:<id>` | `EventParticipants` | Lista de participantes do evento; clique abre perfil do usuário |
| `create-review:event:<id>` | `CreateReview` | Tela de escrever avaliação do evento (estrelas + descrição) |
| `perfil-meus-eventos` | `PerfilMeusEventos` | Eventos do perfil: favoritos, próximos, interesses, participados, avaliações |
| `admin-cadastrar-evento` | `AdminCadastrarEvento` | Cadastro de novo evento (admin) |
| `admin-editar-evento:<id>` | `AdminEditarEvento` | Edição de evento existente (admin) |

O App centraliza `selectedEventId` e `selectedParticipantEventId` e repassa para os componentes acima.

---

## 3. Modelo de dados (evento)

- **Fonte:** tabela `events` no Supabase; tipo `Event` em `shared/types` e reexport em `features/events/types`.
- **Campos principais:** `id`, `name`, `description`, `image` / `imageUrl`, `date`, `time`, `endTime`, `location`, `category`, `price`, `participants` (contagem), `isActive`.
- **Curadoria:** eventos listados na área pública têm `is_active: true` e `curation_status: 'approved'`. Criação/edição podem usar `curation_status: 'pending'` para aprovação posterior.

---

## 4. Listagem de eventos (`Eventos`)

- **Fonte dos dados:** hook `useEvents()` → serviço `getEvents()` (eventos ativos e aprovados).
- **Filtros de categoria:** "Todos", "Hoje", "Semana", "Gratuitos" (filtro por data e por `price`).
- **Busca:** por texto (nome/descrição/categoria).
- **Filtro avançado:** modal de filtros (ex.: tags derivadas de descrição/categoria: gratuito, ar-livre, música, workshop, etc.).
- **Exibição:** cards expandidos (`EventCardExpanded`) com imagem, data, nome, local; ícone de favoritar (estado global de favoritos).
- **Mapa:** eventos podem ser exibidos no mapa; geocoding do endereço para coordenadas (com cache).
- **Autenticação:** se não logada e tentar ação que exige login, pode ser exibido modal de auth (dependendo do fluxo da tela).

---

## 5. Detalhe do evento (`EventDetails`)

### 5.1 Dados exibidos

- Nome, descrição, imagem(s), tags (derivadas de descrição/categoria).
- **Quando:** data formatada, dia da semana, horário de início (e fim se houver).
- **Onde:** endereço/local; mapa (geocoding do endereço); link "Ver no Google Maps".

### 5.2 Ações do usuário (requerem login)

- **Favoritar:** ícone de coração; usa `useFavorites()`; toggle em `events` com `eventId`. Estado compartilhado via `FavoritesContext` (aparece no perfil e em "Meus Eventos").
- **Tenho interesse:** botão que chama `toggleInterest()`; grava em `event_interests` e adiciona em `event_participants` se ainda não estiver; atualiza contador e lista de participantes.
- **Fui!!:** botão que chama `toggleAttendance()`; grava em `event_participants`; se havia "Tenho interesse", remove interesse e mantém participação. Desmarcar "Fui!!" remove da lista de participantes.
- **Avaliar:** botão "Escreva uma avaliação" (ou equivalente) que navega para `create-review:event:<eventId>`. Barra de avaliação é um único bloco clicável (acessível e com prioridade de clique).
- **Compartilhar:** gera link e texto para compartilhamento (Web Share API quando disponível).
- **Ver participantes:** link para `event-participants:<eventId>`.

### 5.3 Avaliações (reviews)

- Listagem de avaliações do evento via `useEventReviews(eventId)`.
- Exibição: autor (nome/avatar do avaliador), nota (estrelas), comentário, data.
- **Responder:** botão "Responder" em cada comentário abre campo de resposta (estado local `replyingTo` + `replyText`); envio de resposta conforme serviço de reviews.
- Cálculo de média de notas e contagem de reviews para exibição no detalhe.

### 5.4 Admin

- Se o usuário tem `canManageEvents` e o evento está ativo: botão **Desativar conteúdo**.
- Ao desativar: chama `deactivateContent('event', eventId)`; toast de sucesso; redirecionamento para `admin-conteudos-desativados`.

### 5.5 Autenticação

- Ações que exigem login (favoritar, interesse, Fui!!, avaliar) checam `isAuthenticated`. Se não logada, pode ser exibido `AuthTooltip` (modal de login) em vez de executar a ação.

---

## 6. Participantes do evento (`EventParticipants`)

- Lista de participantes do evento via `useEventParticipants(eventId)` (tabela `event_participants` + perfis).
- Exibição: avatar, nome, bio (se houver).
- Clique em um participante: navega para `view-profile:<userId>`.

---

## 7. Avaliação de evento (`CreateReview`)

- Rota: `create-review:event:<eventId>`; o App seta apenas `selectedEventId` e limpa outros IDs de lugar/serviço/comunidade.
- Campos da avaliação: **estrelas** (nota) e **descrição** (texto). Nome e avatar do avaliador vêm do perfil logado (não são editáveis na tela).
- Após salvar: dispara evento customizado `review-created` (com `eventId`, `reviewType: 'event'`) para atualizar a tela de detalhe; redirecionamento para `event-details:<eventId>`.

---

## 8. Perfil – Meus Eventos (`PerfilMeusEventos`)

- **Eventos favoritos:** IDs de `getFavoritesByType('events')` cruzados com lista de eventos (`useEvents()`); exibidos em seção/carrossel.
- **Próximos eventos:** eventos em que a usuária está inscrita e que ainda não ocorreram (`getUpcomingEvents(profile.id)`).
- **Interesses:** eventos em que marcou "Tenho interesse" (`getInterestedEvents(profile.id)`).
- **Participados:** eventos em que marcou "Fui!!" (`getAttendedEvents(profile.id)`).
- **Avaliações:** avaliações feitas pela usuária em eventos (`getUserReviews(profile.id)` filtrado por evento).
- Navegação para detalhe: `event-details:<id>`.

---

## 9. Perfil – Carrossel "Meus Eventos"

- Na página de Perfil, o carrossel "Meus Eventos" usa os **favoritos** (localStorage, via `getFavoritesByType('events')`).
- Até 4 eventos favoritos são carregados por ID com `getEventById(id)` e exibidos em cards (imagem, data, nome); clique leva a `event-details:<id>`.
- "Ver mais" leva a `perfil-meus-eventos`.

---

## 10. Serviços e tabelas (backend lógico)

- **events:** CRUD de eventos; listagem com `is_active` e `curation_status: 'approved'`; `getEventById(id)` para detalhe e carrosséis.
- **event_participants:** inscrição/participação ("Fui!!" e, quando aplicável, "Tenho interesse"); contagem e lista de participantes.
- **event_interests:** "Tenho interesse"; ao marcar interesse, o fluxo também pode inserir em `event_participants` para contagem.
- **Reviews de evento:** tabela de reviews associada a `event_id`; listagem por evento; criação com nota e comentário; respostas a comentários conforme implementado no módulo de reviews.

---

## 11. Admin – Cadastro e edição

- **AdminCadastrarEvento:** formulário com nome, descrição, imagem, data, horário de início e fim, local/endereço, categoria, preço. Envio chama `createEvent(...)`; pode usar `curation_status: 'pending'`. Rascunho pode ser salvo em localStorage.
- **AdminEditarEvento:** carrega evento com `getEventById(eventId)`; mesmo conjunto de campos; envio chama `updateEvent(id, ...)`. Apenas usuários com `canManageEvents` acessam.

---

## 12. Curadoria e desativação

- Eventos inativos (`is_active: false`) não aparecem na listagem pública.
- Desativação é feita na tela de detalhe (botão "Desativar conteúdo") por quem tem permissão; redirecionamento para lista de conteúdos desativados.
- A curadoria (aprovar/reprovar) pode ser feita em outra tela (ex.: Curadoria de Conteúdo); eventos aprovados têm `curation_status: 'approved'`.

---

## 13. Integrações resumidas

- **Favoritos:** estado global (`FavoritesContext`); favoritar em EventDetails atualiza o mesmo estado usado no Perfil e em "Meus Eventos".
- **Perfil:** carrossel "Meus Eventos" (favoritos) + página "Meus Eventos" (favoritos, próximos, interesses, participados, avaliações).
- **Navegação:** App trata `event-details:`, `event-participants:`, `create-review:event:`, `perfil-meus-eventos`, `admin-editar-evento:` e repassa IDs corretos aos componentes.
- **Reviews:** evento customizado `review-created` com `eventId` para refetch de reviews no EventDetails.

---

## 14. Arquivos principais (referência)

| Função | Caminho (exemplos) |
|--------|---------------------|
| Listagem | `features/events/pages/Eventos.tsx` |
| Detalhe | `features/events/components/EventDetails.tsx` |
| Participantes | `features/events/pages/EventParticipants.tsx` |
| Interações (interesse / Fui!!) | `features/events/services/eventInteractions.ts`, `hooks/useEventInteractions.ts` |
| Participantes (lista/contagem) | `features/events/services/eventParticipants.ts`, `hooks/useEventParticipants.ts` |
| CRUD eventos | `features/events/services/events.ts` |
| Hooks de lista e detalhe | `features/events/hooks/useEvents.ts` |
| Perfil – Meus Eventos | `pages/PerfilMeusEventos.tsx` |
| Avaliação | `pages/CreateReview.tsx` (genérico para place/service/event/community) |
| Admin | `features/events/pages/AdminCadastrarEvento.tsx`, `AdminEditarEvento.tsx` |

---

*Documento gerado para referência da equipe de desenvolvimento. Para alterações no produto ou novos fluxos, atualizar esta especificação e o código em conjunto.*
