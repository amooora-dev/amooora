# Setup do Supabase - Amooora

## ✅ O que foi feito

### 1. Instalação e Configuração
- ✅ Instalado `@supabase/supabase-js`
- ✅ Criado arquivo `.env` com credenciais do Supabase
- ✅ Criado `src/lib/supabase.ts` com cliente Supabase configurado
- ✅ `.env` adicionado ao `.gitignore` para segurança

### 2. Schema do Banco de Dados
- ✅ Criadas 10 tabelas no Supabase:
  - `profiles` - Perfis de usuário
  - `places` - Locais seguros
  - `services` - Serviços oferecidos
  - `events` - Eventos da comunidade
  - `reviews` - Avaliações
  - `saved_places` - Locais favoritos
  - `event_participants` - Participantes de eventos
  - `community_posts` - Posts da comunidade
  - `post_likes` - Curtidas em posts
  - `post_replies` - Comentários em posts

- ✅ Configurado Row Level Security (RLS) em todas as tabelas
- ✅ Criados índices para performance
- ✅ Criados triggers para atualização automática de ratings e contadores
- ✅ Criada função para auto-criar perfil ao registrar usuário

### 3. Services Atualizados
Todos os services foram atualizados para usar o Supabase ao invés de mocks:

- ✅ `src/app/services/places.ts` - Buscar locais do banco
- ✅ `src/app/services/services.ts` - Buscar serviços do banco
- ✅ `src/app/services/events.ts` - Buscar eventos do banco
- ✅ `src/app/services/reviews.ts` - Buscar avaliações do banco
- ✅ `src/app/services/users.ts` - Buscar usuários do banco

Os hooks (`usePlaces`, `useServices`, etc.) continuam funcionando normalmente, pois eles usam os services atualizados.

## 📋 Próximos Passos

### 1. Testar a Conexão (IMPORTANTE)

Primeiro, certifique-se de que o arquivo `.env` está configurado corretamente:

```bash
# Verificar se o arquivo .env existe
cat .env
```

Se o arquivo não existir ou estiver vazio, você precisa criar:

```env
VITE_SUPABASE_URL=https://btavwaysfjpsuqxdfguw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0YXZ3YXlzZmpwc3VxeGRmZ3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NjQ0NzUsImV4cCI6MjA4NDM0MDQ3NX0.pJQYiYy3bKO7khX4ZkUexCwXHaCgW2u4Q-puyiUSQhc
```

### 2. Inserir Dados de Teste

Antes de testar no frontend, você precisa inserir alguns dados de teste no Supabase. Você pode fazer isso:

**Opção A: Via Dashboard do Supabase**
1. Acesse: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
2. Vá em "Table Editor"
3. Adicione dados manualmente nas tabelas `places`, `services`, `events`

**Opção B: Via SQL (Recomendado)**
Execute no SQL Editor do Supabase para criar dados de exemplo:

```sql
-- Inserir alguns locais de exemplo
INSERT INTO places (name, description, image, category, is_safe, rating, address, latitude, longitude) VALUES
('Café da Vila', 'Um café aconchegante no coração da vila', 'https://images.unsplash.com/photo-1521017432531-fbd92d768814', 'Café', true, 4.8, 'Rua das Flores, 123', -23.5505, -46.6333),
('Bar Liberdade', 'Bar descontraído com música ao vivo', 'https://images.unsplash.com/photo-1694165823915-3e5a4c881d65', 'Bar', true, 4.9, 'Av. Principal, 456', -23.5515, -46.6343),
('Parque Ibirapuera', 'O parque mais importante de São Paulo', 'https://placehold.co/400x300?text=Ibirapuera', 'Parque', true, 4.7, 'Av. Pedro Álvares Cabral, São Paulo - SP', -23.5880, -46.6564);

-- Inserir alguns serviços de exemplo
INSERT INTO services (name, description, image, category, category_slug, price, rating, provider) VALUES
('Massagem Relaxante', 'Massagem terapêutica para alívio de tensões', 'https://placehold.co/400x300?text=Massagem', 'Bem-estar', 'bem-estar', 120.00, 4.7, 'Spa Zen'),
('Guia Turístico', 'Tour personalizado pelos principais pontos turísticos', 'https://placehold.co/400x300?text=Tour', 'Turismo', 'turismo', 150.00, 4.9, 'Tours & Cia');

-- Inserir alguns eventos de exemplo
INSERT INTO events (name, description, image, date, location, category, price) VALUES
('Festival de Música LGBTQIA+', 'Festival de música com artistas da comunidade', 'https://placehold.co/400x300?text=Festival', NOW() + INTERVAL '30 days', 'Parque da Cidade', 'Música', 50.00),
('Feira de Artesanato', 'Feira com produtos de artistas locais', 'https://placehold.co/400x300?text=Feira', NOW() + INTERVAL '15 days', 'Praça Central', 'Artesanato', 0);
```

