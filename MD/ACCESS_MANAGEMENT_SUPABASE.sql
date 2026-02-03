-- =========================================================
-- AMOOORA - Gestão de acessos (site FECHADO) via Supabase RLS
-- Perfis (roles):
--   - admin_geral
--   - user_viewer (default)
--   - admin_locais
--   - admin_eventos
--   - admin_servicos
--
-- O objetivo deste script é:
-- 1) Garantir profiles.role/status (compatível com o app)
-- 2) Criar onboarding automático (trigger em auth.users -> profiles)
-- 3) Criar RPCs admin-only para listar perfis e setar role/status
-- 4) Aplicar RLS/policies para "site fechado" + ownership + admin override
--
-- Observação:
-- - O script usa IF EXISTS / checagem de tabela para não quebrar ambientes.
-- - Execute no SQL Editor do Supabase.
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- 1) PROFILES: garantir role/status e campos comuns do app
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade
);

alter table public.profiles
  add column if not exists name text,
  add column if not exists email text,
  add column if not exists avatar text,
  add column if not exists phone text,
  add column if not exists bio text,
  add column if not exists pronouns text,
  add column if not exists city text,
  add column if not exists role text not null default 'user_viewer',
  add column if not exists status text not null default 'active',
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

-- ---------------------------------------------------------
-- 2) Onboarding automático: auth.users -> profiles
-- ---------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'user_viewer',
    'active'
  )
  on conflict (id) do update
  set email = excluded.email,
      name = coalesce(public.profiles.name, excluded.name);

  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
  end if;
end;
$$;

-- ---------------------------------------------------------
-- 3) Helpers (RLS)
-- ---------------------------------------------------------
create or replace function public.is_authenticated()
returns boolean
language sql
stable
as $$
  select auth.uid() is not null;
$$;

create or replace function public.has_role(role_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = role_name
      and p.status = 'active'
  );
$$;

create or replace function public.is_admin_geral()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('admin_geral');
$$;

-- ---------------------------------------------------------
-- 4) RPCs admin-only (para evitar autopromoção)
-- ---------------------------------------------------------
create or replace function public.admin_list_profiles()
returns table (
  id uuid,
  email text,
  name text,
  role text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select p.id, p.email, p.name, p.role, p.status, p.created_at, p.updated_at
  from public.profiles p
  where public.is_admin_geral();
$$;

create or replace function public.admin_set_profile_access(
  target_user_id uuid,
  new_role text,
  new_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin_geral() then
    raise exception 'forbidden';
  end if;

  update public.profiles
  set role = new_role,
      status = new_status,
      updated_at = now()
  where id = target_user_id;
end;
$$;

grant execute on function public.admin_list_profiles() to authenticated;
grant execute on function public.admin_set_profile_access(uuid, text, text) to authenticated;

-- ---------------------------------------------------------
-- 5) RLS: habilitar e policies (site fechado)
-- ---------------------------------------------------------
alter table public.profiles enable row level security;

do $$
begin
  -- PROFILES policies
  drop policy if exists profiles_select_auth on public.profiles;
  create policy profiles_select_auth
  on public.profiles for select
  using (public.is_authenticated());

  drop policy if exists profiles_update_own on public.profiles;
  create policy profiles_update_own
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

  drop policy if exists profiles_update_admin on public.profiles;
  create policy profiles_update_admin
  on public.profiles for update
  using (public.is_admin_geral())
  with check (public.is_admin_geral());
end;
$$;

-- Impedir que usuária comum altere role/status via UPDATE direto (usar RPC admin_*)
revoke update (role, status) on public.profiles from authenticated;

-- (Opcional, mas recomendado) permitir update de campos "perfil" para authenticated
grant update (name, email, avatar, phone, bio, pronouns, city, updated_at) on public.profiles to authenticated;

-- ---------------------------------------------------------
-- 6) Colunas padrão de ownership (se existirem as tabelas)
-- ---------------------------------------------------------
do $$
begin
  if to_regclass('public.places') is not null then
    alter table public.places
      add column if not exists created_by uuid references auth.users(id),
      add column if not exists updated_by uuid references auth.users(id),
      add column if not exists status text default 'active',
      add column if not exists created_at timestamptz default now(),
      add column if not exists updated_at timestamptz default now();
  end if;

  if to_regclass('public.events') is not null then
    alter table public.events
      add column if not exists created_by uuid references auth.users(id),
      add column if not exists updated_by uuid references auth.users(id),
      add column if not exists status text default 'active',
      add column if not exists created_at timestamptz default now(),
      add column if not exists updated_at timestamptz default now();
  end if;

  if to_regclass('public.services') is not null then
    alter table public.services
      add column if not exists created_by uuid references auth.users(id),
      add column if not exists updated_by uuid references auth.users(id),
      add column if not exists status text default 'active',
      add column if not exists created_at timestamptz default now(),
      add column if not exists updated_at timestamptz default now();
  end if;

  if to_regclass('public.communities') is not null then
    alter table public.communities
      add column if not exists created_by uuid references auth.users(id),
      add column if not exists updated_by uuid references auth.users(id),
      add column if not exists status text default 'active',
      add column if not exists created_at timestamptz default now(),
      add column if not exists updated_at timestamptz default now();
  end if;
