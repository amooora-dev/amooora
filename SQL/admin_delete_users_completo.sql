-- =========================================================
-- AMOOORA - Funções RPC para deletar usuários (admin_geral apenas)
-- =========================================================
-- 
-- INSTRUÇÕES:
-- 1. Copie TODO este arquivo
-- 2. Cole no SQL Editor do Supabase (Dashboard → SQL Editor → New Query)
-- 3. Clique em "Run" ou pressione Ctrl+Enter
-- 4. Aguarde a confirmação de sucesso
-- 5. Recarregue a página do site e teste novamente
-- =========================================================

-- =========================================================
-- LIMPEZA: Dropar funções antigas (se existirem)
-- =========================================================
drop function if exists public.admin_delete_users(uuid[]);
drop function if exists public.admin_delete_user_single(uuid);
drop function if exists public.admin_delete_user_single(target_user_id uuid);

-- =========================================================
-- OPÇÃO 1: Função para deletar múltiplos usuários de uma vez (RECOMENDADO)
-- =========================================================
create or replace function public.admin_delete_users(user_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_user_id uuid;
  current_user_id uuid;
begin
  -- Obter o ID do usuário atual
  current_user_id := auth.uid();
  
  -- Verificar se é admin_geral
  if not public.is_admin_geral() then
    raise exception 'forbidden: apenas admin_geral pode deletar usuários';
  end if;

  -- Não permitir deletar a si mesmo
  if current_user_id = any(user_ids) then
    raise exception 'forbidden: você não pode deletar sua própria conta';
  end if;

  -- Deletar cada usuário do auth.users (cascateia para profiles)
  foreach target_user_id in array user_ids
  loop
    -- Verificar se o usuário existe antes de deletar
    if exists (select 1 from auth.users where auth.users.id = target_user_id) then
      -- Limpar todas as referências antes de deletar (para evitar foreign key violations)
      
      -- Deletar posts de comunidades (se a tabela existir)
      if to_regclass('public.community_posts') is not null then
        delete from public.community_posts where public.community_posts.user_id = target_user_id;
      end if;
      
      -- Deletar respostas de posts (se a tabela existir)
      if to_regclass('public.post_replies') is not null then
        delete from public.post_replies where public.post_replies.user_id = target_user_id;
      end if;
      
      -- Deletar reviews (se a tabela existir)
      if to_regclass('public.reviews') is not null then
        delete from public.reviews where public.reviews.user_id = target_user_id;
      end if;
      
      -- Deletar participantes de eventos (se a tabela existir)
      if to_regclass('public.event_participants') is not null then
        delete from public.event_participants where public.event_participants.user_id = target_user_id;
      end if;
      
      -- Deletar membros de comunidades (se a tabela existir)
      if to_regclass('public.community_members') is not null then
        delete from public.community_members where public.community_members.user_id = target_user_id;
      end if;
      
      -- Deletar lugares salvos (se a tabela existir)
      if to_regclass('public.saved_places') is not null then
        delete from public.saved_places where public.saved_places.user_id = target_user_id;
      end if;
      
      -- Deletar reports onde o usuário é reporter ou resolved_by (se a tabela existir)
      if to_regclass('public.reports') is not null then
        update public.reports set resolved_by = null where public.reports.resolved_by = target_user_id;
        delete from public.reports where public.reports.reporter_id = target_user_id;
      end if;
      
      -- Atualizar created_by para null em places, events, services, communities (se existirem)
      if to_regclass('public.places') is not null then
        update public.places set created_by = null where public.places.created_by = target_user_id;
      end if;
      
      if to_regclass('public.events') is not null then
        update public.events set created_by = null where public.events.created_by = target_user_id;
      end if;
      
      if to_regclass('public.services') is not null then
        update public.services set created_by = null where public.services.created_by = target_user_id;
      end if;
      
      if to_regclass('public.communities') is not null then
        update public.communities set created_by = null where public.communities.created_by = target_user_id;
      end if;
      
      -- Deletar do auth.users (cascateia automaticamente para profiles)
      -- As tabelas com ON DELETE CASCADE (likes, favorites) serão limpas automaticamente
      delete from auth.users where auth.users.id = target_user_id;
    end if;
  end loop;
end;
$$;

grant execute on function public.admin_delete_users(uuid[]) to authenticated;

-- =========================================================
-- OPÇÃO 2: Função para deletar um usuário por vez (FALLBACK)
-- =========================================================
create or replace function public.admin_delete_user_single(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid;
begin
  -- Obter o ID do usuário atual
  current_user_id := auth.uid();
  
  -- Verificar se é admin_geral
  if not public.is_admin_geral() then
    raise exception 'forbidden: apenas admin_geral pode deletar usuários';
  end if;

  -- Não permitir deletar a si mesmo
  if current_user_id = target_user_id then
    raise exception 'forbidden: você não pode deletar sua própria conta';
  end if;

  -- Verificar se o usuário existe
  if not exists (select 1 from auth.users where auth.users.id = target_user_id) then
    raise exception 'usuário não encontrado';
  end if;

  -- Limpar todas as referências antes de deletar (para evitar foreign key violations)
  
  -- Deletar posts de comunidades (se a tabela existir)
  if to_regclass('public.community_posts') is not null then
    delete from public.community_posts where public.community_posts.user_id = target_user_id;
  end if;
  
  -- Deletar respostas de posts (se a tabela existir)
  if to_regclass('public.post_replies') is not null then
    delete from public.post_replies where public.post_replies.user_id = target_user_id;
  end if;
  
  -- Deletar reviews (se a tabela existir)
  if to_regclass('public.reviews') is not null then
    delete from public.reviews where public.reviews.user_id = target_user_id;
  end if;
  
  -- Deletar participantes de eventos (se a tabela existir)
  if to_regclass('public.event_participants') is not null then
    delete from public.event_participants where public.event_participants.user_id = target_user_id;
  end if;
  
  -- Deletar membros de comunidades (se a tabela existir)
  if to_regclass('public.community_members') is not null then
    delete from public.community_members where public.community_members.user_id = target_user_id;
  end if;
  
  -- Deletar lugares salvos (se a tabela existir)
  if to_regclass('public.saved_places') is not null then
    delete from public.saved_places where public.saved_places.user_id = target_user_id;
  end if;
  
  -- Deletar reports onde o usuário é reporter ou resolved_by (se a tabela existir)
  if to_regclass('public.reports') is not null then
    update public.reports set resolved_by = null where public.reports.resolved_by = target_user_id;
    delete from public.reports where public.reports.reporter_id = target_user_id;
  end if;
  
  -- Atualizar created_by para null em places, events, services, communities (se existirem)
  if to_regclass('public.places') is not null then
    update public.places set created_by = null where public.places.created_by = target_user_id;
  end if;
  
  if to_regclass('public.events') is not null then
    update public.events set created_by = null where public.events.created_by = target_user_id;
  end if;
  
  if to_regclass('public.services') is not null then
    update public.services set created_by = null where public.services.created_by = target_user_id;
  end if;
  
  if to_regclass('public.communities') is not null then
    update public.communities set created_by = null where public.communities.created_by = target_user_id;
  end if;
  
  -- Deletar do auth.users (cascateia automaticamente para profiles)
  -- As tabelas com ON DELETE CASCADE (likes, favorites) serão limpas automaticamente
  delete from auth.users where auth.users.id = target_user_id;
end;
$$;

grant execute on function public.admin_delete_user_single(uuid) to authenticated;

-- =========================================================
-- Verificação: confirmar que as funções foram criadas
-- =========================================================
do $$
begin
  if exists (
    select 1 
    from pg_proc 
    where proname = 'admin_delete_users' 
    and pronamespace = (select oid from pg_namespace where nspname = 'public')
  ) then
    raise notice '✅ Função admin_delete_users criada com sucesso!';
  else
    raise warning '⚠️ Função admin_delete_users não foi criada';
  end if;

  if exists (
    select 1 
    from pg_proc 
    where proname = 'admin_delete_user_single' 
    and pronamespace = (select oid from pg_namespace where nspname = 'public')
  ) then
    raise notice '✅ Função admin_delete_user_single criada com sucesso!';
  else
    raise warning '⚠️ Função admin_delete_user_single não foi criada';
  end if;
end;
$$;
