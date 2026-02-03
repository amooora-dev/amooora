-- =====================================================
-- CORRIGIR RLS PARA PERMITIR INSERT NA TABELA EVENTS
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =====================================================
-- Este script permite que qualquer pessoa possa inserir
-- eventos na tabela (necessário para cadastro sem login)
-- =====================================================

-- =====================================================
-- 1. REMOVER POLÍTICAS ANTIGAS DE INSERT (se existirem)
-- =====================================================

DO $$
BEGIN
    -- Remover políticas antigas de INSERT
    DROP POLICY IF EXISTS "events_insert_policy" ON public.events;
    DROP POLICY IF EXISTS "Allow public insert on events" ON public.events;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.events;
    DROP POLICY IF EXISTS "Enable insert for all users" ON public.events;
    
    RAISE NOTICE 'Políticas antigas de INSERT removidas (se existiam)';
END $$;

-- =====================================================
-- 2. CRIAR NOVA POLÍTICA DE INSERT PÚBLICA
-- =====================================================

CREATE POLICY "Allow public insert on events"
ON public.events
FOR INSERT
TO public
WITH CHECK (true);

-- =====================================================
-- 3. VERIFICAR SE RLS ESTÁ HABILITADO
-- =====================================================

-- Garantir que RLS está habilitado na tabela
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. VERIFICAR POLÍTICAS CRIADAS
-- =====================================================

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'events'
ORDER BY policyname;

-- =====================================================
-- 5. TESTAR INSERT (OPCIONAL - pode comentar após testar)
-- =====================================================

-- Descomente as linhas abaixo para testar o INSERT:
/*
INSERT INTO public.events (
    name,
    description,
    date,
    location,
    category,
    is_active,
    participants_count
) VALUES (
    'Evento de Teste RLS',
    'Teste de inserção após correção de RLS',
    NOW() + INTERVAL '7 days',
    'Local de Teste',
    'Outros',
    true,
    0
);

-- Verificar se foi inserido
SELECT id, name, created_at 
FROM public.events 
WHERE name = 'Evento de Teste RLS'
ORDER BY created_at DESC 
LIMIT 1;

-- Remover o evento de teste (opcional)
-- DELETE FROM public.events WHERE name = 'Evento de Teste RLS';
*/

DO $$
BEGIN
    RAISE NOTICE '✅ Política de INSERT criada com sucesso para a tabela events!';
    RAISE NOTICE 'Agora é possível cadastrar eventos sem erro de RLS.';
END $$;
