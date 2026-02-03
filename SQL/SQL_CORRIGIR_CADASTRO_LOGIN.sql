-- =====================================================
-- CORRIGIR PROBLEMAS DE CADASTRO E LOGIN
-- Garante que SELECT seja público e INSERT em profiles funcione
-- =====================================================

-- =====================================================
-- TABELA: profiles
-- =====================================================

-- Remover políticas antigas que podem estar bloqueando
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON profiles;

-- Política de SELECT: Qualquer um pode ver perfis públicos
CREATE POLICY "Public can view profiles"
ON profiles FOR SELECT
USING (true);

-- Política de INSERT: Permitir inserção durante cadastro (via trigger ou código)
-- IMPORTANTE: Isso permite que o trigger handle_new_user() e o código de signUp funcionem
CREATE POLICY "Allow profile creation on signup"
ON profiles FOR INSERT
WITH CHECK (true);

-- Política de UPDATE: Usuário só pode atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =====================================================
-- VERIFICAR SE AS POLÍTICAS DE SELECT ESTÃO PÚBLICAS
-- =====================================================

-- Verificar se existe política pública de SELECT para places
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'places' 
    AND cmd = 'SELECT'
    AND (qual LIKE '%true%' OR qual IS NULL)
  ) THEN
    -- Criar política pública de SELECT se não existir
    CREATE POLICY "Public can view places"
    ON places FOR SELECT
    USING (true);
  END IF;
END $$;

-- Verificar se existe política pública de SELECT para services
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'services' 
    AND cmd = 'SELECT'
    AND (qual LIKE '%true%' OR qual IS NULL)
  ) THEN
    CREATE POLICY "Public can view services"
    ON services FOR SELECT
    USING (true);
  END IF;
END $$;

-- Verificar se existe política pública de SELECT para events
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'events' 
    AND cmd = 'SELECT'
    AND (qual LIKE '%true%' OR qual IS NULL)
  ) THEN
    CREATE POLICY "Public can view events"
    ON events FOR SELECT
    USING (true);
  END IF;
END $$;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar políticas de SELECT (devem estar públicas)
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('places', 'services', 'events', 'profiles')
  AND cmd = 'SELECT'
ORDER BY tablename, policyname;
