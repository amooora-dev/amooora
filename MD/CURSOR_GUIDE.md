# Amooora - Guia de Desenvolvimento para Cursor

## Contexto do Projeto

A **Amooora** é uma plataforma mobile feita por e para a comunidade sáfica. É um espaço seguro, acolhedor, representativo e comunitário que conecta pessoas, lugares, eventos, serviços e conteúdos com foco em cuidado, afeto e pertencimento.

## Arquitetura do App

### Stack Tecnológica
- React 18.3.1
- TypeScript
- Tailwind CSS v4
- Vite
- Lucide React (ícones)

### Estrutura de Pastas
```
/src
  /app
    /components
      - Header.tsx
      - SectionHeader.tsx
      - PlaceCard.tsx
      - EventCard.tsx
      - ServiceCard.tsx
      - BottomNav.tsx
      - Badge.tsx
      - DateBadge.tsx
      - Rating.tsx
      /figma
        - ImageWithFallback.tsx (protegido - não modificar)
    - App.tsx
  /styles
    - theme.css
    - fonts.css
```

## Design System

### Cores
```css
/* Cores Principais da Amooora */
--primary: #7B3FF2        /* Roxo principal */
--secondary: #932d6f       /* Lilás */
--accent: #FF6B7A         /* Coral/Laranja */

/* Cores Neutras */
--muted: #F5F3F7          /* Fundo suave */
--muted-foreground: #717182 /* Texto secundário */
--foreground: oklch(0.145 0 0) /* Texto principal */
--background: #ffffff      /* Fundo branco */
```

### Espaçamentos
- Base: múltiplos de 8px (espaçamento Tailwind padrão)
- Padding de seções: `px-5 py-6`
- Gap entre elementos: `gap-3`, `gap-4`

### Tipografia
- Títulos de seção: `text-lg font-semibold`
- Títulos de card: `font-semibold`
- Corpo: padrão do tema
- Meta/legenda: `text-sm text-muted-foreground`

### Border Radius
- Cards: `rounded-xl` (12px)
- Badges: `rounded-full`
- Botões: `rounded-lg` (8px)

### Sombras
- Cards: `shadow-sm` com hover para `shadow-md`
- Bottom Nav: `shadow-lg`

## Componentes Criados

### 1. Header
**Arquivo:** `/src/app/components/Header.tsx`
- Exibe saudação personalizada
- Botão de notificações (círculo roxo)
- Fixo no topo

### 2. SectionHeader
**Arquivo:** `/src/app/components/SectionHeader.tsx`
**Props:**
- `icon: ReactNode` - Ícone da seção
- `title: string` - Título da seção
- `onViewAll?: () => void` - Callback para "Ver todos"

### 3. PlaceCard
**Arquivo:** `/src/app/components/PlaceCard.tsx`
**Props:**
- `name: string` - Nome do lugar
- `category: string` - Categoria (Café, Bar, etc)
- `rating: number` - Avaliação (0-5)
- `reviewCount: number` - Número de avaliações
- `distance: string` - Distância (ex: "0.5 km")
- `imageUrl: string` - URL da imagem
- `isSafe?: boolean` - Mostra badge "Seguro"

### 4. EventCard
**Arquivo:** `/src/app/components/EventCard.tsx`
**Props:**
- `name: string` - Nome do evento
- `date: string` - Data formatada (ex: "15 Dez")
- `time: string` - Horário (ex: "19:00")
- `location: string` - Local do evento
- `participants: number` - Número de participantes
- `imageUrl: string` - URL da imagem

**Layout:** Horizontal com imagem à esquerda, badge de data à direita

### 5. ServiceCard
**Arquivo:** `/src/app/components/ServiceCard.tsx`
**Props:**
- `name: string` - Nome do serviço
- `icon: LucideIcon` - Ícone do serviço
- `color: string` - Cor de fundo (hex)

### 6. BottomNav
**Arquivo:** `/src/app/components/BottomNav.tsx`
**Props:**
- `activeItem?: string` - Item ativo atual
- `onItemClick?: (id: string) => void` - Callback de navegação

**Itens:**
- home - Home
- places - Locais
- events - Eventos
- community - Comunidade
- profile - Perfil