end;
$$;

-- ---------------------------------------------------------
-- 7) Tabelas globais (criar se não existirem)
-- ---------------------------------------------------------
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  created_at timestamptz default now(),
  unique (user_id, target_type, target_id)
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  created_at timestamptz default now(),
  unique (user_id, target_type, target_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id),
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  details text,
  status text not null default 'open',
  created_at timestamptz default now(),
  resolved_by uuid references auth.users(id),
  resolved_at timestamptz
);

-- ---------------------------------------------------------
-- 8) RLS + policies para conteúdo (site fechado + ownership)
-- ---------------------------------------------------------
do $$
begin
  -- PLACES
  if to_regclass('public.places') is not null then
    alter table public.places enable row level security;

    drop policy if exists places_select_auth on public.places;
    create policy places_select_auth on public.places for select
    using (public.is_authenticated());

    drop policy if exists places_insert_own on public.places;
    create policy places_insert_own on public.places for insert
    with check (created_by = auth.uid());

    drop policy if exists places_update_own_or_admin on public.places;
    create policy places_update_own_or_admin on public.places for update
    using (created_by = auth.uid() or public.is_admin_geral());

    -- delete: admin_geral OR admin_locais (own)
    drop policy if exists places_delete_admin_or_admin_locais on public.places;
    create policy places_delete_admin_or_admin_locais on public.places for delete
    using (public.is_admin_geral() or (public.has_role('admin_locais') and created_by = auth.uid()));
  end if;

  -- EVENTS (user_viewer já pode delete OWN; admin_geral override)
  if to_regclass('public.events') is not null then
    alter table public.events enable row level security;

    drop policy if exists events_select_auth on public.events;
    create policy events_select_auth on public.events for select
    using (public.is_authenticated());

    drop policy if exists events_insert_own on public.events;
    create policy events_insert_own on public.events for insert
    with check (created_by = auth.uid());

    drop policy if exists events_update_own_or_admin on public.events;
    create policy events_update_own_or_admin on public.events for update
    using (created_by = auth.uid() or public.is_admin_geral());

    drop policy if exists events_delete_own_or_admin on public.events;
    create policy events_delete_own_or_admin on public.events for delete
    using (created_by = auth.uid() or public.is_admin_geral());
  end if;

  -- SERVICES (create/edit: admin_servicos (own) OR admin_geral; delete: admin_geral)
  if to_regclass('public.services') is not null then
    alter table public.services enable row level security;

    drop policy if exists services_select_auth on public.services;
    create policy services_select_auth on public.services for select
    using (public.is_authenticated());

    drop policy if exists services_insert_admin_servicos on public.services;
    create policy services_insert_admin_servicos on public.services for insert
    with check (public.is_admin_geral() or (public.has_role('admin_servicos') and created_by = auth.uid()));

    drop policy if exists services_update_admin_servicos on public.services;
    create policy services_update_admin_servicos on public.services for update
    using (public.is_admin_geral() or (public.has_role('admin_servicos') and created_by = auth.uid()));

    drop policy if exists services_delete_admin_only on public.services;
    create policy services_delete_admin_only on public.services for delete
    using (public.is_admin_geral());
  end if;

  -- COMMUNITIES (qualquer logada cria; owner edita; só admin_geral deleta)
  if to_regclass('public.communities') is not null then
    alter table public.communities enable row level security;

    drop policy if exists communities_select_auth on public.communities;
    create policy communities_select_auth on public.communities for select
    using (public.is_authenticated());

    drop policy if exists communities_insert_own on public.communities;
    create policy communities_insert_own on public.communities for insert
    with check (created_by = auth.uid());

    drop policy if exists communities_update_own_or_admin on public.communities;
    create policy communities_update_own_or_admin on public.communities for update
    using (created_by = auth.uid() or public.is_admin_geral());

    drop policy if exists communities_delete_admin_only on public.communities;
    create policy communities_delete_admin_only on public.communities for delete
    using (public.is_admin_geral());
  end if;

  -- LIKES/FAVORITES/REPORTS (globais)
  alter table public.likes enable row level security;
  drop policy if exists likes_select_auth on public.likes;
  create policy likes_select_auth on public.likes for select using (public.is_authenticated());
  drop policy if exists likes_insert_own on public.likes;
  create policy likes_insert_own on public.likes for insert with check (user_id = auth.uid());
  drop policy if exists likes_delete_own on public.likes;
  create policy likes_delete_own on public.likes for delete using (user_id = auth.uid());

  alter table public.favorites enable row level security;
  drop policy if exists favorites_select_auth on public.favorites;
  create policy favorites_select_auth on public.favorites for select using (public.is_authenticated());
  drop policy if exists favorites_insert_own on public.favorites;
  create policy favorites_insert_own on public.favorites for insert with check (user_id = auth.uid());
  drop policy if exists favorites_delete_own on public.favorites;
  create policy favorites_delete_own on public.favorites for delete using (user_id = auth.uid());

  alter table public.reports enable row level security;
  drop policy if exists reports_insert_own on public.reports;
  create policy reports_insert_own on public.reports for insert with check (reporter_id = auth.uid());
  drop policy if exists reports_select_own_or_admin on public.reports;
  create policy reports_select_own_or_admin on public.reports for select using (reporter_id = auth.uid() or public.is_admin_geral());
  drop policy if exists reports_update_admin on public.reports;
  create policy reports_update_admin on public.reports for update using (public.is_admin_geral());
