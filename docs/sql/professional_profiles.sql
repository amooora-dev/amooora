-- Tabela para perfil profissional (executar no Supabase SQL Editor se ainda não existir)
-- RLS: usuário pode ler qualquer perfil profissional; insert/update/delete apenas do próprio user_id

create table if not exists public.professional_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  title text default '',
  industry text default '',
  location text default '',
  about text default '',
  open_to_opportunities boolean default true,
  open_to_networking boolean default true,
  experiences jsonb default '[]',
  education jsonb default '[]',
  skills jsonb default '[]',
  links jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_professional_profiles_user_id on public.professional_profiles(user_id);

alter table public.professional_profiles enable row level security;

drop policy if exists "Leitura pública de perfis profissionais" on public.professional_profiles;
create policy "Leitura pública de perfis profissionais"
  on public.professional_profiles for select
  using (true);

drop policy if exists "Usuário gerencia próprio perfil profissional" on public.professional_profiles;
create policy "Usuário gerencia próprio perfil profissional"
  on public.professional_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
