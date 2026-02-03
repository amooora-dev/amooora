# 🔧 Configurar Google Maps API Key no Vercel

**Problema:** O mapa não está abrindo no mobile porque a API key não está configurada no ambiente de produção (Vercel).

---

## ✅ Solução: Adicionar Variável de Ambiente no Vercel

### Passo 1: Acessar o Dashboard do Vercel

1. Acesse: https://vercel.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto **amooora-dev** (ou o nome do seu projeto)

### Passo 2: Adicionar Variável de Ambiente

1. No menu do projeto, clique em **Settings** (Configurações)
2. No menu lateral, clique em **Environment Variables** (Variáveis de Ambiente)
3. Clique no botão **Add New** (Adicionar Nova)

### Passo 3: Configurar a Variável

Preencha os campos:

- **Name (Nome):** `VITE_GOOGLE_MAPS_API_K`
- **Value (Valor):** `AIzaSyDlR1OgLBoDMXf1usqfdKkiG-6x6j7fTwc`
- **Environment (Ambiente):** Selecione:
  - ✅ **Production** (Produção)
  - ✅ **Preview** (Preview)
  - ✅ **Development** (Desenvolvimento) - opcional

### Passo 4: Salvar e Fazer Redeploy

1. Clique em **Save** (Salvar)
2. Vá para a aba **Deployments** (Implantações)
3. Clique nos três pontos (⋯) do último deployment
4. Selecione **Redeploy** (Reimplantar)
5. Aguarde o deploy concluir

---

## 🔍 Verificar se Funcionou

Após o redeploy:

1. Acesse o site no mobile: https://amooora-dev.vercel.app
2. Abra o console do navegador (se possível) ou verifique se o mapa carrega
3. O mapa deve aparecer na seção "Amooora Recomenda" na home

---

## ⚠️ Importante: Configurar Restrições no Google Cloud Console

Para proteger sua API key, configure as restrições:

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Clique na sua chave de API
3. Em **"Application restrictions"**, selecione **"HTTP referrers"**
4. Adicione os seguintes domínios:
   ```
   http://localhost:*
   https://localhost:*
   https://*.vercel.app/*
   https://amooora-dev.vercel.app/*
   https://amooora.com.br/*
   ```
5. Salve as alterações

---

## 🐛 Troubleshooting

### Mapa ainda não carrega após configurar no Vercel

1. **Verifique se o redeploy foi concluído**
   - Aguarde alguns minutos após o redeploy
   - Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)

2. **Verifique se a variável está correta**
   - No Vercel, vá em Settings → Environment Variables
   - Confirme que `VITE_GOOGLE_MAPS_API_K` está listada
   - Confirme que o valor está correto (sem espaços extras)

3. **Verifique as APIs no Google Cloud Console**
   - Acesse: https://console.cloud.google.com/apis/library
   - Confirme que as seguintes APIs estão ativadas:
     - ✅ Maps JavaScript API
     - ✅ Geocoding API

4. **Verifique o console do navegador**
   - Abra as ferramentas de desenvolvedor (F12)
   - Vá na aba Console
   - Procure por erros relacionados ao Google Maps
   - Se aparecer "API key not authorized", verifique as restrições de HTTP referrers

---

## 📝 Checklist

- [ ] Variável `VITE_GOOGLE_MAPS_API_K` adicionada no Vercel
- [ ] Variável configurada para Production, Preview e Development
- [ ] Redeploy realizado no Vercel
- [ ] Restrições de HTTP referrers configuradas no Google Cloud Console
- [ ] Maps JavaScript API ativada no Google Cloud Console
- [ ] Geocoding API ativada no Google Cloud Console
- [ ] Testado no mobile após o redeploy

---

**Última Atualização:** Janeiro de 2025  
**Status:** Instruções para configurar API key no Vercel ✅
