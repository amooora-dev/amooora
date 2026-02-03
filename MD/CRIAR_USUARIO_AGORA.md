# 🚀 Criar Usuário Agora - Guia Rápido

## ⚡ Método Rápido (2 minutos)

### Passo 1: Acessar o Dashboard
**Clique neste link direto:**
👉 https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw/auth/users

### Passo 2: Criar Usuário
1. **Clique no botão "Add User"** (ou "Create User") - geralmente no canto superior direito
2. **Preencha o formulário:**
   - **Email:** `teste@amooora.com.br`
   - **Password:** `teste123`
   - ✅ **IMPORTANTE:** Marque a caixa **"Auto Confirm User"** (isso evita precisar confirmar email)
3. **Clique em "Create User"**

### Passo 3: Preencher Perfil (Automático)
1. **Vá em SQL Editor** (menu lateral esquerdo)
2. **Clique em "New query"**
3. **Abra o arquivo** `SQL/SQL_CRIAR_USUARIO_TESTE.sql` no seu computador
4. **Copie TODO o conteúdo** do arquivo
5. **Cole no SQL Editor**
6. **Clique em "Run"** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)
7. **Deve aparecer:** "Usuário encontrado! ID: [uuid]" e "Perfil criado/atualizado com sucesso!"

### Passo 4: Testar Login
1. **Abra:** `http://localhost:5174/`
2. **Clique em "Entrar"**
3. **Faça login:**
   - Email: `teste@amooora.com.br`
   - Senha: `teste123`
4. **Deve redirecionar para Home**
5. **Clique no ícone de Perfil** (canto superior direito ou menu inferior)
6. **Veja seu perfil completo!** 🎉

---

## 📸 Capturas de Tela do Processo

### Onde encontrar "Add User":
- Menu lateral → **Authentication** → **Users**
- Botão **"Add User"** no canto superior direito da lista de usuários

### Formulário de criação:
```
┌─────────────────────────────┐
│  Add User                   │
├─────────────────────────────┤
│  Email:                     │
│  [teste@amooora.com.br    ] │
│                             │
│  Password:                  │
│  [teste123                ] │
│                             │
│  ☑ Auto Confirm User        │ ← IMPORTANTE!
│                             │
│  [Cancel]  [Create User]    │
└─────────────────────────────┘
```

---

## ✅ Verificar se Funcionou

Depois de criar o usuário:

1. **Verifique se o usuário aparece na lista** (Authentication → Users)
2. **Execute o SQL** `SQL/SQL_CRIAR_USUARIO_TESTE.sql`
3. **Verifique a mensagem no SQL Editor:**
   - ✅ "Usuário encontrado! ID: [uuid]"
   - ✅ "Perfil criado/atualizado com sucesso!"
4. **Tente fazer login no site**

---

## ❓ Problemas?

### "Usuário não encontrado" no SQL
- **Causa:** Usuário não foi criado ainda
- **Solução:** Complete o Passo 2 primeiro

### Login não funciona
- **Causa:** Email não confirmado ou credenciais incorretas
- **Solução:** Certifique-se de marcar "Auto Confirm User" ao criar

### SQL dá erro
- **Causa:** Usuário não existe
- **Solução:** Crie o usuário primeiro via Dashboard

---

## 🔗 Links Diretos

- **Criar Usuário:** https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw/auth/users
- **SQL Editor:** https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw/sql/new
- **Dashboard Principal:** https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw

---

**Tempo estimado:** 2-3 minutos  
**Dificuldade:** ⭐ Muito Fácil  
**Resultado:** Usuário criado e pronto para testar! 🚀
