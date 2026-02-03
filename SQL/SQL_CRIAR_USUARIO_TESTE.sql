-- =====================================================
-- CRIAR USUÁRIO DE TESTE E PREENCHER PERFIL
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =====================================================

-- IMPORTANTE: O usuário precisa ser criado via Supabase Auth primeiro
-- Este SQL assume que você já criou o usuário via Dashboard ou API

-- =====================================================
-- OPÇÃO 1: CRIAR VIA DASHBOARD (RECOMENDADO)
-- =====================================================
-- 1. Acesse: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
-- 2. Vá em Authentication → Users → Add User
-- 3. Email: teste@amooora.com.br
-- 4. Password: teste123
-- 5. Confirme o email (marque "Auto Confirm User")
-- 6. Clique em "Create User"
-- 7. Copie o User ID que aparecer
-- 8. Execute o SQL abaixo substituindo 'USER_ID_AQUI' pelo ID copiado

-- =====================================================
-- OPÇÃO 2: BUSCAR USER ID E CRIAR/ATUALIZAR PERFIL
-- =====================================================

-- Primeiro, vamos buscar o user_id do email (se já existir)
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Buscar ID do usuário pelo email
  SELECT id INTO test_user_id
  FROM auth.users
  WHERE email = 'teste@amooora.com.br';

  -- Se o usuário não existir, você precisa criá-lo primeiro via Dashboard
  IF test_user_id IS NULL THEN
    RAISE NOTICE 'Usuário não encontrado! Crie o usuário primeiro via Dashboard:';
    RAISE NOTICE '1. Vá em Authentication → Users → Add User';
    RAISE NOTICE '2. Email: teste@amooora.com.br';
    RAISE NOTICE '3. Password: teste123';
    RAISE NOTICE '4. Marque "Auto Confirm User"';
    RAISE NOTICE '5. Execute este SQL novamente após criar o usuário';
    RETURN;
  END IF;

  RAISE NOTICE 'Usuário encontrado! ID: %', test_user_id;

  -- Criar ou atualizar perfil com dados completos
  INSERT INTO public.profiles (
    id,
    name,
    email,
    avatar,
    phone,
    bio,
    pronouns,
    city,
    interests,
    relationship_type,
    privacy_level
  ) VALUES (
    test_user_id,
    'Ana Paula Silva',
    'teste@amooora.com.br',
    'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZyaWVuZHMlMjBncm91cCUyMGhhcHB5fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    '(11) 98765-4321',
    'Apaixonada por café, cultura e boas conversas. Ativista pelos direitos LGBTQIA+. 🌈 Adoro eventos culturais e conhecer novos lugares seguros na cidade.',
    'ela/dela',
    'São Paulo, SP',
    ARRAY['Música', 'Arte', 'Viagens', 'Fotografia', 'Literatura', 'Ativismo']::text[],
    'Amizades e networking',
    'public'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    avatar = EXCLUDED.avatar,
    phone = EXCLUDED.phone,
    bio = EXCLUDED.bio,
    pronouns = EXCLUDED.pronouns,
    city = EXCLUDED.city,
    interests = EXCLUDED.interests,
    relationship_type = EXCLUDED.relationship_type,
    privacy_level = EXCLUDED.privacy_level,
    updated_at = NOW();

  RAISE NOTICE 'Perfil criado/atualizado com sucesso!';
END $$;

-- =====================================================
-- VERIFICAR SE O PERFIL FOI CRIADO
-- =====================================================

SELECT 
  p.id,
  p.name,
  p.email,
  p.pronouns,
  p.city,
  p.bio,
  p.interests,
  p.relationship_type,
  u.created_at as user_created_at,
  p.created_at as profile_created_at
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.email = 'teste@amooora.com.br';
