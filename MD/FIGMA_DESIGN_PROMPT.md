# Prompt Figma — Amooora (telas, componentes, cores, tipografia)

Documento para uso em ferramentas de design (Figma) ou com assistentes (ex.: Claude) para gerar telas alinhadas ao app web **Amooora**.

---

## Instrução principal (copiar para o prompt)

```
You are designing a mobile-first web app called **Amooora** — a Brazilian LGBTQIA+ community platform for safe places, services, events, and communities.

### Product & UX principles
- **Mobile-first**: single column, max content width ~448px (max-w-md), centered on larger screens with subtle shadow on the main column (`shadow-xl`).
- **App shell**: most screens use a **fixed top header** + **scrollable main** + optional **fixed bottom tab bar** (5 tabs on main journeys).
- **Navigation**: state-based (not URL router for all flows); treat as a **single-page app** with many “screens.”
- **Language**: UI copy in **Brazilian Portuguese**.
- **Icon set**: Lucide-style outline icons (stroke ~2–2.5px), consistent sizing (often 20–24px in header).

---

### Design tokens — colors (light mode is primary)
Use these as the official palette (from `theme.css`):

| Token | Hex / value | Usage |
|-------|-------------|--------|
| **Primary** | `#932d6f` | Brand magenta/purple — primary buttons, active accents, key CTAs, hamburger icon, links |
| **Primary foreground** | `#ffffff` | Text/icons on primary |
| **Secondary** | `#dca0c8` | Soft pink — **bottom nav active** icon + label |
| **Secondary foreground** | `#ffffff` | Text on secondary surfaces |
| **Accent** | `#c4532f` | Orange — profile shortcut button in header (circle) |
| **Accent foreground** | `#ffffff` | Icons on accent |
| **Tertiary** | `#3a184f` | Deep purple — supporting brand tone |
| **Background** | `#ffffff` | Main screen surface inside the column |
| **Page backdrop** | `#F5F3F7` (`muted`) | Outer background behind the white column |
| **Foreground** | near black `oklch(0.145 0 0)` | Primary text |
| **Muted foreground** | `#717182` | Secondary text, inactive nav |
| **Muted** | `#F5F3F7` | Soft sections |
| **Border** | `rgba(0,0,0,0.1)` | Dividers, cards |
| **Input background** | `#f3f3f5` | Form fields |
| **Destructive** | `#d4183d` | Errors, logout emphasis in menu |
| **Notification badge** | `#ef4444` (red-500 style) | Unread count pill on bell |

**Header specifics**: white bar, bottom border `gray-100`, circular icon buttons: primary purple (notifications), orange (profile), light `primary/10` (menu).

**Radius**: base `--radius: 0.75rem` (12px); cards often `rounded-xl` / `rounded-2xl`.

---

### Typography
- **Base font size**: 16px on `html`.
- **Weights**: normal 400 for body inputs; **medium 500** for headings (h1–h4), labels, and buttons (per global base styles).
- **Scale** (Tailwind semantic): h1 ≈ text-2xl, h2 ≈ text-xl, h3 ≈ text-lg, h4 ≈ text-base — all medium weight, line-height ~1.5.
- **No custom webfont file** is defined in the repo; use a clean **system UI stack** or **Inter** as stand-in for Figma.

---

### Core layout components

1. **Header (fixed top)**
   - Height ~ accommodates logo **~70px** tall.
   - Left: optional **back** in gray circle (`bg-gray-100`, arrow).
   - Center: **Amooora logo** (tap → home).
   - Right cluster: **Notifications** (purple circle, white bell, red badge if unread), **Profile** (orange circle, white user-edit icon), **Menu** (light purple circle, menu/x).
   - **Dropdown menu**: white panel, `rounded-2xl`, shadow, items with icon + label; separator before **Sair** (red hover).

2. **Bottom navigation (fixed bottom)**
   - White, top border, shadow, `z-50`.
   - Five items: **Home, Locais, Serviços, Eventos, Comunidade** (Users icon).
   - **Active**: secondary pink (`#dca0c8`) icon + label semibold; **inactive**: muted gray.

3. **Main content**
   - Horizontal padding ~`px-5` (20px), vertical spacing between sections (`space-y-8`).
   - Bottom padding ~`pb-24` to clear bottom nav when present.

4. **Search trigger (home)**
   - Full-width row: light gray background, rounded-xl, border gray-100, search icon left, placeholder “Buscar locais, eventos e serviços...”

5. **Cards**
   - **Place / Event / Service cards**: image-led, rounded corners, badges/tags, titles, meta (location, date).
   - **Community**: post cards, stats, rules card, carousels.
   - **shadcn-style Card**: white, `rounded-xl`, border, optional header/content.

6. **Buttons (UI kit)**
   - Variants: primary (purple), secondary (pink), destructive, outline, ghost, link.
   - Primary CTA often **full width**, **rounded-full** on marketing/auth flows; medium font.

