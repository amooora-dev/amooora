-- =============================================================================
-- AMOOORA — RLS e funções auxiliares (segurança Supabase) — 2026
-- =============================================================================
-- Execute no Supabase: SQL Editor → New query.
-- Sem ambiente de staging: veja MD 2026/SUPABASE_RLS_APLICACAO.md (backup,
-- export antes, rollback).
--
-- Objetivos:
-- 1) Leitura pública só do catálogo aprovado e ativo (places, events, services,
--    communities), com exceção para criadoras e curadoras/admins.
-- 2) Escrita (INSERT/UPDATE/DELETE) sem sessão anônima nessas tabelas.
-- 3) Funções SECURITY DEFINER para papéis admin (alinhado a profiles.role).
-- 4) Corrigir contact_messages: papel admin → admin_geral (e variantes).
--
-- Pré-requisitos sugeridos (idempotentes):
-- - places: coluna is_safe (catálogo “ativo”); created_by; curation_status.
-- - events/services/communities: is_active; curation_status onde aplicável.
-- - O bloco 0a abaixo cria colunas em falta (IF NOT EXISTS).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0a) Colunas usadas nas políticas (evita erro "column does not exist")
--     places usa is_safe no app — RLS de places usa is_safe, não is_active.
-- -----------------------------------------------------------------------------
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS is_safe boolean NOT NULL DEFAULT true;
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS curation_status text NOT NULL DEFAULT 'approved';

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS curation_status text NOT NULL DEFAULT 'approved';

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS curation_status text NOT NULL DEFAULT 'approved';

ALTER TABLE public.communities
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- -----------------------------------------------------------------------------
-- 0) Colunas de curadoria só em communities (CHECK); places/events/services
--    já recebem curation_status no bloco 0a, salvo se já existirem.
-- -----------------------------------------------------------------------------
ALTER TABLE public.communities
  ADD COLUMN IF NOT EXISTS curation_status text NOT NULL DEFAULT 'approved'
  CHECK (curation_status IN ('pending', 'approved', 'rejected'));

-- -----------------------------------------------------------------------------
-- 1) Funções de papel (SECURITY DEFINER — leem profiles com search_path fixo)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin_geral()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.status = 'active'
      AND p.role = 'admin_geral'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_locais()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.status = 'active'
      AND p.role IN ('admin_geral', 'admin_locais')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_eventos()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.status = 'active'
      AND p.role IN ('admin_geral', 'admin_eventos')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_servicos()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.status = 'active'
      AND p.role IN ('admin_geral', 'admin_servicos')
  );
$$;

-- -----------------------------------------------------------------------------
-- 2) PLACES — remover políticas conhecidas (nomes legados) e recriar
-- -----------------------------------------------------------------------------
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public SELECT places" ON public.places;
DROP POLICY IF EXISTS "Public can view places" ON public.places;
DROP POLICY IF EXISTS "Anyone can view places" ON public.places;
DROP POLICY IF EXISTS "Todos podem ver locais" ON public.places;
DROP POLICY IF EXISTS "Permitir SELECT público em places" ON public.places;
DROP POLICY IF EXISTS "temp_public_all_places" ON public.places;
DROP POLICY IF EXISTS "Public can insert places" ON public.places;
DROP POLICY IF EXISTS "Public can update places" ON public.places;
DROP POLICY IF EXISTS "Public can delete places" ON public.places;
DROP POLICY IF EXISTS "Authenticated users can insert places" ON public.places;
DROP POLICY IF EXISTS "Creator can update places" ON public.places;
DROP POLICY IF EXISTS "Creator can delete places" ON public.places;
DROP POLICY IF EXISTS "Authenticated INSERT places" ON public.places;
DROP POLICY IF EXISTS "Authenticated UPDATE places" ON public.places;
DROP POLICY IF EXISTS "Authenticated DELETE places" ON public.places;

CREATE POLICY amo2026_places_select ON public.places
  FOR SELECT TO public
  USING (
    (
      COALESCE(is_safe, true) = true
      AND COALESCE(curation_status, 'approved') = 'approved'
    )
    OR (auth.uid() IS NOT NULL AND created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_locais()
  );

CREATE POLICY amo2026_places_insert ON public.places
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (created_by IS NULL OR created_by = auth.uid())
  );

