# 📝 Instruções: Inserir Dados de Exemplo no Banco

## 🎯 Objetivo
Criar dados de exemplo no banco de dados Supabase para testar as páginas do site.

## 📋 O Que Será Inserido

### ✅ Locais (Places) - 3 exemplos:
1. **Bar Aconchego LGBTQIA+** - Bar LGBT-friendly em São Paulo
2. **Café Diversidade** - Café inclusivo na Vila Madalena
3. **Casa de Cultura Queer** - Espaço cultural dedicado à comunidade

### ✅ Serviços (Services) - 3 exemplos:
1. **Terapia LGBTQIA+ Afirmativa** - Atendimento psicológico especializado
2. **Advocacia Especializada em Direitos LGBTQIA+** - Assessoria jurídica
3. **Salão de Beleza Inclusivo** - Serviços de beleza LGBTQIA+ friendly

### ✅ Eventos (Events) - 3 exemplos:
1. **Pride Fest 2025** - Festival LGBTQIA+ (28 de junho de 2025)
2. **Workshop: Conhecendo Seus Direitos LGBTQIA+** - Evento educativo (15 de março de 2025)
3. **Sarau Queer - Noite de Poesia e Arte** - Sarau mensal (20 de fevereiro de 2025)

## 🚀 Como Executar

### Passo 1: Acesse o Supabase Dashboard
1. Acesse: https://supabase.com/dashboard/project/btavwaysfjpsuqxdfguw
2. Vá em **SQL Editor** → **New query**

### Passo 2: Execute o SQL
1. Abra o arquivo `SQL/SQL_INSERIR_DADOS_EXEMPLO.sql`
2. **Copie TODO o conteúdo** e cole no SQL Editor
3. Clique em **Run** ou pressione `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### Passo 3: Verifique os Resultados
Após executar o SQL, você verá:
- ✅ Quantos locais foram inseridos
- ✅ Quantos serviços foram inseridos
- ✅ Quantos eventos foram inseridos
- ✅ Lista de todos os dados inseridos

## ✅ Verificar no Site

Depois de inserir os dados:

1. **Acesse o site:** `http://localhost:5174/`
2. **Navegue pelas páginas:**
   - **Home** → Deve mostrar os novos locais e eventos
   - **Locais** → Deve mostrar os 3 novos locais
   - **Serviços** → Deve mostrar os 3 novos serviços
   - **Eventos** → Deve mostrar os 3 novos eventos

3. **Teste os detalhes:**
   - Clique em "Ver Local" → Deve abrir os detalhes do local
   - Clique em "Ver Detalhes" nos serviços → Deve abrir os detalhes do serviço
   - Clique nos eventos → Deve abrir os detalhes do evento

## 📝 Detalhes dos Dados

### Locais:
- ✅ Todos com `is_safe = true` (aparecem no site)
- ✅ Com endereço completo em São Paulo
- ✅ Com coordenadas geográficas
- ✅ Com descrições detalhadas
- ✅ Com imagens do Unsplash

### Serviços:
- ✅ Todos com `is_active = true` (aparecem no site)
- ✅ Com preços definidos
- ✅ Com categoria e slug correspondentes
- ✅ Com prestador identificado
- ✅ Com descrições detalhadas

### Eventos:
- ✅ Todos com `is_active = true` (aparecem no site)
- ✅ Com datas futuras (aparecem no site)
- ✅ Alguns gratuitos, outros com preço
- ✅ Com localização definida
- ✅ Com descrições detalhadas

## 🔄 Se Precisar Limpar os Dados

Para remover os dados inseridos (caso necessário):

```sql
-- Remover dados de exemplo (CUIDADO: remove todos os dados!)
DELETE FROM public.events WHERE name LIKE '%Pride%' OR name LIKE '%Workshop%' OR name LIKE '%Sarau%';
DELETE FROM public.services WHERE name LIKE '%Terapia%' OR name LIKE '%Advocacia%' OR name LIKE '%Salão%';
DELETE FROM public.places WHERE name LIKE '%Aconchego%' OR name LIKE '%Diversidade%' OR name LIKE '%Queer%';
```

## ✨ Próximos Passos

Depois de inserir os dados:
1. ✅ Teste todas as páginas do site
2. ✅ Verifique se os dados aparecem corretamente
3. ✅ Teste os detalhes de cada item
4. ✅ Adicione mais dados se necessário