7. **Forms**
   - Inputs on light gray background; labels medium; validation errors in destructive red; password visibility toggle where needed.

8. **Modals**
   - Auth modal when tapping profile while logged out (login vs cadastro).
   - Toasts: top-center (Sonner, rich colors).

9. **Maps**
   - Full-screen or embedded **Google Maps** style blocks (pins for places/events).

10. **Chat (friends)**
    - Conversation thread + composer; message bubbles.

11. **Admin**
    - Denser lists, tables, forms for CRUD; still mobile column, may scroll long forms.

---

### Screen inventory (design each as a mobile frame)

**Onboarding & auth**
- Welcome / landing
- Login (email, senha, errors)
- Cadastro (sign-up)

**Main discovery**
- Home (search, map preview, highlights, sections for locais/eventos/serviços, category shortcuts)
- Locais (list + filters)
- Detalhe do local (PlaceDetails)
- Serviços (grid/list, categories)
- Lista por categoria (Terapia, Advocacia, Saúde, Carreira)
- Detalhe do serviço
- Eventos (list/calendar/map)
- Detalhe do evento
- Participantes do evento
- Mapa (full map)

**Comunidades**
- Todas as comunidades (hub)
- Comunidade (legacy/simple view if distinct)
- Detalhe da comunidade (feed, about, join)
- Minhas comunidades
- Detalhe do post
- Criar avaliação / review (CreateReview) — pode ser para local, serviço, evento ou comunidade

**Perfil & social**
- Perfil (usuário logado)
- Editar perfil
- Ver perfil de outro usuário (ViewProfile)
- Perfil profissional (ver / editar)
- Configurações
- Notificações
- Meus favoritos
- Minhas publicações
- Favoritos: locais / eventos / serviços (subtelas de perfil)
- Amigos (abas, ex.: solicitações)
- Busca de amigos
- Chat com amigo
- Busca global

**Institucional**
- Sobre Amooora
- Fale conosco

**Admin & moderação** (restricted roles — can use slightly more “dashboard” feel but same tokens)
- Painel Admin (hub)
- Cadastrar / editar: local, serviço, evento, comunidade
- Cadastrar usuário (admin geral)
- Gerenciar usuários
- Editar conteúdos / conteúdos desativados
- Curadoria de conteúdo

**Edge / system**
- Conta bloqueada/inativa (full-screen message + botão Sair)

---

### Deliverables in Figma
1. **Styles**: Color styles for tokens above; text styles (Title, H2, Body, Caption, Button).
2. **Components**: Header (variants: back / no back), BottomNav, SearchField, Primary/Secondary buttons, Card, Tag/Badge, Avatar, List row, Form field, Modal, Toast.
3. **Pages**: One artboard per major screen in the list; use **375×812** (or similar) as default mobile frame.
4. **Consistency**: Same column width, same header/bottom nav where the app uses them; generous vertical rhythm; accessible tap targets (~44px).

Design mood: **welcoming, safe, inclusive**, modern app UI — purple/pink warmth, white content, soft gray chrome, clear hierarchy, no clutter.
```

---

## Referência no código

| Recurso | Onde está |
|---------|-----------|
| Tokens de cor e tipografia base | `src/styles/theme.css` |
| Navegação / lista de telas | `src/app/App.tsx` |
| Bottom navigation | `src/app/shared/components/BottomNav.tsx` |
| Header | `src/app/shared/components/Header.tsx` |
| Home (layout exemplo) | `src/app/pages/Home.tsx` |

**Nota:** `src/styles/fonts.css` está vazio no repositório; no Figma, use **Inter** ou fonte do sistema até haver fonte web definida.

---

## PNGs das telas (para enviar com o prompt)

Foi adicionado um fluxo de **captura automática** em PNG (viewport tipo mobile, captura **full page**).

1. **Dependência:** `playwright` (dev). Na primeira vez, instale o Chromium do Playwright:  
   `npx playwright install chromium`  
2. **Gerar os arquivos:** na raiz do projeto, rode:  
   `npm run screenshots:export`  
3. **Saída:** pasta **`MD/screenshots-export/`** — um `.png` por tela (nome do arquivo = identificador da tela, ex.: `home.png`, `login.png`).

O script sobe o Vite em uma porta temporária e usa `?screen=...` **somente em desenvolvimento** (`src/app/dev/parseDevScreenParams.ts`) para abrir cada tela sem clicar na navegação.

**Observações:** telas que dependem de IDs reais (ex.: detalhe de um local) ou de **perfil admin** podem aparecer como “não encontrado” ou como a home, conforme o usuário e os dados no Supabase. Para uma captura com conteúdo real, você pode abrir manualmente no navegador e usar `?screen=place-details&placeId=<uuid>` (ou outros parâmetros documentados em `parseDevScreenParams.ts`).

---

*Última atualização: gerado a partir da estrutura do repositório Amooora.*
