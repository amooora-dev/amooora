-- =====================================================
-- CRIAR USUÁRIO ADMINISTRADOR
-- Execute este SQL no Supabase SQL Editor
-- =====================================================
-- IMPORTANTE: Após criar o usuário, faça login uma vez
-- e então execute a segunda parte deste script
-- =====================================================

-- PARTE 1: Criar usuário admin via Supabase Auth
-- Para criar o usuário, você precisa:
-- 1. Ir em Authentication > Users no Supabase Dashboard
-- 2. Clicar em "Add user" > "Create new user"
-- 3. Criar um usuário com email e senha
-- 4. Copiar o UUID do usuário criado
-- 5. Usar esse UUID na PARTE 2 abaixo

-- OU criar via código/Supabase Auth:
-- No seu código ou via Supabase Dashboard > Authentication > Users:
-- - Email: admin@amooora.com (ou o email que você preferir)
-- - Password: [crie uma senha forte]
-- - User UID: [será gerado automaticamente]

-- =====================================================
-- PARTE 2: Marcar usuário como admin
-- =====================================================
-- Substitua 'USER_UUID_AQUI' pelo UUID do usuário criado

-- Opção 1: Atualizar o perfil existente (se já existe)
UPDATE profiles
SET 
  is_admin = true,
  role = 'admin'
WHERE id = 'USER_UUID_AQUI';

-- Se o perfil não existe, você precisará criar manualmente ou
-- aguardar o trigger handle_new_user() criar automaticamente

-- =====================================================
-- PARTE 3: Verificar se o usuário foi marcado como admin
-- =====================================================

SELECT id, email, name, is_admin, role
FROM profiles
WHERE id = 'USER_UUID_AQUI';

-- =====================================================
-- ALTERNATIVA: Adicionar coluna is_admin se não existir
-- =====================================================

-- Verificar se a coluna existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
END $$;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- =====================================================
-- INSTRUÇÕES PASSO A PASSO:
-- =====================================================

-- 1. No Supabase Dashboard, vá em Authentication > Users
-- 2. Clique em "Add user" > "Create new user"
-- 3. Preencha:
--    - Email: admin@amooora.com (ou outro email)
--    - Password: [crie uma senha forte]
--    - Auto Confirm User: ✅ (marcar)
-- 4. Clique em "Create user"
-- 5. Copie o UUID do usuário criado
-- 6. Execute a PARTE 2 acima substituindo 'USER_UUID_AQUI'
-- 7. Execute a PARTE 3 para verificar

-- =====================================================
-- CREDENCIAIS DE EXEMPLO (ALTERE DEPOIS):
-- =====================================================
-- Email: admin@amooora.com
-- Senha: [crie uma senha forte aqui]
-- UUID: [será mostrado após criar o usuário]
