# Troubleshooting: Vercel não mostra última versão

## 🔍 Verificações Rápidas

### 1. Verificar Status do Deploy no Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **amooora-dev**
3. Verifique a aba **Deployments**
4. Veja se há:
   - ✅ Deploy bem-sucedido recente
   - ⚠️ Deploy em andamento
   - ❌ Deploy com erro

### 2. Verificar Logs de Build

Se houver erro no deploy:
1. Clique no deployment com erro
2. Veja os **Build Logs**
3. Procure por erros de:
   - Variáveis de ambiente faltando
   - Erros de compilação TypeScript
   - Dependências não instaladas

### 3. Verificar Variáveis de Ambiente

No Dashboard do Vercel:
1. Vá em **Settings** → **Environment Variables**
2. Verifique se existem:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Se não existirem, adicione-as

### 4. Forçar Novo Deploy

**Opção 1: Via Dashboard do Vercel**
1. Vá em **Deployments**
2. Clique nos três pontos (⋯) do último deploy
3. Selecione **Redeploy**

**Opção 2: Via Git (Recomendado)**
```bash
# Criar um commit vazio para forçar deploy
git commit --allow-empty -m "chore: forçar redeploy no Vercel"
git push origin main
```

**Opção 3: Via CLI do Vercel**
```bash
npm run deploy:prod
```

### 5. Limpar Cache

**No Navegador:**
- Chrome/Edge: `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)
- Firefox: `Ctrl+F5` (Windows) ou `Cmd+Shift+R` (Mac)
- Ou abra em modo anônimo/privado

**No Vercel:**
1. Vá em **Settings** → **Build & Development Settings**
2. Marque **Clear build cache and redeploy**

## 🚨 Problemas Comuns

### Build Falha por Variáveis de Ambiente

**Sintoma:** Build falha com erro sobre variáveis não definidas

**Solução:**
1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   - `VITE_SUPABASE_URL` = URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY` = Chave anônima do Supabase
3. Faça um novo deploy

### Deploy Antigo Aparece

**Sintoma:** Site mostra versão antiga mesmo após deploy bem-sucedido

**Soluções:**
1. Limpar cache do navegador (hard refresh)
2. Verificar se o deploy mais recente está em **Production**
3. Verificar se há múltiplos projetos no Vercel (pode estar olhando o errado)

### Build Demora Muito

**Sintoma:** Deploy fica "Building..." por muito tempo

**Soluções:**
1. Verificar logs do build para ver onde está travando
2. Verificar se há dependências pesadas sendo instaladas
3. Considerar usar cache do Vercel para node_modules

## ✅ Checklist de Verificação

- [ ] Último commit está no GitHub?
- [ ] Vercel está conectado ao repositório correto?
- [ ] Variáveis de ambiente estão configuradas?
- [ ] Build está passando sem erros?
- [ ] Deploy mais recente está em "Ready"?
- [ ] Cache do navegador foi limpo?
- [ ] Está acessando a URL correta (production)?

## 📞 Próximos Passos

Se nenhuma das soluções acima funcionar:
1. Verifique os logs completos do build no Vercel
2. Compare o código local com o que está no GitHub
3. Verifique se há diferenças entre branches (main vs outras)
