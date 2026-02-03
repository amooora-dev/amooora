-- =====================================================
-- ADICIONAR COLUNA community_id NA TABELA reviews
-- =====================================================
-- Data: Janeiro de 2025
-- Descrição: Adiciona suporte para reviews de comunidades
-- =====================================================

-- Adicionar coluna community_id na tabela reviews
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE;

-- Criar índice para melhorar performance de queries
CREATE INDEX IF NOT EXISTS idx_reviews_community_id ON public.reviews(community_id) 
WHERE community_id IS NOT NULL;

-- Adicionar constraint para garantir que apenas um tipo de review seja preenchido
-- (já existe lógica no código, mas podemos adicionar check constraint se necessário)
-- Por enquanto, vamos confiar na lógica da aplicação

-- Comentário na coluna
COMMENT ON COLUMN public.reviews.community_id IS 'ID da comunidade avaliada (opcional, apenas um de place_id, service_id, event_id ou community_id deve ser preenchido)';
