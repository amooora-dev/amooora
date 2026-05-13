# Supabase — RLS e vulnerabilidades (aplicação)

Este guia complementa o [relatório de vulnerabilidades](./relatorio-vulnerabilidades-amooora.md) e o [checklist](./CHECKLIST-VULNERABILIDADES-AMOOORA.md) para o que **só pode ser feito no projeto Supabase** (Dashboard / SQL Editor).

---

## 1. O que este pacote resolve

| Tema no relatório | Ação |
|-------------------|------|
| RLS em tabelas de catálogo | Script [`SQL/SQL_RLS_SEGURANCA_AMOOORA_2026.sql`](../SQL/SQL_RLS_SEGURANCA_AMOOORA_2026.sql) |
| Escrita anônima em `places` / `events` / `services` / `communities` | Bloqueada: só `authenticated`, com dono ou admin de área |
| Leitura pública só do conteúdo **ativo + aprovado** | `is_active` e `curation_status` (com `COALESCE` seguro) |
| `contact_messages` com papel `admin` legado | Políticas novas usam `admin_geral` via `is_admin_geral()` |
| `reviews` | SELECT público; INSERT/UPDATE/DELETE restritos |

**Não resolve neste ficheiro:** sessão em `HttpOnly` cookies (exige BFF/SSR ou fluxo dedicado do Supabase no servidor). Ver secção 6.

---

## 2. Não tens projeto de staging no Supabase — como proceder

Podes aplicar **direto no projeto de produção**, mas com estes passos para reduzir risco:

### A) Backup / restauração (recomendado)

1. No **Supabase Dashboard** do projeto: **Database** → **Backups** (ou **Point-in-time recovery**, conforme o [plano](https://supabase.com/pricing)).  
2. Confirma que existe **backup recente** antes de mexer.  
3. Se algo correr mal, a forma mais limpa de “voltar tudo” é **restaurar a base a partir desse backup** (fluxo do painel Supabase / suporte, conforme documentação do teu plano).

### B) Export do estado das políticas (antes de correr o SQL novo)

1. Executa no SQL Editor o ficheiro  
   [`SQL/SQL_RLS_SEGURANCA_AMOOORA_2026_ANTES_EXPORT.sql`](../SQL/SQL_RLS_SEGURANCA_AMOOORA_2026_ANTES_EXPORT.sql).  
2. Guarda o resultado (copiar tabela ou CSV). Assim sabes **exactamente** que `policyname` e expressões existiam antes — útil se precisares de recriar políticas à mão.

### C) Opção “segundo projeto” (substituto de staging)

No painel Supabase: **New project** → duplicar schema (dump + restore) ou recriar só estrutura e dados de teste. Aplica o SQL primeiro **nesse** projeto. Custa um projeto extra / tempo, mas evita surpresas em produção.

### D) Como correr o script

1. (Opcional) `curadoria_supabase.sql` se quiseres as RPCs de curadoria; o script `SQL_RLS_SEGURANCA_AMOOORA_2026.sql` já inclui o bloco **0a** que cria `curation_status` (e outras colunas em falta) com `IF NOT EXISTS`. Em **places** a política pública usa **`is_safe`** (como o app), não `is_active`.  
2. **Export** (ponto B).  
3. Colar e executar [`SQL/SQL_RLS_SEGURANCA_AMOOORA_2026.sql`](../SQL/SQL_RLS_SEGURANCA_AMOOORA_2026.sql).  
4. Testar o site (listagens, login, criar conteúdo, Fale Conosco, admin).

---

## 3. Voltar atrás depois de aplicar o SQL de 2026

### Opção 1 — Restaurar backup (a mais segura)

Usar **Database → Backups** (ou PITR) no Supabase para voltar ao estado anterior ao script. Não depende de ficheiros no Git.

### Opção 2 — Script de rollback parcial

O ficheiro [`SQL/SQL_RLS_SEGURANCA_AMOOORA_2026_ROLLBACK.sql`](../SQL/SQL_RLS_SEGURANCA_AMOOORA_2026_ROLLBACK.sql) remove **só** políticas `amo2026_*` e as funções `is_admin_locais`, `is_admin_eventos`, `is_admin_servicos`.

**Atenção:** depois disto, essas tabelas podem ficar **sem nenhuma política** enquanto o RLS estiver ligado → por defeito **ninguém** lê/escreve via API. Por isso o rollback “a sério” é quase sempre **restaurar backup** ou **voltar a colar as políticas antigas** que guardaste no export (ponto B), não só o `ROLLBACK.sql` isolado.

A função `is_admin_geral()` **não** é removida pelo rollback (pode ser usada por outras partes do projeto).

### Opção 3 — Colunas `curation_status` / `created_by` em `communities`

O script de rollback tem comentários para `DROP COLUMN` — só descomenta se tiveres a certeza de que não vais perder dados úteis.

---

## 4. Ordem resumida (sem staging)

| Passo | Ação |
|------|------|
| 1 | Confirmar backups Supabase |
| 2 | Correr `SQL_RLS_SEGURANCA_AMOOORA_2026_ANTES_EXPORT.sql` e guardar o resultado |
| 3 | Correr `SQL_RLS_SEGURANCA_AMOOORA_2026.sql` |
| 4 | Testar app |
| 5a | Se OK: nada a fazer |
| 5b | Se falhar: restaurar **backup** OU rollback + recolocar políticas antigas a partir do export |

---

## 5. Credenciais

- **Frontend:** apenas `VITE_SUPABASE_ANON_KEY` e `VITE_SUPABASE_URL` (ver [`.env.example`](../.env.example)).  
- **Nunca** commitar `service_role` nem expor no bundle. Operações administrativas sensíveis devem usar **Edge Function**, **RPC `SECURITY DEFINER`** já revista, ou painel Supabase.

---

## 6. Token em `localStorage` (relatório item 1)

Mitigação imediata: **RLS forte** + **CSP** + menos XSS.

Migração para cookies **HttpOnly** implica, por exemplo:

- App com SSR (Next.js, Remix) com [Supabase SSR](https://supabase.com/docs/guides/auth/server-side), ou  
- Backend próprio que faça refresh de sessão e defina cookies seguros.

Isto é uma **épica à parte**; não faz parte do script SQL acima.

---

## 7. Tabelas não cobertas pelo script de 2026

O app ainda usa, entre outras: `community_posts`, `post_replies`, `post_likes`, `community_members`, `friend_requests`, `friend_messages`, `saved_places`, `visited_places`, `event_interests`, `event_participants`, `place_follows`, storage `objects`.

Muitas já têm scripts em `SQL/` (ex.: `event_interactions_tables.sql`, `SQL_FRIENDS_MODULE.sql`). Após aplicar o script principal, faça uma **auditoria** com:

```sql
SELECT relname, relrowsecurity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY relname;
```

Ative RLS e políticas onde ainda faltar, seguindo o mesmo princípio: **mínimo privilégio** e papéis em `profiles.role`.

---

## 8. `place_follows` — nota de privacidade

A política antiga **“Anyone can view follow counts”** (`USING (true)` em `SELECT`) expõe `user_id` de todas as seguidoras. O script **2026 não a altera** para não quebrar `getPlaceFollowersCount` sem refatorar para **RPC** com `SECURITY DEFINER`. Trate como melhoria seguinte (RPC de contagem + remoção dessa política).
