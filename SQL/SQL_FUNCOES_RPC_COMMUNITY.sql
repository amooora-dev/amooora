-- =====================================================
-- FUNÇÕES RPC PARA SISTEMA DE COMUNIDADE
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =====================================================
-- Este script cria funções RPC para incrementar/decrementar
-- contadores de likes e replies nos posts da comunidade
-- =====================================================

-- =====================================================
-- 1. INCREMENTAR CONTADOR DE LIKES
-- =====================================================

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

-- =====================================================
-- 2. DECREMENTAR CONTADOR DE LIKES
-- =====================================================

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

-- =====================================================
-- 3. INCREMENTAR CONTADOR DE REPLIES
-- =====================================================

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

-- =====================================================
-- 4. DECREMENTAR CONTADOR DE REPLIES
-- =====================================================

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
-- VERIFICAR FUNÇÕES CRIADAS
-- =====================================================

SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%likes_count%' OR routine_name LIKE '%replies_count%'
ORDER BY routine_name;
