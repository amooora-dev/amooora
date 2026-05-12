# Design System e Orientações Visuais

**Última atualização:** Maio 2026  
**Projeto:** Amooora — Plataforma LGBTQIA+ brasileira

---

## Identidade Visual

**Mood:** Acolhedor, seguro, inclusivo — UI moderna com tons de roxo/rosa, superfícies brancas limpas, hierarquia visual clara.

**Público-alvo:** Comunidade LGBTQIA+ no Brasil.

**Idioma da UI:** Português brasileiro (pt-BR) para todos os textos voltados ao usuário.

---

## Paleta de Cores

### Cores da Marca (Light Mode — Padrão)

| Token CSS | Hex / Valor | Nome | Uso |
|---|---|---|---|
| `--primary` | `#932d6f` | Magenta/Roxo | CTAs principais, links, botões primários, ícone do menu |
| `--primary-foreground` | `#ffffff` | Branco | Texto/ícones sobre primary |
| `--secondary` | `#dca0c8` | Rosa Claro | Superfícies secundárias, **BottomNav ativo** |
| `--secondary-foreground` | `#ffffff` | Branco | Texto sobre secondary |
| `--accent` | `#c4532f` | Laranja | Botão de perfil no header |
| `--accent-foreground` | `#ffffff` | Branco | Ícones sobre accent |
| `--tertiary` | `#3a184f` | Roxo Escuro | Suporte de marca |
| `--tertiary-foreground` | `#ffffff` | Branco | Texto sobre tertiary |

### Cores de Sistema

| Token CSS | Valor | Uso |
|---|---|---|
| `--background` | `#ffffff` | Superfície principal |
| `--foreground` | `oklch(0.145 0 0)` (~preto) | Texto principal |
| `--muted` | `#F5F3F7` | Fundo da página, seções suaves |
| `--muted-foreground` | `#717182` | Texto secundário, nav inativo |
| `--destructive` | `#d4183d` | Erros, ações destrutivas |
| `--destructive-foreground` | `#ffffff` | Texto sobre destructive |
| `--border` | `rgba(0, 0, 0, 0.1)` | Divisores, bordas de cards |
| `--input-background` | `#f3f3f5` | Fundo de inputs |
| `--switch-background` | `#cbced4` | Track de switches |
| `--ring` | `oklch(0.708 0 0)` | Focus ring |

### Cores de Gráficos (Admin/Analytics)

`--chart-1` a `--chart-5` — valores oklch definidos em `theme.css`.

### Dark Mode

Dark mode existe com tokens em `.dark { ... }` no `theme.css`, usando valores **oklch**. O tema padrão do produto é **light mode**.

---

## Tipografia

### Fonte

Nenhuma webfont customizada é definida no repositório (`fonts.css` está vazio). Usar **fonte do sistema** (system UI stack) ou **Inter** como fallback em ferramentas de design.

### Escala Tipográfica

| Elemento | Tamanho | Peso | Line-height |
|---|---|---|---|
| `html` (base) | 16px (`--font-size`) | — | — |
| `h1` | `text-2xl` (~24px) | medium (500) | 1.5 |
| `h2` | `text-xl` (~20px) | medium (500) | 1.5 |
| `h3` | `text-lg` (~18px) | medium (500) | 1.5 |
| `h4` | `text-base` (16px) | medium (500) | 1.5 |
| `label` | `text-base` (16px) | medium (500) | 1.5 |
| `button` (nativo) | `text-base` (16px) | medium (500) | 1.5 |
| `input` | `text-base` (16px) | normal (400) | 1.5 |
| Body text | `text-sm` a `text-base` | normal (400) | 1.5 |

---

## Escala de Radius (Cantos arredondados)

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | `calc(0.75rem - 4px)` = 8px | Botões pequenos, badges |
| `--radius-md` | `calc(0.75rem - 2px)` = 10px | Inputs, botões padrão |
| `--radius-lg` | `0.75rem` = 12px | Cards, containers |
| `--radius-xl` | `calc(0.75rem + 4px)` = 16px | Cards maiores |

Na prática, cards usam `rounded-xl` ou `rounded-2xl`, botões usam `rounded-md` ou `rounded-full`.

---

## Layout (App Shell — Mobile-first)

### Estrutura da Página

