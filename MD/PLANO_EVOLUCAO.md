# Plano de Evolução - Amooora

Este documento contém o plano de evolução do site antes da implementação de login e perfil.

## 📋 Visão Geral

Este plano prioriza funcionalidades que funcionam **sem autenticação**, criando uma base sólida para quando o login for implementado.

---

## 🎯 Fase 1: Fundação (3-4 horas)

### 1. Sistema de Avaliações Básico
**Tempo estimado:** 1-2 horas

**Funcionalidades:**
- ✅ Implementar criação de reviews sem login (ou com identificação opcional)
- ✅ Mostrar avaliações reais nos detalhes de lugares/eventos/serviços
- ✅ Cálculo de média de avaliações dinamicamente
- ✅ Adicionar filtros por avaliação na página de Locais
- ✅ Interface para adicionar avaliação (com estrelas, comentário)

**Tabelas necessárias:**
- `reviews` (se não existir)
  - id, place_id/service_id/event_id, rating, comment, author_name (opcional), created_at

**Integração:**
- PlaceDetails, EventDetails, ServiceDetails
- Página de Locais (filtros)

---

### 2. Favoritos com localStorage
**Tempo estimado:** 30-45 minutos

**Funcionalidades:**
- ✅ Salvar favoritos localmente (sem banco ainda)
- ✅ Botão de favoritar em todos os cards (lugares, eventos, serviços)
- ✅ Página "Meus Favoritos" que lista itens salvos
- ✅ Indicador visual de favoritado
- ✅ Migração futura: quando login for implementado, migrar favoritos do localStorage para o banco

**Estrutura localStorage:**
```javascript
{
  favorites: {
    places: ['id1', 'id2'],
    events: ['id3'],
    services: ['id4']
  }
}
```

**Integração:**
- PlaceCard, EventCard, ServiceCard
- PlaceCardExpanded, EventCardExpanded, ServiceCardExpanded
- Nova página ou seção em Perfil

---

### 3. Melhorar Estados Vazios e Loading States
**Tempo estimado:** 1 hora

**Funcionalidades:**
- ✅ Criar componentes de Empty State reutilizáveis
- ✅ Substituir "Carregando..." por skeleton screens
- ✅ Mensagens contextuais quando não há resultados
- ✅ Ilustrações ou ícones apropriados
- ✅ Sugestões de ações (ex: "Tente ajustar os filtros")

**Componentes:**
- `EmptyState.tsx` (componente reutilizável)
- `SkeletonCard.tsx`, `SkeletonList.tsx`
- Atualizar todas as páginas (Home, Locais, Eventos, Serviços, Comunidade)

**Onde aplicar:**
- Quando `loading === true` → skeleton
- Quando `data.length === 0` → empty state
- Erros → mensagem de erro amigável

---

## 📦 Fase 2: Conteúdo (2-3 horas)

### 4. Popular Banco de Dados
**Tempo estimado:** 1 hora

**Ações:**
- ✅ Criar scripts SQL com dados de exemplo realistas
- ✅ Lugares LGBTQIA+ friendly reais
- ✅ Eventos da comunidade
- ✅ Serviços diversos (terapia, advocacia, saúde, etc.)
- ✅ Garantir imagens de qualidade
- ✅ Endereços e coordenadas reais

**Arquivo:** `SQL/POPULAR_DADOS_EXEMPLO.sql`

---

### 5. Expandir Categorias e Tags
**Tempo estimado:** 30 minutos

**Ações:**
- ✅ Adicionar mais categorias de serviços
- ✅ Sistema de tags para lugares (ex: "vegano", "aceita pets", "acessível")
- ✅ Filtros por tags na página de Locais
- ✅ Visual de tags nos cards

---

### 6. Melhorar Qualidade das Imagens
**Tempo estimado:** 1 hora

**Ações:**
- ✅ Verificar todas as URLs de imagens
- ✅ Garantir imagens reais e de qualidade
- ✅ Implementar fallbacks adequados
- ✅ Otimização futura: lazy loading

---

## 🔍 Fase 3: Busca e Navegação (3-4 horas)

### 7. Busca Global Funcional
**Tempo estimado:** 1-2 horas

