# Configurar Variáveis de Ambiente no Vercel

O Vercel precisa das variáveis de ambiente do Supabase para o aplicativo funcionar.

## Passo a Passo:

1. **Acesse o Dashboard do Vercel:**
   - Vá para: https://vercel.com/dashboard
   - Encontre o projeto `amooora-dev` (ou crie um novo)

2. **Configurar Variáveis de Ambiente:**
   - Vá em **Settings** → **Environment Variables**
   - Adicione as seguintes variáveis:

   ```
   VITE_SUPABASE_URL = https://btavwaysfjpsuqxdfguw.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0YXZ3YXlzZmpwc3VxeGRmZ3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NjQ0NzUsImV4cCI6MjA4NDM0MDQ3NX0.pJQYiYy3bKO7khX4ZkUexCwXHaCgW2u4Q-puyiUSQhc
   ```

3. **Selecionar Ambientes:**
   - Marque: Production, Preview e Development
   - Clique em **Save**

4. **Refazer Deploy:**
   - Vá em **Deployments**
   - Clique nos três pontos (⋯) do último deploy
   - Selecione **Redeploy**

   OU

   - Faça um novo push para o GitHub
   - O Vercel fará deploy automático

## Verificar se Funcionou:

Após o deploy, acesse a URL do Vercel e verifique:
- ✅ Se a aplicação carrega
- ✅ Se consegue fazer login/cadastro
- ✅ Se consegue cadastrar locais, serviços e eventos
- ✅ Se os dados aparecem nas listagens

## Se o Deploy Falhar:

1. Verifique os **Build Logs** no Vercel Dashboard
2. Verifique se as variáveis de ambiente estão configuradas corretamente
3. Verifique se o build local funciona: `npm run build`