end;
$$;

-- ---------------------------------------------------------
-- 9) RLS para tabelas do app (se existirem)
-- - reviews: user_id own + select auth
-- - saved_places/event_participants/community_members: user_id own + select auth
-- ---------------------------------------------------------
do $$
begin
  if to_regclass('public.reviews') is not null then
    alter table public.reviews enable row level security;
    drop policy if exists reviews_select_auth on public.reviews;
    create policy reviews_select_auth on public.reviews for select using (public.is_authenticated());
    drop policy if exists reviews_insert_own on public.reviews;
    create policy reviews_insert_own on public.reviews for insert with check (user_id = auth.uid());
    drop policy if exists reviews_update_own_or_admin on public.reviews;
    create policy reviews_update_own_or_admin on public.reviews for update using (user_id = auth.uid() or public.is_admin_geral());
    drop policy if exists reviews_delete_own_or_admin on public.reviews;
    create policy reviews_delete_own_or_admin on public.reviews for delete using (user_id = auth.uid() or public.is_admin_geral());
  end if;

  if to_regclass('public.saved_places') is not null then
    alter table public.saved_places enable row level security;
    drop policy if exists saved_places_select_own on public.saved_places;
    create policy saved_places_select_own on public.saved_places for select using (user_id = auth.uid());
    drop policy if exists saved_places_insert_own on public.saved_places;
    create policy saved_places_insert_own on public.saved_places for insert with check (user_id = auth.uid());
    drop policy if exists saved_places_delete_own on public.saved_places;
    create policy saved_places_delete_own on public.saved_places for delete using (user_id = auth.uid());
  end if;

  if to_regclass('public.event_participants') is not null then
    alter table public.event_participants enable row level security;
    drop policy if exists event_participants_select_own on public.event_participants;
    create policy event_participants_select_own on public.event_participants for select using (user_id = auth.uid());
    drop policy if exists event_participants_insert_own on public.event_participants;
    create policy event_participants_insert_own on public.event_participants for insert with check (user_id = auth.uid());
    drop policy if exists event_participants_delete_own on public.event_participants;
    create policy event_participants_delete_own on public.event_participants for delete using (user_id = auth.uid());
  end if;

  if to_regclass('public.community_members') is not null then
    alter table public.community_members enable row level security;
    drop policy if exists community_members_select_own on public.community_members;
    create policy community_members_select_own on public.community_members for select using (user_id = auth.uid());
    drop policy if exists community_members_insert_own on public.community_members;
    create policy community_members_insert_own on public.community_members for insert with check (user_id = auth.uid());
    drop policy if exists community_members_delete_own on public.community_members;
    create policy community_members_delete_own on public.community_members for delete using (user_id = auth.uid());
  end if;

  -- community_posts / post_replies (se existirem): select auth + ownership via user_id
  if to_regclass('public.community_posts') is not null then
    alter table public.community_posts enable row level security;
    drop policy if exists community_posts_select_auth on public.community_posts;
    create policy community_posts_select_auth on public.community_posts for select using (public.is_authenticated());
    drop policy if exists community_posts_insert_own on public.community_posts;
    create policy community_posts_insert_own on public.community_posts for insert with check (user_id = auth.uid());
    drop policy if exists community_posts_update_own_or_admin on public.community_posts;
    create policy community_posts_update_own_or_admin on public.community_posts for update using (user_id = auth.uid() or public.is_admin_geral());
    drop policy if exists community_posts_delete_own_or_admin on public.community_posts;
    create policy community_posts_delete_own_or_admin on public.community_posts for delete using (user_id = auth.uid() or public.is_admin_geral());
  end if;

  if to_regclass('public.post_replies') is not null then
    alter table public.post_replies enable row level security;
    drop policy if exists post_replies_select_auth on public.post_replies;
    create policy post_replies_select_auth on public.post_replies for select using (public.is_authenticated());
    drop policy if exists post_replies_insert_own on public.post_replies;
    create policy post_replies_insert_own on public.post_replies for insert with check (user_id = auth.uid());
    drop policy if exists post_replies_delete_own_or_admin on public.post_replies;
    create policy post_replies_delete_own_or_admin on public.post_replies for delete using (user_id = auth.uid() or public.is_admin_geral());
  end if;
end;
$$;

-- =========================================================
-- FIM
-- =========================================================