**Funcionalidades:**
- ✅ Barra de busca no Header
- ✅ Buscar em lugares, eventos, serviços simultaneamente
- ✅ Resultados agrupados por tipo
- ✅ Navegação direta para resultado

**Componente:** `GlobalSearch.tsx` ou modal de busca

---

### 8. Filtros Combinados Avançados
**Tempo estimado:** 1-2 horas

**Funcionalidades:**
- ✅ Combinar múltiplos filtros (categoria + avaliação + distância + tags)
- ✅ Resetar filtros facilmente
- ✅ Indicar quantos resultados foram encontrados
- ✅ Salvar preferências de filtros (localStorage)

**Integração:**
- Página de Locais (já tem filtros básicos)
- Página de Eventos
- Página de Serviços

---

### 9. Compartilhamento de Conteúdo
**Tempo estimado:** 30 minutos

**Funcionalidades:**
- ✅ Botão de compartilhar em todos os detalhes
- ✅ Web Share API (nativo do dispositivo)
- ✅ Fallback para copiar link
- ✅ Link direto para detalhes (ex: `/place-details:id`)
- ✅ Preview ao compartilhar (meta tags)

**Integração:**
- PlaceDetails, EventDetails, ServiceDetails

---

## 👥 Fase 4: Social Básico (Opcional - 2-3 horas)

### 10. Comentários Funcionais na Comunidade
**Funcionalidades:**
- ✅ Comentários funcionais nos posts (já existe parcialmente)
- ✅ Respostas aninhadas
- ✅ Edição/deleção (futuro com login)

### 11. Sistema de Likes/Curtidas
**Funcionalidades:**
- ✅ Curtir posts e comentários (localStorage inicialmente)
- ✅ Contador de curtidas
- ✅ Indicador visual

### 12. Feed Organizado e Relevante
**Funcionalidades:**
- ✅ Ordenação por relevância/popularidade
- ✅ Sistema de trending
- ✅ Posts em destaque

---

## ⚡ Fase 5: Performance e Otimização (Contínua)

### Otimização de Imagens
- ✅ Lazy loading de imagens
- ✅ WebP quando possível
- ✅ Placeholders durante carregamento

### Paginação ou Infinite Scroll
- ✅ Carregar mais resultados progressivamente
- ✅ Melhor performance com muitos dados
- ✅ Indicador de "carregando mais"

---

## 🚀 Próximos Passos Após Fases 1-3

Quando as fases 1-3 estiverem completas, estaremos prontos para:

1. **Implementar Login e Perfil** com uma base sólida
2. **Migrar favoritos** do localStorage para o banco
3. **Associar avaliações** a usuários reais
4. **Sistema de notificações** baseado em ações do usuário

---

## 📊 Status de Implementação

### ✅ Fase 1: Fundação
- [ ] Sistema de Avaliações Básico
- [ ] Favoritos com localStorage
- [ ] Melhorar Estados Vazios e Loading States

### ⏳ Fase 2: Conteúdo
- [ ] Popular Banco de Dados
- [ ] Expandir Categorias e Tags
- [ ] Melhorar Qualidade das Imagens

### ⏳ Fase 3: Busca e Navegação
- [ ] Busca Global Funcional
- [ ] Filtros Combinados Avançados
- [ ] Compartilhamento de Conteúdo

### ⏳ Fase 4: Social Básico (Opcional)
- [ ] Comentários Funcionais na Comunidade
- [ ] Sistema de Likes/Curtidas
- [ ] Feed Organizado e Relevante

### ⏳ Fase 5: Performance
- [ ] Otimização de Imagens
- [ ] Paginação ou Infinite Scroll

---

## 🎯 Prioridade Recomendada

**Começar por:**
1. Sistema de Avaliações (maior impacto na confiabilidade)
2. Favoritos (funcionalidade esperada pelos usuários)
3. Estados Vazios (melhora UX mesmo sem muitos dados)

**Depois:**
4. Popular banco com dados reais
5. Busca global
6. Filtros avançados

---

**Última atualização:** Janeiro 2025
**Próxima revisão:** Após implementação da Fase 1
