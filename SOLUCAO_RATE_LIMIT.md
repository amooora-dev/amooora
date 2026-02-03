# Solução para Erro "Email Rate Limit Exceeded"

## Problema

O erro "email rate limit exceeded" ocorre quando o Supabase atinge o limite de envio de emails em um período de tempo. Isso é comum durante testes repetidos de cadastro.

## Soluções

### 1. Aguardar alguns minutos
O limite de rate limit do Supabase é temporário. Aguarde 5-10 minutos antes de tentar criar uma nova conta novamente.

### 2. Usar um email diferente
Cada tentativa de cadastro conta para o rate limit. Use um email diferente para continuar testando.

### 3. Desabilitar verificação de email (apenas desenvolvimento)
No Supabase Dashboard:
1. Vá em **Authentication** → **Settings**
2. Desabilite **"Enable email confirmations"** temporariamente
3. Isso permite criar contas sem enviar emails de verificação

⚠️ **Importante**: Reative a verificação de email antes de ir para produção!

### 4. Verificar configurações de email no Supabase
- Vá em **Authentication** → **Settings** → **SMTP Settings**
- Verifique se há limites configurados
- Considere usar um serviço SMTP externo para produção

## Melhorias Implementadas

✅ Mensagens de erro mais amigáveis
✅ Tratamento específico para rate limit
✅ Orientações claras para o usuário

## Próximos Passos

1. Aguarde alguns minutos ou use um email diferente
2. Teste novamente o cadastro
3. Verifique se a foto de perfil está sendo carregada corretamente após o cadastro
