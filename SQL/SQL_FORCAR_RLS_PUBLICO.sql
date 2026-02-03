-- =====================================================
-- FORÇAR POLÍTICAS RLS PÚBLICAS - GARANTIR QUE FUNCIONA
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =====================================================

-- =====================================================
-- REMOVER TODAS AS POLÍTICAS EXISTENTES
-- =====================================================

-- Remover todas as políticas de places
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'places') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.places';
    END LOOP;
END $$;

-- Remover todas as políticas de services
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'services') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.services';
    END LOOP;
END $$;

-- Remover todas as políticas de events
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'events') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.events';
    END LOOP;
END $$;

-- Remover todas as políticas de profiles
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.profiles';
    END LOOP;
END $$;

-- =====================================================
-- GARANTIR QUE RLS ESTÁ HABILITADO
-- =====================================================

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CRIAR POLÍTICAS PÚBLICAS DE SELECT
-- =====================================================

-- PLACES: SELECT PÚBLICO (TODOS PODEM VER)
CREATE POLICY "public_select_places"
ON public.places FOR SELECT
TO public
USING (true);

-- SERVICES: SELECT PÚBLICO (TODOS PODEM VER)
CREATE POLICY "public_select_services"
ON public.services FOR SELECT
TO public
USING (true);

-- EVENTS: SELECT PÚBLICO (TODOS PODEM VER)
CREATE POLICY "public_select_events"
ON public.events FOR SELECT
TO public
USING (true);

-- PROFILES: SELECT PÚBLICO (TODOS PODEM VER)
CREATE POLICY "public_select_profiles"
ON public.profiles FOR SELECT
TO public
USING (true);

-- =====================================================
-- TESTAR SE AS POLÍTICAS FUNCIONAM
-- =====================================================

-- Testar consultas (deve retornar dados se houver)
SELECT 
  'places' as tabela,
  COUNT(*) as total_registros,
  COUNT(*) FILTER (WHERE is_safe = true) as com_is_safe_true
FROM public.places
UNION ALL
SELECT 
  'services' as tabela,
  COUNT(*) as total_registros,
  COUNT(*) FILTER (WHERE is_active = true) as com_is_active_true
FROM public.services
UNION ALL
SELECT 
  'events' as tabela,
  COUNT(*) as total_registros,
  COUNT(*) FILTER (WHERE is_active = true) as com_is_active_true
FROM public.events;

-- =====================================================
-- VERIFICAR POLÍTICAS CRIADAS
-- =====================================================

SELECT 
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN roles::text LIKE '%public%' OR roles IS NULL THEN '✅ PÚBLICO'
    ELSE '❌ RESTRITO'
  END as status,
  qual as condicao
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('places', 'services', 'events', 'profiles')
  AND cmd = 'SELECT'
ORDER BY tablename;
