# 🚨 Solução Final para Problema de Timeout

## ⚠️ Problema Atual
Todos os dados (Locais, Eventos, Serviços) estão mostrando erro de timeout na página inicial.

## 🔍 Diagnóstico Rápido

### Passo 1: Verificar Console do Navegador

1. **Abra o Console do Navegador:**
   - Pressione `F12` ou `Cmd+Option+I` (Mac)
   - Vá na aba **Console**

2. **Procure por estas mensagens:**
   ```
   🔧 Inicializando cliente Supabase...
   🔗 URL configurada: ✅ Sim ou ❌ Não
   🔑 Chave configurada: ✅ Sim ou ❌ Não
   ```

3. **Se aparecer `❌ Não`:**
   - O arquivo `.env` não está configurado corretamente
   - Veja o Passo 2 abaixo

### Passo 2: Verificar Arquivo .env

1. **Certifique-se que o arquivo `.env` existe na raiz do projeto**

2. **Verifique se contém:**
   ```env
   VITE_SUPABASE_URL=https://btavwaysfjpsuqxdfguw.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
   ```

3. **Para obter a chave:**
   - Acesse: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
   - Vá em **Settings** → **API**
   - Copie a **URL** e a **anon/public key**
   - Cole no arquivo `.env`

4. **Reinicie o servidor:**
   ```bash
   # Pare o servidor (Ctrl+C)
   npm run dev
   ```

### Passo 3: Executar SQL de Correção RLS (CRÍTICO)

**Este é o passo mais importante!** O problema provavelmente é RLS bloqueando as queries.

1. **Acesse o Supabase Dashboard:**
   - https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
   - Vá em **SQL Editor** → **New query**

2. **Execute o arquivo `SQL/SQL_CORRIGIR_RLS_DEFINITIVO.sql`:**
   - Abra o arquivo `SQL/SQL_CORRIGIR_RLS_DEFINITIVO.sql`
   - Copie **TODO o conteúdo**
   - Cole no SQL Editor
   - Clique em **Run** ou pressione `Ctrl+Enter`

3. **Verifique o resultado:**
   - Deve mostrar `✅ PÚBLICO` para todas as tabelas
   - As queries de teste devem retornar números (não erros)

### Passo 4: Verificar se Há Dados no Banco

Execute no SQL Editor do Supabase:

```sql
-- Verificar quantos dados existem
SELECT COUNT(*) as total_places FROM places;
SELECT COUNT(*) as total_services FROM services;
SELECT COUNT(*) as total_events FROM events;
```

**Se retornar 0:**
- Execute `SQL/SQL_INSERIR_DADOS_EXEMPLO.sql` para inserir dados de teste

### Passo 5: Limpar Cache e Recarregar

1. **Limpar cache do navegador:**
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` (Windows) ou `Cmd+Shift+R` (Mac)

2. **Limpar cache do Vite:**
   ```bash
   rm -rf node_modules/.vite dist .vite
   npm run dev
   ```

## 🔧 Solução Alternativa: Desabilitar RLS Temporariamente (TESTE)

⚠️ **ATENÇÃO: Apenas para teste! Não use em produção!**

Execute no SQL Editor do Supabase:

```sql
-- Desabilitar RLS temporariamente (APENAS PARA TESTE)
ALTER TABLE places DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

**Teste o app:**
- Se funcionar = problema era RLS
- Se ainda não funcionar = problema é outro (conexão, .env, etc.)

**Depois do teste, reabilite RLS:**
```sql
-- Reabilitar RLS
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- E execute SQL/SQL_CORRIGIR_RLS_DEFINITIVO.sql para criar políticas corretas
```

## 📊 Checklist de Verificação

- [ ] Console mostra `✅ Sim` para URL e Chave
- [ ] Arquivo `.env` existe e está correto
- [ ] Executei `SQL/SQL_CORRIGIR_RLS_DEFINITIVO.sql`
- [ ] Verifiquei que há dados no banco (COUNT > 0)
- [ ] Limpei o cache do navegador
- [ ] Reiniciei o servidor de desenvolvimento
- [ ] Recarreguei a página (hard refresh)

## 🆘 Se Nada Funcionar

1. **Copie e me envie:**
   - Mensagens do console do navegador (F12)
   - Resultado do SQL de verificação de dados
   - Resultado do SQL de verificação de políticas RLS

2. **Verifique a aba Network:**
   - F12 → Aba **Network**
   - Recarregue a página
   - Procure por requisições para `supabase.co`
   - Veja se há erros 401, 403 ou timeout

Com essas informações, consigo identificar o problema específico!

---

**Última atualização**: Solução completa para timeout persistente
