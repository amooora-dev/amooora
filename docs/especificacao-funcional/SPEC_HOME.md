# Especificação funcional – Home

**Última atualização:** 09/02/2025

Este documento descreve o que foi implementado **funcionalmente** na tela Home do app Amooora.

---

## 1. Visão geral

A Home é a página inicial do app após o acesso (ou após login). Apresenta um resumo de conteúdos (locais, eventos, serviços) e atalhos para as principais áreas: Lugares Seguros, Eventos, Serviços e Comunidade.

---

## 2. Rota

| Rota | Componente |
|------|------------|
| `home` | `Home` (`pages/Home.tsx`) |

---

## 3. Fontes de dados

- **Locais:** `usePlaces()` → lista de lugares ativos (Supabase).
- **Eventos:** `useEvents()` → lista de eventos ativos e aprovados.
- **Serviços:** `useServices()` → lista de serviços.

Os dados são limitados para exibição (ex.: 3 locais, 3 eventos, 6 serviços mais recentes). O mapa na Home usa até 10 locais com coordenadas (latitude/longitude).

---

## 4. Blocos da tela

### 4.1 Busca

- Botão que abre a **busca global** (`GlobalSearch`): busca em locais, eventos e serviços. Ao abrir, o usuário digita e vê resultados; clique leva ao detalhe do item (place-details, event-details, service-details).

### 4.2 Amooora Recomenda (Mapa)

- Card clicável com mapa (`InteractiveMap`) exibindo **locais** que possuem coordenadas (até 10).
- Clique no card navega para a página **Mapa** (`mapa`).
- Marcadores no mapa podem ser clicados (comportamento configurável; por padrão o card inteiro leva ao mapa).

### 4.3 Destaques (carrossel horizontal)

- **Lugares Seguros:** card com imagem e texto; clique → `places`.
- **Eventos:** card com imagem e texto; clique → `events`.
- **Serviços:** card com imagem (primeiro serviço ou placeholder) e texto; clique → `services`.
- **Comunidade:** card com imagem e texto; clique → `community`.

### 4.4 Lugares Seguros Próximos

- Lista horizontal (carrossel) de **até 3 locais** com `PlaceCard`: imagem, nome, categoria, avaliação. Clique → `place-details:<id>`.

### 4.5 Eventos em Destaque

- Lista horizontal (carrossel) de **até 3 eventos** com `EventCard`: imagem, data, nome, local. Ícone de favoritar (estado global). Clique no card → `event-details:<id>`.

### 4.6 Serviços (grid)

- Grid em 2 colunas com **até 6 serviços** (`ServiceCardGrid`): ícone/categoria, nome. Clique → `service-details:<id>` ou, conforme configuração, navegação por categoria.

---

## 5. Header e navegação

- Header fixo com logo/menu e, para admin, atalho para área administrativa.
- Navegação para outras páginas é feita via `onNavigate(page)` repassado pelo App.

---

## 6. Integrações

- **Favoritos:** ícone de favoritar nos eventos usa `useFavorites()` (estado global); não exige login para exibir, mas ao clicar sem login pode abrir modal de autenticação.
- **BottomNav:** não é exibida na Home na implementação típica; o App pode exibir barra inferior em outras telas.

---

## 7. Arquivos principais

| Função | Caminho |
|--------|---------|
| Página Home | `pages/Home.tsx` |
| Busca global | `components/GlobalSearch.tsx` |
| Card de destaque | `components/HighlightCard.tsx` |
| Mapa | `components/InteractiveMap.tsx` |
| Hooks de dados | `features/places/hooks/usePlaces.ts`, `features/events/hooks/useEvents.ts`, `features/services/hooks/useServices.ts` |

---

*Documento para referência da equipe de desenvolvimento.*
