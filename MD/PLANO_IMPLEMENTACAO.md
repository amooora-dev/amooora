# Plano de Implementação - Migração para React Router

## 📋 Resumo da Implementação

Este documento descreve a implementação completa da migração de navegação por estado para React Router, com data layer estruturado e layouts organizados.

## 🔄 Plano de Commits (Recomendado)

### Commit 1: Estrutura Base e Configuração
**Mensagem:** `feat: configurar projeto React + TypeScript com Vite e React Router`

**Arquivos:**
- `package.json`
- `tsconfig.json`, `tsconfig.node.json`
- `vite.config.ts`
- `index.html`
- `.gitignore`
- `.eslintrc.cjs`
- `src/index.css`
- `src/main.tsx`

**Descrição:** Configuração inicial do projeto com todas as dependências necessárias.

---

### Commit 2: Data Layer (Types, Mocks, Services)
**Mensagem:** `feat: criar data layer com types, mocks e services`

**Arquivos:**
- `src/app/types/index.ts`
- `src/app/data/mocks.ts`
- `src/app/services/places.ts`
- `src/app/services/services.ts`
- `src/app/services/events.ts`
- `src/app/services/reviews.ts`
- `src/app/services/users.ts`

**Descrição:** Implementação da camada de dados com tipos TypeScript, dados mockados e serviços que simulam chamadas de API.

---

### Commit 3: Custom Hooks
**Mensagem:** `feat: adicionar custom hooks para consumo de dados`

**Arquivos:**
- `src/app/hooks/usePlaces.ts`
- `src/app/hooks/useServices.ts`
- `src/app/hooks/useEvents.ts`
- `src/app/hooks/useUser.ts`
- `src/app/hooks/useReviews.ts`

**Descrição:** Hooks customizados para facilitar o consumo de dados nas páginas.

---

### Commit 4: Layouts
**Mensagem:** `feat: criar layouts AuthLayout e AppLayout com navegação inferior`

**Arquivos:**
- `src/app/layouts/AuthLayout.tsx`
- `src/app/layouts/AppLayout.tsx`

**Descrição:** Dois layouts principais - um para autenticação e outro para a aplicação com navegação inferior.

---

### Commit 5: Páginas e Componentes
**Mensagem:** `feat: criar todas as páginas da aplicação`

**Arquivos:**
- `src/app/pages/*.tsx` (todas as 16 páginas)

**Descrição:** Implementação de todas as páginas da aplicação consumindo dados do data layer via hooks.

---

### Commit 6: Configuração de Rotas
**Mensagem:** `feat: configurar React Router com todas as rotas`

**Arquivos:**
- `src/App.tsx`

**Descrição:** Configuração final do React Router com todas as rotas mapeadas, incluindo rotas aninhadas e layouts.

---

## ✅ Checklist de Implementação

### ✅ Estrutura Base
- [x] Projeto React + TypeScript configurado
- [x] Vite como bundler
- [x] React Router instalado e configurado
- [x] TypeScript estrito habilitado
- [x] ESLint configurado

### ✅ Data Layer
- [x] Types definidos (User, Place, Service, Event, Review)
- [x] Mocks criados (6-10 itens por entidade)
- [x] Services implementados (funções async que simulam API)
- [x] Hooks customizados criados

### ✅ Layouts
- [x] AuthLayout para splash/welcome/cadastro
- [x] AppLayout com navegação inferior
- [x] Navegação inferior funcional com 5 itens

### ✅ Rotas Implementadas
- [x] `/splash`, `/welcome`, `/cadastro` (AuthLayout)
- [x] `/home` (dashboard)
- [x] `/locais` e `/locais/:id`
- [x] `/servicos`, `/servicos/:id`, `/servicos/categoria/:slug`
- [x] `/eventos` e `/eventos/:id`
- [x] `/comunidade`
- [x] `/perfil`, `/perfil/editar`, `/configuracoes`
- [x] `/avaliacao/criar` (com query params)

### ✅ Funcionalidades
- [x] Navegação "Voltar" funcionando corretamente
- [x] Todas as páginas consumindo dados via hooks
- [x] Estados de loading e error tratados
- [x] TypeScript sem erros
- [x] Navegação entre todas as rotas funcionando

---

## 🚀 Como Testar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Rodar em desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Testar navegação:**
   - Acesse `http://localhost:5173` → Redireciona para `/home`
   - Navegue entre todas as seções usando a navegação inferior
   - Teste detalhes de locais, serviços e eventos
   - Teste botões "Voltar" em páginas de detalhes
   - Teste criação de avaliação a partir de detalhes
   - Teste fluxo de cadastro/login (por enquanto só navega)

4. **Verificar tipos:**
   ```bash
   npm run build
   ```

---

## 📊 Estatísticas

- **Total de arquivos criados:** 38
- **Linhas de código TypeScript:** ~2.500
- **Páginas implementadas:** 16
- **Rotas configuradas:** 17
- **Hooks customizados:** 5
- **Services implementados:** 5
- **Types definidos:** 5

---

## 🎯 Próximos Passos (Após esta entrega)

### Prioridade Alta
1. **Integrar Design do Figma:** Substituir estilos inline por componentes do design system
2. **Autenticação Real:** Implementar login/logout funcional
3. **API Backend:** Substituir mocks por API real
4. **Persistência:** Salvar avaliações criadas

### Prioridade Média
5. **Busca e Filtros:** Implementar busca e filtros avançados
6. **Favoritos:** Sistema de favoritar locais/serviços
7. **Upload de Imagens:** Permitir upload de fotos nas avaliações
8. **Mapas:** Integrar mapas para localização

### Prioridade Baixa
9. **Testes:** Adicionar testes unitários e E2E
10. **Performance:** Lazy loading e code splitting
11. **Analytics:** Integrar tracking de eventos
12. **PWA:** Transformar em Progressive Web App

---

## 📝 Notas Importantes

1. **Navegação Inferior:** Implementada com navegação fixa na parte inferior. Pode ser facilmente adaptada para um componente mais sofisticado do shadcn/ui.

2. **Dados Mockados:** Todos os dados estão em memória. Para produção, substitua as funções em `src/app/services/*` por chamadas reais de API.

3. **Estilos:** Atualmente usando estilos inline. Recomendamos migrar para o design system do Figma ou usar CSS Modules/styled-components.

4. **Autenticação:** Por enquanto, a tela de cadastro apenas navega. Implemente autenticação real conforme necessário.

5. **Validação:** Adicione validação de formulários quando necessário (ex: react-hook-form + zod).

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview do build
npm run preview

# Lint
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

---

**Status:** ✅ Implementação completa e funcional

**Data:** Janeiro 2024

**Desenvolvido com:** React 18 + TypeScript + Vite + React Router 6