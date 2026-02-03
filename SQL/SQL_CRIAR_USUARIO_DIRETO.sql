-- =====================================================
-- CRIAR USUÁRIO DIRETAMENTE VIA SQL
-- ATENÇÃO: Isso pode não funcionar perfeitamente
-- RECOMENDADO: Criar via Dashboard
-- =====================================================

-- IMPORTANTE: Criar usuário via SQL não é o método recomendado
-- porque o hash da senha pode não ser gerado corretamente.
-- O método mais seguro é via Dashboard ou via API.

-- =====================================================
-- MÉTODO RECOMENDADO: Via Dashboard
-- =====================================================
-- 1. Acesse: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw/auth/users
-- 2. Clique em "Add User" ou "Create User"
-- 3. Email: teste@amooora.com.br
-- 4. Password: teste123
-- 5. Marque "Auto Confirm User"
-- 6. Clique em "Create User"
-- 7. Depois execute o SQL/SQL_CRIAR_USUARIO_TESTE.sql para preencher o perfil

-- =====================================================
-- TENTAR CRIAR VIA SQL (PODE NÃO FUNCIONAR)
-- =====================================================

-- Primeiro, verificar se o usuário já existe
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Buscar se já existe
  SELECT id INTO test_user_id
  FROM auth.users
  WHERE email = 'teste@amooora.com.br';

  IF test_user_id IS NOT NULL THEN
    RAISE NOTICE 'Usuário já existe! ID: %', test_user_id;
    RAISE NOTICE 'Execute SQL/SQL_CRIAR_USUARIO_TESTE.sql para preencher o perfil';
    RETURN;
  END IF;

  RAISE NOTICE 'Usuário não encontrado.';
  RAISE NOTICE 'IMPORTANTE: Criar usuário via SQL não é recomendado.';
  RAISE NOTICE 'Use o Dashboard para criar o usuário:';
  RAISE NOTICE 'https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw/auth/users';
  RAISE NOTICE '';
  RAISE NOTICE 'Depois execute SQL/SQL_CRIAR_USUARIO_TESTE.sql para preencher o perfil';
END $$;
