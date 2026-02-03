# Guia: Resolver Problemas de Rate Limit no Supabase

## Problema
O Supabase tem limites de taxa (rate limits) para criação de usuários e envio de emails. Quando você cria muitos usuários em pouco tempo, o limite é atingido e novos cadastros falham.

## Soluções Imediatas

### 1. Desabilitar Verificação de Email (Recomendado para Desenvolvimento)

**No Supabase Dashboard:**

1. Acesse: **Authentication** → **Settings**
2. Role até a seção **Email Auth**
3. **Desabilite** a opção **"Enable email confirmations"**
4. Salve as alterações

⚠️ **Importante**: Isso permite criar contas sem enviar emails de verificação. Reative antes de ir para produção!

**Benefícios:**
- Não conta para o rate limit de emails
- Criação de usuários instantânea
- Ideal para testes e desenvolvimento

### 2. Limpar Usuários de Teste

**No Supabase Dashboard:**

1. Acesse: **Authentication** → **Users**
2. Selecione os usuários de teste (use filtros se necessário)
3. Clique em **Delete** para remover usuários não utilizados
4. Confirme a exclusão

**Ou via SQL Editor:**

```sql
-- CUIDADO: Isso deleta TODOS os usuários não verificados
-- Ajuste a query conforme necessário

-- Ver usuários não verificados
SELECT id, email, created_at, email_confirmed_at
FROM auth.users
WHERE email_confirmed_at IS NULL
ORDER BY created_at DESC;

-- Deletar usuários não verificados criados nas últimas 24h
DELETE FROM auth.users
WHERE email_confirmed_at IS NULL
AND created_at < NOW() - INTERVAL '24 hours';
```

### 3. Aguardar Reset do Rate Limit

O rate limit do Supabase geralmente reseta após:
- **1 hora** para emails
- **24 horas** para criação de usuários (em alguns casos)

**Como verificar:**
- Tente criar um usuário após 1 hora
- Se ainda falhar, aguarde 24 horas

### 4. Usar Emails Diferentes

Para testes, use emails únicos:
- `teste1@example.com`
- `teste2@example.com`
- `teste3@example.com`
- Ou use serviços como `mailinator.com` ou `10minutemail.com`

### 5. Configurar SMTP Personalizado (Produção)

Para produção, configure seu próprio SMTP:

1. Acesse: **Authentication** → **Settings** → **SMTP Settings**
2. Configure com seu provedor de email (Gmail, SendGrid, etc.)
3. Isso aumenta significativamente os limites de envio

## Configurações Recomendadas para Desenvolvimento

### No Supabase Dashboard:

1. **Authentication** → **Settings**:
   - ✅ Desabilitar "Enable email confirmations"
   - ✅ Habilitar "Enable sign ups" (se necessário)

2. **Authentication** → **Email Templates**:
   - Pode deixar os templates padrão

3. **Project Settings** → **API**:
   - Verifique se há limites configurados

## Verificar Status do Rate Limit

**No Supabase Dashboard:**

1. Acesse: **Logs** → **API Logs**
2. Filtre por erros relacionados a "rate limit"
3. Verifique a frequência de erros

## Código: Tratamento de Erros

O código já está preparado para lidar com rate limits:

- Mensagens de erro amigáveis
- Tratamento específico para "rate limit exceeded"
- Orientações para o usuário

## Próximos Passos

1. **Imediato**: Desabilite verificação de email para desenvolvimento
2. **Limpeza**: Remova usuários de teste antigos
3. **Produção**: Configure SMTP personalizado quando for para produção

## Limites do Supabase (Plano Free)

- **Emails**: ~4 emails por hora por usuário
- **Criação de usuários**: Varia, mas geralmente ~10-20 por hora
- **API Requests**: 500MB de transferência por mês

## Contato com Suporte

Se o problema persistir:
1. Acesse: **Support** no Supabase Dashboard
2. Abra um ticket explicando o problema
3. Mencione que está em desenvolvimento/testes
