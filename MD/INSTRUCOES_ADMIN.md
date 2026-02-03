# 🔐 Instruções para Configurar Acesso Administrativo

## Passo a Passo Completo

### 1. Adicionar Colunas de Admin na Tabela `profiles`

Execute este SQL no Supabase SQL Editor:

```sql
-- Adicionar colunas se não existirem
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
END $$;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
```

### 2. Criar Usuário Administrador

#### Opção A: Criar via Dashboard do Supabase (Recomendado)

1. Acesse: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
2. Vá em **Authentication** → **Users**
3. Clique em **"Add user"** → **"Create new user"**
4. Preencha:
   - **Email**: `admin@amooora.com` (ou outro email de sua escolha)
   - **Password**: [crie uma senha forte]
   - **Auto Confirm User**: ✅ (marque esta opção)
5. Clique em **"Create user"**
6. **Copie o UUID** do usuário criado (aparece na lista de usuários)

#### Opção B: Criar via Código (Cadastro Normal)

1. Use a página de cadastro normal do app
2. Cadastre um usuário com email e senha
3. Depois execute o SQL da Parte 3 para torná-lo admin

### 3. Marcar Usuário como Admin

No Supabase SQL Editor, execute:

```sql
-- Substitua 'USER_UUID_AQUI' pelo UUID copiado na etapa anterior
UPDATE profiles
SET 
  is_admin = true,
  role = 'admin'
WHERE id = 'USER_UUID_AQUI';
```

### 4. Verificar se Funcionou

Execute este SQL para verificar:

```sql
SELECT id, email, name, is_admin, role
FROM profiles
WHERE is_admin = true OR role = 'admin';
```

Você deve ver o usuário criado com `is_admin = true` e `role = 'admin'`.

---

## Como Usar o Painel Admin

### 1. Acessar o Painel

1. Abra o aplicativo
2. Vá para a página **Welcome**
3. Clique no botão **"Área Administrativa"**
4. Você será redirecionado para a tela de login

### 2. Fazer Login

1. Digite o **email** do usuário admin criado
2. Digite a **senha** do usuário admin
3. Clique em **"Entrar"**

### 3. Usar o Painel

Após o login, você terá acesso a:
- ✅ **Cadastrar Usuário**: Criar novos usuários no sistema
- ✅ **Cadastrar Local**: Adicionar locais seguros
- ✅ **Cadastrar Serviço**: Adicionar serviços ao catálogo
- ✅ **Cadastrar Evento**: Criar eventos na plataforma

### 4. Sair do Painel

Clique no ícone de **Logout** (porta) no canto superior direito do painel admin.

---

## Segurança

### ✅ O que está protegido:

1. **Autenticação obrigatória**: Apenas usuários logados podem acessar o admin
2. **Verificação de role**: Apenas usuários com `is_admin = true` ou `role = 'admin'` podem acessar
3. **Logout funcional**: Sair do admin também faz logout do sistema

### ⚠️ Próximos passos recomendados:

1. **Restringir Políticas RLS**: Execute `SQL/SQL_RLS_SEGURO.sql` para proteger o banco
2. **Criar múltiplos admins**: Crie mais usuários admin conforme necessário
3. **Trocar senha regularmente**: Mantenha senhas seguras
4. **Monitorar acesso**: Verifique logs de acesso no Supabase Dashboard

---

## Troubleshooting

### Problema: "Acesso negado. Você não possui permissões de administrador"

**Solução:**
- Verifique se o usuário foi marcado como admin:
  ```sql
  SELECT id, email, is_admin, role FROM profiles WHERE email = 'seu@email.com';
  ```
- Se `is_admin = false` ou `role != 'admin'`, execute:
  ```sql
  UPDATE profiles SET is_admin = true, role = 'admin' WHERE email = 'seu@email.com';
  ```

### Problema: "Erro ao verificar permissões de administrador"

**Solução:**
- Verifique se as colunas `is_admin` e `role` existem na tabela `profiles`
- Execute o SQL da Parte 1 novamente

### Problema: Não consigo criar usuário no Supabase

**Solução:**
- Use a página de cadastro normal do app
- Depois marque como admin usando o SQL da Parte 3

---

## Credenciais de Exemplo

⚠️ **IMPORTANTE**: Altere essas credenciais após o primeiro acesso!

**Email**: `admin@amooora.com`  
**Senha**: [crie uma senha forte com no mínimo 8 caracteres]

---

**Última atualização**: Janeiro 2025
