# Especificação funcional – Serviços

**Última atualização:** 09/02/2025

Este documento descreve o que foi implementado **funcionalmente** na área de Serviços do app Amooora.

---

## 1. Visão geral

A área de serviços permite listar e buscar serviços por categoria (Terapia, Advocacia, Costura, Marcenaria, Beleza, Saúde, etc.), ver detalhes de cada serviço (descrição, prestador, preço, avaliações), favoritar e avaliar. Administradores podem cadastrar, editar e desativar serviços.

---

## 2. Rotas e páginas

| Rota / Navegação | Componente | Descrição |
|------------------|------------|-----------|
| `services` | `Servicos` | Listagem de serviços com filtro de categoria e busca |
| `service-details:<id>` | `ServiceDetails` | Detalhe do serviço (dados, avaliações, favoritar) |
| `services:<categoria>` | `Servicos` | Listagem com categoria inicial selecionada |
| `create-review:service:<id>` | `CreateReview` | Tela de escrever avaliação do serviço |
| `perfil-servicos-favoritos` | `PerfilServicosFavoritos` | Serviços favoritos do perfil |
| `admin-cadastrar-servico` / `admin-editar-servico:<id>` | Admin | Cadastro e edição de serviço (admin) |

---

## 3. Listagem (`Servicos`)

- **Fonte:** `useServices()` → lista de serviços (Supabase).
- **Categorias:** ex.: Todos, Terapia, Advocacia, Costura, Marcenaria, Pintura, Reparos, Bem-estar, Beleza, Saúde, Carreira, Outros.
- **Categoria inicial:** a rota pode receber `initialCategory` (ex.: `services:Terapia`) para abrir já filtrado.
- **Busca:** por nome, descrição, prestador ou categoria.
- **Exibição:** cards expandidos (`ServiceCardExpanded`) com ícone/categoria, nome, prestador, favoritar. Clique → `service-details:<id>`.

---

## 4. Detalhe do serviço (`ServiceDetails`)

- **Dados exibidos:** nome, descrição, imagem, categoria, prestador, preço (ou "A consultar"), avaliação média, contagem de reviews.
- **Ações (com login):** favoritar (coração), escrever avaliação, compartilhar.
- **Avaliações:** listagem de reviews; possível responder comentários conforme implementação do módulo de reviews.
- **Admin:** desativar conteúdo para quem tem permissão (quando aplicável).

---

## 5. Perfil – Serviços favoritados

- Página `PerfilServicosFavoritos`: lista de serviços cujos IDs estão em `getFavoritesByType('services')`, cruzada com `useServices()`. Clique → `service-details:<id>`.

---

## 6. Integrações

- **Favoritos:** estado global (`FavoritesContext`); favoritar em ServiceDetails reflete no Perfil e no carrossel "Serviços favoritados".
- **Avaliação:** `CreateReview` com `serviceId`; após salvar, dispara `review-created` e redireciona para `service-details:<id>`.

---

## 7. Arquivos principais

| Função | Caminho (exemplos) |
|--------|---------------------|
| Listagem | `features/services/pages/Servicos.tsx` |
| Detalhe | `features/services/components/ServiceDetails.tsx` |
| Perfil – Serviços Favoritos | `pages/PerfilServicosFavoritos.tsx` |
| Hooks | `features/services/hooks/useServices.ts` |
| Serviços (API) | `services/services.ts` ou `features/services/services/` |
| Admin | `features/services/pages/AdminCadastrarServico.tsx`, `AdminEditarServico.tsx` |

---

*Documento para referência da equipe de desenvolvimento.*
