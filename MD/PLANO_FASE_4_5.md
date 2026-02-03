# Plano de Implementação: Fase 4 (Social Básico) e Fase 5 (Performance)

## FASE 4: Social Básico

### 1. Criar Serviços para Comunidade
- `src/app/services/community.ts` (novo)
- Funções: `getCommunityPosts()`, `getPostById()`, `getPostReplies()`, `createReply()`, `togglePostLike()`
- Ordenação: trending → likes → replies → created_at

### 2. Criar Hooks
- `src/app/hooks/useCommunityPosts.ts`
- `src/app/hooks/usePostLikes.ts`
- `src/app/hooks/usePostReplies.ts`

### 3. Atualizar Tipos
- Adicionar `CommunityPost` e `PostReply` em `src/app/types/index.ts`

### 4. Integrar Componentes
- `Comunidade.tsx` - usar dados do banco
- `PostDetails.tsx` - comentários e likes do banco
- `CommunityPostCard.tsx` - likes persistentes

## FASE 5: Performance

### 1. Lazy Loading
- Atualizar `ImageWithFallback.tsx` com `loading="lazy"`

### 2. Infinite Scroll
- Criar `InfiniteScroll.tsx` reutilizável
- Implementar em: Locais, Eventos, Servicos, Comunidade
- Atualizar serviços para suportar `limit` e `offset`
