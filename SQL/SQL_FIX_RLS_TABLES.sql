-- =====================================================
-- CORRIGIR POLÍTICAS RLS DAS TABELAS
-- Permite INSERT/UPDATE/DELETE sem autenticação (temporário)
-- =====================================================
-- Execute este SQL no SQL Editor do Supabase Dashboard
-- Dashboard: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
-- =====================================================

-- =====================================================
-- TABELA: places
-- =====================================================

-- Remover políticas antigas da tabela places
DROP POLICY IF EXISTS "Public can view places" ON places;
DROP POLICY IF EXISTS "Anyone can view places" ON places;
DROP POLICY IF EXISTS "Authenticated users can insert places" ON places;
DROP POLICY IF EXISTS "Public can insert places" ON places;
DROP POLICY IF EXISTS "Creator can update places" ON places;
DROP POLICY IF EXISTS "Public can update places" ON places;
DROP POLICY IF EXISTS "Creator can delete places" ON places;
DROP POLICY IF EXISTS "Public can delete places" ON places;

-- Política de SELECT (leitura pública)
CREATE POLICY "Public can view places"
ON places FOR SELECT
USING (true);

-- Política de INSERT (inserção pública - temporário)
CREATE POLICY "Public can insert places"
ON places FOR INSERT
WITH CHECK (true);

-- Política de UPDATE (atualização pública - temporário)
CREATE POLICY "Public can update places"
ON places FOR UPDATE
USING (true)
WITH CHECK (true);

-- Política de DELETE (exclusão pública - temporário)
CREATE POLICY "Public can delete places"
ON places FOR DELETE
USING (true);

-- =====================================================
-- TABELA: services
-- =====================================================

-- Remover políticas antigas da tabela services
DROP POLICY IF EXISTS "Public can view services" ON services;
DROP POLICY IF EXISTS "Anyone can view services" ON services;
DROP POLICY IF EXISTS "Authenticated users can insert services" ON services;
DROP POLICY IF EXISTS "Public can insert services" ON services;
DROP POLICY IF EXISTS "Creator can update services" ON services;
DROP POLICY IF EXISTS "Public can update services" ON services;
DROP POLICY IF EXISTS "Creator can delete services" ON services;
DROP POLICY IF EXISTS "Public can delete services" ON services;

-- Política de SELECT (leitura pública)
CREATE POLICY "Public can view services"
ON services FOR SELECT
USING (true);

-- Política de INSERT (inserção pública - temporário)
CREATE POLICY "Public can insert services"
ON services FOR INSERT
WITH CHECK (true);

-- Política de UPDATE (atualização pública - temporário)
CREATE POLICY "Public can update services"
ON services FOR UPDATE
USING (true)
WITH CHECK (true);

-- Política de DELETE (exclusão pública - temporário)
CREATE POLICY "Public can delete services"
ON services FOR DELETE
USING (true);

-- =====================================================
-- TABELA: events
-- =====================================================

-- Remover políticas antigas da tabela events
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Anyone can view events" ON events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON events;
DROP POLICY IF EXISTS "Public can insert events" ON events;
DROP POLICY IF EXISTS "Creator can update events" ON events;
DROP POLICY IF EXISTS "Public can update events" ON events;
DROP POLICY IF EXISTS "Creator can delete events" ON events;
DROP POLICY IF EXISTS "Public can delete events" ON events;

-- Política de SELECT (leitura pública)
CREATE POLICY "Public can view events"
ON events FOR SELECT
USING (true);

-- Política de INSERT (inserção pública - temporário)
CREATE POLICY "Public can insert events"
ON events FOR INSERT
WITH CHECK (true);

-- Política de UPDATE (atualização pública - temporário)
CREATE POLICY "Public can update events"
ON events FOR UPDATE
USING (true)
WITH CHECK (true);

-- Política de DELETE (exclusão pública - temporário)
CREATE POLICY "Public can delete events"
ON events FOR DELETE
USING (true);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar políticas criadas para places
SELECT policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'places'
ORDER BY policyname;

-- Verificar políticas criadas para services
SELECT policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'services'
ORDER BY policyname;

-- Verificar políticas criadas para events
SELECT policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'events'
ORDER BY policyname;
