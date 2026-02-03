# Instruções para Inserir Reviews de Teste

Este guia explica como inserir 2 reviews de teste para cada conteúdo (locais, serviços e eventos) no banco de dados.

## 📋 O que será inserido?

- **2 reviews para cada local seguro** existente no banco
- **2 reviews para cada serviço ativo** existente no banco
- **2 reviews para cada evento ativo** existente no banco

Cada review inclui:
- Rating (nota de 1 a 5)
- Comentário temático para a comunidade LGBTQIA+
- Nome do autor (sem necessidade de login)
- Data de criação variada

## 🚀 Como Executar

### Passo 1: Acessar o Supabase Dashboard

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Faça login na sua conta
3. Selecione o projeto **Amooora-Dev**

### Passo 2: Abrir o SQL Editor

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query** (Nova Consulta)

### Passo 3: Executar o Script

1. Abra o arquivo `SQL/SQL_INSERIR_REVIEWS_TESTE.sql` deste projeto
2. Copie todo o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)

### Passo 4: Verificar os Resultados

O script inclui consultas de verificação no final que mostram:
- Total de reviews inseridas
- Quantidade de reviews por tipo (Locais, Serviços, Eventos)
- Uma prévia das últimas 10 reviews inseridas

## ✅ Verificação no Portal

Após executar o script, você poderá verificar no portal:

1. **Locais**: Acesse qualquer local e veja a seção "Avaliações" com 2 reviews
2. **Serviços**: Acesse qualquer serviço e veja a seção "Avaliações" com 2 reviews
3. **Eventos**: Acesse qualquer evento e veja a seção "Avaliações" com 2 reviews

### O que você verá:

- Rating médio calculado automaticamente
- Lista de avaliações com nome do autor, estrelas e comentário
- Data de criação de cada review
- Contagem total de avaliações

## 🔄 Executar Novamente

**⚠️ ATENÇÃO**: Se você executar o script novamente, ele criará reviews duplicadas.

Para limpar as reviews antes de executar novamente, execute:

```sql
-- CUIDADO: Isso apagará TODAS as reviews!
DELETE FROM public.reviews;
```

Ou, se quiser manter algumas reviews e apenas adicionar novas, o script continuará funcionando normalmente, apenas adicionando mais reviews.

## 📊 Exemplo de Resultado Esperado

Se você tem:
- 3 locais
- 3 serviços
- 3 eventos

O script criará:
- 6 reviews para locais (2 por local)
- 6 reviews para serviços (2 por serviço)
- 6 reviews para eventos (2 por evento)
- **Total: 18 reviews**

## 🐛 Problemas Comuns

### Erro: "column author_name does not exist"
- **Solução**: Execute primeiro o script `SQL/SQL_ADICIONAR_AUTHOR_NAME_REVIEWS.sql` para adicionar a coluna `author_name` na tabela `reviews`.

### Nenhuma review apareceu
- Verifique se os lugares têm `is_safe = true`
- Verifique se os serviços têm `is_active = true`
- Verifique se os eventos têm `is_active = true`
- Verifique se há dados nas tabelas `places`, `services` e `events`

### Reviews duplicadas
- Se você executou o script mais de uma vez, as reviews foram duplicadas. Isso é normal, mas se quiser limpar, use o comando DELETE mencionado acima.

## 📝 Notas

- As reviews são criadas **sem necessidade de login** (usando `author_name`)
- As datas são variadas para simular reviews de diferentes períodos
- Os comentários são temáticos e relacionados à comunidade LGBTQIA+
- O rating médio é calculado automaticamente pelo código da aplicação