### 7. Badge
**Arquivo:** `/src/app/components/Badge.tsx`
**Props:**
- `children: ReactNode` - Conteúdo do badge
- `variant?: 'primary' | 'secondary' | 'accent'` - Estilo

### 8. DateBadge
**Arquivo:** `/src/app/components/DateBadge.tsx`
**Props:**
- `date: string` - Data formatada

### 9. Rating
**Arquivo:** `/src/app/components/Rating.tsx`
**Props:**
- `rating: number` - Nota (0-5)
- `reviewCount: number` - Número de avaliações

## Diretrizes de Design

### Tom Visual
- ✅ Acolhedor, humano e contemporâneo
- ✅ Feminino plural (não estereotipado)
- ✅ Sensação de cuidado e segurança
- ❌ Evitar estética corporativa fria

### Padrões de Interação
- Hover: `hover:shadow-md transition-shadow`
- Botões: `hover:scale-105 transition-transform`
- Estados ativos: cor `primary` com `font-semibold`

### Mobile-First
- Largura base: 390px (iPhone padrão)
- Container principal: `max-w-md mx-auto`
- Bottom nav fixo: `fixed bottom-0 left-0 right-0`
- Conteúdo com padding bottom: `pb-20` (para não ficar atrás do nav)

## Estrutura de Dados

### Lugar (Place)
```typescript
{
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance: string;
  imageUrl: string;
  isSafe: boolean;
}
```

### Evento (Event)
```typescript
{
  id: string;
  name: string;
  date: string;        // formato: "15 Dez"
  time: string;        // formato: "19:00"
  location: string;
  participants: number;
  imageUrl: string;
}
```

### Serviço (Service)
```typescript
{
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;       // hex color
}
```

## Como Usar no Cursor

### Para criar novos componentes:
```
Crie um novo componente seguindo o design system da Amooora:
- Use as cores: primary (#7B3FF2), secondary (#932d6f), accent (#FF6B7A)
- Use Tailwind CSS v4
- Siga o padrão mobile-first (max-w-md)
- Use os componentes existentes: Badge, Rating, DateBadge quando aplicável
- Importe ícones de 'lucide-react'
- Use ImageWithFallback para imagens
```

### Para adicionar novas telas:
```
Crie uma nova tela seguindo o layout da Home:
- Header no topo
- Conteúdo scrollável com padding bottom (pb-20)
- BottomNav fixo
- Container max-w-md mx-auto
- Background bg-muted
```

### Para modificar estilos:
```
Mantenha consistência com o design system:
- Cores definidas em /src/styles/theme.css
- Não use classes de font-size, font-weight ou line-height do Tailwind
- Use as variantes de components quando possível
- Mantenha o raio de borda consistente (rounded-xl para cards)
```

## Próximos Passos Sugeridos

1. **Telas adicionais:**
   - Tela de detalhes de lugar
   - Tela de detalhes de evento
   - Tela de listagem completa (Locais, Eventos, Serviços)
   - Tela de perfil
   - Tela de comunidade

2. **Funcionalidades:**
   - Sistema de filtros
   - Busca
   - Favoritos
   - Mapa de lugares
   - Sistema de autenticação

3. **Melhorias:**
   - Skeleton loaders
   - Estados vazios
   - Tratamento de erros
   - Animações com Motion/React
   - Gestos (swipe, pull to refresh)

4. **Backend (Supabase):**
   - Autenticação de usuárias
   - CRUD de lugares, eventos, serviços
   - Sistema de reviews
   - Sistema de participação em eventos
   - Chat/comunidade

## Regras Importantes

1. ⚠️ **NUNCA** modifique `/src/app/components/figma/ImageWithFallback.tsx`
2. ✅ Use `ImageWithFallback` para todas as imagens
3. ✅ Importe fontes apenas em `/src/styles/fonts.css`
4. ✅ Mantenha componentes pequenos e reutilizáveis
5. ✅ Use TypeScript com tipos explícitos
6. ✅ Siga os padrões de nomenclatura existentes

## Exemplo de Prompt para Cursor

> "Seguindo o design system da Amooora (cores primary #7B3FF2, secondary #932d6f, accent #FF6B7A), crie uma tela de detalhes de lugar que:
> - Mostre imagem grande no topo"

---

**Data de criação:** Janeiro 2026  
**Versão:** 1.0  
**Última atualização:** Tela Home completa com todos os componentes