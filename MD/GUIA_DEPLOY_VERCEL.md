# Guia de Deploy na Vercel - Amooora

## ✅ Preparação Completa

- ✅ Vercel CLI instalado
- ✅ Arquivo `vercel.json` configurado
- ✅ Scripts de deploy adicionados ao `package.json`

---

## 🚀 Opção 1: Deploy via CLI (Recomendado)

### Passo 1: Fazer Login na Vercel

```bash
# Fazer login (abrirá o navegador)
npx vercel login
```

### Passo 2: Deploy pela Primeira Vez

```bash
# Deploy de preview (desenvolvimento)
npx vercel

# OU use o script npm
npm run deploy
```

Isso vai:
1. Pedir para você selecionar o escopo (sua conta/team)
2. Conectar ao projeto existente ou criar um novo
3. Detectar automaticamente as configurações do Vite
4. Fazer o build e deploy

### Passo 3: Configurar Variáveis de Ambiente

Após o primeiro deploy, você precisa configurar as variáveis de ambiente:

**Opção A: Via Dashboard da Vercel**
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://btavwaysfjpsuqxdfguw.supabase.co`
   - **Environment**: Production, Preview, Development (marque todos)
   
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0YXZ3YXlzZmpwc3VxeGRmZ3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NjQ0NzUsImV4cCI6MjA4NDM0MDQ3NX0.pJQYiYy3bKO7khX4ZkUexCwXHaCgW2u4Q-puyiUSQhc`
   - **Environment**: Production, Preview, Development (marque todos)
5. Clique em **Save**

**Opção B: Via CLI**
```bash
# Adicionar variáveis de ambiente
npx vercel env add VITE_SUPABASE_URL production preview development
# Quando pedir o valor, cole: https://btavwaysfjpsuqxdfguw.supabase.co

npx vercel env add VITE_SUPABASE_ANON_KEY production preview development
# Quando pedir o valor, cole a chave anon do Supabase
```

### Passo 4: Deploy de Produção

```bash
# Deploy para produção
npx vercel --prod

# OU use o script npm
npm run deploy:prod
```

---

## 🖥️ Opção 2: Deploy via Dashboard da Vercel

### Passo 1: Conectar Repositório

1. Acesse: https://vercel.com
2. Faça login
3. Clique em **"Add New..."** → **"Project"**
4. Clique em **"Import Git Repository"**
5. Selecione ou conecte: `https://github.com/ninamcunha/amooora-dev`

### Passo 2: Configurar Projeto

A Vercel vai detectar automaticamente:
- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Install Command: `npm install`

Você não precisa alterar nada! Mas pode verificar se está correto.

### Passo 3: Configurar Variáveis de Ambiente

**IMPORTANTE**: Antes de fazer o deploy, configure as variáveis!

1. Na tela de configuração do projeto, expanda **"Environment Variables"**
2. Adicione:
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://btavwaysfjpsuqxdfguw.supabase.co`
   - Marque: Production, Preview, Development
   
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0YXZ3YXlzZmpwc3VxeGRmZ3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NjQ0NzUsImV4cCI6MjA4NDM0MDQ3NX0.pJQYiYy3bKO7khX4ZkUexCwXHaCgW2u4Q-puyiUSQhc`
   - Marque: Production, Preview, Development

### Passo 4: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build e deploy (pode levar alguns minutos)
3. Quando terminar, você receberá um URL (ex: `https://amooora-dev.vercel.app`)

---

## 📋 Checklist de Deploy

Antes de fazer deploy, certifique-se:

- [ ] Build local funciona (`npm run build`)
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Repositório GitHub conectado (se usar dashboard)
- [ ] Vercel CLI instalado e logado (se usar CLI)

---

## 🔍 Verificar Deploy

Após o deploy, verifique:

1. **URL Funcionando**: Acesse o URL fornecido pela Vercel
2. **Console do Navegador**: Verifique se não há erros
3. **Dados do Supabase**: Teste se as páginas carregam dados do Supabase
4. **Logs**: Verifique os logs de build no dashboard da Vercel

---

## 🔄 Próximos Deploys

Após o primeiro deploy:

### Deploy Automático (via Git)
- **Cada push para `main`** → Deploy de produção automático
- **Cada push para outras branches** → Deploy de preview automático

### Deploy Manual via CLI
```bash
# Preview
npm run deploy

# Produção
npm run deploy:prod
```

---

## ⚙️ Configurações Avançadas

### Domínio Customizado

1. No dashboard da Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Siga as instruções de DNS

### Branch Protection

No dashboard da Vercel:
1. Vá em **Settings** → **Git**
2. Configure quais branches fazem deploy automático

### Variáveis de Ambiente por Ambiente

Você pode ter diferentes variáveis para:
- **Production**: Produção
- **Preview**: Pull requests e branches
- **Development**: Deploy local com `vercel dev`

---

## 🐛 Troubleshooting

### Erro: "Build Failed"
- Verifique os logs no dashboard da Vercel
- Teste o build local: `npm run build`
- Verifique se todas as dependências estão no `package.json`

### Erro: "Environment Variable not found"
- Certifique-se de que as variáveis estão configuradas no dashboard
- Verifique se selecionou todos os ambientes (Production, Preview, Development)
- Faça um novo deploy após adicionar variáveis

### Erro: "Page not found" (404)
- Verifique se o `vercel.json` está configurado corretamente
- O arquivo tem as rewrites para SPA?

### Erro: "Supabase connection failed"
- Verifique se as variáveis de ambiente estão configuradas
- Verifique se o nome das variáveis está correto (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`)
- Verifique se os valores estão corretos

---

## 📝 Comandos Úteis

```bash
# Ver informações do projeto
npx vercel ls

# Ver logs do deploy
npx vercel logs

# Remover deploy de preview
npx vercel rm <deployment-url>

# Iniciar servidor local com ambiente da Vercel
npx vercel dev
```

---

## 🔗 Links Úteis

- **Dashboard Vercel**: https://vercel.com/dashboard
- **Documentação Vercel**: https://vercel.com/docs
- **Documentação Vite + Vercel**: https://vercel.com/docs/frameworks/vite

---

## ✅ Próximos Passos Após Deploy

1. ✅ Deploy concluído
2. ⏭️ Testar aplicação no URL fornecido
3. ⏭️ Configurar domínio customizado (opcional)
4. ⏭️ Configurar CI/CD automático (já funciona se conectado ao Git)

---

**Última atualização**: Vercel CLI instalado e pronto para deploy! 🚀
