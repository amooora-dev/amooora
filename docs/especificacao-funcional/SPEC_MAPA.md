# Especificação funcional – Mapa

**Última atualização:** 09/02/2025

Este documento descreve o que foi implementado **funcionalmente** na página Mapa do app Amooora.

---

## 1. Visão geral

A página Mapa exibe um mapa interativo com marcadores de **locais** e **eventos**. O usuário pode filtrar por "Todos", "Locais" ou "Eventos" e (quando logado) visualizar diferenciação para eventos em que está inscrito ou participou. Clique no marcador ou em item da lista leva ao detalhe (place-details ou event-details).

---

## 2. Rota

| Rota | Componente |
|------|------------|
| `mapa` | `Mapa` (`pages/Mapa.tsx`) |

---

## 3. Fontes de dados

- **Locais:** `usePlaces()` — apenas locais com `latitude` e `longitude` são exibidos no mapa (ou geocoding do endereço quando aplicável).
- **Eventos:** `useEvents()`; eventos precisam de geocoding do campo `location` para obter coordenadas (cache de geocoding para não repetir requisições).
- **Usuário logado:** `getUpcomingEvents`, `getAttendedEvents`, `getInterestedEvents` para destacar no mapa eventos em que a usuária participa ou tem interesse.

---

## 4. Filtros

- **Todos:** exibe locais e eventos no mapa.
- **Locais:** apenas marcadores de locais.
- **Eventos:** apenas marcadores de eventos.

---

## 5. Comportamento do mapa

- **Componente:** `InteractiveMap` com marcadores por tipo (place/event). Centro e zoom configuráveis.
- **Clique no marcador:** navega para `place-details:<id>` ou `event-details:<id>` conforme o tipo.
- **Lista lateral ou inferior:** pode existir lista de locais/eventos visíveis; clique na lista também navega para o detalhe.
- **Eventos do usuário:** quando autenticado, eventos em que a usuária está inscrita ou participou podem ser destacados (ex.: cor ou ícone diferente).

---

## 6. Navegação

- Botão "Voltar" ou equivalente chama `onBack()` ou `onNavigate` para retornar à tela anterior (ex.: home).

---

## 7. Arquivos principais

| Função | Caminho |
|--------|---------|
| Página Mapa | `pages/Mapa.tsx` |
| Mapa interativo | `components/InteractiveMap.tsx` |
| Geocoding | `shared/services/` (geocodeAddress) |
| Dados de eventos do usuário | `services/profile.ts` (getUpcomingEvents, getAttendedEvents, getInterestedEvents) |

---

*Documento para referência da equipe de desenvolvimento.*
