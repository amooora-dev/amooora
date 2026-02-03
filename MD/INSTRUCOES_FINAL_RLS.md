# 🔧 Instruções Finais: Corrigir RLS e Garantir que Dados Apareçam

## ✅ Você já verificou:
- Os campos `is_safe`, `is_active` e `date` estão corretos no banco de dados

## 🔴 Problema atual:
Os dados não estão aparecendo no site, mesmo com os campos corretos.

## 💡 Solução:
O problema é **definitivamente** as políticas RLS (Row Level Security) bloqueando as queries.

## 📋 Passo a Passo:

### Passo 1: Execute o SQL Forçado

1. **Acesse o Supabase Dashboard:**
   - https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
   - Vá em **SQL Editor** → **New query**

2. **Abra o arquivo `SQL/SQL_FORCAR_RLS_PUBLICO.sql`**

3. **Copie TODO o conteúdo** e cole no SQL Editor

4. **Execute** (botão **Run** ou `Ctrl+Enter`)

### O que este SQL faz:

✅ **Remove TODAS as políticas antigas** (mesmo que estejam com nomes diferentes)  
✅ **Habilita RLS** em todas as tabelas  
✅ **Cria políticas públicas de SELECT** que permitem leitura para todos  
✅ **Testa as consultas** para verificar se funcionam  
✅ **Mostra o resultado** das políticas criadas

### Passo 2: Verifique o Resultado

Após executar o SQL, você verá:

1. **Resultado das queries de teste:**
   - Quantos registros existem em cada tabela
   - Quantos passam pelos filtros (`is_safe=true`, `is_active=true`)

2. **Lista de políticas criadas:**
   - Todas devem mostrar `✅ PÚBLICO`
   - Condição deve ser `true`

### Passo 3: Teste no Site

1. **Feche e reabra o navegador** (ou limpe o cache: `Ctrl+Shift+R` ou `Cmd+Shift+R`)

2. **Abra o site:** `http://localhost:5173`

3. **Pressione F12** para abrir o Console

4. **Navegue pelas páginas:**
   - Home
   - Locais
   - Serviços
   - Eventos

5. **Verifique as mensagens no Console:**

   **Se funcionar, você verá:**
   ```
   ✅ Cliente Supabase inicializado com sucesso
   🔍 Buscando locais do Supabase...
   📊 Total de locais no banco (sem filtros): X
   ✅ Locais encontrados (com filtro is_safe=true): X
   ```

   **Se ainda houver erro, você verá:**
   ```
   ❌ Erro ao buscar TODOS os locais (sem filtros): {...}
   ```

## 🔍 Se Ainda Não Funcionar:

### Verifique as Variáveis de Ambiente

1. Certifique-se de que o arquivo `.env` existe na raiz do projeto
2. Verifique se contém:
   ```
   VITE_SUPABASE_URL=https://btavwaysfjpsuqxdfguw.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
   ```
3. **Reinicie o servidor** após alterar o `.env`:
   ```bash
   # Pare o servidor (Ctrl+C)
   # Inicie novamente
   npm run dev
   ```

### Limpe o Cache

Execute no terminal:
```bash
rm -rf node_modules/.vite dist .vite
npm run dev
```

No navegador, pressione `Ctrl+Shift+R` (Windows/Linux) ou `Cmd+Shift+R` (Mac) para hard refresh.

## 📊 Após Executar o SQL

Me envie:
1. **Print do resultado do SQL** (mostra quantos dados existem)
2. **Print da lista de políticas** (deve mostrar todas como `✅ PÚBLICO`)
3. **Mensagens do console** (F12)

Com essas informações, consigo confirmar se tudo está funcionando!

## ✅ Checklist Final

- [ ] Executei o SQL `SQL/SQL_FORCAR_RLS_PUBLICO.sql`
- [ ] Todas as políticas mostram `✅ PÚBLICO`
- [ ] As queries de teste retornaram dados
- [ ] Limpei o cache do navegador
- [ ] Reiniciei o servidor de desenvolvimento
- [ ] Verifiquei o console do navegador (F12)