```
┌──────────────────── bg-muted (#F5F3F7) ────────────────────┐
│                                                             │
│   ┌─────────── max-w-md (~448px) bg-white shadow-xl ─────┐ │
│   │  ┌─── Header (fixed top, z-50, bg-white) ──────────┐ │ │
│   │  │  [← Back]  [Logo 70px]  [🔔] [👤] [☰]          │ │ │
│   │  └──────────────────────────────────────────────────┘ │ │
│   │                                                       │ │
│   │  ┌─── Main content (scrollable, px-5, pb-24) ──────┐ │ │
│   │  │                                                   │ │ │
│   │  │  Conteúdo da tela                                 │ │ │
│   │  │  (space-y-8 entre seções)                         │ │ │
│   │  │                                                   │ │ │
│   │  └───────────────────────────────────────────────────┘ │ │
│   │                                                       │ │
│   │  ┌─── BottomNav (fixed bottom, z-50, bg-white) ────┐ │ │
│   │  │  Home | Locais | Serviços | Eventos | Comunidade │ │ │
│   │  └──────────────────────────────────────────────────┘ │ │
│   └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Especificações

- **Fundo externo:** `bg-muted` (`#F5F3F7`)
- **Coluna principal:** `max-w-md` (~448px), `bg-white`, `min-h-screen`, `shadow-xl`, centrado
- **Padding horizontal:** `px-5` (20px)
- **Espaçamento entre seções:** `space-y-8` ou `mb-8`
- **Padding inferior:** `pb-24` (para limpar o BottomNav)

---

## Componentes Visuais

### Header

