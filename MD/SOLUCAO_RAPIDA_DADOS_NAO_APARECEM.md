# ⚡ Solução Rápida: Dados Não Estão Aparecendo

## 🔴 Problema
Os conteúdos do banco de dados não estão sendo carregados no sistema.

## ✅ Solução em 3 Passos

### Passo 1: Execute o SQL de Correção

1. **Acesse o Supabase Dashboard:**
   - https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
   - Vá em **SQL Editor** → **New query**

2. **Copie e cole o conteúdo do arquivo `SQL/SQL_CORRECAO_RAPIDA_RLS.sql`**

3. **Execute o SQL** (botão **Run** ou `Ctrl+Enter`)

Este SQL vai:
- ✅ Remover políticas RLS antigas que podem estar bloqueando
- ✅ Criar políticas públicas de SELECT para todas as tabelas
- ✅ Mostrar quantos dados existem e quantos passam pelos filtros
- ✅ Verificar se as políticas foram criadas corretamente

### Passo 2: Verifique os Dados no Supabase

1. **Vá para Table Editor** no Dashboard do Supabase
2. **Verifique cada tabela:**

   **places (Locais):**
   - Verifique se há registros cadastrados
   - **IMPORTANTE:** Verifique se o campo `is_safe` está como `true`
   - Se estiver `false` ou `null`, o local não aparecerá no site

   **services (Serviços):**
   - Verifique se há registros cadastrados
   - **IMPORTANTE:** Verifique se o campo `is_active` está como `true`
   - Se estiver `false` ou `null`, o serviço não aparecerá no site

   **events (Eventos):**
   - Verifique se há registros cadastrados
   - **IMPORTANTE:** Verifique se o campo `is_active` está como `true`
   - **IMPORTANTE:** Verifique se o campo `date` é uma data **futura**
   - Se `is_active` for `false` ou `null`, OU se a data for passada, o evento não aparecerá

### Passo 3: Verifique o Console do Navegador

1. **Abra o site:** `http://localhost:5173`
2. **Pressione F12** para abrir o Console
3. **Navegue pelas páginas** (Home, Locais, Serviços, Eventos)
4. **Procure por estas mensagens:**

   **Se funcionar:**
   ```
   ✅ Cliente Supabase inicializado com sucesso
   🔍 Buscando locais do Supabase...
   📊 Total de locais no banco (sem filtros): 5
   ✅ Locais encontrados (com filtro is_safe=true): 5
   ```

   **Se houver erro:**
   ```
   ❌ Erro ao buscar TODOS os locais (sem filtros): {...}
   ```

## 🔧 Se Ainda Não Funcionar

### Opção 1: Corrigir Dados Manualmente

1. No **Table Editor** do Supabase, edite cada registro:
   - **places**: Coloque `is_safe = true`
   - **services**: Coloque `is_active = true`
   - **events**: Coloque `is_active = true` e `date` com data futura

### Opção 2: Corrigir Dados via SQL

Execute no SQL Editor do Supabase:

```sql
-- Tornar todos os locais seguros
UPDATE public.places 
SET is_safe = true 
WHERE is_safe IS NULL OR is_safe = false;

-- Tornar todos os serviços ativos
UPDATE public.services 
SET is_active = true 
WHERE is_active IS NULL OR is_active = false;

-- Tornar todos os eventos ativos
UPDATE public.events 
SET is_active = true 
WHERE is_active IS NULL OR is_active = false;
```

### Opção 3: Verificar Variáveis de Ambiente

1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Verifique se contém:
   ```
   VITE_SUPABASE_URL=https://btavwaysfjpsuqxdfguw.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_aqui
   ```
3. Se não tiver, pegue no Dashboard do Supabase:
   - Settings → API → Project URL e anon public key

## 📋 Checklist

- [ ] Executei o SQL `SQL/SQL_CORRECAO_RAPIDA_RLS.sql`
- [ ] Verifiquei dados no Table Editor
- [ ] Verifiquei campos `is_safe`, `is_active` e `date`
- [ ] Verifiquei console do navegador (F12)
- [ ] Verifiquei arquivo `.env` com variáveis corretas

## 🆘 Precisa de Ajuda?

Me envie:
1. **Print do resultado do SQL** (mostra quantos dados existem)
2. **Mensagens do console** (F12)
3. **Print do Table Editor** mostrando os dados

Com essas informações, consigo identificar exatamente o problema!
