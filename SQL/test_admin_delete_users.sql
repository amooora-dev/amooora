-- =========================================================
-- TESTE: Validar função de deleção de usuários
-- =========================================================
-- 
-- Este script testa se a função admin_delete_users está funcionando
-- Execute APENAS se quiser testar (não deleta nada por padrão)
-- =========================================================

-- 1. Verificar se as funções existem
do $$
begin
  if exists (
    select 1 
    from pg_proc 
    where proname = 'admin_delete_users' 
    and pronamespace = (select oid from pg_namespace where nspname = 'public')
  ) then
    raise notice '✅ Função admin_delete_users existe';
  else
    raise warning '❌ Função admin_delete_users NÃO existe';
  end if;

  if exists (
    select 1 
    from pg_proc 
    where proname = 'admin_delete_user_single' 
    and pronamespace = (select oid from pg_namespace where nspname = 'public')
  ) then
    raise notice '✅ Função admin_delete_user_single existe';
  else
    raise warning '❌ Função admin_delete_user_single NÃO existe';
  end if;
end;
$$;

-- 2. Verificar se há usuários no sistema
do $$
declare
  user_count integer;
begin
  select count(*) into user_count from auth.users;
  raise notice '📊 Total de usuários no sistema: %', user_count;
  
  if user_count = 0 then
    raise warning '⚠️ Nenhum usuário encontrado no sistema';
  end if;
end;
$$;

-- 3. Listar todos os usuários (para referência)
select 
  u.id,
  u.email,
  p.name,
  p.role,
  p.status,
  u.created_at
from auth.users u
left join public.profiles p on p.id = u.id
order by u.created_at desc
limit 10;

-- 4. Verificar se há referências que podem causar problemas
do $$
declare
  posts_count integer;
  reviews_count integer;
  members_count integer;
begin
  -- Verificar community_posts
  if to_regclass('public.community_posts') is not null then
    select count(*) into posts_count from public.community_posts;
    raise notice '📝 Posts de comunidades: %', posts_count;
  end if;
  
  -- Verificar reviews
  if to_regclass('public.reviews') is not null then
    select count(*) into reviews_count from public.reviews;
    raise notice '⭐ Reviews: %', reviews_count;
  end if;
  
  -- Verificar community_members
  if to_regclass('public.community_members') is not null then
    select count(*) into members_count from public.community_members;
    raise notice '👥 Membros de comunidades: %', members_count;
  end if;
end;
$$;

-- =========================================================
-- TESTE REAL (DESCOMENTE APENAS SE QUISER TESTAR DE FATO)
-- =========================================================
-- 
-- ATENÇÃO: Isso vai DELETAR um usuário de teste!
-- Use apenas com um usuário que você criou especificamente para teste
-- 
-- Para testar:
-- 1. Crie um usuário de teste primeiro
-- 2. Anote o ID do usuário de teste
-- 3. Descomente as linhas abaixo
-- 4. Substitua 'USER_ID_AQUI' pelo ID real
-- 5. Execute como admin_geral
-- =========================================================

/*
-- Exemplo de teste (NÃO EXECUTE SEM MODIFICAR):
-- select public.admin_delete_user_single('USER_ID_AQUI'::uuid);
*/