### 3. Testar no Frontend

Reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

Agora os dados virão do Supabase! Os hooks e componentes já estão preparados para funcionar.

### 4. Configurar Autenticação (Próximo passo)

Para habilitar autenticação de usuários:

1. **Configurar Auth Providers** no Dashboard do Supabase:
   - Settings → Authentication → Providers
   - Habilitar Email, Google, etc.

2. **Criar utilitários de autenticação**:
   - Criar `src/lib/auth.ts` com funções `signUp`, `signIn`, `signOut`
   - Usar `supabase.auth` para gerenciar sessões

3. **Atualizar componentes de cadastro/login**:
   - `src/app/pages/Welcome.tsx`
   - `src/app/pages/Cadastro.tsx`

### 5. Configurar Storage (Para imagens)

Para permitir upload de imagens:

1. **Criar buckets** no Supabase:
   - Dashboard → Storage → Create bucket
   - Criar buckets: `avatars`, `places`, `events`, `services`, `posts`

2. **Configurar políticas RLS** no Storage:
   - Permitir leitura pública
   - Permitir upload apenas para usuários autenticados

3. **Atualizar services** para usar Storage:
   - Criar função `uploadImage` em `src/lib/storage.ts`
   - Usar URLs do Storage ao invés de URLs externas

### 6. Gerar Tipos TypeScript (Opcional mas Recomendado)

```bash
# Instalar CLI do Supabase
npm install -D supabase

# Gerar tipos
npx supabase gen types typescript --project-id btavwaysfjpsuqxdfguw > src/types/database.ts
```

Isso criará tipos TypeScript baseados no schema do banco de dados.

## 🔗 Links Úteis

- **Dashboard do Projeto**: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
- **Documentação Supabase**: https://supabase.com/docs
- **Documentação do Cliente JS**: https://supabase.com/docs/reference/javascript/introduction

## 📝 Notas Importantes

1. **Segurança**: O arquivo `.env` NÃO deve ser commitado no Git (já está no .gitignore)

2. **RLS (Row Level Security)**: As políticas RLS estão configuradas para:
   - Todos podem ver locais, serviços e eventos
   - Apenas usuários autenticados podem criar conteúdo
   - Usuários só podem editar/deletar seu próprio conteúdo

3. **Fallback para Mocks**: Se houver erro na conexão com o Supabase, os services podem retornar erros. Considere adicionar um fallback para mocks em caso de erro (opcional).

4. **Performance**: Os índices foram criados, mas para produção você pode querer otimizar queries com:
   - Paginação (`.range()`)
   - Filtros mais específicos
   - Cache quando apropriado

## 🐛 Troubleshooting

**Erro: "Variáveis de ambiente do Supabase não configuradas"**
- Verifique se o arquivo `.env` existe na raiz do projeto
- Reinicie o servidor de desenvolvimento após criar o `.env`

**Erro: "relation does not exist"**
- Verifique se as migrações foram aplicadas corretamente
- Acesse o Dashboard e verifique se as tabelas existem

**Dados não aparecem**
- Verifique se há dados inseridos nas tabelas
- Verifique as políticas RLS (podem estar bloqueando a leitura)
- Verifique o console do navegador para erros

---

**Última atualização**: Concluído! ✅
