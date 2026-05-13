# Checklist — Vulnerabilidades e melhorias Amooora

Referência: [relatorio-vulnerabilidades-amooora.md](./relatorio-vulnerabilidades-amooora.md)  
Última atualização do checklist: 13/05/2026

Legenda: ✅ feito (código/repo) | ⏳ pendente (Supabase/infra/arquitetura) | 🔍 validar em produção após deploy

---

## Prioridade 1 — Segurança (sem painel Supabase)

| # | Item | Status | Notas |
|---|------|--------|--------|
| 2 | Cabeçalhos HTTP (CSP, HSTS, X-Frame-Options, etc.) | ✅ | `vercel.json` — após deploy, validar com [securityheaders.com](https://securityheaders.com) ou DevTools. Se algo quebrar (novo CDN/script), ajustar `Content-Security-Policy`. |
| — | Logs que vazavam contexto (Maps/Supabase init) | ✅ | `InteractiveMap.tsx` sem preview de chave; `supabase.ts` sem logs em produção. |
| — | Preferências de filtro em dispositivo compartilhado | ✅ | `useFilterPreferences` migrado para `sessionStorage` + migração automática de legado no `localStorage`; limpeza da chave no logout em `Header.tsx`. |

## Prioridade 2 — SEO / HTML base

| # | Item | Status | Notas |
|---|------|--------|--------|
| 4 | `lang="pt-BR"` | ✅ | `index.html` |
| 7–8 | Favicon, apple-touch, meta description, canonical, OG, Twitter | ✅ | `index.html` + `public/favicon.png`, `apple-touch-icon.png`, `og-image.png` (cópia do logo; substituir por arte OG 1200×630 quando existir). |
| 9 | `<h1>` na home | ✅ | `Home.tsx` — título em `sr-only` |
| 11 | Eventos passados em listagens | ✅ | `useEvents({ filterPast: true })` na home, eventos, mapa, busca global, aba eventos em Busca; **favoritos / perfil** mantêm `useEvents()` sem filtro para ainda resolver eventos favoritos passados. |

## Prioridade 3 — Acessibilidade (incremental)

| # | Item | Status | Notas |
|---|------|--------|--------|
| 6 | Botões do header (`type`, `aria-label`) | ✅ | `shared/components/Header.tsx` |
| 6 | Botão favorito em `EventCard` | ✅ | `type="button"` |
| 5 | Demais imagens / ícones sem `alt` | 🔍 | Revisar outros componentes conforme uso (relatório citava pins do mapa — marcadores Google usam API; cards já usam `ImageWithFallback` com `alt`). |
| 10 | Lazy loading | ✅ | Já presente em `ImageWithFallback` compartilhado; hero pode usar `loading="eager"` no futuro se LCP exigir. |

---

## Pendente — exige Supabase, Vercel ou decisão de produto

| # | Item | Responsável |
|---|------|-------------|
| 1 | Sessão fora do `localStorage` (cookies HttpOnly / SSR auth) | Arquitetura + Supabase — ver [SUPABASE_RLS_APLICACAO.md](./SUPABASE_RLS_APLICACAO.md) secção 4 |
| 3 | RLS e auditoria de policies | **Passo 1:** executar [`SQL/SQL_RLS_SEGURANCA_AMOOORA_2026.sql`](../SQL/SQL_RLS_SEGURANCA_AMOOORA_2026.sql) no Supabase (guia [SUPABASE_RLS_APLICACAO.md](./SUPABASE_RLS_APLICACAO.md)). **Passo 2:** auditar tabelas restantes (comunidades/posts/amigos, etc.). |
| 12 | “Ofuscar” nome da chave no storage | Baixo valor — não priorizar |
| 13 | Service Worker cache de auth | Não há PWA no `vite.config` atual; revisitar se ativar SW |
| — | Pentest / revisão CSP em modo report-only | Operações / segurança |

---

## Validação da CSP **sem** deploy no Git (local)

1. Na raiz do projeto: `npm run preview:csp` (equivale a `vite build && vite preview`).  
2. Abrir `http://localhost:4173` (porta em `vite.config.ts` → `preview.port`).  
3. DevTools → **Console**: procurar mensagens `Content Security Policy` / `violates the following Content Security Policy`.  
4. DevTools → **Rede** → documento `index.html` → cabeçalhos de resposta: confirmar `Content-Security-Policy` e demais headers de segurança. Se aparecer **304 Not Modified**, marque **“Desativar cache”** na barra da aba Rede, recarregue (**Cmd+Shift+R** / **Ctrl+Shift+R**): com **200**, os cabeçalhos de resposta costumam listar a CSP completa.  
5. Ao alterar a política, manter **a mesma string** em [`vercel.json`](../vercel.json) e em [`vite.security-headers.mjs`](../vite.security-headers.mjs).

**Nota:** `vite dev` **não** aplica esta CSP (o HMR do Vite precisaria de diretivas extras). Para testar CSP, use sempre `preview:csp`.

---

## Validação pós-deploy na Vercel (rápido)

1. Abrir o site: mapa carrega, login Supabase funciona, imagens externas (Unsplash, storage) aparecem.  
2. Se o console mostrar **violação de CSP**, anotar o host bloqueado e acrescentar em `connect-src` / `img-src` / `script-src` no `vercel.json` **e** em `vite.security-headers.mjs`.  
3. Testar logout: filtros do mapa não devem persistir após nova sessão no mesmo browser (sessionStorage).  
4. Compartilhar URL em app de mensagens: preview OG deve aparecer.

---

## Melhorias futuras (código)

- Arte dedicada `og-image.png` (1200×630), texto legível.  
- Reduzir `console.log` em `App.tsx` (navegação) em produção.  
- Alinhar `components/figma/ImageWithFallback.tsx` duplicado ao compartilhado ou remover duplicata.
