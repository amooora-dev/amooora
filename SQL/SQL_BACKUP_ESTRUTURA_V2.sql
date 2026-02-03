-- =====================================================
-- BACKUP DA ESTRUTURA DO SUPABASE - VERSÃO 2.0.0
-- Amooora - Estrutura Completa do Banco de Dados
-- =====================================================
-- Data: Janeiro de 2025
-- Versão: 2.0.0
-- Projeto: Amooora-Dev
-- =====================================================
-- Este script contém a estrutura completa do banco de dados
-- incluindo todas as tabelas, colunas, constraints, RLS policies
-- e funções RPC criadas até a versão 2.0.0
-- =====================================================

-- =====================================================
-- 1. ESTRUTURA DE TABELAS
-- =====================================================

-- Tabela: profiles
-- NOTA: Esta tabela já existe nas migrations base
-- Colunas adicionais na V2.0.0: username (se aplicável)

-- Tabela: places
-- NOTA: Esta tabela já existe nas migrations base
-- Colunas adicionais na V2.0.0: tags (text[])

-- Adicionar coluna tags se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'places'
        AND column_name = 'tags'
    ) THEN
        ALTER TABLE public.places
        ADD COLUMN tags TEXT[];
        RAISE NOTICE 'Coluna tags adicionada à tabela places.';
    ELSE
        RAISE NOTICE 'Coluna tags já existe na tabela places.';
    END IF;
END $$;

-- =====================================================
-- 2. ADICIONAR CAMPOS V2.0.0 - SERVICES
-- =====================================================

-- Phone
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'phone'
    ) THEN
        ALTER TABLE public.services ADD COLUMN phone TEXT;
        RAISE NOTICE 'Coluna phone adicionada à tabela services.';
    END IF;
END $$;

-- WhatsApp
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'whatsapp'
    ) THEN
        ALTER TABLE public.services ADD COLUMN whatsapp TEXT;
        RAISE NOTICE 'Coluna whatsapp adicionada à tabela services.';
    END IF;
END $$;

-- Address
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'address'
    ) THEN
        ALTER TABLE public.services ADD COLUMN address TEXT;
        RAISE NOTICE 'Coluna address adicionada à tabela services.';
    END IF;
END $$;

-- Specialties (JSONB)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'specialties'
    ) THEN
        ALTER TABLE public.services ADD COLUMN specialties JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Coluna specialties (JSONB) adicionada à tabela services.';
    END IF;
END $$;

-- Hours (JSONB)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'hours'
    ) THEN
        ALTER TABLE public.services ADD COLUMN hours JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE 'Coluna hours (JSONB) adicionada à tabela services.';
    END IF;
END $$;

-- =====================================================
-- 3. ADICIONAR CAMPOS V2.0.0 - EVENTS
-- =====================================================

-- End Time
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'end_time'
    ) THEN
        ALTER TABLE public.events ADD COLUMN end_time TIMESTAMPTZ;
        RAISE NOTICE 'Coluna end_time (TIMESTAMPTZ) adicionada à tabela events.';
    END IF;
END $$;

-- =====================================================
-- 4. ADICIONAR CAMPOS V2.0.0 - REVIEWS
-- =====================================================

-- Author Name
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'author_name'
    ) THEN
        ALTER TABLE public.reviews ADD COLUMN author_name TEXT;
        RAISE NOTICE 'Coluna author_name adicionada à tabela reviews.';
    END IF;
END $$;

-- Tornar user_id nullable
DO $$
BEGIN
    IF (SELECT is_nullable FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'user_id') = 'NO' THEN
        ALTER TABLE public.reviews ALTER COLUMN user_id DROP NOT NULL;
        RAISE NOTICE 'Coluna user_id alterada para NULLABLE na tabela reviews.';
    END IF;
END $$;

-- =====================================================
-- 5. ADICIONAR CAMPOS V2.0.0 - POST_REPLIES
-- =====================================================

-- Author Name
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'post_replies' AND column_name = 'author_name'
    ) THEN
        ALTER TABLE public.post_replies ADD COLUMN author_name TEXT;
        RAISE NOTICE 'Coluna author_name adicionada à tabela post_replies.';
    END IF;
END $$;

-- Tornar user_id nullable
DO $$
BEGIN
    IF (SELECT is_nullable FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'post_replies' AND column_name = 'user_id') = 'NO' THEN
        ALTER TABLE public.post_replies ALTER COLUMN user_id DROP NOT NULL;
        RAISE NOTICE 'Coluna user_id alterada para NULLABLE na tabela post_replies.';
    END IF;
END $$;

-- =====================================================
-- 6. FUNÇÕES RPC - COMUNIDADE
-- =====================================================

-- Incrementar Likes
CREATE OR REPLACE FUNCTION increment_likes_count(post_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE community_posts
  SET likes_count = likes_count + 1
  WHERE id = post_id_param;
END;
$$;

-- Decrementar Likes
CREATE OR REPLACE FUNCTION decrement_likes_count(post_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE community_posts
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = post_id_param;
END;
$$;

-- Incrementar Replies
CREATE OR REPLACE FUNCTION increment_replies_count(post_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE community_posts
  SET replies_count = replies_count + 1
  WHERE id = post_id_param;
END;
$$;

-- Decrementar Replies
CREATE OR REPLACE FUNCTION decrement_replies_count(post_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE community_posts
  SET replies_count = GREATEST(0, replies_count - 1)
  WHERE id = post_id_param;
END;
$$;

-- =====================================================
-- 7. VERIFICAÇÃO DA ESTRUTURA
-- =====================================================

-- Verificar todas as colunas das tabelas principais
SELECT 
    'services' as tabela,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'services'
AND column_name IN ('phone', 'whatsapp', 'address', 'specialties', 'hours')
ORDER BY column_name

UNION ALL

SELECT 
    'events' as tabela,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'events'
AND column_name = 'end_time'

UNION ALL

SELECT 
    'reviews' as tabela,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'reviews'
AND column_name IN ('author_name', 'user_id')
ORDER BY column_name

UNION ALL

SELECT 
    'post_replies' as tabela,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'post_replies'
AND column_name IN ('author_name', 'user_id')
ORDER BY column_name;

-- Verificar funções RPC criadas
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'increment_likes_count',
    'decrement_likes_count',
    'increment_replies_count',
    'decrement_replies_count'
)
ORDER BY routine_name;

-- =====================================================
-- FIM DO BACKUP
-- =====================================================
-- Este script garante que todas as estruturas V2.0.0
-- estejam presentes no banco de dados.
-- Execute este script após aplicar as migrations base V1.0.0
-- =====================================================
