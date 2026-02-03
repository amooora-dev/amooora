-- =====================================================
-- FLEXIBILIZAR RLS TEMPORARIAMENTE - PERMITIR ACESSO TOTAL
-- ATENÇÃO: Esta é uma configuração temporária para testes!
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =====================================================

-- =====================================================
-- REMOVER TODAS AS POLÍTICAS EXISTENTES
-- =====================================================

-- Remover TODAS as políticas de places
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'places') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.places';
    END LOOP;
END $$;

-- Remover TODAS as políticas de services
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'services') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.services';
    END LOOP;
END $$;

-- Remover TODAS as políticas de events
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'events') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.events';
    END LOOP;
END $$;

-- Remover TODAS as políticas de profiles
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
-- CRIAR POLÍTICAS PERMISSIVAS TEMPORÁRIAS
-- =====================================================

-- PLACES: Acesso TOTAL para todos (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "temp_public_all_places"
ON public.places FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- SERVICES: Acesso TOTAL para todos (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "temp_public_all_services"
ON public.services FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- EVENTS: Acesso TOTAL para todos (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "temp_public_all_events"
ON public.events FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- PROFILES: Acesso TOTAL para todos (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "temp_public_all_profiles"
ON public.profiles FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- =====================================================
-- VERIFICAR POLÍTICAS CRIADAS
-- =====================================================

SELECT 
  tablename,
  policyname,
  cmd,
  roles,
  CASE 
    WHEN roles::text LIKE '%public%' OR roles IS NULL THEN '✅ PÚBLICO'
    ELSE '❌ RESTRITO'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('places', 'services', 'events', 'profiles')
ORDER BY tablename, cmd;

-- =====================================================
-- TESTAR SE AS CONSULTAS FUNCIONAM
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
