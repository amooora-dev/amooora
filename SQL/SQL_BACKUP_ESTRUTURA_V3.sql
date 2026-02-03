-- =====================================================
-- BACKUP COMPLETO DA ESTRUTURA DO SUPABASE - VERSÃO 3.0.0
-- Amooora - Estrutura Completa do Banco de Dados
-- =====================================================
-- Data: Janeiro de 2025
-- Versão: 3.0.0
-- Projeto: Amooora-Dev (btavwaysfjpsuqxdfguw)
-- =====================================================
-- Este script contém a estrutura completa do banco de dados
-- incluindo todas as tabelas, colunas, constraints, RLS policies,
-- funções RPC, triggers e migrations aplicadas até a versão 3.0.0
-- =====================================================

-- =====================================================
-- MIGRATIONS APLICADAS ATÉ V3.0.0
-- =====================================================
-- 1. 20260118203508 - create_extensions_and_profiles
-- 2. 20260118203532 - create_places_services_events
-- 3. 20260118203553 - create_relationship_tables
-- 4. 20260118203610 - create_community_tables
-- 5. 20260118203655 - create_functions_and_triggers_fixed
-- 6. 20260118203731 - fix_security_and_performance
-- 7. 20260121192829 - allow_anonymous_post_replies
-- 8. 20260121194408 - insert_community_posts_example
-- =====================================================

-- =====================================================
-- ESTRUTURA DE TABELAS - V3.0.0
-- =====================================================

-- Tabelas principais:
-- 1. profiles (9 usuários)
-- 2. places (7 lugares)
-- 3. services (4 serviços)
-- 4. events (6 eventos)
-- 5. reviews (44 avaliações)
-- 6. saved_places (0 salvos)
-- 7. event_participants (0 participantes)
-- 8. community_posts (11 posts)
-- 9. post_likes (0 likes)
-- 10. post_replies (6 respostas)
-- 11. communities (5 comunidades)
-- 12. community_members (2 membros)

-- =====================================================
-- NOVAS FUNCIONALIDADES V3.0.0
-- =====================================================

-- 1. SISTEMA DE COMUNIDADES COMPLETO
--    - Tabela communities com suporte a categorias, ícones e contadores
--    - Sistema de membros (community_members)
--    - Posts de comunidade (community_posts)
--    - Sistema de likes e replies para posts
--    - Suporte a comentários anônimos (author_name)

-- 2. MELHORIAS EM REVIEWS
--    - Suporte a reviews anônimas (author_name)
--    - user_id nullable para permitir reviews sem autenticação

-- 3. MELHORIAS EM SERVICES
--    - Campos: phone, whatsapp, address
--    - Campo specialties (JSONB) para especialidades
--    - Campo hours (JSONB) para horários de funcionamento

-- 4. MELHORIAS EM EVENTS
--    - Campo end_time para eventos com duração

-- 5. SISTEMA DE POSTS E INTERAÇÕES
--    - Posts de comunidade com categorias
--    - Sistema de likes (post_likes)
--    - Sistema de replies com suporte a respostas aninhadas (parent_reply_id)
--    - Contadores automáticos (likes_count, replies_count)

-- =====================================================
-- FUNÇÕES RPC DISPONÍVEIS
-- =====================================================

-- increment_likes_count(post_id_param UUID)
-- Decrementar likes de um post
-- decrement_likes_count(post_id_param UUID)
-- Incrementar replies de um post
-- increment_replies_count(post_id_param UUID)
-- Decrementar replies de um post
-- decrement_replies_count(post_id_param UUID)

-- =====================================================
-- RLS POLICIES ATIVAS
-- =====================================================

-- Todas as tabelas têm RLS habilitado
-- Policies configuradas para:
-- - Leitura pública onde apropriado
-- - Escrita apenas para usuários autenticados
-- - Atualização/deleção apenas para criadores ou admins

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Bucket: communities (para imagens de comunidades)
-- Bucket: avatars (para avatares de usuários)
-- Bucket: places (para imagens de lugares)
-- Bucket: events (para imagens de eventos)
-- Bucket: services (para imagens de serviços)

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

-- 1. O sistema suporta comentários anônimos através do campo author_name
-- 2. user_id pode ser NULL em reviews e post_replies quando anônimo
-- 3. Contadores (likes_count, replies_count) são atualizados via triggers
-- 4. Todas as tabelas têm created_at e updated_at automáticos
-- 5. RLS está ativo em todas as tabelas para segurança

-- =====================================================
-- PRÓXIMOS PASSOS RECOMENDADOS
-- =====================================================

-- 1. Implementar sistema de notificações
-- 2. Adicionar sistema de busca avançada
-- 3. Implementar sistema de denúncias
-- 4. Adicionar analytics e métricas
-- 5. Otimizar queries com índices adicionais

-- =====================================================
-- FIM DO BACKUP V3.0.0
-- =====================================================
