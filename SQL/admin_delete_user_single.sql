-- =========================================================
-- AMOOORA - Função RPC para deletar UM usuário (versão alternativa)
-- Use esta se a versão com array não funcionar
-- =========================================================

-- Função para deletar um único usuário
create or replace function public.admin_delete_user_single(user_id uuid)
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
  if current_user_id = user_id then
    raise exception 'forbidden: você não pode deletar sua própria conta';
  end if;

  -- Verificar se o usuário existe
  if not exists (select 1 from auth.users where id = user_id) then
    raise exception 'usuário não encontrado';
  end if;

  -- Deletar do auth.users (cascateia automaticamente para profiles)
  delete from auth.users where id = user_id;
end;
$$;

-- Grant para authenticated
grant execute on function public.admin_delete_user_single(uuid) to authenticated;
