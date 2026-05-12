# Prompt — Design System Amooora (Claude Code)

Cole o bloco abaixo no **Claude Code** (ou outro assistente) quando quiser implementar ou reproduzir o app com **fidelidade às configurações de estilo do repositório**.

**Fonte de verdade no código:** `src/styles/theme.css`, `src/styles/tailwind.css`, `src/styles/index.css`, `src/app/components/ui/*`.

---

## Copiar a partir daqui (prompt)

```
You are implementing the **Amooora** design system and UI. Follow these rules exactly so the result matches the existing Vite + React + Tailwind CSS v4 codebase.

## Stack (do not substitute)
- **Styling:** Tailwind CSS v4 with `@import 'tailwindcss'` and `@theme inline` tokens wired to CSS variables in `:root`.
- **Components:** shadcn-style primitives (Radix + `class-variance-authority`), paths like `src/app/components/ui/`.
- **Icons:** Lucide React (`lucide-react`), stroke icons, typically 20px (`w-5 h-5`) in chrome; active nav can use strokeWidth 2.5 vs 2.
- **Copy:** Brazilian Portuguese (pt-BR) for user-facing strings.
- **Default theme:** Light mode is the product default; `.dark` exists with alternate tokens — only use if explicitly building dark mode.

## CSS variables — LIGHT (`:root`) — use these exact values

These are the **Amooora official** brand tokens (from `theme.css`):

| Token | Value | Role |
|-------|--------|------|
| `--font-size` | `16px` | Root `html` font size |
| `--background` | `#ffffff` | Main surface |
| `--foreground` | `oklch(0.145 0 0)` | Primary text (~near black) |
| `--primary` | `#932d6f` | Brand magenta/purple — main CTAs, links, primary actions |
| `--primary-foreground` | `#ffffff` | Text/icons on primary |
| `--secondary` | `#dca0c8` | Soft pink — secondary surfaces; **bottom nav active** state |
| `--secondary-foreground` | `#ffffff` | Text on secondary |
| `--accent` | `#c4532f` | Orange accent (e.g. profile shortcut in header) |
| `--accent-foreground` | `#ffffff` | Text on accent |
| `--tertiary` | `#3a184f` | Deep purple — brand support (use where tertiary is needed) |
| `--tertiary-foreground` | `#ffffff` | Text on tertiary |
| `--muted` | `#F5F3F7` | Page backdrop / soft sections |
| `--muted-foreground` | `#717182` | Secondary text, inactive nav labels |
| `--destructive` | `#d4183d` | Errors, destructive actions |
| `--destructive-foreground` | `#ffffff` | Text on destructive |
| `--border` | `rgba(0, 0, 0, 0.1)` | Dividers, card borders |
| `--input` | `transparent` | Input border color token |
| `--input-background` | `#f3f3f5` | Input fill |
| `--switch-background` | `#cbced4` | Switch track |
| `--ring` | `oklch(0.708 0 0)` | Focus ring base |
| `--font-weight-normal` | `400` | Body / inputs |
| `--font-weight-medium` | `500` | Headings, labels, buttons |
| `--radius` | `0.75rem` | Base radius (12px) |

**Tailwind `@theme inline` maps** `--color-primary`, `--color-secondary`, … to these variables — use semantic classes: `bg-primary`, `text-muted-foreground`, `border-border`, etc.

**Radius scale (from theme):**
- `--radius-sm` = `calc(var(--radius) - 4px)`
- `--radius-md` = `calc(var(--radius) - 2px)`
- `--radius-lg` = `var(--radius)` (12px)
- `--radius-xl` = `calc(var(--radius) + 4px)`

Charts / sidebar: `--chart-1` … `--chart-5` and `--sidebar-*` exist for dashboards; use as in `theme.css` if building admin/analytics.

## Typography (global base — from `@layer base` in `theme.css`)
- `html { font-size: var(--font-size); }` → **16px base**.
- **h1:** `text-2xl` (via `--text-2xl`), **font-weight medium**, line-height **1.5**
- **h2:** `text-xl`, medium, 1.5
- **h3:** `text-lg`, medium, 1.5
- **h4:** `text-base`, medium, 1.5
- **label:** `text-base`, medium, 1.5
- **button (native):** `text-base`, medium, 1.5
- **input:** `text-base`, normal (400), 1.5
- **No custom `@font-face` in repo** (`fonts.css` may be empty) — use **system UI stack** or **Inter** as fallback in design tools.

## Global chrome
- **`*`:** `border-border`, `outline-ring/50`
- **body:** `bg-background text-foreground`

