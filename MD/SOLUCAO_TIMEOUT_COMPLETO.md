# 🚨 Solução Completa para Problema de Timeout

## 📋 Diagnóstico Completo

O problema de timeout pode ter várias causas. Siga os passos abaixo na ordem:

### Passo 1: Verificar Variáveis de Ambiente

1. **Certifique-se que o arquivo `.env` existe na raiz do projeto:**
   ```bash
   ls -la .env
   ```

2. **Verifique se o conteúdo está correto:**
   ```env
   VITE_SUPABASE_URL=https://btavwaysfjpsuqxdfguw.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_aqui
   ```

3. **Se o arquivo não existir ou estiver incorreto:**
   - Acesse: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
   - Vá em Settings → API
   - Copie a URL e a Anon Key
   - Crie o arquivo `.env` na raiz do projeto com essas informações

4. **Reinicie o servidor de desenvolvimento:**
   ```bash
   # Pare o servidor (Ctrl+C)
   npm run dev
   ```

### Passo 2: Verificar se RLS está Bloqueando (SQL Editor no Supabase)

1. **Acesse o Supabase Dashboard:**
   - https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw

2. **Execute o arquivo `SQL/SQL_TESTE_RLS_SIMPLES.sql`:**
   - Vá em SQL Editor → New query
   - Copie e cole o conteúdo de `SQL/SQL_TESTE_RLS_SIMPLES.sql`
   - Execute (Run)
   - Verifique os resultados:
     - Se as queries COUNT(*) retornarem números = RLS está OK
     - Se der erro de permissão = RLS está bloqueando

3. **Se RLS estiver bloqueando, execute `SQL/SQL_FIX_SELECT_PUBLICO.sql`:**
   - Vá em SQL Editor → New query
   - Copie e cole o conteúdo de `SQL/SQL_FIX_SELECT_PUBLICO.sql`
   - Execute (Run)
   - Execute novamente `SQL/SQL_TESTE_RLS_SIMPLES.sql` para confirmar

### Passo 3: Verificar se Há Dados nas Tabelas

Execute no SQL Editor do Supabase:

```sql
-- Verificar se há dados
SELECT COUNT(*) as total FROM places;
SELECT COUNT(*) as total FROM services;
SELECT COUNT(*) as total FROM events;

-- Ver alguns dados
SELECT id, name FROM places LIMIT 5;
SELECT id, name FROM services LIMIT 5;
SELECT id, name FROM events LIMIT 5;
```

**Se não houver dados:**
- Execute `SQL/SQL_INSERIR_DADOS_EXEMPLO.sql` para inserir dados de teste

### Passo 4: Verificar Console do Navegador

1. **Abra o Console do Navegador:**
   - F12 ou Cmd+Option+I (Mac)
   - Vá na aba Console

2. **Procure por:**
   - `🔧 Inicializando cliente Supabase...`
   - `🔗 URL configurada: ✅ Sim` ou `❌ Não`
   - `🔑 Chave configurada: ✅ Sim` ou `❌ Não`
   - Mensagens de erro em vermelho

3. **Se aparecer `❌ Não` nas configurações:**
   - O arquivo `.env` não está sendo carregado
   - Reinicie o servidor de desenvolvimento
   - Verifique se o arquivo está na raiz do projeto

### Passo 5: Testar Conexão Direta no Supabase

Execute no SQL Editor do Supabase:

```sql
-- Testar se consegue fazer SELECT sem filtros
SELECT * FROM places LIMIT 1;
SELECT * FROM services LIMIT 1;
SELECT * FROM events LIMIT 1;
```

**Se essas queries funcionarem no SQL Editor mas não no app:**
- O problema é RLS bloqueando consultas do cliente
- Execute `SQL/SQL_FIX_SELECT_PUBLICO.sql` novamente
- Verifique se a política foi criada corretamente

### Passo 6: Desabilitar RLS Temporariamente (TESTE APENAS)

⚠️ **ATENÇÃO: Apenas para teste! Não use em produção!**

Execute no SQL Editor do Supabase:

```sql
-- Desabilitar RLS temporariamente (APENAS PARA TESTE)
ALTER TABLE places DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

**Teste o app novamente:**
- Se funcionar = problema era RLS
- Se ainda não funcionar = problema é outro (conexão, dados, etc.)

**Depois do teste, reabilite RLS:**
```sql
-- Reabilitar RLS
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- E execute SQL/SQL_FIX_SELECT_PUBLICO.sql para criar políticas corretas
```

### Passo 7: Verificar Network Tab

1. **Abra o DevTools (F12)**
2. **Vá na aba Network**
3. **Recarregue a página**
4. **Procure por requisições para `supabase.co`:**
   - Se houver requisições = conexão está funcionando
   - Se houver erros 401/403 = problema de RLS
   - Se houver timeout = problema de conexão ou query muito lenta
   - Se não houver requisições = problema na inicialização do cliente

## 🔧 Soluções Alternativas

### Solução 1: Usar Mocks Temporariamente

Se nada funcionar, você pode usar mocks temporariamente:

1. Verifique se há arquivo `src/app/data/mocks.ts`
2. Modifique os services para usar mocks em caso de erro
3. Isso permitirá que o app funcione enquanto você corrige o Supabase

### Solução 2: Verificar Firewall/Proxy

- Certifique-se que não há firewall bloqueando conexões com `supabase.co`
- Verifique se está usando proxy/VPN que pode estar bloqueando

### Solução 3: Limpar Cache

```bash
# Limpar cache do npm/node_modules
rm -rf node_modules package-lock.json
npm install

# Limpar cache do navegador
# Chrome: Ctrl+Shift+Delete → Limpar cache
# Firefox: Ctrl+Shift+Delete → Limpar cache
```

## 📞 Próximos Passos

Após seguir todos os passos acima:

1. **Copie e me envie:**
   - Resultado do `SQL/SQL_TESTE_RLS_SIMPLES.sql`
   - Erros do console do navegador
   - Requisições da aba Network (se houver)

2. **Com essas informações, posso ajudar a identificar o problema específico**

---

**Última atualização**: Criado para diagnóstico completo do problema de timeout
