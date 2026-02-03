# 🚀 Deploy na Vercel - Instruções Rápidas

## ✅ O que já está pronto

- ✅ Build testado e funcionando
- ✅ Vercel CLI instalado
- ✅ Arquivo `vercel.json` configurado
- ✅ Scripts de deploy no `package.json`

---

## 🔐 Passo 1: Fazer Login na Vercel

Execute no terminal:

```bash
npx vercel login
```

Isso vai:
1. Abrir seu navegador automaticamente
2. Pedir para você fazer login na Vercel (ou criar conta)
3. Autorizar o CLI a acessar sua conta
4. Voltar ao terminal quando concluído

---

## 📦 Passo 2: Fazer o Deploy

Após fazer login, execute:

```bash
# Deploy de preview (primeira vez)
npx vercel

# OU use o script npm
npm run deploy
```

O CLI vai perguntar:
- **Set up and deploy?** → Digite `Y` (Yes)
- **Which scope?** → Selecione sua conta
- **Link to existing project?** → Digite `N` (No) se for a primeira vez
- **Project name?** → Pressione Enter para usar o padrão ou digite um nome
- **Directory?** → Pressione Enter para usar `.`

Aguarde o build e deploy (pode levar alguns minutos).

---

## 🔑 Passo 3: Configurar Variáveis de Ambiente

**IMPORTANTE**: Após o primeiro deploy, você DEVE configurar as variáveis de ambiente!

### Opção A: Via Dashboard (Recomendado)

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto recém-criado
3. Vá em **Settings** → **Environment Variables**
4. Clique em **Add New**
5. Adicione as variáveis:

**Variável 1:**
- **Key**: `VITE_SUPABASE_URL`
- **Value**: `https://btavwaysfjpsuqxdfguw.supabase.co`
- **Environments**: ✅ Production ✅ Preview ✅ Development

**Variável 2:**
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0YXZ3YXlzZmpwc3VxeGRmZ3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NjQ0NzUsImV4cCI6MjA4NDM0MDQ3NX0.pJQYiYy3bKO7khX4ZkUexCwXHaCgW2u4Q-puyiUSQhc`
- **Environments**: ✅ Production ✅ Preview ✅ Development

6. Clique em **Save** para cada variável
7. **Faça um novo deploy** para aplicar as variáveis (ou elas serão aplicadas no próximo deploy automático)

### Opção B: Via CLI

```bash
# Adicionar VITE_SUPABASE_URL
npx vercel env add VITE_SUPABASE_URL

# Quando perguntar:
# - What's the value? → Cole: https://btavwaysfjpsuqxdfguw.supabase.co
# - Add to which environments? → Selecione: Production, Preview, Development

# Adicionar VITE_SUPABASE_ANON_KEY
npx vercel env add VITE_SUPABASE_ANON_KEY

# Quando perguntar:
# - What's the value? → Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0YXZ3YXlzZmpwc3VxeGRmZ3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NjQ0NzUsImV4cCI6MjA4NDM0MDQ3NX0.pJQYiYy3bKO7khX4ZkUexCwXHaCgW2u4Q-puyiUSQhc
# - Add to which environments? → Selecione: Production, Preview, Development
```

---

## 🌐 Passo 4: Deploy de Produção

Após configurar as variáveis, faça o deploy de produção:

```bash
# Deploy para produção
npx vercel --prod

# OU use o script npm
npm run deploy:prod
```

---

## ✅ Verificar Deploy

Após o deploy:

1. **Acesse o URL fornecido pela Vercel** (ex: `https://amooora-dev.vercel.app`)
2. **Teste a aplicação:**
   - Verifique se a página carrega
   - Teste navegação entre páginas
   - Verifique console do navegador (F12) para erros
   - Teste se os dados do Supabase carregam

---

## 🔄 Deploy Automático

Após conectar o repositório GitHub:

- **Cada push para `main`** → Deploy de produção automático
- **Cada pull request** → Deploy de preview automático

Para conectar ao GitHub:
1. No dashboard da Vercel, vá em **Settings** → **Git**
2. Conecte seu repositório: `https://github.com/ninamcunha/amooora-dev`

---

## 📋 Resumo dos Comandos

```bash
# 1. Login
npx vercel login

# 2. Deploy preview
npm run deploy

# 3. Adicionar variáveis de ambiente (via CLI ou Dashboard)
npx vercel env add VITE_SUPABASE_URL
npx vercel env add VITE_SUPABASE_ANON_KEY

# 4. Deploy produção
npm run deploy:prod
```

---

## ⚠️ Importante

- **NUNCA commite o arquivo `.env`** (já está no .gitignore)
- **Configure as variáveis de ambiente na Vercel** antes de fazer deploy de produção
- **As variáveis são necessárias** para a aplicação se conectar ao Supabase

---

## 🐛 Problemas Comuns

### "The specified token is not valid"
→ Execute `npx vercel login` novamente

### "Build failed"
→ Verifique se o build local funciona: `npm run build`
→ Verifique os logs no dashboard da Vercel

### "Environment Variable not found"
→ Configure as variáveis de ambiente no dashboard da Vercel
→ Faça um novo deploy após adicionar variáveis

### "Supabase connection failed" no deploy
→ Verifique se as variáveis de ambiente estão configuradas
→ Verifique se os valores estão corretos
→ Verifique se selecionou todos os ambientes (Production, Preview, Development)

---

**Pronto para fazer deploy?** Execute: `npx vercel login` 🚀
