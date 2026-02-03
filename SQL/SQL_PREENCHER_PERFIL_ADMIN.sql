-- =====================================================
-- PREENCHER PERFIL DO ADMIN COM DADOS DE EXEMPLO
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =====================================================

-- Este SQL preenche o perfil do admin@amooora.com com dados completos
-- e também adiciona conteúdo relacionado (locais favoritos, eventos, reviews)

DO $$
DECLARE
  admin_user_id uuid;
  first_place_id uuid;
  second_place_id uuid;
  first_event_id uuid;
  second_event_id uuid;
  first_service_id uuid;
BEGIN
  -- Buscar ID do usuário admin
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@amooora.com';

  -- Se o usuário não existir, avisar
  IF admin_user_id IS NULL THEN
    RAISE NOTICE 'Usuário admin@amooora.com não encontrado!';
    RAISE NOTICE 'Crie o usuário primeiro via Dashboard se necessário.';
    RETURN;
  END IF;

  RAISE NOTICE 'Usuário admin encontrado! ID: %', admin_user_id;

  -- =====================================================
  -- 1. PREENCHER PERFIL DO ADMIN
  -- =====================================================
  
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
    admin_user_id,
    'Admin Amooora',
    'admin@amooora.com',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    '(11) 99999-9999',
    'Administradora da plataforma Amooora. Apaixonada por criar espaços seguros e acolhedores para a comunidade LGBTQIA+. 🌈',
    'ela/dela',
    'São Paulo, SP',
    ARRAY['Administração', 'Comunidade', 'Eventos', 'Segurança', 'Inclusão', 'Tecnologia']::text[],
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

  RAISE NOTICE 'Perfil do admin atualizado com sucesso!';

  -- =====================================================
  -- 2. ADICIONAR LOCAIS FAVORITOS
  -- =====================================================

  -- Buscar os primeiros 5 locais disponíveis
  SELECT id INTO first_place_id FROM public.places WHERE is_safe = true LIMIT 1;
  SELECT id INTO second_place_id FROM public.places WHERE is_safe = true OFFSET 1 LIMIT 1;

  -- Adicionar locais favoritos (se existirem locais no banco)
  IF first_place_id IS NOT NULL THEN
    INSERT INTO public.saved_places (user_id, place_id)
    VALUES (admin_user_id, first_place_id)
    ON CONFLICT (user_id, place_id) DO NOTHING;
    RAISE NOTICE 'Local favorito 1 adicionado: %', first_place_id;
  END IF;

  IF second_place_id IS NOT NULL THEN
    INSERT INTO public.saved_places (user_id, place_id)
    VALUES (admin_user_id, second_place_id)
    ON CONFLICT (user_id, place_id) DO NOTHING;
    RAISE NOTICE 'Local favorito 2 adicionado: %', second_place_id;
  END IF;

  -- Adicionar mais locais se existirem
  INSERT INTO public.saved_places (user_id, place_id)
  SELECT admin_user_id, id
  FROM public.places
  WHERE is_safe = true
    AND id NOT IN (
      SELECT place_id FROM public.saved_places WHERE user_id = admin_user_id
    )
  LIMIT 3
  ON CONFLICT (user_id, place_id) DO NOTHING;

  -- =====================================================
  -- 3. ADICIONAR PARTICIPAÇÃO EM EVENTOS (FUTUROS)
  -- =====================================================

  -- Buscar eventos futuros
  SELECT id INTO first_event_id 
  FROM public.events 
  WHERE is_active = true 
    AND date >= CURRENT_DATE
  ORDER BY date ASC
  LIMIT 1;

  SELECT id INTO second_event_id 
  FROM public.events 
  WHERE is_active = true 
    AND date >= CURRENT_DATE
    AND id != COALESCE(first_event_id, '00000000-0000-0000-0000-000000000000')
  ORDER BY date ASC
  LIMIT 1;

  -- Adicionar participação em eventos futuros
  IF first_event_id IS NOT NULL THEN
    INSERT INTO public.event_participants (event_id, user_id)
    VALUES (first_event_id, admin_user_id)
    ON CONFLICT (event_id, user_id) DO NOTHING;
    RAISE NOTICE 'Evento futuro 1 adicionado: %', first_event_id;
  END IF;

  IF second_event_id IS NOT NULL THEN
    INSERT INTO public.event_participants (event_id, user_id)
    VALUES (second_event_id, admin_user_id)
    ON CONFLICT (event_id, user_id) DO NOTHING;
    RAISE NOTICE 'Evento futuro 2 adicionado: %', second_event_id;
  END IF;

  -- =====================================================
  -- 4. ADICIONAR PARTICIPAÇÃO EM EVENTOS PASSADOS
  -- =====================================================

  -- Adicionar alguns eventos passados (se existirem)
  INSERT INTO public.event_participants (event_id, user_id)
  SELECT id, admin_user_id
  FROM public.events
  WHERE is_active = true
    AND date < CURRENT_DATE
    AND id NOT IN (
      SELECT event_id FROM public.event_participants WHERE user_id = admin_user_id
    )
  ORDER BY date DESC
  LIMIT 2
  ON CONFLICT (event_id, user_id) DO NOTHING;

  -- =====================================================
  -- 5. ADICIONAR REVIEWS DE EXEMPLO
  -- =====================================================

  -- Buscar primeiro serviço para review
  SELECT id INTO first_service_id FROM public.services WHERE is_active = true LIMIT 1;

  -- Review para local favorito
  IF first_place_id IS NOT NULL THEN
    INSERT INTO public.reviews (place_id, user_id, rating, comment)
    VALUES (
      first_place_id,
      admin_user_id,
      5,
      'Lugar incrível! Ambiente super acolhedor e seguro. Recomendo muito! 🌈'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE 'Review para local adicionada';
  END IF;

  -- Review para serviço
  IF first_service_id IS NOT NULL THEN
    INSERT INTO public.reviews (service_id, user_id, rating, comment)
    VALUES (
      first_service_id,
      admin_user_id,
      5,
      'Excelente serviço! Profissionais muito qualificados e acolhedores. Super recomendo!'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE 'Review para serviço adicionada';
  END IF;

  -- Review para evento
  IF first_event_id IS NOT NULL THEN
    INSERT INTO public.reviews (event_id, user_id, rating, comment)
    VALUES (
      first_event_id,
      admin_user_id,
      5,
      'Evento incrível! Ambiente super seguro e acolhedor. Já estou ansiosa para o próximo! 🎉'
    )
    ON CONFLICT DO NOTHING;
    RAISE NOTICE 'Review para evento adicionada';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Perfil do admin preenchido com sucesso!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Dados adicionados:';
  RAISE NOTICE '- Perfil completo (nome, avatar, bio, etc.)';
  RAISE NOTICE '- Locais favoritos';
  RAISE NOTICE '- Participação em eventos futuros';
  RAISE NOTICE '- Participação em eventos passados';
  RAISE NOTICE '- Reviews de exemplo';

END $$;

-- =====================================================
-- VERIFICAR DADOS PREENCHIDOS
-- =====================================================

-- Verificar perfil
SELECT 
  'Perfil' as tipo,
  p.name,
  p.email,
  p.city,
  p.bio
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.email = 'admin@amooora.com';

-- Verificar locais favoritos
SELECT 
  'Locais Favoritos' as tipo,
  COUNT(*) as total
FROM public.saved_places sp
JOIN auth.users u ON u.id = sp.user_id
WHERE u.email = 'admin@amooora.com';

-- Verificar eventos (futuros e passados)
SELECT 
  'Eventos Futuros' as tipo,
  COUNT(*) as total
FROM public.event_participants ep
JOIN auth.users u ON u.id = ep.user_id
JOIN public.events e ON e.id = ep.event_id
WHERE u.email = 'admin@amooora.com'
  AND e.date >= CURRENT_DATE;

SELECT 
  'Eventos Passados' as tipo,
  COUNT(*) as total
FROM public.event_participants ep
JOIN auth.users u ON u.id = ep.user_id
JOIN public.events e ON e.id = ep.event_id
WHERE u.email = 'admin@amooora.com'
  AND e.date < CURRENT_DATE;

-- Verificar reviews
SELECT 
  'Reviews' as tipo,
  COUNT(*) as total
FROM public.reviews r
JOIN auth.users u ON u.id = r.user_id
WHERE u.email = 'admin@amooora.com';
