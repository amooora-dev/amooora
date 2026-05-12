# 🔍 Relatório de Vulnerabilidades — Amooora
**URL:** https://amooora.vercel.app  
**Data da análise:** 12/05/2026  
**Severidade:** 🔴 Alta | 🟠 Média | 🟡 Baixa | 🔵 Informativo

---

## Sumário Executivo

O site Amooora é uma plataforma voltada à comunidade LGBTQIA+ (especialmente lésbicas/sáficas) que exibe locais seguros, eventos e serviços no mapa de São Paulo. A análise identificou vulnerabilidades nas categorias de **segurança**, **acessibilidade**, **SEO**, **privacidade** e **boas práticas de desenvolvimento**.

---

## 🔴 Vulnerabilidades de Alta Severidade

### 1. Token de Autenticação Supabase Exposto no `localStorage`

**Descrição:**  
O token de sessão do Supabase (`sb-btavwaysfjpsuqxdfguw-auth-token`) está armazenado diretamente no `localStorage` do navegador.

**Risco:**  
O `localStorage` é acessível por qualquer JavaScript rodando na página. Caso haja um ataque de **Cross-Site Scripting (XSS)**, o token pode ser roubado e utilizado para sequestrar a sessão do usuário autenticado.

**Sugestão:**  
- Migrar o armazenamento do token para **`HttpOnly Cookies`** (inacessíveis via JS).
- Implementar tokens de curta duração com refresh automático via backend.
- Habilitar proteção contra XSS rigorosa (ver item abaixo).

---

### 2. Ausência de Cabeçalhos HTTP de Segurança (Security Headers)

**Descrição:**  
A aplicação não retorna cabeçalhos HTTP de segurança essenciais.

**Cabeçalhos ausentes identificados:**

| Cabeçalho | Risco da Ausência |
|---|---|
| `Content-Security-Policy` (CSP) | Permite injeção de scripts maliciosos (XSS) |
| `X-Frame-Options` | Permite ataques de Clickjacking |
| `X-Content-Type-Options` | Permite MIME-type sniffing por browsers |
| `Referrer-Policy` | Dados de URL podem vazar para terceiros |
| `Permissions-Policy` | Câmera, microfone e geolocalização sem restrição declarada |
| `Strict-Transport-Security` (HSTS) | Ausência pode permitir downgrade para HTTP |

**Sugestão:**  
Configurar os cabeçalhos no servidor (Vercel) via `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' https://maps.googleapis.com; ..." }
      ]
    }
  ]
}
```

---

### 3. Chave de Projeto Supabase Visível na URL do `localStorage`

**Descrição:**  
A chave `sb-btavwaysfjpsuqxdfguw-auth-token` revela o **Project Reference ID** do Supabase (`btavwaysfjpsuqxdfguw`) diretamente no navegador do usuário.

**Risco:**  
Com esse ID, um atacante pode tentar acessar a API REST do Supabase diretamente e explorar endpoints públicos ou mal configurados.

**Sugestão:**  
- Garantir que as **Row Level Security (RLS) policies** estejam habilitadas em **todas** as tabelas do Supabase.
- Nunca expor a `service_role` key — usar apenas a `anon` key no frontend.
- Auditar as políticas RLS regularmente.

---

## 🟠 Vulnerabilidades de Média Severidade

### 4. Atributo `lang` da Página Incorreto

**Descrição:**  
O atributo `lang` do elemento `<html>` está definido como `"en"` (inglês), mas todo o conteúdo da página está em **português brasileiro**.

**Risco:**  
- Leitores de tela pronunciarão o conteúdo com fonética errada, prejudicando usuários com deficiência visual.
- Pode afetar negativamente o SEO para buscas em pt-BR.

**Sugestão:**  
```html
<html lang="pt-BR">
```

---

### 5. Imagens sem Atributo `alt` (Falha de Acessibilidade)

**Descrição:**  
Múltiplas imagens possuem o atributo `alt` vazio (`alt=""`) sem a devida marcação `role="presentation"`, sendo imagens com conteúdo semântico real (pins do mapa, thumbnails de locais/eventos/serviços).

