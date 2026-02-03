-- Script para limpar usuários de teste no Supabase
-- CUIDADO: Execute com cuidado e sempre faça backup antes!

-- ============================================
-- 1. VERIFICAR USUÁRIOS NÃO VERIFICADOS
-- ============================================
-- Execute esta query primeiro para ver quais usuários serão afetados

SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN 'Não verificado'
    ELSE 'Verificado'
  END as status,
  EXTRACT(EPOCH FROM (NOW() - created_at))/3600 as horas_desde_criacao
FROM auth.users
ORDER BY created_at DESC
LIMIT 50;

-- ============================================
-- 2. DELETAR USUÁRIOS NÃO VERIFICADOS (ÚLTIMAS 24H)
-- ============================================
-- Remove apenas usuários não verificados criados nas últimas 24 horas

DELETE FROM auth.users
WHERE email_confirmed_at IS NULL
AND created_at < NOW() - INTERVAL '1 hour'
AND created_at > NOW() - INTERVAL '24 hours';

-- ============================================
-- 3. DELETAR USUÁRIOS DE TESTE POR EMAIL
-- ============================================
-- Deletar usuários com emails específicos de teste
-- Ajuste os emails conforme necessário

DELETE FROM auth.users
WHERE email LIKE '%teste%'
   OR email LIKE '%test%'
   OR email LIKE '%@example.com'
   OR email LIKE '%@mailinator.com';

-- ============================================
-- 4. DELETAR USUÁRIOS ANTIGOS NÃO VERIFICADOS
-- ============================================
-- Remove usuários não verificados com mais de 7 dias

DELETE FROM auth.users
WHERE email_confirmed_at IS NULL
AND created_at < NOW() - INTERVAL '7 days';

-- ============================================
-- 5. LIMPAR PERFIS ÓRFÃOS
-- ============================================
-- Remove perfis que não têm usuário correspondente

DELETE FROM profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- ============================================
-- 6. VERIFICAR RESULTADO
-- ============================================
-- Execute após as limpezas para verificar

SELECT 
  COUNT(*) as total_usuarios,
  COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as nao_verificados,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as verificados
FROM auth.users;
