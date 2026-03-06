# Especificação funcional – Comunidade

**Última atualização:** 09/02/2025

Este documento descreve o que foi implementado **funcionalmente** na área de Comunidade do app Amooora.

---

## 1. Visão geral

A área de comunidade permite visualizar um feed de publicações de comunidades, filtrar por categoria (Apoio, Dicas, Eventos, Geral), buscar em posts e respostas, criar publicações, interagir com posts (curtir, comentar, responder comentários) e gerenciar participação em comunidades (seguir, listar comunidades).

---

## 2. Rotas e páginas

| Rota / Navegação | Componente | Descrição |
|------------------|------------|-----------|
| `community` | `Comunidade` | Feed de posts e lista de comunidades; abas Feed / Comunidades |
| `post-details:<id>` | `PostDetails` | Detalhe do post com comentários e respostas |
| `community-details:<id>` | `CommunityDetails` | Detalhe de uma comunidade |
| `minhas-comunidades` | `MinhasComunidades` | Comunidades que o usuário segue |
| `todas-comunidades` | `TodasComunidades` | Listagem de todas as comunidades |

---

## 3. Página Comunidade (`Comunidade`)

- **Abas:** "Feed" (publicações) e "Comunidades" (carrossel de comunidades).
- **Feed:** posts vindos de `useCommunityPosts()` com filtro opcional de categoria (Todos, Apoio, Dicas, Eventos, Geral). Scroll infinito (`InfiniteScroll`) para carregar mais. Busca por texto pode consultar posts e respostas (`getCommunityPosts`, `getPostReplies`).
- **Cards de post:** `CommunityPostCard` com autor, conteúdo, categoria, curtidas, número de respostas. Clique → `post-details:<id>`.
- **Criar post:** formulário `CreatePostForm` para criar nova publicação (comunidade/categoria conforme regra do app).
- **Comunidades:** carrossel `CommunityCardCarousel` com cards de comunidades; clique → `community-details:<id>`.

---

## 4. Detalhe do post (`PostDetails`)

- Exibição do post completo; listagem de comentários (replies) com suporte a respostas aninhadas.
- **Responder:** botão "Responder" em comentário abre campo de texto; envio via serviço de replies (`addReply`).
- Curtidas e contagem de respostas.

---

## 5. Comunidades que Sigo / Minhas Comunidades

- Lista de comunidades em que o usuário é membro (tabela `community_members`). Na página de Perfil, carrossel "Comunidades que Sigo" usa `getFollowedCommunities(profile.id)`; cards em formato igual aos outros carrosséis; "Ver mais" → `minhas-comunidades`.

---

## 6. Modelo de dados (resumo)

- **Posts:** tabela de posts com categoria, autor, conteúdo, comunidade (quando aplicável).
- **Replies:** comentários e respostas a comentários (`parent_reply_id` para aninhamento).
- **Communities:** tabelas de comunidades e `community_members` para "seguir" / participar.

---

## 7. Arquivos principais

| Função | Caminho (exemplos) |
|--------|---------------------|
| Página Comunidade | `features/communities/pages/Comunidade.tsx` |
| Feed / posts | `hooks/useCommunityPosts.ts`, `features/communities/services/community.ts` |
| Post card | `components/CommunityPostCard.tsx` |
| Detalhe do post | `features/communities/pages/PostDetails.tsx` |
| Comunidades | `features/communities/services/communities.ts`, `communityFollows.ts` |
| Perfil – comunidades | `services/profile.ts` (`getFollowedCommunities`) |

---

*Documento para referência da equipe de desenvolvimento.*
