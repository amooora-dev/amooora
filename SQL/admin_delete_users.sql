-- =========================================================
-- AMOOORA - Função RPC para deletar usuários (admin_geral apenas)
-- =========================================================
-- 
-- INSTRUÇÕES:
-- 1. Copie TODO este arquivo
-- 2. Cole no SQL Editor do Supabase
-- 3. Execute o script
-- 4. Aguarde a confirmação de sucesso
-- =========================================================

-- Função para deletar um ou múltiplos usuários
-- Deleta do auth.users (que cascateia para profiles devido ao on delete cascade)
create or replace function public.admin_delete_users(user_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  user_id uuid;
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
  foreach user_id in array user_ids
  loop
    -- Verificar se o usuário existe antes de deletar
    if exists (select 1 from auth.users where id = user_id) then
      -- Deletar do auth.users (cascateia automaticamente para profiles)
      delete from auth.users where id = user_id;
    end if;
  end loop;
end;
$$;

-- Grant para authenticated (mas só admin_geral pode executar devido à verificação interna)
grant execute on function public.admin_delete_users(uuid[]) to authenticated;

-- Verificar se a função foi criada
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
    raise exception '❌ Erro ao criar função admin_delete_users';
  end if;
end;
$$;
