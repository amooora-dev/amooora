# Guia de Teste - Deleção de Usuários

## ✅ Correções Aplicadas

1. **Renomeada variável `user_id` para `target_user_id`** - Elimina ambiguidade com colunas das tabelas
2. **Todas as referências de colunas qualificadas** - `public.tabela.coluna` em vez de apenas `coluna`
3. **Script de teste criado** - Para validar a função antes de usar

---

## 📋 Passo a Passo para Aplicar

### 1. Executar o SQL Principal

1. Abra o **Supabase Dashboard** → **SQL Editor** → **New Query**
2. Abra o arquivo `SQL/admin_delete_users_completo.sql`
3. **Copie TODO o conteúdo** do arquivo
4. **Cole no SQL Editor** do Supabase
5. Clique em **Run** (ou pressione Ctrl+Enter / Cmd+Enter)
6. Aguarde a mensagem de sucesso:
   - ✅ Função admin_delete_users criada com sucesso!
   - ✅ Função admin_delete_user_single criada com sucesso!

### 2. Validar a Função (Opcional mas Recomendado)

1. No **SQL Editor**, abra o arquivo `SQL/test_admin_delete_users.sql`
2. **Copie e cole** no Supabase
3. Execute para ver:
   - Se as funções existem
   - Quantos usuários há no sistema
   - Quantas referências existem (posts, reviews, etc.)

### 3. Testar no Site

1. **Recarregue a página** do site (F5)
2. Faça **login como admin_geral**
3. Vá em **Admin** → **Gerenciar Usuárias**
4. Você verá:
   - Lista de todos os usuários
   - Checkbox ao lado de cada usuário (exceto você)
   - Botão "Selecionar todos" no topo
   - Botão "Deletar (X)" quando houver seleção

### 4. Testar Deleção

1. **Marque os checkboxes** dos usuários que deseja deletar
2. Clique em **"Deletar (X)"**
3. **Confirme** na janela de confirmação
4. Os usuários serão deletados permanentemente

---

## 🔍 Verificação de Problemas

### Se ainda aparecer erro de ambiguidade:

1. Verifique se executou o SQL **completo** (não apenas parte)
2. Verifique se não há erros no console do SQL Editor
3. Tente **dropar e recriar** as funções:

```sql
-- Dropar funções antigas
drop function if exists public.admin_delete_users(uuid[]);
drop function if exists public.admin_delete_user_single(uuid);

-- Depois execute o SQL completo novamente
```

### Se aparecer erro de permissão:

- Certifique-se de estar logado como `admin_geral`
- Verifique se o perfil tem `role = 'admin_geral'` e `status = 'active'`

### Se aparecer erro de foreign key:

- A função agora limpa automaticamente todas as referências
- Se ainda aparecer, pode ser uma tabela nova que não foi incluída
- Me avise qual tabela está causando o problema

---

## 🧪 Teste Manual no SQL (Avançado)

Se quiser testar diretamente no SQL Editor:

```sql
-- 1. Listar usuários
select id, email, name from auth.users u
left join public.profiles p on p.id = u.id
limit 5;

-- 2. Testar deletar um usuário específico (SUBSTITUA O ID)
-- select public.admin_delete_user_single('ID_DO_USUARIO_AQUI'::uuid);

-- 3. Verificar se foi deletado
-- select id, email from auth.users where id = 'ID_DO_USUARIO_AQUI';
```

---

## ✅ Checklist Final

- [ ] SQL executado com sucesso (sem erros)
- [ ] Funções criadas (mensagens de sucesso apareceram)
- [ ] Site recarregado (F5)
- [ ] Login como admin_geral
- [ ] Página "Gerenciar Usuárias" carrega
- [ ] Lista de usuários aparece
- [ ] Checkboxes funcionam
- [ ] Deleção funciona sem erros

---

## 📞 Se Ainda Não Funcionar

Envie:
1. **Screenshot do erro** (se houver)
2. **Mensagens do console** do navegador (F12 → Console)
3. **Mensagens do SQL Editor** (se houver erros ao executar)

E eu ajusto imediatamente!