- **Posição:** fixo no topo, `z-50`
- **Fundo:** `bg-white`, borda inferior `border-gray-100`
- **Largura:** `max-w-md mx-auto`
- **Logo:** altura ~70px
- **Botões circulares:**
  - Notificações: `bg-primary` (#932d6f), ícone `Bell` branco, badge vermelho
  - Perfil: `bg-accent` (#c4532f), ícone `UserPen` branco
  - Menu: `bg-primary/10`, ícone `Menu`/`X` em `text-primary`
- **Botão voltar:** `bg-gray-100`, ícone `ArrowLeft` cinza
- **Menu dropdown:** `bg-white`, `rounded-2xl`, `shadow-lg`, separador antes de "Sair" (vermelho)

### Bottom Navigation

- **Posição:** fixo embaixo, `z-50`
- **Fundo:** `bg-white`, `border-t border-border`, `shadow-lg`
- **5 itens:** Home, Locais, Serviços, Eventos, Comunidade
- **Ativo:** ícone + label em `text-secondary` (#dca0c8), `font-semibold`, `strokeWidth: 2.5`
- **Inativo:** ícone + label em `text-muted-foreground` (#717182), `font-medium`, `strokeWidth: 2`
- **Tamanho do ícone:** `w-5 h-5` (20px)
- **Label:** `text-xs`

### Button (CVA variants)

| Variante | Classes |
|---|---|
| **default** | `bg-primary text-primary-foreground hover:bg-primary/90` |
| **destructive** | `bg-destructive text-white hover:bg-destructive/90` |
| **outline** | `border bg-background text-foreground hover:bg-accent hover:text-accent-foreground` |
| **secondary** | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| **ghost** | `hover:bg-accent hover:text-accent-foreground` |
| **link** | `text-primary underline-offset-4 hover:underline` |

| Tamanho | Classes |
|---|---|
| **default** | `h-9 px-4 py-2` |
| **sm** | `h-8 rounded-md gap-1.5 px-3` |
| **lg** | `h-10 rounded-md px-6` |
| **icon** | `size-9 rounded-md` |

CTAs de marketing/auth: `w-full rounded-full` (botão largo arredondado).

### Card

- `bg-card text-card-foreground`
- `rounded-xl`, `border`
- Gap interno: `gap-6`
- Padding header: `px-6 pt-6`

### Input

- Altura: `h-9`
- `rounded-md`, `border`, `px-3`
- `bg-input-background` (#f3f3f5)
- Placeholder: `text-muted-foreground`
- Focus: `focus-visible:ring-[3px]`
- Seleção: `bg-primary text-primary-foreground`

### Badge

- `inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium`
- **default:** `bg-primary text-primary-foreground`
- **secondary:** `bg-secondary text-secondary-foreground`
- **destructive:** `bg-destructive text-white`
- **outline:** `text-foreground`

### Toast (Sonner)

- Posição: `top-center`
- `richColors` habilitado
- Mensagens em PT-BR

---

## Ícones

- **Biblioteca:** Lucide React (`lucide-react`)
- **Estilo:** Outline (stroke)
- **Tamanho padrão:** `w-5 h-5` (20px) no chrome do app
- **StrokeWidth:** 2 (normal), 2.5 (ativo/enfatizado)

### Ícones do BottomNav

| Tab | Ícone |
|---|---|
| Home | `Home` |
| Locais | `MapPin` |
| Serviços | `Scissors` |
| Eventos | `Calendar` |
| Comunidade | `Users` |

### Ícones do Header/Menu

`Bell`, `UserPen`, `Menu`, `X`, `ArrowLeft`, `Heart`, `Search`, `Settings`, `Home`, `MapPin`, `Calendar`, `Scissors`, `MessageSquare`, `Info`, `Map`, `LogOut`

---

## Animações

### Loading/Splash

```css
@keyframes loading {
  from { width: 0%; }
  to { width: 100%; }
}
```

### Transições

- Botões: `transition-colors` ou `transition-all`
- Motion (Framer Motion): disponível via pacote `motion` para animações mais complexas

### Utilitários

- `.scrollbar-hide` — esconde scrollbar em todos os browsers

---

## Estilos Globais

```css
* { border-color: var(--border); outline-color: oklch(0.708 0 0 / 0.5); }
body { background: var(--background); color: var(--foreground); }
```

---

## Tailwind CSS v4

### Configuração

- Import: `@import 'tailwindcss' source(none)`
- Source: `@source '../**/*.{js,ts,jsx,tsx}'`
- Animações: `tw-animate-css`
- Plugin Vite: `@tailwindcss/vite`

### Tokens mapeados via `@theme inline`

Todos os tokens CSS são mapeados para classes Tailwind:
- `bg-primary` → `var(--primary)`
- `text-muted-foreground` → `var(--muted-foreground)`
- `border-border` → `var(--border)`
- `rounded-lg` → `var(--radius)`
- etc.

### Utilitário customizado

```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
```

---

## Arquivos de Referência

| Conteúdo | Arquivo |
|---|---|
| Tokens de cor, tipografia, animações | `src/styles/theme.css` |
| Config Tailwind + utilitários | `src/styles/tailwind.css` |
| Entry point CSS | `src/styles/index.css` |
| Fontes (vazio) | `src/styles/fonts.css` |
| Botão (CVA) | `src/app/components/ui/button.tsx` |
| Input | `src/app/components/ui/input.tsx` |
| Badge | `src/app/components/ui/badge.tsx` |
| Card | `src/app/components/ui/card.tsx` |
| Header | `src/app/shared/components/Header.tsx` |
| BottomNav | `src/app/shared/components/BottomNav.tsx` |
| Layout shell | `src/app/layouts/AppLayout.tsx` |

---

## Regras para Implementação

1. **Nunca substituir** os hexadecimais da marca (`#932d6f`, `#dca0c8`, `#c4532f`, `#3a184f`) por cores "esteticamente similares"
2. **Manter** a coluna `max-w-md` para telas de consumo — não expandir para largura total sem spec dedicada de desktop
3. **Usar exclusivamente** Lucide React para ícones do app
4. **Mapear todas as cores** para tokens do `theme.css`, nunca hardcodar hexadecimais nos componentes
5. **Radius** sempre via escala `--radius-*`, não valores arbitrários
6. **Reutilizar** Button/Input/Badge/Card do shadcn existente — não criar componentes duplicados
7. **Manter** padrão shadcn: Radix UI + CVA + `cn()` helper

---

## Para Figma / Ferramentas de Design

### Frames

- Tamanho base: **375 x 812** (mobile standard)
- Coluna de conteúdo: ~375px (dentro do frame)

### Styles a criar

- **Color styles:** Primary, Secondary, Accent, Tertiary, Background, Muted, Foreground, etc.
- **Text styles:** Title (h1), Heading (h2), Subheading (h3), Body, Caption, Button, Input
- **Efeitos:** Shadow XL (para coluna principal)

### Componentes a criar

Header (com/sem back), BottomNav, SearchField, Button (todas as variantes), Input, Card, Badge/Tag, Avatar, List row, Form field, Modal, Toast

### Consistência

- Mesma largura de coluna em todas as telas
- Mesmo Header e BottomNav onde o app os utiliza
- Ritmo vertical generoso
- Alvos de toque acessíveis (~44px mínimo)

---

## Prompt para Assistentes de Design

Para gerar telas fiéis ao Amooora, consulte os prompts completos em:
- `MD/DESIGN_SYSTEM_PROMPT.md` — Prompt técnico do design system
- `MD/FIGMA_DESIGN_PROMPT.md` — Prompt para criação de telas no Figma

---

## Possíveis Melhorias / Trade-offs

- **Fonte customizada:** Definir uma webfont oficial (Inter, Plus Jakarta Sans, ou similar)
- **Dark mode refinado:** Os tokens dark existem mas não são otimizados para a marca — ajustar primary/secondary para dark
- **Design tokens:** Exportar tokens em formato JSON (Style Dictionary) para sincronizar código ↔ Figma
- **Spacing scale:** Formalizar uma escala de espaçamento consistente (4px grid)
- **Acessibilidade:** Verificar contraste WCAG 2.1 AA para todas as combinações cor-de-fundo/texto
- **Responsive:** Definir breakpoints e comportamento para tablet/desktop além do mobile
