# 🔍 Diagnóstico: Login Admin e Dados Não Funcionam

## ⚠️ Problemas Reportados

1. Quando loga com `admin@amooora.com`:
   - Conteúdo do banco de dados não está funcionando
   - Novo ícone de configuração não aparece

2. Demais logins não estão funcionando também

## 🔧 Possíveis Causas

### 1. Sessão Não Está Sendo Detectada Imediatamente

Após o login, o hook `useAdmin` pode não estar detectando a sessão imediatamente.

**Solução implementada:**
- Aguardar 200ms após login para garantir persistência da sessão
- Verificar sessão após login
- Melhorar logs no `useAdmin` hook

### 2. Problema com RLS (Row Level Security)

Se os dados não aparecem, pode ser que as políticas RLS estejam bloqueando o acesso mesmo após login.

**Verificar:**
- Execute no SQL Editor do Supabase:
```sql
-- Verificar políticas RLS nas tabelas
SELECT * FROM pg_policies WHERE tablename IN ('places', 'services', 'events', 'profiles');
```

### 3. Hook useAdmin Não Está Detectando Admin

O hook pode não estar reagindo corretamente ao login.

**Solução implementada:**
- Adicionado logs detalhados
- Verificação de eventos `SIGNED_IN` e `TOKEN_REFRESHED`
- Verificação imediata após login

## 📋 Checklist de Diagnóstico

### Passo 1: Verificar Console do Navegador

1. Abra o DevTools (F12 ou Cmd+Option+I)
2. Vá na aba **Console**
3. Tente fazer login com `admin@amooora.com`
4. Observe os logs:
   - `🔐 Tentando fazer login com: ...`
   - `✅ Login bem-sucedido!`
   - `🔍 Verificando sessão após login: ...`
   - `🔄 useAdmin: Mudança na sessão: ...`
   - `✅ useAdmin: Admin detectado por email!`

### Passo 2: Verificar se a Sessão Foi Criada

Execute no console do navegador:
```javascript
// Verificar sessão atual
const { data: { session } } = await supabase.auth.getSession();
console.log('Sessão atual:', session);

// Verificar usuário
const { data: { user } } = await supabase.auth.getUser();
console.log('Usuário atual:', user);
```

### Passo 3: Verificar se Dados Estão Sendo Carregados

Execute no console:
```javascript
// Tentar buscar dados diretamente
const { data, error } = await supabase
  .from('places')
  .select('*')
  .limit(5);

console.log('Locais:', data);
console.log('Erro:', error);
```

### Passo 4: Verificar Políticas RLS

1. Acesse: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
2. Vá em **SQL Editor**
3. Execute:
```sql
-- Verificar se políticas RLS permitem SELECT público
SELECT * FROM pg_policies 
WHERE tablename IN ('places', 'services', 'events')
AND policyname LIKE '%SELECT%';
```

## 🚨 Erros Comuns

### Erro: "new row violates row-level security policy"
**Causa:** Política RLS bloqueando acesso
**Solução:** Verificar políticas RLS na tabela

### Erro: "JWT expired" ou "Invalid JWT"
**Causa:** Token de autenticação expirado ou inválido
**Solução:** Fazer logout e login novamente

### Erro: Dados não aparecem mas não há erro
**Causa:** RLS bloqueando silenciosamente
**Solução:** Verificar políticas RLS e garantir SELECT público

## 🔄 Solução Rápida

Se os dados não aparecem após login:

1. **Verificar RLS:**
   - Execute `SQL/SQL_FIX_SELECT_PUBLICO.sql` no SQL Editor
   - Isso garante que SELECT é público nas tabelas principais

2. **Limpar Cache:**
   - Limpar cache do navegador (Ctrl+Shift+Delete ou Cmd+Shift+Delete)
   - Recarregar a página

3. **Verificar Logs:**
   - Console do navegador deve mostrar logs detalhados
   - Copiar logs de erro e me enviar

## 📝 Informações para Enviar ao Desenvolvedor

Se o problema persistir, envie:

1. **Logs do console** (copie tudo)
2. **Mensagem de erro exata** (se houver)
3. **Resultado da verificação de sessão** (Passo 2)
4. **Resultado da busca de dados** (Passo 3)
5. **Status das políticas RLS** (Passo 4)
