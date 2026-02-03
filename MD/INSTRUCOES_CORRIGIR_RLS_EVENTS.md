# Instruções para Corrigir RLS da Tabela Events

## Problema
Ao tentar cadastrar um evento, aparece o erro:
```
Erro ao criar evento: new row violates row-level security policy for table "events"
```

## Causa
A tabela `events` tem RLS (Row Level Security) habilitado, mas não há uma política que permita INSERT (inserção) de novos registros.

## Solução
Execute o script SQL para criar uma política que permita INSERT público na tabela `events`.

## Passos

1. **Acesse o Supabase Dashboard**
   - Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New Query**

3. **Execute o Script**
   - Copie e cole o conteúdo do arquivo `SQL/SQL_CORRIGIR_RLS_EVENTS_INSERT.sql`
   - Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)

4. **Verifique o Resultado**
   - Você deve ver uma mensagem de sucesso
   - A política `Allow public insert on events` deve aparecer na lista de políticas

## Verificação

Após executar o script, teste cadastrar um evento novamente:

1. Vá para a área administrativa
2. Tente cadastrar um novo evento
3. O erro de RLS não deve mais aparecer

## Nota Importante

Esta política permite que **qualquer pessoa** possa inserir eventos na tabela. Se no futuro você quiser restringir isso apenas para usuários autenticados, você pode modificar a política para:

```sql
CREATE POLICY "Allow authenticated insert on events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (true);
```

Mas por enquanto, a política pública permite que o cadastro funcione mesmo sem login.
