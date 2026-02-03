# 📝 Instruções: Criar Usuário de Teste

## 🎯 Objetivo
Criar um usuário de teste para testar a página de perfil e login:
- **Email:** teste@amooora.com.br
- **Senha:** teste123

## 📋 Passo a Passo

### Passo 1: Criar Usuário no Supabase Dashboard

1. **Acesse o Supabase Dashboard:**
   - https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw

2. **Vá em Authentication:**
   - Menu lateral → **Authentication** → **Users**

3. **Criar Novo Usuário:**
   - Clique em **Add User** (ou **Create User**)
   - **Email:** `teste@amooora.com.br`
   - **Password:** `teste123`
   - **Marque "Auto Confirm User"** (importante!)
   - Clique em **Create User**

4. **Copie o User ID:**
   - Após criar, você verá o User ID do usuário
   - Anote esse ID (você vai precisar no próximo passo)

### Passo 2: Preencher Perfil do Usuário

1. **Execute o SQL:**
   - Vá em **SQL Editor** → **New query**
   - Abra o arquivo `SQL/SQL_CRIAR_USUARIO_TESTE.sql`
   - Copie TODO o conteúdo e cole no SQL Editor
   - Execute (botão **Run** ou `Ctrl+Enter`)

2. **O SQL vai:**
   - Buscar o usuário pelo email automaticamente
   - Criar/atualizar o perfil com dados completos:
     - Nome: Ana Paula Silva
     - Avatar: Foto de grupo de mulheres
     - Bio: Descrição completa
     - Pronomes: ela/dela
     - Cidade: São Paulo, SP
     - Interesses: Música, Arte, Viagens, Fotografia, Literatura, Ativismo
     - Tipo de relacionamento: Amizades e networking

### Passo 3: Testar Login

1. **Acesse o site:** `http://localhost:5174/`
2. **Clique em "Entrar"** na página Welcome
3. **Faça login com:**
   - Email: `teste@amooora.com.br`
   - Senha: `teste123`
4. **Deve redirecionar para Home**
5. **Clique no ícone de Perfil** (no Header ou BottomNav)
6. **Verifique se o perfil mostra os dados preenchidos**

## ✅ Verificar se Funcionou

Após executar o SQL, você deve ver:
- ✅ Mensagem: "Usuário encontrado! ID: [uuid]"
- ✅ Mensagem: "Perfil criado/atualizado com sucesso!"
- ✅ Resultado da query mostrando o perfil criado

## 🔍 Se o SQL Não Funcionar

Se aparecer "Usuário não encontrado", você precisa:
1. Criar o usuário primeiro via Dashboard (Passo 1)
2. Executar o SQL novamente

## 🎨 Dados do Perfil Criado

- **Nome:** Ana Paula Silva
- **Username:** @teste (gerado do email)
- **Avatar:** Foto de grupo de mulheres felizes
- **Bio:** "Apaixonada por café, cultura e boas conversas..."
- **Pronomes:** ela/dela
- **Cidade:** São Paulo, SP
- **Interesses:** Música, Arte, Viagens, Fotografia, Literatura, Ativismo
- **Relacionamento:** Amizades e networking

## 📝 Nota sobre o Email

O email fornecido `teste@amooora.com.ber` parece ter um erro de digitação (deveria ser `.com.br` ou `.com`).  
Vou usar exatamente como você escreveu, mas se preferir corrigir, é só me avisar!