## Layout (app shell — mobile-first)
- Outer page background: **`bg-muted`** (`#F5F3F7`).
- Main column: **`max-w-md` (~448px)** centered, **`bg-white`**, **`min-h-screen`**, **`shadow-xl`**, vertical flex as needed.
- Horizontal padding: typically **`px-5`** (20px) in main content.
- Section spacing: often **`space-y-8`** or **`mb-8`** between blocks.
- **Bottom navigation** (when present): fixed bottom, `bg-white`, `border-t border-border`, `shadow-lg`, `z-50`; items in a row with `max-w-md mx-auto`; **active** tab uses **`text-secondary`** + **`font-semibold`** for label and icon; **inactive** uses **`text-muted-foreground`** + **`font-medium`**.
- **Header** (when present): fixed top, `z-50`, `bg-white`, `border-b border-gray-100`, `max-w-md mx-auto`; logo height ~**70px**; circular icon buttons (e.g. notifications **`bg-primary`** + white icon; profile **`bg-[#c4532f]`** or `accent`; menu **`bg-primary/10`**, icon **`text-primary`**); notification badge: red pill ~`bg-red-500`, small white text.

## Button component (must match `button.tsx` CVA)
Base classes include: `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:pointer-events-none`, focus: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`.

**Variants:**
- **default:** `bg-primary text-primary-foreground hover:bg-primary/90`
- **destructive:** `bg-destructive text-white hover:bg-destructive/90` (+ destructive focus ring rules for dark)
- **outline:** `border bg-background text-foreground hover:bg-accent hover:text-accent-foreground` (+ dark input tweaks)
- **secondary:** `bg-secondary text-secondary-foreground hover:bg-secondary/80`
- **ghost:** `hover:bg-accent hover:text-accent-foreground`
- **link:** `text-primary underline-offset-4 hover:underline`

**Sizes:** default `h-9 px-4 py-2`; sm `h-8`; lg `h-10 px-6`; icon `size-9 rounded-md`.

Marketing/auth flows often use **full-width** buttons with **`rounded-full`** — keep that pattern where the existing screens use it.

## Badge (`badge.tsx`)
- Base: `inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium …`
- **default:** `border-transparent bg-primary text-primary-foreground`
- **secondary:** `border-transparent bg-secondary text-secondary-foreground`
- **destructive:** `border-transparent bg-destructive text-white`
- **outline:** `text-foreground` + hover via accent

## Input (`input.tsx`)
- Height **`h-9`**, **`rounded-md`**, **`border`**, **`px-3`**, **`text-base`** (`md:text-sm` at md breakpoint), **`bg-input-background`**, placeholder **`text-muted-foreground`**, focus **`focus-visible:ring-[3px]`** with ring token, selection **`bg-primary text-primary-foreground`**.

## Card (`card.tsx`)
- **`bg-card text-card-foreground`**, **`rounded-xl`**, **`border`**, inner gap **`gap-6`**; header uses padding patterns with `px-6 pt-6` as in component.

## Motion / animation
- `@keyframes loading` in `theme.css`: width **0% → 100%** (used for splash/progress contexts).

## Dark mode (`.dark`)
- If implementing dark UI, **mirror** the variable overrides in `.dark { … }` from `theme.css` exactly — do not invent new hex values for primary/secondary in dark mode; the file uses **oklch** for dark surfaces.

## Do NOT
- Do not replace brand hex `#932d6f`, `#dca0c8`, `#c4532f`, `#3a184f` with different purple/pink/orange for “aesthetic” reasons.
- Do not drop the **max-w-md** mobile column for main consumer screens unless building a dedicated desktop layout spec.
- Do not use a different icon family than Lucide for app chrome.

## Deliverable expectation
When generating code or Figma specs, **map every color** to the tokens above, **every radius** to `--radius` scale, and **reuse** the Button/Input/Badge behavior verbatim. Layout blocks should read like the Home shell: muted outer → white constrained column → fixed header / optional fixed bottom nav.
```

---

## Referência rápida no repositório

| Conteúdo | Arquivo |
|----------|---------|
| Tokens e tipografia base | `src/styles/theme.css` |
| Tailwind + utilitários | `src/styles/tailwind.css` |
| Botão | `src/app/components/ui/button.tsx` |
| Input | `src/app/components/ui/input.tsx` |
| Badge | `src/app/components/ui/badge.tsx` |
| Card | `src/app/components/ui/card.tsx` |

Para telas e fluxos completos, combine com **`MD/FIGMA_DESIGN_PROMPT.md`**.
