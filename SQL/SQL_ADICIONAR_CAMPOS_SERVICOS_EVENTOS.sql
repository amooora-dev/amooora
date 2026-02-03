-- =====================================================
-- ADICIONAR CAMPOS PARA SERVIÇOS E EVENTOS
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =====================================================
-- Este script adiciona os campos necessários para:
-- - Serviços: telefone, whatsapp, endereço, especialidades, horários
-- - Eventos: horário de término
-- =====================================================

-- =====================================================
-- 1. ADICIONAR CAMPOS NA TABELA SERVICES
-- =====================================================

-- Telefone
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'services'
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE public.services
        ADD COLUMN phone TEXT;
        RAISE NOTICE 'Coluna phone criada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna phone já existe.';
    END IF;
END $$;

-- WhatsApp
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'services'
        AND column_name = 'whatsapp'
    ) THEN
        ALTER TABLE public.services
        ADD COLUMN whatsapp TEXT;
        RAISE NOTICE 'Coluna whatsapp criada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna whatsapp já existe.';
    END IF;
END $$;

-- Endereço
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'services'
        AND column_name = 'address'
    ) THEN
        ALTER TABLE public.services
        ADD COLUMN address TEXT;
        RAISE NOTICE 'Coluna address criada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna address já existe.';
    END IF;
END $$;

-- Especialidades (JSONB para array de strings)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'services'
        AND column_name = 'specialties'
    ) THEN
        ALTER TABLE public.services
        ADD COLUMN specialties JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Coluna specialties criada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna specialties já existe.';
    END IF;
END $$;

-- Horários de funcionamento (JSONB para objeto com dias da semana)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'services'
        AND column_name = 'hours'
    ) THEN
        ALTER TABLE public.services
        ADD COLUMN hours JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE 'Coluna hours criada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna hours já existe.';
    END IF;
END $$;

-- =====================================================
-- 2. ADICIONAR CAMPO NA TABELA EVENTS
-- =====================================================

-- Horário de término (timestamptz para manter consistência com date)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'events'
        AND column_name = 'end_time'
    ) THEN
        ALTER TABLE public.events
        ADD COLUMN end_time TIMESTAMPTZ;
        RAISE NOTICE 'Coluna end_time criada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna end_time já existe.';
    END IF;
END $$;

-- =====================================================
-- 3. VERIFICAR COLUNAS ADICIONADAS
-- =====================================================

-- Verificar colunas da tabela services
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'services'
AND column_name IN ('phone', 'whatsapp', 'address', 'specialties', 'hours')
ORDER BY column_name;

-- Verificar colunas da tabela events
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'events'
AND column_name = 'end_time'
ORDER BY column_name;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
