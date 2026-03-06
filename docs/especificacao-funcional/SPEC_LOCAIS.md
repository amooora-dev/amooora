# Especificação funcional – Locais

**Última atualização:** 09/02/2025

Este documento descreve o que foi implementado **funcionalmente** na área de Locais (Lugares Seguros) do app Amooora.

---

## 1. Visão geral

A área de locais permite listar, filtrar e buscar lugares (estabelecimentos) cadastrados, ver detalhes de cada local (informações, mapa, avaliações), favoritar, avaliar, marcar como visitado e seguir. Administradores podem cadastrar, editar e desativar locais.

---

## 2. Rotas e páginas

| Rota / Navegação | Componente | Descrição |
|------------------|------------|-----------|
| `places` | `Locais` | Listagem de locais com filtros e busca |
| `place-details:<id>` | `PlaceDetails` | Detalhe do local (dados, mapa, ações, avaliações) |
| `create-review:place:<id>` | `CreateReview` | Tela de escrever avaliação do local |
| `perfil-locais-favoritos` | `PerfilLocaisFavoritos` | Locais favoritos do perfil |
| `admin-cadastrar-local` | `AdminCadastrarLocal` | Cadastro de novo local (admin) |
| `admin-editar-local:<id>` | `AdminEditarLocal` | Edição de local (admin) |

---

## 3. Listagem (`Locais`)

- **Fonte:** `usePlaces()` → eventos ativos (Supabase).
- **Filtros de categoria:** ex.: Todos, Cafés, Bares, Restaurantes, Cultura.
- **Busca:** por nome, descrição ou endereço.
- **Filtro avançado:** modal com filtros (ex.: nota mínima); tags derivadas da descrição (vegano, aceita-pets, acessível, wifi, etc.).
- **Exibição:** cards expandidos (`PlaceCardExpanded`) com imagem, nome, categoria, avaliação; ícone de favoritar. Clique no card → `place-details:<id>`.
- **Autenticação:** ações que exigem login (favoritar, avaliar, visitado) podem exibir modal de login se não autenticado.

---

## 4. Detalhe do local (`PlaceDetails`)

- **Dados exibidos:** nome, descrição, imagem, endereço, mapa (geocoding), categoria, avaliação média, contagem de reviews, indicadores (ex.: seguro).
- **Ações (com login):** favoritar (coração), marcar como visitado, seguir local, escrever avaliação, compartilhar. Barra "Escreva uma avaliação" é um bloco único clicável → `create-review:place:<id>`.
- **Avaliações:** listagem de reviews com autor, nota, comentário, data; botão "Responder" abre campo de resposta.
- **Admin:** botão "Desativar conteúdo" para quem tem `canManagePlaces`; desativação redireciona para conteúdos desativados.

---

## 5. Perfil – Locais Favoritos

- Página `PerfilLocaisFavoritos`: lista de locais cujos IDs estão em `getFavoritesByType('places')`, cruzada com `usePlaces()`. Exibe também avaliações/visitas do usuário quando aplicável. Clique no local → `place-details:<id>`.

---

## 6. Integrações

- **Favoritos:** estado global (`FavoritesContext`); favoritar em PlaceDetails reflete no Perfil e no carrossel "Locais Favoritos" da página de Perfil.
- **Avaliação:** `CreateReview` com `placeId`; após salvar, dispara `review-created` e redireciona para `place-details:<id>`.

---

## 7. Arquivos principais

| Função | Caminho (exemplos) |
|--------|---------------------|
| Listagem | `features/places/pages/Locais.tsx` |
| Detalhe | `features/places/components/PlaceDetails.tsx` |
| Perfil – Locais Favoritos | `pages/PerfilLocaisFavoritos.tsx` |
| Hooks | `features/places/hooks/usePlaces.ts` |
| Serviços | `features/places/services/places.ts` |
| Admin | `features/places/pages/AdminCadastrarLocal.tsx`, `AdminEditarLocal.tsx` |

---

*Documento para referência da equipe de desenvolvimento.*
