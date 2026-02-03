# Guia de Teste - Cadastro de Usuário no Supabase

## ✅ O que foi implementado:

1. **Serviço de Autenticação** (`src/lib/auth.ts`):
   - Função `signUp()` para criar novo usuário
   - Função `signIn()` para login
   - Função `signOut()` para logout
   - Função `getCurrentAuthUser()` para obter usuário atual

2. **Página de Cadastro atualizada** (`src/app/pages/Cadastro.tsx`):
   - Integração com Supabase Auth
   - Estados de loading e erro
   - Feedback visual para o usuário
   - Validação de formulário mantida

## 🧪 Como testar:

### 1. Verificar configuração do Supabase

Antes de testar, certifique-se de que:

- ✅ **Email Provider está habilitado**:
  1. Acesse: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
  2. Vá em **Settings → Authentication → Providers**
  3. Verifique se **Email** está habilitado

- ✅ **Trigger `handle_new_user()` está criado**:
  1. Vá em **SQL Editor** no Dashboard
  2. Execute esta query para verificar:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```

  Se não existir, o perfil será criado manualmente pelo código.

### 2. Rodar a aplicação

```bash
npm run dev
```

### 3. Testar o cadastro

1. **Acesse a página de Welcome** (`http://localhost:5173`)
2. **Clique em "Cadastrar"**
3. **Preencha o formulário (Passo 1)**:
   - Nome: ex. "Maria Silva"
   - Email: use um email real (ex. "teste@example.com")
   - Senha: mínimo 8 caracteres (ex. "senha123")
   - Confirmar Senha: mesma senha
4. **Clique em "Continuar"**
5. **Preencha o formulário (Passo 2)**:
   - Selecione seus pronomes
   - Marque "Confirmo que sou maior de 18 anos"
   - Marque "Aceito os Termos de Uso"
6. **Clique em "Criar Conta"**

### 4. Verificar no Supabase Dashboard

Após o cadastro, verifique:

1. **Usuário criado em Auth**:
   - Vá em **Authentication → Users**
   - Você deve ver o novo usuário com o email cadastrado

2. **Perfil criado na tabela `profiles`**:
   - Vá em **Table Editor → profiles**
   - Você deve ver o perfil com:
     - `id`: UUID do usuário
     - `name`: Nome cadastrado
     - `email`: Email cadastrado
     - `pronouns`: Pronomes selecionados

### 5. Verificar logs no Console

Abra o **DevTools** (F12) e verifique:

- ✅ Console deve mostrar: "Usuário criado com sucesso: {user object}"
- ❌ Se houver erro, aparecerá uma mensagem vermelha na tela

## 🔍 Possíveis problemas e soluções:

### Erro: "Email already registered"
- **Solução**: Use um email diferente ou delete o usuário em **Authentication → Users**

### Erro: "Invalid email format"
- **Solução**: Verifique se o email está no formato correto (ex. "teste@example.com")

### Erro: "Password should be at least 8 characters"
- **Solução**: Use uma senha com pelo menos 8 caracteres

### Usuário criado, mas perfil não aparece na tabela `profiles`
- **Possível causa**: O trigger `handle_new_user()` não está criado
- **Solução**: O código tenta criar/atualizar o perfil manualmente. Verifique os logs do console para mais detalhes.

### Erro de CORS ou conexão
- **Solução**: Verifique se as variáveis de ambiente no `.env` estão corretas:
  ```
  VITE_SUPABASE_URL=https://btavwaysfjpsuqxdfguw.supabase.co
  VITE_SUPABASE_ANON_KEY=sua_chave_aqui
  ```

## 📝 Próximos passos:

1. ✅ Cadastro funcionando
2. ⏭️ Implementar login na página Welcome
3. ⏭️ Criar contexto de autenticação (AuthContext)
4. ⏭️ Proteger rotas que exigem autenticação
5. ⏭️ Permitir edição de perfil

---

**Status**: ✅ Pronto para testar!
