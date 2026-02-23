-- =========================================================
-- AMOOORA - Curadoria de conteúdo (Supabase)
-- Execute no SQL Editor do Supabase (Dashboard > SQL Editor > New query)
-- =========================================================
-- 1) Coluna curation_status em places, events, services
-- 2) Default 'pending' para novos conteúdos
-- 3) RPC para aprovar/reprovar (admin por área)
-- 4) RPC para listar pendentes (admin por área)
-- =========================================================

-- ---------------------------------------------------------
-- 1) Coluna curation_status (pending | approved | rejected)
-- ---------------------------------------------------------
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS curation_status text NOT NULL DEFAULT 'approved'
  CHECK (curation_status IN ('pending', 'approved', 'rejected'));

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS curation_status text NOT NULL DEFAULT 'approved'
  CHECK (curation_status IN ('pending', 'approved', 'rejected'));

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS curation_status text NOT NULL DEFAULT 'approved'
  CHECK (curation_status IN ('pending', 'approved', 'rejected'));

-- Novos inserts sem curation_status passam a ser 'pending'
ALTER TABLE public.places   ALTER COLUMN curation_status SET DEFAULT 'pending';
ALTER TABLE public.events   ALTER COLUMN curation_status SET DEFAULT 'pending';
ALTER TABLE public.services ALTER COLUMN curation_status SET DEFAULT 'pending';

-- ---------------------------------------------------------
-- 2) RPC: aprovar ou reprovar item na curadoria
-- admin_geral: qualquer tabela | admin_locais: places | admin_eventos: events | admin_servicos: services
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.curation_approve_or_reject(
  p_table_name text,
  p_row_id uuid,
  p_approve boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_role text;
  v_status text;
  v_allowed boolean := false;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Não autenticado');
  END IF;

  SELECT role, status INTO v_role, v_status
  FROM public.profiles
  WHERE id = v_user_id;

  IF v_role IS NULL OR v_status <> 'active' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Perfil inativo ou não encontrado');
  END IF;

  IF v_role = 'admin_geral' THEN
    v_allowed := true;
  ELSIF p_table_name = 'places' AND v_role = 'admin_locais' THEN
    v_allowed := true;
  ELSIF p_table_name = 'events' AND v_role = 'admin_eventos' THEN
    v_allowed := true;
  ELSIF p_table_name = 'services' AND v_role = 'admin_servicos' THEN
    v_allowed := true;
  END IF;

  IF NOT v_allowed THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Sem permissão para curadoria nesta área');
  END IF;

  IF p_table_name = 'places' THEN
    UPDATE public.places
    SET curation_status = CASE WHEN p_approve THEN 'approved' ELSE 'rejected' END, updated_at = now()
    WHERE id = p_row_id;
    IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'error', 'Local não encontrado'); END IF;
  ELSIF p_table_name = 'events' THEN
    UPDATE public.events
    SET curation_status = CASE WHEN p_approve THEN 'approved' ELSE 'rejected' END, updated_at = now()
    WHERE id = p_row_id;
    IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'error', 'Evento não encontrado'); END IF;
  ELSIF p_table_name = 'services' THEN
    UPDATE public.services
    SET curation_status = CASE WHEN p_approve THEN 'approved' ELSE 'rejected' END, updated_at = now()
    WHERE id = p_row_id;
    IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'error', 'Serviço não encontrado'); END IF;
  ELSE
    RETURN jsonb_build_object('ok', false, 'error', 'Tabela inválida');
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.curation_approve_or_reject(text, uuid, boolean) TO authenticated;

-- ---------------------------------------------------------
-- 3) RPC: listar itens pendentes (só admins da área)
-- p_kind: 'places' | 'events' | 'services'
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_pending_curation(p_kind text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_role text;
  v_status text;
  v_allowed boolean := false;
  v_result jsonb;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN RETURN '[]'::jsonb; END IF;

  SELECT role, status INTO v_role, v_status FROM public.profiles WHERE id = v_user_id;
  IF v_role IS NULL OR v_status <> 'active' THEN RETURN '[]'::jsonb; END IF;

  IF v_role = 'admin_geral' THEN v_allowed := true;
  ELSIF p_kind = 'places' AND v_role = 'admin_locais' THEN v_allowed := true;
  ELSIF p_kind = 'events' AND v_role = 'admin_eventos' THEN v_allowed := true;
  ELSIF p_kind = 'services' AND v_role = 'admin_servicos' THEN v_allowed := true;
  END IF;

  IF NOT v_allowed THEN RETURN '[]'::jsonb; END IF;

  IF p_kind = 'places' THEN
    SELECT coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_result
    FROM (SELECT id, name, description, category, image, created_at, created_by FROM public.places WHERE curation_status = 'pending' ORDER BY created_at DESC) t;
    RETURN v_result;
  ELSIF p_kind = 'events' THEN
    SELECT coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_result
    FROM (SELECT id, name, description, date, location, category, image, created_at, created_by FROM public.events WHERE curation_status = 'pending' ORDER BY created_at DESC) t;
    RETURN v_result;
  ELSIF p_kind = 'services' THEN
    SELECT coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_result
    FROM (SELECT id, name, description, category, image, created_at, created_by FROM public.services WHERE curation_status = 'pending' ORDER BY created_at DESC) t;
    RETURN v_result;
  ELSE
    RETURN '[]'::jsonb;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_pending_curation(text) TO authenticated;

-- Fim do script de curadoria
