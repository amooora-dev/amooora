# 🔍 Diagnóstico de Problemas no Login

## ⚠️ Problema: Login não está funcionando

## 🔧 Passos para Diagnosticar

### 1. Verificar se o usuário foi criado

1. **Acesse o Supabase Dashboard:**
   - https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
   - Vá em **Authentication** → **Users**

2. **Verifique se o usuário existe:**
   - Procure por `teste@amooora.com.br`
   - Se NÃO existir, você precisa criá-lo primeiro:
     - Clique em **Add User** (ou **Create User**)
     - Email: `teste@amooora.com.br`
     - Password: `teste123`
     - **IMPORTANTE:** Marque "Auto Confirm User"
     - Clique em **Create User**

### 2. Verificar console do navegador

1. **Abra o DevTools:**
   - Pressione `F12` ou `Cmd+Option+I` (Mac)
   - Vá na aba **Console**

2. **Tente fazer login e observe os logs:**
   - Você deve ver logs como:
     - `🔐 Tentando fazer login com: { email: "..." }`
     - `✅ Login bem-sucedido!` (se funcionar)
     - `❌ Erro de autenticação: ...` (se falhar)

3. **Copie os logs de erro** e me envie para ajudar no diagnóstico

### 3. Erros Comuns e Soluções

#### ❌ Erro: "Invalid login credentials"
**Causa:** Email ou senha incorretos
**Solução:**
- Verifique se o email está correto: `teste@amooora.com.br`
- Verifique se a senha está correta: `teste123`
- Certifique-se de que não há espaços antes/depois do email/senha

#### ❌ Erro: "Email not confirmed"
**Causa:** Usuário criado mas email não foi confirmado
**Solução:**
- Ao criar o usuário no Dashboard, **marque "Auto Confirm User"**
- Ou vá em Authentication → Users → encontre o usuário → clique nos três pontos → **Confirm User**

#### ❌ Erro: "User not found"
**Causa:** Usuário não foi criado no Supabase
**Solução:**
- Crie o usuário primeiro via Dashboard (veja passo 1)

#### ❌ Erro: "Invalid email"
**Causa:** Formato de email inválido
**Solução:**
- Certifique-se de que o email está no formato correto: `email@dominio.com.br`
- Remova espaços antes/depois do email

### 4. Verificar Configuração do Supabase

1. **Verificar Auth Providers:**
   - Dashboard → **Authentication** → **Providers**
   - Certifique-se de que **Email** está habilitado
   - Verifique se não há restrições de domínio

2. **Verificar URL e Key:**
   - Abra o arquivo `.env` no projeto
   - Verifique se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão definidas
   - Certifique-se de que não há aspas extras ou espaços

### 5. Testar Login Direto no Supabase

1. **Abra o console do navegador (DevTools)**
2. **Execute este código:**
```javascript
// Substitua pela URL e Key do seu projeto
const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
const supabase = createClient(
  'https://btavwaysfjpsuqxdfguw.supabase.co',
  'sua-anon-key-aqui'
);

// Testar login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'teste@amooora.com.br',
  password: 'teste123'
});

console.log('Resultado:', { data, error });
```

### 6. Verificar Rede

1. **Verifique se há erros de rede:**
   - DevTools → **Network** → Tente fazer login
   - Procure por requisições para `/auth/v1/token`
   - Verifique se há erros 400, 401, 403, 500

2. **Verifique CORS (se estiver em desenvolvimento local):**
   - O Supabase permite localhost por padrão
   - Se estiver usando outra URL, adicione em Settings → API → CORS

## 📝 Informações para Enviar ao Desenvolvedor

Se o problema persistir, envie:

1. **Logs do console** (copie tudo que aparece)
2. **Mensagem de erro exata** que aparece na tela
3. **Captura de tela** da página de login
4. **Confirmação de que o usuário foi criado** no Dashboard
5. **Status do usuário** no Dashboard (confirmado? ativo?)

## ✅ Checklist Rápido

- [ ] Usuário criado no Supabase Dashboard
- [ ] Email confirmado (Auto Confirm marcado)
- [ ] Email correto: `teste@amooora.com.br`
- [ ] Senha correta: `teste123`
- [ ] Email provider habilitado no Supabase
- [ ] Variáveis de ambiente configuradas (.env)
- [ ] Console aberto para ver logs
- [ ] Nenhum erro de rede no DevTools

## 🚀 Criar Usuário Rápido

Se você ainda não criou o usuário:

1. Acesse: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw/auth/users
2. Clique em **Add User**
3. Preencha:
   - Email: `teste@amooora.com.br`
   - Password: `teste123`
   - **Marque:** "Auto Confirm User"
4. Clique em **Create User**
5. Execute o SQL `SQL/SQL_CRIAR_USUARIO_TESTE.sql` para preencher o perfil
