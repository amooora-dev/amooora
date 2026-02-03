# Guia de Uso do Supabase MCP para Criar o Schema

## Como Usar o Prompt

Você pode usar o prompt do arquivo `MD/PROMPT_SUPABASE_SCHEMA.md` de duas formas:

### Opção 1: Usar com o Supabase AI Assistant (no dashboard do Supabase)

1. Acesse o dashboard do Supabase: https://supabase.com/dashboard
2. Abra o projeto ou crie um novo
3. Vá em "SQL Editor" ou "Database" > "SQL Editor"
4. Copie e cole o conteúdo do arquivo `MD/PROMPT_SUPABASE_SCHEMA.md`
5. Use o AI Assistant do Supabase para gerar as migrações automaticamente

### Opção 2: Usar com o MCP do Supabase via Cursor

Se você tiver o MCP do Supabase configurado no Cursor, pode usar diretamente os comandos:

#### 1. Listar projetos
```
Liste meus projetos do Supabase
```

#### 2. Criar migrações
```
Crie uma migração SQL para o schema do Amooora baseado no prompt em MD/PROMPT_SUPABASE_SCHEMA.md
```

#### 3. Aplicar migrações
```
Aplique a migração "create_amooora_schema" no projeto [seu-project-id]
```

---

## Exemplo de Comandos MCP Supabase

### 1. Listar Projetos
```
Liste todos os projetos do Supabase
```

### 2. Criar Tabela profiles
```sql
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  avatar text,
  phone text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_verified boolean DEFAULT false,
  pronouns text,
  city text,
  interests text[],
  relationship_type text,
  privacy_level text DEFAULT 'public' CHECK (privacy_level IN ('public', 'connected'))
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Perfis públicos são visíveis para todos"
  ON profiles FOR SELECT
  USING (privacy_level = 'public');

CREATE POLICY "Usuários podem ver perfis conectados"
  ON profiles FOR SELECT
  USING (
    privacy_level = 'connected' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 3. Criar Trigger para Auto-criar Perfil

```sql
-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger no auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Passo a Passo Recomendado

### Passo 1: Preparar o Projeto
1. Crie um projeto no Supabase ou use um existente
2. Copie o Project ID do seu projeto

### Passo 2: Executar Migrações em Ordem

#### Migração 1: Tabelas Base
- `profiles`
- `places`
- `services`
- `events`

#### Migração 2: Tabelas de Relacionamento
- `reviews`
- `saved_places`
- `event_participants`

#### Migração 3: Comunidade
- `community_posts`
- `post_likes`
- `post_replies`

#### Migração 4: Funções e Triggers
- Funções de atualização de ratings
- Funções de contadores
- Trigger de auto-criação de perfil
- Trigger de atualização de `updated_at`

#### Migração 5: Índices
- Criar todos os índices para performance

#### Migração 6: RLS (Row Level Security)
- Configurar todas as políticas RLS

### Passo 3: Testar e Validar
1. Verificar se todas as tabelas foram criadas
2. Testar inserção de dados
3. Verificar políticas RLS
4. Testar triggers e funções

---

## Exemplo de Prompt para o Cursor/AI

```
Preciso criar o schema completo do banco de dados Supabase para o aplicativo Amooora.

O aplicativo é uma plataforma LGBTQIA+ para descobrir locais seguros, serviços, eventos e conectar pessoas.

Use o MCP do Supabase para:
1. Listar meus projetos
2. Criar todas as tabelas especificadas no arquivo MD/PROMPT_SUPABASE_SCHEMA.md
3. Configurar RLS (Row Level Security) para todas as tabelas
4. Criar funções e triggers necessários
5. Criar índices para performance

Tabelas necessárias:
- profiles (perfis de usuário)
- places (locais seguros)
- services (serviços)
- events (eventos)
- reviews (avaliações)
- saved_places (locais favoritos)
- event_participants (participantes de eventos)
- community_posts (posts da comunidade)
- post_likes (curtidas em posts)
- post_replies (comentários em posts)

Siga as especificações detalhadas no arquivo MD/PROMPT_SUPABASE_SCHEMA.md.

Após criar, me informe:
- Quais tabelas foram criadas
- Quais políticas RLS foram configuradas
- Quais triggers foram criados
- Se há algum aviso de segurança ou performance
```

---

## Comandos SQL Úteis para Testar

### Verificar tabelas criadas
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Verificar políticas RLS
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Verificar triggers
```sql
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

### Verificar índices
```sql
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## Próximos Passos Após Criar o Schema

1. **Configurar Storage**: Criar buckets para imagens de perfis, lugares, eventos, etc.
2. **Configurar Funções Edge**: Se necessário, criar Edge Functions para lógica específica
3. **Testar API**: Usar o cliente Supabase no frontend para testar as queries
4. **Gerar Types TypeScript**: Usar `supabase gen types typescript` para gerar tipos
5. **Configurar Variáveis de Ambiente**: Adicionar URLs e keys do Supabase no projeto

---

## Links Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/triggers.html)
- [Supabase TypeScript Client](https://supabase.com/docs/reference/javascript/introduction)