# 🔍 Como Verificar se os Dados Estão Renderizando

## ✅ Servidor está rodando
- **Porta:** 5173
- **URL:** http://localhost:5173

## 📋 Passo a Passo para Verificar

### 1. Abrir a Aplicação no Navegador

1. Abra seu navegador (Chrome, Firefox, Safari, etc.)
2. Acesse: **http://localhost:5173**
3. Você deve ver a página inicial (Home)

### 2. Abrir o Console do Navegador

1. Pressione **F12** (Windows/Linux) ou **Cmd+Option+I** (Mac)
2. Vá na aba **Console**
3. Procure por estas mensagens:

#### ✅ Mensagens de Sucesso (esperadas):
```
🔧 Inicializando cliente Supabase...
🔗 URL configurada: ✅ Sim
🔑 Chave configurada: ✅ Sim
✅ Cliente Supabase inicializado com sucesso
🔍 Buscando locais do Supabase...
📊 Total de locais no banco (sem filtros): X
✅ Locais encontrados (com filtro is_safe=true): X
🔍 Buscando TODOS os eventos do Supabase...
✅ Total de eventos encontrados: X
🔍 Buscando serviços do Supabase...
✅ Total de serviços encontrados: X
```

#### ❌ Mensagens de Erro (problemas):
```
❌ Variáveis de ambiente do Supabase não configuradas!
❌ Erro ao buscar locais: ...
❌ Erro de RLS: ...
❌ Timeout ao carregar locais
```

### 3. Verificar a Aba Network

1. No DevTools, vá na aba **Network**
2. Recarregue a página (F5 ou Ctrl+R)
3. Procure por requisições para `supabase.co`:
   - Se houver requisições = conexão está funcionando
   - Se houver erros 401/403 = problema de RLS
   - Se houver timeout = problema de conexão ou query lenta
   - Se não houver requisições = problema na inicialização

### 4. Verificar se os Dados Aparecem na Tela

Na página inicial, você deve ver:

#### ✅ Se estiver funcionando:
- **Lugares Seguros Próximos:** Cards com imagens, nomes, categorias
- **Eventos Recomendados:** Cards com imagens, nomes, datas
- **Serviços para Você:** Cards com ícones de categorias

#### ❌ Se NÃO estiver funcionando:
- Mensagens de erro em vermelho: "Erro ao carregar locais/eventos/serviços"
- Mensagem "Carregando..." que não desaparece
- Seções vazias sem conteúdo

### 5. Verificar Dados no Supabase

Execute no SQL Editor do Supabase:

```sql
-- Verificar quantos dados existem
SELECT COUNT(*) as total_places FROM places;
SELECT COUNT(*) as total_services FROM services;
SELECT COUNT(*) as total_events FROM events;
```

**Se retornar 0:**
- Execute `SQL/SQL_INSERIR_DADOS_EXEMPLO.sql` para inserir dados de teste

**Se retornar números > 0:**
- Os dados existem no banco
- O problema é RLS ou conexão

### 6. Verificar Políticas RLS

Execute no SQL Editor do Supabase:

```sql
-- Verificar políticas RLS ativas
SELECT 
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN cmd = 'SELECT' AND (roles::text LIKE '%public%' OR roles IS NULL) THEN '✅ SELECT PÚBLICO'
    WHEN cmd IN ('INSERT', 'UPDATE', 'DELETE') AND roles::text LIKE '%authenticated%' THEN '✅ WRITE AUTENTICADO'
    ELSE '⚠️ VERIFICAR'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('places', 'services', 'events', 'profiles')
ORDER BY tablename, cmd;
```

**Resultado esperado:**
- Todas as tabelas devem ter `✅ SELECT PÚBLICO`
- Todas as tabelas devem ter `✅ WRITE AUTENTICADO` para INSERT/UPDATE/DELETE

## 🔧 Soluções Rápidas

### Se os dados não aparecem:

1. **Execute o SQL de correção RLS:**
   - Abra `SQL/SQL_CORRIGIR_RLS_SEGURO.sql`
   - Execute no Supabase SQL Editor

2. **Verifique o arquivo .env:**
   - Deve existir na raiz do projeto
   - Deve conter `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

3. **Reinicie o servidor:**
   ```bash
   # Pare o servidor (Ctrl+C)
   npm run dev
   ```

4. **Limpe o cache:**
   - Navegador: Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
   - Vite: `rm -rf node_modules/.vite dist .vite`

## 📊 Checklist de Verificação

- [ ] Servidor rodando na porta 5173
- [ ] Console mostra `✅ Sim` para URL e Chave
- [ ] Console mostra mensagens de sucesso ao buscar dados
- [ ] Aba Network mostra requisições para `supabase.co`
- [ ] Dados aparecem na tela (cards com conteúdo)
- [ ] Não há mensagens de erro no console
- [ ] Políticas RLS estão corretas (SELECT público)

## 🆘 Se Ainda Não Funcionar

1. **Copie e me envie:**
   - Screenshot do console do navegador
   - Screenshot da aba Network
   - Resultado do SQL de verificação de dados
   - Resultado do SQL de verificação de políticas RLS

2. **Informações adicionais:**
   - Quantos dados existem no banco? (resultado do COUNT)
   - Quais erros aparecem no console?
   - As requisições para Supabase estão sendo feitas?

---

**Última atualização**: Guia completo para verificar se os dados estão renderizando