CREATE POLICY amo2026_places_update ON public.places
  FOR UPDATE TO authenticated
  USING (
    (created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_locais()
  )
  WITH CHECK (
    (created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_locais()
  );

CREATE POLICY amo2026_places_delete ON public.places
  FOR DELETE TO authenticated
  USING (
    (created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_locais()
  );

-- -----------------------------------------------------------------------------
-- 3) EVENTS
-- -----------------------------------------------------------------------------
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public SELECT events" ON public.events;
DROP POLICY IF EXISTS "Public can view events" ON public.events;
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
DROP POLICY IF EXISTS "Todos podem ver eventos" ON public.events;
DROP POLICY IF EXISTS "Permitir SELECT público em events" ON public.events;
DROP POLICY IF EXISTS "temp_public_all_events" ON public.events;
DROP POLICY IF EXISTS "Public can insert events" ON public.events;
DROP POLICY IF EXISTS "Public can update events" ON public.events;
DROP POLICY IF EXISTS "Public can delete events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON public.events;
DROP POLICY IF EXISTS "Creator can update events" ON public.events;
DROP POLICY IF EXISTS "Creator can delete events" ON public.events;
DROP POLICY IF EXISTS "Authenticated INSERT events" ON public.events;
DROP POLICY IF EXISTS "Authenticated UPDATE events" ON public.events;
DROP POLICY IF EXISTS "Authenticated DELETE events" ON public.events;

CREATE POLICY amo2026_events_select ON public.events
  FOR SELECT TO public
  USING (
    (
      COALESCE(is_active, true) = true
      AND COALESCE(curation_status, 'approved') = 'approved'
    )
    OR (auth.uid() IS NOT NULL AND created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_eventos()
  );

CREATE POLICY amo2026_events_insert ON public.events
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (created_by IS NULL OR created_by = auth.uid())
  );

CREATE POLICY amo2026_events_update ON public.events
  FOR UPDATE TO authenticated
  USING (
    (created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_eventos()
  )
  WITH CHECK (
    (created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_eventos()
  );

CREATE POLICY amo2026_events_delete ON public.events
  FOR DELETE TO authenticated
  USING (
    (created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_eventos()
  );

-- -----------------------------------------------------------------------------
-- 4) SERVICES
-- -----------------------------------------------------------------------------
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public SELECT services" ON public.services;
DROP POLICY IF EXISTS "Public can view services" ON public.services;
DROP POLICY IF EXISTS "Anyone can view services" ON public.services;
DROP POLICY IF EXISTS "Todos podem ver serviços" ON public.services;
DROP POLICY IF EXISTS "Permitir SELECT público em services" ON public.services;
DROP POLICY IF EXISTS "temp_public_all_services" ON public.services;
DROP POLICY IF EXISTS "Public can insert services" ON public.services;
DROP POLICY IF EXISTS "Public can update services" ON public.services;
DROP POLICY IF EXISTS "Public can delete services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can insert services" ON public.services;
DROP POLICY IF EXISTS "Creator can update services" ON public.services;
DROP POLICY IF EXISTS "Creator can delete services" ON public.services;
DROP POLICY IF EXISTS "Authenticated INSERT services" ON public.services;
DROP POLICY IF EXISTS "Authenticated UPDATE services" ON public.services;
DROP POLICY IF EXISTS "Authenticated DELETE services" ON public.services;

CREATE POLICY amo2026_services_select ON public.services
  FOR SELECT TO public
  USING (
    (
      COALESCE(is_active, true) = true
      AND COALESCE(curation_status, 'approved') = 'approved'
    )
    OR (auth.uid() IS NOT NULL AND created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_servicos()
  );

CREATE POLICY amo2026_services_insert ON public.services
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (created_by IS NULL OR created_by = auth.uid())
  );

CREATE POLICY amo2026_services_update ON public.services
  FOR UPDATE TO authenticated
  USING (
    (created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_servicos()
  )
  WITH CHECK (
    (created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_servicos()
  );

CREATE POLICY amo2026_services_delete ON public.services
  FOR DELETE TO authenticated
  USING (
    (created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_servicos()
  );

-- -----------------------------------------------------------------------------
-- 4b) COMMUNITIES — coluna created_by (usada pelo app; pode faltar em BD antigo)
-- -----------------------------------------------------------------------------
ALTER TABLE public.communities
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- -----------------------------------------------------------------------------
-- 5) COMMUNITIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on active communities" ON public.communities;
DROP POLICY IF EXISTS "Allow authenticated insert on communities" ON public.communities;
DROP POLICY IF EXISTS "Allow authenticated update on communities" ON public.communities;
DROP POLICY IF EXISTS "Allow authenticated delete on communities" ON public.communities;
DROP POLICY IF EXISTS "Public can view communities" ON public.communities;
DROP POLICY IF EXISTS "Anyone can view communities" ON public.communities;
DROP POLICY IF EXISTS "Public can insert communities" ON public.communities;
DROP POLICY IF EXISTS "Public can update communities" ON public.communities;
DROP POLICY IF EXISTS "Public can delete communities" ON public.communities;
DROP POLICY IF EXISTS "communities_select_auth" ON public.communities;
DROP POLICY IF EXISTS "communities_insert_own" ON public.communities;
DROP POLICY IF EXISTS "communities_update_own_or_admin" ON public.communities;
DROP POLICY IF EXISTS "communities_delete_admin_only" ON public.communities;

CREATE POLICY amo2026_communities_select ON public.communities
  FOR SELECT TO public
  USING (
    (
      COALESCE(is_active, true) = true
      AND COALESCE(curation_status, 'approved') = 'approved'
    )
    OR (auth.uid() IS NOT NULL AND created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_geral()
  );

CREATE POLICY amo2026_communities_insert ON public.communities
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (created_by IS NULL OR created_by = auth.uid())
  );

CREATE POLICY amo2026_communities_update ON public.communities
  FOR UPDATE TO authenticated
  USING (
    (created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_geral()
  )
  WITH CHECK (
    (created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_geral()
  );

CREATE POLICY amo2026_communities_delete ON public.communities
  FOR DELETE TO authenticated
  USING (
    (created_by IS NOT NULL AND created_by = auth.uid())
    OR public.is_admin_geral()
  );

-- -----------------------------------------------------------------------------
-- 6) PROFILES — leitura ampla (app lista pessoas/comunidades); escrita restrita
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public SELECT profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Perfis públicos são visíveis para todos" ON public.profiles;
DROP POLICY IF EXISTS "Permitir SELECT público em profiles" ON public.profiles;
DROP POLICY IF EXISTS "temp_public_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated INSERT profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated UPDATE profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated DELETE profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_auth" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;

CREATE POLICY amo2026_profiles_select ON public.profiles
  FOR SELECT TO public
  USING (true);

CREATE POLICY amo2026_profiles_insert ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY amo2026_profiles_update ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.is_admin_geral())
  WITH CHECK (auth.uid() = id OR public.is_admin_geral());

CREATE POLICY amo2026_profiles_delete ON public.profiles
  FOR DELETE TO authenticated
  USING (public.is_admin_geral());

-- -----------------------------------------------------------------------------
-- 7) REVIEWS — só se a tabela existir
-- -----------------------------------------------------------------------------
DO $reviews_rls$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'reviews'
      AND c.relkind = 'r'
  ) THEN
    ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "reviews_select_auth" ON public.reviews;
    DROP POLICY IF EXISTS "reviews_insert_own" ON public.reviews;
    DROP POLICY IF EXISTS "reviews_update_own_or_admin" ON public.reviews;
    DROP POLICY IF EXISTS "reviews_delete_own_or_admin" ON public.reviews;
    DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
    DROP POLICY IF EXISTS "Public can insert reviews" ON public.reviews;
    DROP POLICY IF EXISTS amo2026_reviews_select ON public.reviews;
    DROP POLICY IF EXISTS amo2026_reviews_insert ON public.reviews;
    DROP POLICY IF EXISTS amo2026_reviews_update ON public.reviews;
    DROP POLICY IF EXISTS amo2026_reviews_delete ON public.reviews;

    CREATE POLICY amo2026_reviews_select ON public.reviews
      FOR SELECT TO public
      USING (true);

    CREATE POLICY amo2026_reviews_insert ON public.reviews
      FOR INSERT TO authenticated
      WITH CHECK (user_id = auth.uid());

    CREATE POLICY amo2026_reviews_update ON public.reviews
      FOR UPDATE TO authenticated
      USING (user_id = auth.uid() OR public.is_admin_geral())
      WITH CHECK (user_id = auth.uid() OR public.is_admin_geral());

    CREATE POLICY amo2026_reviews_delete ON public.reviews
      FOR DELETE TO authenticated
      USING (user_id = auth.uid() OR public.is_admin_geral());
  END IF;
END
$reviews_rls$;

-- -----------------------------------------------------------------------------
-- 8) CONTACT_MESSAGES — só se a tabela existir (criar com
--    SQL/CREATE_CONTACT_MESSAGES_TABLE.sql se ainda não existir)
-- -----------------------------------------------------------------------------
DO $contact_rls$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'contact_messages'
      AND c.relkind = 'r'
  ) THEN
    ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
    DROP POLICY IF EXISTS "Users can view their own messages" ON public.contact_messages;
    DROP POLICY IF EXISTS "Admins can view all messages" ON public.contact_messages;
    DROP POLICY IF EXISTS "Admins can update messages" ON public.contact_messages;
    DROP POLICY IF EXISTS amo2026_contact_insert ON public.contact_messages;
    DROP POLICY IF EXISTS amo2026_contact_select_own ON public.contact_messages;
    DROP POLICY IF EXISTS amo2026_contact_select_admin ON public.contact_messages;
    DROP POLICY IF EXISTS amo2026_contact_update_admin ON public.contact_messages;

    CREATE POLICY amo2026_contact_insert ON public.contact_messages
      FOR INSERT TO public
      WITH CHECK (
        length(trim(COALESCE(email, ''))) > 3
        AND length(trim(COALESCE(message, ''))) > 0
        AND (user_id IS NULL OR user_id = auth.uid())
      );

    CREATE POLICY amo2026_contact_select_own ON public.contact_messages
      FOR SELECT TO authenticated
      USING (user_id IS NOT NULL AND user_id = auth.uid());

    CREATE POLICY amo2026_contact_select_admin ON public.contact_messages
      FOR SELECT TO authenticated
      USING (public.is_admin_geral());

    CREATE POLICY amo2026_contact_update_admin ON public.contact_messages
      FOR UPDATE TO authenticated
      USING (public.is_admin_geral())
      WITH CHECK (public.is_admin_geral());
  END IF;
END
$contact_rls$;

-- -----------------------------------------------------------------------------
-- 9) Verificação rápida (listar políticas amo2026_*)
-- -----------------------------------------------------------------------------
SELECT tablename, policyname, cmd, roles::text AS roles
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname LIKE 'amo2026_%'
ORDER BY tablename, policyname;
