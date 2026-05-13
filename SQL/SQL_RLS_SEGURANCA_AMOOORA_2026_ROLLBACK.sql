-- =============================================================================
-- ROLLBACK — remove alterações de SQL_RLS_SEGURANCA_AMOOORA_2026.sql
-- =============================================================================
-- AVISO IMPORTANTE:
-- Após executar este script, as tabelas abaixo podem ficar SEM políticas RLS
-- (só RLS ligado = acesso negado por defeito), a menos que volte a aplicar
-- um script antigo de políticas que tenha GUARDADO antes da migração.
--
-- Formas seguras de "voltar atrás":
-- 1) Preferida: Supabase Dashboard → Database → Backups → restaurar ponto
--    anterior (depende do plano; ver documentação Supabase).
-- 2) Executar ESTE ficheiro e, em seguida, colar no SQL Editor o resultado
--    que exportou com SQL_RLS_SEGURANCA_AMOOORA_2026_ANTES_EXPORT.sql (se
--    guardou os DROP/CREATE antigos manualmente).
-- 3) Re-executar um script legado do repositório (ex. SQL_CORRIGIR_RLS_SEGURO.sql)
--    só se souber que reflete o estado desejado — pode ser permissivo demais.
-- =============================================================================

-- Políticas criadas pelo script 2026 (prefixo amo2026_)
DROP POLICY IF EXISTS amo2026_places_select ON public.places;
DROP POLICY IF EXISTS amo2026_places_insert ON public.places;
DROP POLICY IF EXISTS amo2026_places_update ON public.places;
DROP POLICY IF EXISTS amo2026_places_delete ON public.places;

DROP POLICY IF EXISTS amo2026_events_select ON public.events;
DROP POLICY IF EXISTS amo2026_events_insert ON public.events;
DROP POLICY IF EXISTS amo2026_events_update ON public.events;
DROP POLICY IF EXISTS amo2026_events_delete ON public.events;

DROP POLICY IF EXISTS amo2026_services_select ON public.services;
DROP POLICY IF EXISTS amo2026_services_insert ON public.services;
DROP POLICY IF EXISTS amo2026_services_update ON public.services;
DROP POLICY IF EXISTS amo2026_services_delete ON public.services;

DROP POLICY IF EXISTS amo2026_communities_select ON public.communities;
DROP POLICY IF EXISTS amo2026_communities_insert ON public.communities;
DROP POLICY IF EXISTS amo2026_communities_update ON public.communities;
DROP POLICY IF EXISTS amo2026_communities_delete ON public.communities;

DROP POLICY IF EXISTS amo2026_profiles_select ON public.profiles;
DROP POLICY IF EXISTS amo2026_profiles_insert ON public.profiles;
DROP POLICY IF EXISTS amo2026_profiles_update ON public.profiles;
DROP POLICY IF EXISTS amo2026_profiles_delete ON public.profiles;

DROP POLICY IF EXISTS amo2026_reviews_select ON public.reviews;
DROP POLICY IF EXISTS amo2026_reviews_insert ON public.reviews;
DROP POLICY IF EXISTS amo2026_reviews_update ON public.reviews;
DROP POLICY IF EXISTS amo2026_reviews_delete ON public.reviews;

DO $rollback_contact$
BEGIN
  IF to_regclass('public.contact_messages') IS NOT NULL THEN
    DROP POLICY IF EXISTS amo2026_contact_insert ON public.contact_messages;
    DROP POLICY IF EXISTS amo2026_contact_select_own ON public.contact_messages;
    DROP POLICY IF EXISTS amo2026_contact_select_admin ON public.contact_messages;
    DROP POLICY IF EXISTS amo2026_contact_update_admin ON public.contact_messages;
  END IF;
END
$rollback_contact$;

-- Funções introduzidas ou substituídas pelo script 2026 (papéis por área).
-- is_admin_geral() pode já existir noutros fluxos: NÃO é removida aqui.
DROP FUNCTION IF EXISTS public.is_admin_locais();
DROP FUNCTION IF EXISTS public.is_admin_eventos();
DROP FUNCTION IF EXISTS public.is_admin_servicos();

-- Colunas adicionadas pelo 2026 (opcional: só remova se tiver a certeza de
-- que nenhum dado/app depende delas). Por defeito ficam comentadas.
-- ALTER TABLE public.communities DROP COLUMN IF EXISTS curation_status;
-- ALTER TABLE public.communities DROP COLUMN IF EXISTS created_by;
