# 📝 Instruções: Preencher Perfil do Admin

## 🎯 Objetivo
Preencher o perfil de `admin@amooora.com` com dados de exemplo para testar a página de perfil com conteúdo completo.

## 📋 Passo a Passo

### Passo 1: Executar o SQL

1. **Acesse o Supabase Dashboard:**
   - https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw

2. **Vá em SQL Editor:**
   - Menu lateral → **SQL Editor** → **New query**

3. **Execute o SQL:**
   - Abra o arquivo `SQL/SQL_PREENCHER_PERFIL_ADMIN.sql`
   - Copie TODO o conteúdo
   - Cole no SQL Editor
   - Clique em **Run** (ou `Ctrl+Enter` / `Cmd+Enter`)

### Passo 2: Verificar Resultado

O SQL vai automaticamente:

1. **Buscar o usuário** `admin@amooora.com`
2. **Preencher o perfil** com:
   - Nome: Admin Amooora
   - Avatar: Foto de perfil
   - Bio: Descrição completa
   - Pronomes: ela/dela
   - Cidade: São Paulo, SP
   - Interesses: Administração, Comunidade, Eventos, Segurança, Inclusão, Tecnologia
   - Tipo de relacionamento: Amizades e networking

3. **Adicionar locais favoritos** (primeiros 5 locais do banco)

4. **Adicionar participação em eventos:**
   - 2 eventos futuros
   - 2 eventos passados

5. **Adicionar reviews de exemplo:**
   - 1 review para um local favorito
   - 1 review para um serviço
   - 1 review para um evento

### Passo 3: Testar no Site

1. **Faça login** com `admin@amooora.com`
2. **Clique no ícone de Perfil** (Header ou BottomNav)
3. **Verifique se aparece:**
   - ✅ Perfil completo com nome, avatar, bio
   - ✅ Estatísticas (Eventos, Lugares, Amigos)
   - ✅ Locais Favoritos (cards com imagens)
   - ✅ Próximos Eventos (eventos futuros)
   - ✅ Eventos que Participei (eventos passados)
   - ✅ Calendário com eventos marcados
   - ✅ Reviews com comentários

## ✅ O que será preenchido

### Perfil:
- **Nome:** Admin Amooora
- **Email:** admin@amooora.com
- **Avatar:** Foto de perfil profissional
- **Bio:** Descrição sobre administradora da plataforma
- **Pronomes:** ela/dela
- **Cidade:** São Paulo, SP
- **Interesses:** Administração, Comunidade, Eventos, Segurança, Inclusão, Tecnologia

### Conteúdo relacionado:
- **5 locais favoritos** (os primeiros 5 locais do banco)
- **2 eventos futuros** (próximos eventos)
- **2 eventos passados** (eventos já realizados)
- **3 reviews** (uma para local, uma para serviço, uma para evento)

## 🔍 Verificar se Funcionou

Após executar o SQL, você deve ver no final:
- ✅ "Usuário admin encontrado! ID: [uuid]"
- ✅ "Perfil do admin atualizado com sucesso!"
- ✅ "Local favorito 1 adicionado"
- ✅ "Evento futuro 1 adicionado"
- ✅ "Review para local adicionada"
- ✅ "✅ Perfil do admin preenchido com sucesso!"

## ⚠️ Observações

- O SQL adiciona conteúdo baseado nos **dados existentes** no banco
- Se não houver locais/eventos/serviços no banco, essas partes serão puladas
- O SQL usa `ON CONFLICT DO NOTHING` para não duplicar dados
- Você pode executar o SQL várias vezes sem problemas

## 🚀 Resultado Final

Ao fazer login com `admin@amooora.com` e acessar o perfil, você verá:
- Perfil completo e profissional
- Locais favoritos com imagens
- Eventos futuros e passados
- Reviews com comentários
- Calendário com eventos marcados
- Estatísticas atualizadas

**Tudo pronto para testar a página de perfil com conteúdo real!** 🎉
