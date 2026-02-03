-- =====================================================
-- CORREÇÃO RÁPIDA: GARANTIR QUE DADOS APARECEM
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =====================================================

-- =====================================================
-- 1. VERIFICAR E CORRIGIR POLÍTICAS RLS
-- =====================================================

-- PLACES: Garantir SELECT público
DROP POLICY IF EXISTS "Public can view places" ON public.places;
DROP POLICY IF EXISTS "Public SELECT on places" ON public.places;
DROP POLICY IF EXISTS "Anyone can view places" ON public.places;

CREATE POLICY "Public can view places"
ON public.places FOR SELECT
TO public
USING (true);

-- SERVICES: Garantir SELECT público
DROP POLICY IF EXISTS "Public can view services" ON public.services;
DROP POLICY IF EXISTS "Public SELECT on services" ON public.services;
DROP POLICY IF EXISTS "Anyone can view services" ON public.services;

CREATE POLICY "Public can view services"
ON public.services FOR SELECT
TO public
USING (true);

-- EVENTS: Garantir SELECT público
DROP POLICY IF EXISTS "Public can view events" ON public.events;
DROP POLICY IF EXISTS "Public SELECT on events" ON public.events;
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;

CREATE POLICY "Public can view events"
ON public.events FOR SELECT
TO public
USING (true);

-- PROFILES: Garantir SELECT público
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public SELECT on profiles" ON public.profiles;

CREATE POLICY "Public can view profiles"
ON public.profiles FOR SELECT
TO public
USING (true);

-- =====================================================
-- 2. VERIFICAR DADOS NO BANCO
-- =====================================================

-- Ver quantos registros existem
SELECT 'places' as tabela, COUNT(*) as total, 
  COUNT(*) FILTER (WHERE is_safe = true) as com_is_safe_true,
  COUNT(*) FILTER (WHERE is_safe = false OR is_safe IS NULL) as com_is_safe_false_null
FROM public.places
UNION ALL
SELECT 'services' as tabela, COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as com_is_active_true,
  COUNT(*) FILTER (WHERE is_active = false OR is_active IS NULL) as com_is_active_false_null
FROM public.services
UNION ALL
SELECT 'events' as tabela, COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = true) as com_is_active_true,
  COUNT(*) FILTER (WHERE is_active = false OR is_active IS NULL) as com_is_active_false_null
FROM public.events;

-- =====================================================
-- 3. CORRIGIR DADOS COM VALORES NULL OU FALSE
-- =====================================================

-- Se você quiser que TODOS os locais apareçam, descomente:
-- UPDATE public.places SET is_safe = true WHERE is_safe IS NULL OR is_safe = false;

-- Se você quiser que TODOS os serviços apareçam, descomente:
-- UPDATE public.services SET is_active = true WHERE is_active IS NULL OR is_active = false;

-- Se você quiser que TODOS os eventos apareçam, descomente:
-- UPDATE public.events SET is_active = true WHERE is_active IS NULL OR is_active = false;

-- =====================================================
-- 4. VERIFICAR SE POLÍTICAS FORAM CRIADAS CORRETAMENTE
-- =====================================================

SELECT 
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN roles::text LIKE '%public%' OR roles IS NULL THEN '✅ PÚBLICO'
    ELSE '❌ RESTRITO'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('places', 'services', 'events', 'profiles')
  AND cmd = 'SELECT'
ORDER BY tablename;
