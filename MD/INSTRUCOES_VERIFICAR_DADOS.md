# 🔍 Instruções para Verificar Por Que Dados Não Aparecem

## Problema
Os conteúdos cadastrados no Supabase não estão aparecendo no site.

## Possíveis Causas

### 1. **Políticas RLS Bloqueando**
As políticas Row Level Security podem estar bloqueando as queries SELECT.

### 2. **Filtros Muito Restritivos**
Os filtros no código podem estar excluindo os dados:
- **Locais**: Só mostra `is_safe = true`
- **Serviços**: Só mostra `is_active = true`
- **Eventos**: Só mostra `is_active = true` E `date >= hoje`

### 3. **Dados Não Cadastrados Corretamente**
Os dados podem não ter sido salvos corretamente no banco.

## 🔧 Como Resolver

### Passo 1: Executar SQL de Correção

1. Acesse: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
2. Vá em **SQL Editor** → **New query**
3. Abra o arquivo `SQL/SQL_VERIFICAR_E_CORRIGIR_RLS.sql` e copie TODO o conteúdo
4. Cole no SQL Editor e execute (botão **Run** ou `Ctrl+Enter`)

Este SQL vai:
- ✅ Verificar políticas atuais
- ✅ Remover políticas antigas
- ✅ Criar políticas públicas de SELECT
- ✅ Verificar quantos dados existem no banco
- ✅ Verificar quantos dados passam pelos filtros

### Passo 2: Verificar Resultados

Depois de executar o SQL, verifique:

1. **Políticas criadas**: Deve mostrar `✅ PÚBLICO` para todas as tabelas
2. **Dados no banco**: Veja quantos registros existem em cada tabela
3. **Dados com filtros**: Veja quantos registros passam pelos filtros do código

### Passo 3: Verificar Console do Navegador

1. Abra o site: `http://localhost:5173`
2. Pressione **F12** para abrir o console
3. Vá para a página de **Locais**, **Serviços** ou **Eventos**
4. Procure por mensagens como:
   - `Buscando locais do Supabase...`
   - `Locais encontrados: X`
   - `Erro detalhado ao buscar locais: ...`

### Passo 4: Verificar Dados no Supabase

1. No Dashboard do Supabase, vá em **Table Editor**
2. Verifique as tabelas:
   - **places**: Veja se há locais cadastrados
   - **services**: Veja se há serviços cadastrados
   - **events**: Veja se há eventos cadastrados

**Verifique especialmente:**
- ✅ **places.is_safe** está como `true`? (caso contrário não aparecerá)
- ✅ **services.is_active** está como `true`? (caso contrário não aparecerá)
- ✅ **events.is_active** está como `true`? (caso contrário não aparecerá)
- ✅ **events.date** é uma data futura? (eventos passados não aparecem)

### Passo 5: Testar Sem Filtros (Temporário)

Se ainda não aparecer, podemos temporariamente remover os filtros para testar. Me avise se precisar!

## 📝 Checklist

- [ ] Executei o SQL `SQL/SQL_VERIFICAR_E_CORRIGIR_RLS.sql`
- [ ] Políticas mostram `✅ PÚBLICO`
- [ ] Verifiquei console do navegador (F12)
- [ ] Verifiquei dados no Table Editor do Supabase
- [ ] Verifiquei campos `is_safe`, `is_active` e `date`

## 🐛 Se Ainda Não Funcionar

1. Copie e cole aqui as mensagens do console do navegador (F12)
2. Me diga quantos registros aparecem nas queries de verificação do SQL
3. Verifique se as variáveis de ambiente estão corretas no arquivo `.env`