**Exemplos identificados:**
- Todos os 7 pins do mapa (`map-pin-CSXVdd8d.PNG`) sem alt descritivo.
- Imagens de capa de eventos e serviços.

**Risco:**  
Usuários com deficiência visual que utilizam leitores de tela não conseguirão entender o contexto das imagens.

**Sugestão:**  
```html
<!-- Imagem com conteúdo -->
<img src="map-pin.PNG" alt="Marcador de local no mapa" />

<!-- Imagem puramente decorativa -->
<img src="decorativa.png" alt="" role="presentation" />
```

---

### 6. Botões sem `aria-label` e sem Texto Visível

**Descrição:**  
14 botões na página estão sem atributo `type` e vários não possuem `aria-label` nem texto visível (ex: botões do header — notificações, perfil e menu hambúrguer).

**Risco:**  
- Leitores de tela anunciarão apenas "botão" sem contexto.
- Sem `type="button"` explícito, botões podem ser interpretados como `type="submit"` pelo browser.

**Sugestão:**  
```html
<button type="button" aria-label="Abrir notificações">
  <svg .../>
</button>
```

---

### 7. Ausência de `favicon`

**Descrição:**  
Nenhum `favicon` foi encontrado na página (`link[rel*="icon"]` ausente).

**Risco:**  
- Experiência de usuário ruim em abas do browser e bookmarks.
- Em plataformas PWA (que o site suporta, dado o Service Worker ativo), o ícone é exibido na tela inicial do dispositivo — sua ausência causa um ícone genérico.

