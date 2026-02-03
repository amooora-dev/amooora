# Instruções: Adicionar Campos para Serviços e Eventos

Este guia explica como adicionar os novos campos necessários nas tabelas `services` e `events` do Supabase.

## 📋 Campos que serão adicionados

### Tabela `services`:
- `phone` (TEXT) - Telefone do prestador
- `whatsapp` (TEXT) - Número do WhatsApp (sem caracteres especiais)
- `address` (TEXT) - Endereço completo
- `specialties` (JSONB) - Array de especialidades oferecidas
- `hours` (JSONB) - Objeto com horários de funcionamento por dia da semana

### Tabela `events`:
- `end_time` (TIMESTAMPTZ) - Horário de término do evento

## 🚀 Como Executar

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard
   - Selecione o projeto: **Amooora-Dev**

2. **Abra o SQL Editor**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New Query** para criar uma nova query

3. **Execute o Script**
   - Abra o arquivo: `SQL/SQL_ADICIONAR_CAMPOS_SERVICOS_EVENTOS.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor do Supabase
   - Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)

4. **Verificar Execução**
   - O script mostrará mensagens de sucesso para cada coluna adicionada
   - Se uma coluna já existir, será informado sem erro
   - No final, será exibida uma verificação das colunas criadas

## ✅ Verificação

Após executar o script, você verá:
- Mensagens de NOTICE informando quais colunas foram criadas
- Uma tabela mostrando as colunas adicionadas na tabela `services`
- Uma tabela mostrando a coluna adicionada na tabela `events`

## 🔍 Verificar Manualmente

Se quiser verificar manualmente no Supabase:

1. Vá em **Table Editor**
2. Selecione a tabela `services`
3. Verifique se aparecem as colunas: `phone`, `whatsapp`, `address`, `specialties`, `hours`
4. Selecione a tabela `events`
5. Verifique se aparece a coluna: `end_time`

## ⚠️ Notas Importantes

- O script é **idempotente**: pode ser executado múltiplas vezes sem problemas
- Se uma coluna já existir, o script apenas informa e continua
- Os campos novos são **opcionais** (NULL permitido)
- Os campos JSONB (`specialties` e `hours`) têm valores padrão (array vazio e objeto vazio respectivamente)

## 🔄 Próximos Passos

Após executar o script:
1. Os campos estarão disponíveis no banco de dados
2. O código da aplicação já está preparado para usar esses campos
3. Os formulários de cadastro já têm os campos visuais necessários
4. Os dados serão salvos automaticamente ao cadastrar novos serviços/eventos
