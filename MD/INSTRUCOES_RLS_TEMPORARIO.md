# ⚠️ Configuração Temporária: RLS Permissivo

## 🚨 ATENÇÃO
Esta é uma configuração **TEMPORÁRIA** para resolver o problema de dados não aparecerem.  
**NÃO use isso em produção!** Esta configuração permite acesso total aos dados.

## 🎯 Objetivo
Flexibilizar temporariamente as regras de segurança (RLS) para que o conteúdo do banco de dados apareça no navegador.

## 📋 Passo a Passo

### Passo 1: Execute o SQL de RLS Temporário

1. **Acesse o Supabase Dashboard:**
   - https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
   - Vá em **SQL Editor** → **New query**

2. **Abra o arquivo `SQL/SQL_RLS_TEMPORARIO_PERMISSIVO.sql`**

3. **Copie TODO o conteúdo** e cole no SQL Editor

4. **Execute** (botão **Run** ou `Ctrl+Enter`)

### Passo 2: Execute o SQL de Storage Temporário

1. **Na mesma janela do SQL Editor**, crie uma **nova query**

2. **Abra o arquivo `SQL/SQL_STORAGE_PUBLICO_TEMPORARIO.sql`**

3. **Copie TODO o conteúdo** e cole no SQL Editor

4. **Execute** (botão **Run** ou `Ctrl+Enter`)

### Passo 3: Verifique o Resultado

Após executar ambos os SQLs, você verá:

1. **Políticas criadas** mostrando `✅ PÚBLICO` para todas as tabelas
2. **Quantidade de registros** em cada tabela

### Passo 4: Teste no Navegador

1. **Feche completamente o navegador** (todas as abas)

2. **Limpe o cache do navegador:**
   - **Chrome/Edge:** `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
   - Selecione "Imagens e arquivos em cache" e limpe

3. **Reabra o navegador** e vá para: `http://localhost:5173`

4. **Pressione F12** para abrir o Console

5. **Navegue pelas páginas:**
   - Home
   - Locais
   - Serviços
   - Eventos

6. **Verifique as mensagens no Console:**

   **Se funcionar, você verá:**
   ```
   ✅ Cliente Supabase inicializado com sucesso
   🔍 Buscando locais do Supabase...
   📊 Total de locais no banco (sem filtros): X
   ✅ Locais encontrados (com filtro is_safe=true): X
   ```

### Passo 5: Reinicie o Servidor (se necessário)

Se ainda não funcionar, reinicie o servidor de desenvolvimento:

1. **Pare o servidor** no terminal: `Ctrl+C` ou `Cmd+C`

2. **Limpe o cache do projeto:**
   ```bash
   rm -rf node_modules/.vite dist .vite
   ```

3. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

## ✅ O Que Foi Feito

### Tabelas (places, services, events, profiles):
- ✅ Removidas **TODAS** as políticas antigas
- ✅ Criadas políticas **TOTALMENTE PERMISSIVAS**
- ✅ Permite **SELECT, INSERT, UPDATE, DELETE** para todos

### Storage (imagens):
- ✅ Removidas políticas antigas de storage
- ✅ Criadas políticas **TOTALMENTE PERMISSIVAS** para upload/download

## 🔒 Importante: Segurança

**Esta configuração é TEMPORÁRIA!**

Depois que confirmar que os dados estão aparecendo, você deve:

1. **Restaurar políticas de segurança adequadas**
2. **Implementar autenticação** para operações de escrita (INSERT, UPDATE, DELETE)
3. **Manter SELECT público** apenas para leitura

## 🐛 Se Ainda Não Funcionar

Me envie:

1. **Print do resultado dos SQLs** (mostra quantos dados existem)
2. **Mensagens do console** (F12) do navegador
3. **Mensagens do terminal** onde o servidor está rodando

Com essas informações, consigo identificar exatamente o que está acontecendo!

## 📝 Checklist

- [ ] Executei `SQL/SQL_RLS_TEMPORARIO_PERMISSIVO.sql`
- [ ] Executei `SQL/SQL_STORAGE_PUBLICO_TEMPORARIO.sql`
- [ ] Todas as políticas mostram `✅ PÚBLICO`
- [ ] Fechei e reabri o navegador
- [ ] Limpei o cache do navegador
- [ ] Reiniciei o servidor de desenvolvimento
- [ ] Verifiquei o console do navegador (F12)

## ⚡ Resultado Esperado

Após executar esses SQLs, **TODOS os dados** devem aparecer no navegador, sem nenhuma restrição de segurança.
