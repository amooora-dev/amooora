-- =====================================================
-- INSERIR 2 REVIEWS DE TESTE PARA CADA CONTEÚDO
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =====================================================
-- Este script insere 2 avaliações para cada lugar, serviço e evento existente
-- =====================================================

-- =====================================================
-- 0. PREPARAR TABELA REVIEWS PARA REVIEWS SEM LOGIN
-- =====================================================

-- Criar coluna author_name se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'reviews' 
        AND column_name = 'author_name'
    ) THEN
        ALTER TABLE public.reviews 
        ADD COLUMN author_name TEXT;
        
        RAISE NOTICE 'Coluna author_name criada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna author_name já existe.';
    END IF;
END $$;

-- Tornar user_id nullable se ainda não for (permite reviews sem login)
DO $$ 
BEGIN
    -- Verificar se user_id é NOT NULL
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'reviews' 
        AND column_name = 'user_id'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.reviews 
        ALTER COLUMN user_id DROP NOT NULL;
        
        RAISE NOTICE 'Coluna user_id agora permite valores NULL (reviews sem login habilitadas)!';
    ELSE
        RAISE NOTICE 'Coluna user_id já permite valores NULL.';
    END IF;
END $$;

-- =====================================================
-- 1. REVIEWS PARA LOCAIS (PLACES)
-- =====================================================

-- Review 1 para cada local
INSERT INTO public.reviews (
  place_id,
  rating,
  comment,
  author_name,
  created_at
)
SELECT 
  id as place_id,
  5 as rating,
  'Lugar incrível! Ambiente super acolhedor e seguro para a comunidade LGBTQIA+. A equipe é muito respeitosa e o espaço é inclusivo. Recomendo muito para quem busca um lugar onde pode ser você mesmo!' as comment,
  'Ana Costa' as author_name,
  NOW() - INTERVAL '2 days' as created_at
FROM public.places
WHERE is_safe = true
ORDER BY created_at DESC;

-- Review 2 para cada local
INSERT INTO public.reviews (
  place_id,
  rating,
  comment,
  author_name,
  created_at
)
SELECT 
  id as place_id,
  4 as rating,
  'Ótimo lugar! O ambiente é muito acolhedor e o atendimento é impecável. A decoração é linda e o espaço transmite segurança. Único ponto negativo é que pode ficar bem cheio nos finais de semana, mas vale a pena esperar!' as comment,
  'Julia Ferreira' as author_name,
  NOW() - INTERVAL '5 days' as created_at
FROM public.places
WHERE is_safe = true
ORDER BY created_at DESC;

-- =====================================================
-- 2. REVIEWS PARA SERVIÇOS (SERVICES)
-- =====================================================

-- Review 1 para cada serviço ativo
INSERT INTO public.reviews (
  service_id,
  rating,
  comment,
  author_name,
  created_at
)
SELECT 
  id as service_id,
  5 as rating,
  'Serviço excelente! Profissional muito qualificado e atencioso. Me senti completamente à vontade durante todo o atendimento. Espaço seguro e acolhedor para pessoas LGBTQIA+. Recomendo sem hesitação!' as comment,
  'Carlos Mendes' as author_name,
  NOW() - INTERVAL '3 days' as created_at
FROM public.services
WHERE is_active = true
ORDER BY created_at DESC;

-- Review 2 para cada serviço ativo
INSERT INTO public.reviews (
  service_id,
  rating,
  comment,
  author_name,
  created_at
)
SELECT 
  id as service_id,
  4 as rating,
  'Atendimento muito bom! O profissional demonstrou grande conhecimento e empatia. Ambiente seguro e respeitoso. O único ponto que poderia melhorar é a disponibilidade de horários, mas a qualidade compensa!' as comment,
  'Patricia Lima' as author_name,
  NOW() - INTERVAL '1 week' as created_at
FROM public.services
WHERE is_active = true
ORDER BY created_at DESC;

-- =====================================================
-- 3. REVIEWS PARA EVENTOS (EVENTS)
-- =====================================================

-- Review 1 para cada evento ativo
INSERT INTO public.reviews (
  event_id,
  rating,
  comment,
  author_name,
  created_at
)
SELECT 
  id as event_id,
  5 as rating,
  'Evento fantástico! Organização impecável e ambiente super seguro e inclusivo. Foi uma experiência maravilhosa poder celebrar a diversidade em um espaço tão acolhedor. Com certeza vou participar novamente!' as comment,
  'Rafael Souza' as author_name,
  NOW() - INTERVAL '1 day' as created_at
FROM public.events
WHERE is_active = true
ORDER BY created_at DESC;

-- Review 2 para cada evento ativo
INSERT INTO public.reviews (
  event_id,
  rating,
  comment,
  author_name,
  created_at
)
SELECT 
  id as event_id,
  4 as rating,
  'Ótimo evento! A programação foi interessante e o espaço estava bem organizado. Ambiente seguro e respeitoso para toda a comunidade LGBTQIA+. Só achei que poderia ter mais opções de alimentação, mas no geral foi excelente!' as comment,
  'Mariana Santos' as author_name,
  NOW() - INTERVAL '4 days' as created_at
FROM public.events
WHERE is_active = true
ORDER BY created_at DESC;

-- =====================================================
-- VERIFICAR REVIEWS INSERIDAS
-- =====================================================

-- Verificar total de reviews inseridas
SELECT 
  'Total de Reviews' as tipo,
  COUNT(*) as quantidade
FROM public.reviews;

-- Verificar reviews por tipo
SELECT 
  'Reviews de Locais' as tipo,
  COUNT(*) as quantidade
FROM public.reviews
WHERE place_id IS NOT NULL

UNION ALL

SELECT 
  'Reviews de Serviços' as tipo,
  COUNT(*) as quantidade
FROM public.reviews
WHERE service_id IS NOT NULL

UNION ALL

SELECT 
  'Reviews de Eventos' as tipo,
  COUNT(*) as quantidade
FROM public.reviews
WHERE event_id IS NOT NULL;

-- Listar algumas reviews inseridas
SELECT 
  CASE 
    WHEN place_id IS NOT NULL THEN 'Local'
    WHEN service_id IS NOT NULL THEN 'Serviço'
    WHEN event_id IS NOT NULL THEN 'Evento'
  END as tipo,
  author_name,
  rating,
  LEFT(comment, 50) || '...' as comentario_preview,
  created_at
FROM public.reviews
ORDER BY created_at DESC
LIMIT 10;
