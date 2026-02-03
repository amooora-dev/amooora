# 🔧 Solução para Problemas de Login e Conteúdo não Aparecendo

## Problemas Identificados

1. **Login/Cadastro não funcionando**: Políticas RLS podem estar bloqueando INSERT na tabela `profiles`
2. **Conteúdo não aparece**: Políticas de SELECT podem não estar públicas nas tabelas `places`, `services`, `events`

## ✅ Solução Rápida

Execute este SQL no Supabase SQL Editor para corrigir ambos os problemas:

```sql
-- =====================================================
-- CORRIGIR CADASTRO, LOGIN E VISUALIZAÇÃO
-- =====================================================

-- =====================================================
-- 1. GARANTIR QUE SELECT SEJA PÚBLICO
-- =====================================================

-- Places: SELECT público (todos podem ver)
DROP POLICY IF EXISTS "Public can view places" ON places;
CREATE POLICY "Public can view places"
ON places FOR SELECT
USING (true);

-- Services: SELECT público (todos podem ver)
DROP POLICY IF EXISTS "Public can view services" ON services;
CREATE POLICY "Public can view services"
ON services FOR SELECT
USING (true);

-- Events: SELECT público (todos podem ver)
DROP POLICY IF EXISTS "Public can view events" ON events;
CREATE POLICY "Public can view events"
ON events FOR SELECT
USING (true);

-- =====================================================
-- 2. GARANTIR QUE CADASTRO FUNCIONE (profiles)
-- =====================================================

-- Remover políticas antigas que podem estar bloqueando
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation on signup" ON profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON profiles;

-- SELECT: Todos podem ver perfis públicos
CREATE POLICY "Public can view profiles"
ON profiles FOR SELECT
USING (true);

-- INSERT: Permitir criação de perfil durante cadastro
-- Isso permite que o trigger handle_new_user() e o código de signUp funcionem
CREATE POLICY "Allow profile creation on signup"
ON profiles FOR INSERT
WITH CHECK (true);

-- UPDATE: Usuário só pode atualizar seu próprio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =====================================================
-- 3. VERIFICAR SE FUNCIONOU
-- =====================================================

-- Verificar políticas de SELECT (devem ser públicas)
SELECT 
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN qual LIKE '%true%' OR qual IS NULL THEN 'PÚBLICO'
    ELSE 'RESTRITO'
  END as acesso
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('places', 'services', 'events', 'profiles')
  AND cmd = 'SELECT'
ORDER BY tablename;

-- Verificar políticas de INSERT em profiles (deve permitir)
SELECT 
  tablename,
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles'
  AND cmd = 'INSERT';
```

## 📋 Passo a Passo

1. **Acesse o Supabase SQL Editor:**
   - https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
   - Vá em **SQL Editor** → **New query**

2. **Cole o SQL acima e execute**

3. **Teste:**
   - Tente fazer um cadastro novo
   - Tente fazer login
   - Verifique se os locais, serviços e eventos aparecem nas páginas

## ⚠️ Importante

Este SQL:
- ✅ Garante que **qualquer um pode VER** locais, serviços e eventos (SELECT público)
- ✅ Garante que **cadastro funcione** (INSERT em profiles permitido)
- ✅ Mantém **UPDATE** restrito ao próprio usuário
- ⚠️ Mantém **INSERT em places/services/events** restrito a usuários autenticados

Se você executou o `SQL/SQL_RLS_SEGURO.sql` antes e isso quebrou o cadastro/login, este SQL corrige.

## 🔍 Se Ainda Não Funcionar

1. Verifique o console do navegador (F12) para ver erros específicos
2. Execute o arquivo `SQL/SQL_VERIFICAR_RLS.sql` para ver quais políticas estão ativas
3. Verifique se as tabelas existem e têm dados
