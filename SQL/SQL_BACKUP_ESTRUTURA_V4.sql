-- =========================================================
-- AMOOORA - BACKUP COMPLETO DA ESTRUTURA SUPABASE V4.0.0
-- Data: 2024-12-XX
-- Versão: V4.0.0 (login1.0)
-- =========================================================
-- 
-- Este arquivo contém TODA a estrutura do banco de dados
-- necessária para restaurar o sistema completo.
--
-- INSTRUÇÕES DE RESTAURAÇÃO:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Execute na ordem: primeiro este backup, depois os scripts específicos
-- 3. Verifique se todas as tabelas, funções e políticas foram criadas
-- =========================================================

-- =========================================================
-- PARTE 1: GESTÃO DE ACESSOS E PERFIS
-- =========================================================
-- Fonte: MD/ACCESS_MANAGEMENT_SUPABASE.sql

create extension if not exists "pgcrypto";

-- Tabela de perfis
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  avatar text,
  phone text,
  bio text,
  pronouns text,
  city text,
  role text not null default 'user_viewer',
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger para criar perfil automaticamente
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'user_viewer'),
    coalesce(new.raw_user_meta_data->>'status', 'active')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Funções helper para verificar roles
create or replace function public.is_admin_geral()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin_geral'
    and status = 'active'
  );
end;
$$;

-- RPCs para gerenciamento de usuários (admin_geral apenas)
create or replace function public.admin_change_user_role(target_user_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin_geral() then
    raise exception 'forbidden: apenas admin_geral pode alterar roles';
  end if;
  
  update public.profiles
  set role = new_role, updated_at = now()
  where id = target_user_id;
end;
$$;

create or replace function public.admin_change_user_status(target_user_id uuid, new_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin_geral() then
    raise exception 'forbidden: apenas admin_geral pode alterar status';
  end if;
  
  update public.profiles
  set status = new_status, updated_at = now()
  where id = target_user_id;
end;
$$;

-- =========================================================
-- PARTE 2: INTERAÇÕES COM EVENTOS
-- =========================================================
-- Fonte: SQL/event_interactions_tables.sql

-- Tabela de interesses em eventos
create table if not exists public.event_interests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(user_id, event_id)
);

-- Tabela de participações em eventos
create table if not exists public.event_participants (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(user_id, event_id)
);

-- Índices
create index if not exists idx_event_interests_user_id on public.event_interests(user_id);
create index if not exists idx_event_interests_event_id on public.event_interests(event_id);
create index if not exists idx_event_participants_user_id on public.event_participants(user_id);
create index if not exists idx_event_participants_event_id on public.event_participants(event_id);

-- RLS para event_interests
alter table public.event_interests enable row level security;

drop policy if exists "Users can view their own interests" on public.event_interests;
drop policy if exists "Users can insert their own interests" on public.event_interests;
drop policy if exists "Users can delete their own interests" on public.event_interests;

create policy "Users can view their own interests"
  on public.event_interests for select
  using (auth.uid() = user_id);

create policy "Users can insert their own interests"
  on public.event_interests for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own interests"
  on public.event_interests for delete
  using (auth.uid() = user_id);

-- RLS para event_participants
alter table public.event_participants enable row level security;

drop policy if exists "Users can view their own participations" on public.event_participants;
drop policy if exists "Users can insert their own participations" on public.event_participants;
drop policy if exists "Users can delete their own participations" on public.event_participants;

create policy "Users can view their own participations"
  on public.event_participants for select
  using (auth.uid() = user_id);

create policy "Users can insert their own participations"
  on public.event_participants for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own participations"
  on public.event_participants for delete
  using (auth.uid() = user_id);

-- =========================================================
-- PARTE 3: DELEÇÃO DE USUÁRIOS
-- =========================================================
-- Fonte: SQL/admin_delete_users_completo.sql

drop function if exists public.admin_delete_users(uuid[]);
drop function if exists public.admin_delete_user_single(uuid);

-- Função para deletar múltiplos usuários
create or replace function public.admin_delete_users(target_user_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_user_id_loop uuid;
  current_user_id uuid;
begin
  current_user_id := auth.uid();
  
  if not public.is_admin_geral() then
    raise exception 'forbidden: apenas admin_geral pode deletar usuários';
  end if;

  if current_user_id = any(target_user_ids) then
    raise exception 'forbidden: você não pode deletar sua própria conta';
  end if;

  foreach target_user_id_loop in array target_user_ids
  loop
    -- Limpar todas as referências
    delete from public.community_posts where public.community_posts.user_id = target_user_id_loop;
    delete from public.post_replies where public.post_replies.user_id = target_user_id_loop;
    delete from public.reviews where public.reviews.user_id = target_user_id_loop;
    delete from public.event_participants where public.event_participants.user_id = target_user_id_loop;
    delete from public.event_interests where public.event_interests.user_id = target_user_id_loop;
    delete from public.community_members where public.community_members.user_id = target_user_id_loop;
    delete from public.saved_places where public.saved_places.user_id = target_user_id_loop;
    delete from public.reports where public.reports.user_id = target_user_id_loop;
    
    -- Limpar created_by em tabelas de conteúdo
    update public.events set created_by = null where public.events.created_by = target_user_id_loop;
    update public.places set created_by = null where public.places.created_by = target_user_id_loop;
    update public.communities set created_by = null where public.communities.created_by = target_user_id_loop;
    
    -- Deletar do auth.users (cascateia para profiles)
    delete from auth.users where auth.users.id = target_user_id_loop;
  end loop;
end;
$$;

-- Função para deletar um único usuário
create or replace function public.admin_delete_user_single(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid;
begin
  current_user_id := auth.uid();
  
  if not public.is_admin_geral() then
    raise exception 'forbidden: apenas admin_geral pode deletar usuários';
  end if;

  if current_user_id = target_user_id then
    raise exception 'forbidden: você não pode deletar sua própria conta';
  end if;

  -- Limpar todas as referências
  delete from public.community_posts where public.community_posts.user_id = target_user_id;
  delete from public.post_replies where public.post_replies.user_id = target_user_id;
  delete from public.reviews where public.reviews.user_id = target_user_id;
  delete from public.event_participants where public.event_participants.user_id = target_user_id;
  delete from public.event_interests where public.event_interests.user_id = target_user_id;
  delete from public.community_members where public.community_members.user_id = target_user_id;
  delete from public.saved_places where public.saved_places.user_id = target_user_id;
  delete from public.reports where public.reports.user_id = target_user_id;
  
  -- Limpar created_by
  update public.events set created_by = null where public.events.created_by = target_user_id;
  update public.places set created_by = null where public.places.created_by = target_user_id;
  update public.communities set created_by = null where public.communities.created_by = target_user_id;
  
  -- Deletar do auth.users
  delete from auth.users where auth.users.id = target_user_id;
end;
$$;

-- =========================================================
-- NOTAS IMPORTANTES:
-- =========================================================
-- 1. Este backup não inclui dados, apenas estrutura
-- 2. Para restaurar dados, use o backup do Supabase Dashboard
-- 3. Verifique se todas as tabelas principais existem:
--    - events, places, communities, services
--    - reviews, saved_places, community_posts
-- 4. Após executar, verifique as políticas RLS nas tabelas
-- 5. Crie um usuário admin_geral manualmente após restaurar
-- =========================================================