**Sugestão:**  
```html
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

---

## 🟡 Vulnerabilidades de Baixa Severidade / Boas Práticas

### 8. Ausência de Meta Tags Essenciais para SEO

**Descrição:**  
As seguintes meta tags estão completamente ausentes:

| Meta Tag | Status |
|---|---|
| `<meta name="description">` | ❌ Ausente |
| `<meta name="robots">` | ❌ Ausente |
| `<link rel="canonical">` | ❌ Ausente |
| Open Graph (`og:title`, `og:description`, `og:image`) | ❌ Ausente |
| Twitter Card | ❌ Ausente |

**Risco:**  
- O site não será bem ranqueado em buscadores.
- Ao compartilhar o link em redes sociais, nenhum preview será exibido — impacto direto no engajamento e crescimento orgânico.

**Sugestão:**  
```html
<meta name="description" content="Amooora — Descubra lugares seguros, eventos e serviços para a comunidade sáfica e LGBTQIA+ em São Paulo." />
<meta property="og:title" content="Amooora" />
<meta property="og:description" content="Encontre locais acolhedores, eventos incríveis e profissionais especializados para a comunidade sáfica." />
<meta property="og:image" content="https://amooora.vercel.app/og-image.png" />
<meta property="og:url" content="https://amooora.vercel.app/" />
<meta name="twitter:card" content="summary_large_image" />
```

---

### 9. Hierarquia de Headings Incorreta (Sem `<h1>`)

**Descrição:**  
A página não possui nenhum elemento `<h1>`. A hierarquia começa diretamente em `<h2>`.

**Risco:**  
- Prejudica fortemente o SEO.
- Dificulta a navegação por leitores de tela.

**Sugestão:**  
```html
<h1 class="sr-only">Amooora — Lugares e eventos sáficos em São Paulo</h1>
```

---

### 10. Imagens sem Lazy Loading

**Descrição:**  
As imagens de conteúdo utilizam `loading="auto"` ao invés de `loading="lazy"`.

**Risco:**  
Todas as imagens são carregadas simultaneamente, aumentando o tempo de carregamento (impacta métricas Core Web Vitals como LCP e FID).

**Sugestão:**  
```html
<img src="event-photo.jpg" alt="..." loading="lazy" />
```

---

### 11. Datas de Eventos Desatualizadas (Conteúdo Obsoleto)

**Descrição:**  
Eventos listados possuem datas antigas (30 jan, 13 fev) — já passadas no momento da análise (mai/2026).

**Risco:**  
- Perda de credibilidade da plataforma.
- Usuários podem tentar comparecer a eventos já realizados.

**Sugestão:**  
- Implementar filtragem automática para ocultar eventos com data passada.
- Exibir o **ano** junto à data para evitar ambiguidade.
- Implementar mecanismo de expiração automática de eventos.

---

### 12. Nome de Chave no localStorage Expõe Provider de Backend

**Descrição:**  
O padrão de nomenclatura `sb-[project-ref]-auth-token` revela que o backend utiliza Supabase.

**Sugestão:**  
Considerar ofuscação ou uso de prefixos customizados para dificultar o reconhecimento do provider de backend.

---

## 🔵 Informativo

### 13. Service Worker Ativo (PWA) — Verificar Cache de Dados Autenticados

**Descrição:**  
A aplicação possui um Service Worker registrado. Verificar se está realizando cache de respostas autenticadas ou tokens.

**Sugestão:**  
```js
// No service worker, excluir rotas de API e auth do cache:
if (request.url.includes('/api/') || request.url.includes('supabase.co')) {
  return fetch(request); // sempre buscar da rede
}
```

---

### 14. Preferências de Filtro Sensíveis em `localStorage`

**Descrição:**  
A chave `amooora_filter_preferences` está persistida em `localStorage`. Em dispositivos compartilhados, essas preferências de usuários LGBTQIA+ ficam expostas.

**Sugestão:**  
Usar `sessionStorage` para preferências temporárias, ou limpar os dados ao fazer logout.

---

## 📋 Tabela Resumo

| # | Vulnerabilidade | Categoria | Severidade |
|---|---|---|---|
| 1 | Token Supabase no localStorage | Segurança | 🔴 Alta |
| 2 | Ausência de Headers HTTP de Segurança | Segurança | 🔴 Alta |
| 3 | Project Ref do Supabase exposto | Segurança | 🔴 Alta |
| 4 | Atributo `lang` incorreto (en → pt-BR) | Acessibilidade | 🟠 Média |
| 5 | Imagens sem `alt` descritivo | Acessibilidade | 🟠 Média |
| 6 | Botões sem `aria-label` e sem `type` | Acessibilidade | 🟠 Média |
| 7 | Ausência de favicon | UX/PWA | 🟠 Média |
| 8 | Ausência de meta tags SEO e Open Graph | SEO/Marketing | 🟡 Baixa |
| 9 | Sem `<h1>` na página | SEO/Acessibilidade | 🟡 Baixa |
| 10 | Imagens sem lazy loading | Performance | 🟡 Baixa |
| 11 | Eventos com datas passadas exibidos | Conteúdo | 🟡 Baixa |
| 12 | Nome de chave expõe provider backend | Segurança | 🟡 Baixa |
| 13 | Cache em Service Worker (PWA) | Segurança/Privacidade | 🔵 Info |
| 14 | Preferências sensíveis em localStorage | Privacidade | 🔵 Info |

---

## ✅ Priorização de Ações Recomendadas

### Imediato (Sprint atual)
1. Habilitar **RLS (Row Level Security)** em todas as tabelas do Supabase e auditar policies.
2. Configurar **Security Headers** no `vercel.json` (CSP, HSTS, X-Frame-Options, etc.).
3. Migrar o **token de autenticação** de `localStorage` para `HttpOnly Cookie`.

### Curto Prazo (próximas 2 semanas)
4. Corrigir `lang="en"` → `lang="pt-BR"` no HTML raiz.
5. Adicionar `alt` descritivo em todas as imagens de conteúdo.
6. Adicionar `aria-label` e `type` em todos os botões.
7. Adicionar `favicon` e `apple-touch-icon`.

### Médio Prazo (próximo mês)
8. Implementar meta tags de **SEO e Open Graph** completas.
9. Adicionar `<h1>` semântico na página.
10. Implementar `loading="lazy"` nas imagens de conteúdo.
11. Criar lógica de **expiração automática de eventos** passados.
12. Revisar estratégia de **cache do Service Worker** para dados autenticados.

---

*Relatório gerado por análise automatizada de front-end. Recomenda-se complementar com auditoria de back-end, testes de penetração (pentest) e análise de políticas do Supabase.*
