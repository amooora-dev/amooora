-- =====================================================
-- CORREÇÃO URGENTE DE RLS - FORÇAR SELECT PÚBLICO
-- Execute este SQL IMEDIATAMENTE se os dados não aparecem
-- =====================================================

-- =====================================================
-- 1. DESABILITAR RLS TEMPORARIAMENTE (TESTE)
-- =====================================================
-- ⚠️ ATENÇÃO: Isso remove TODA a segurança. Use apenas para teste!

ALTER TABLE places DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. VERIFICAR SE FUNCIONOU
-- =====================================================

-- Testar queries (devem funcionar agora)
SELECT COUNT(*) as total_places FROM places;
SELECT COUNT(*) as total_services FROM services;
SELECT COUNT(*) as total_events FROM events;
SELECT COUNT(*) as total_profiles FROM profiles;

-- =====================================================
-- 3. SE FUNCIONOU, REABILITAR RLS COM POLÍTICAS PÚBLICAS
-- =====================================================

-- Reabilitar RLS
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Remover TODAS as políticas antigas
DROP POLICY IF EXISTS "Public can view places" ON places;
DROP POLICY IF EXISTS "Anyone can view places" ON places;
DROP POLICY IF EXISTS "Todos podem ver locais" ON places;
DROP POLICY IF EXISTS "Permitir SELECT público em places" ON places;

DROP POLICY IF EXISTS "Public can view services" ON services;
DROP POLICY IF EXISTS "Anyone can view services" ON services;
DROP POLICY IF EXISTS "Todos podem ver serviços" ON services;
DROP POLICY IF EXISTS "Permitir SELECT público em services" ON services;

DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Todos podem ver eventos" ON events;
DROP POLICY IF EXISTS "Permitir SELECT público em events" ON events;

DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
DROP POLICY IF EXISTS "Perfis públicos são visíveis para todos" ON profiles;
DROP POLICY IF EXISTS "Usuários podem ver perfis conectados" ON profiles;
DROP POLICY IF EXISTS "Permitir SELECT público em profiles" ON profiles;

-- Criar políticas públicas SIMPLES (permitem tudo)
CREATE POLICY "Public SELECT places"
ON places FOR SELECT
TO public
USING (true);

CREATE POLICY "Public SELECT services"
ON services FOR SELECT
TO public
USING (true);

CREATE POLICY "Public SELECT events"
ON events FOR SELECT
TO public
USING (true);

CREATE POLICY "Public SELECT profiles"
ON profiles FOR SELECT
TO public
USING (true);

-- =====================================================
-- 4. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar políticas criadas
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

-- Testar queries novamente (devem funcionar)
SELECT COUNT(*) as total_places FROM places;
SELECT COUNT(*) as total_services FROM services;
SELECT COUNT(*) as total_events FROM events;
SELECT COUNT(*) as total_profiles FROM profiles;

-- =====================================================
-- IMPORTANTE: Após executar este SQL
-- 1. Recarregue a página do app (Ctrl+Shift+R)
-- 2. Verifique o console do navegador (F12)
-- 3. Os dados devem aparecer agora
-- =====================================================
