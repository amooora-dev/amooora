# Guia de instalação: Cursor + projeto Amooora em outro computador

Este documento descreve o passo a passo para usar o projeto Amooora no **Cursor** em um **computador novo** (ou outra máquina), incluindo plugins, integrações e configuração.

> **No computador onde você já trabalha:** se a pasta do projeto já existe e você já envia as alterações para o Git, **não é necessário clonar de novo**. O passo "Clonar o repositório" (seção 3) é apenas para quando você for configurar tudo em **outro** computador pela primeira vez.

---

## 1. Pré-requisitos

Antes de começar, instale no computador:

| Item | Versão sugerida | Onde obter |
|------|-----------------|------------|
| **Node.js** | 18.x ou 20.x (LTS) | [nodejs.org](https://nodejs.org) |
| **Git** | Qualquer versão recente | [git-scm.com](https://git-scm.com) |
| **Cursor** | Última versão | [cursor.com](https://cursor.com) |
| **Conta Supabase** | - | [supabase.com](https://supabase.com) (para backend) |

Verifique no terminal:

```bash
node -v   # deve mostrar v18.x ou v20.x
npm -v
git --version
```

---

## 2. Instalar o Cursor

1. Acesse [cursor.com](https://cursor.com) e baixe o instalador para seu sistema (Windows, macOS ou Linux).
2. Instale e abra o Cursor.
3. Faça login com a mesma conta que você usa no desenvolvimento (para sincronizar configurações, se habilitado).
4. *(Opcional)* Em **Settings** > **Cursor Settings** > **General**, marque **Sync your Cursor settings across devices** para manter extensões e preferências entre máquinas.

---

## 3. Clonar o repositório *(só no computador novo)*

**Faça este passo apenas** quando estiver em um computador onde o projeto ainda não existe. No seu computador atual, pule para a seção 4.

No terminal (ou no terminal integrado do Cursor):

```bash
# Escolha a pasta onde quer o projeto (ex: Documents)
cd ~/Documents

# Clone o repositório (use a URL do seu repositório)
git clone https://github.com/amooora-dev/amooora.git

cd amooora
```

Se o repositório for privado, use SSH ou faça login no Git quando solicitado.

---

## 4. Instalar dependências do projeto

O projeto usa **npm** (ou **pnpm**, se você tiver configurado). No diretório do projeto:

```bash
npm install
```

Se aparecer erro com `peerDependencies` (React), ignore ou use:

```bash
npm install --legacy-peer-deps
```

Aguarde até concluir. Deve ser criada a pasta `node_modules/`.

---

## 5. Variáveis de ambiente (`.env`)

O app precisa de variáveis de ambiente. O arquivo `.env` **não** vai no Git (está no `.gitignore`).

### 5.1 Criar o arquivo `.env`

Na **raiz do projeto** (ao lado de `package.json`), crie um arquivo chamado `.env` com o conteúdo abaixo. Substitua os valores pelos do seu projeto Supabase.

```env
# Obrigatórias (Supabase)
VITE_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_do_supabase

# Opcionais
VITE_SITE_URL=http://localhost:5173
VITE_GOOGLE_MAPS_API_K=sua_chave_google_maps
```

### 5.2 Onde pegar as variáveis do Supabase

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard).
2. Abra o projeto do Amooora (ou crie um).
3. Vá em **Project Settings** (ícone de engrenagem) > **API**.
4. Use:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** (key) → `VITE_SUPABASE_ANON_KEY`

Guarde as chaves em local seguro e **não** as envie para o Git.

---

## 6. Banco de dados (Supabase) – tabela de perfil profissional

Para a funcionalidade **Perfil profissional** funcionar, a tabela `professional_profiles` precisa existir no Supabase.

1. No Supabase, abra **SQL Editor**.
2. Crie uma nova query e cole o conteúdo do arquivo **`docs/sql/professional_profiles.sql`** do projeto.
3. Execute a query (Run).

Se outras tabelas forem necessárias (ex.: `profiles`, eventos, lugares), use os scripts ou migrações já documentados no repositório (ex.: `MD/GUIA_SUPABASE_MCP.md`).

---

## 7. Extensões recomendadas no Cursor (VS Code)

O projeto sugere extensões em `.vscode/extensions.json`. Para instalar todas de uma vez:

1. Abra o projeto no Cursor (**File** > **Open Folder** > pasta `amooora`).
2. Pressione `Ctrl+Shift+X` (ou `Cmd+Shift+X` no Mac) para abrir a aba **Extensions**.
3. Se aparecer o aviso **“This workspace has extension recommendations”**, clique em **Install All**.

Ou instale manualmente:

| Extensão | ID | Uso |
|----------|-----|-----|
| ESLint | `dbaeumer.vscode-eslint` | Linting JavaScript/TypeScript |
| Prettier | `esbenp.prettier-vscode` | Formatação de código |
| Tailwind CSS IntelliSense | `bradlc.vscode-tailwindcss` | Autocomplete Tailwind |
| TypeScript (próxima) | `ms-vscode.vscode-typescript-next` | TypeScript |
| Auto Rename Tag | `formulahendry.auto-rename-tag` | Renomear tags HTML/JSX |
| Path Intellisense | `christian-kohler.path-intellisense` | Autocomplete de caminhos |
| ES7+ React Snippets | `dsznajder.es7-react-js-snippets` | Snippets React |

---

## 8. Configurações do workspace (Cursor/VS Code)

As configurações do projeto estão em **`.vscode/settings.json`** e já vêm no repositório. Elas incluem:

- Formatação ao salvar (Prettier)
- ESLint ao salvar
- TypeScript do workspace (`node_modules`)
- Tab 2 espaços, Emmet para React/TS
- Tema sugerido (ex.: Cursor Light)

Ao abrir a pasta do projeto, o Cursor usa essas configurações automaticamente. Não é necessário copiar nada manualmente, a menos que você queira mesclar com suas preferências globais.

---

## 9. Integrações opcionais (MCPs no Cursor)

O Cursor permite **MCPs** (Model Context Protocol) para integrar com outros serviços. No projeto, podem ser usados:

### 9.1 Figma MCP (design)

- Útil para pegar contexto de telas no Figma e alinhar com o código.
- Em **Cursor** > **Settings** > **MCP** (ou **Features** > **MCP**), adicione o servidor **Figma** conforme a documentação do Cursor/Figma.
- Não é obrigatório para rodar o app; só para quem usa designs no Figma.

### 9.2 Supabase MCP

- Útil para listar projetos, criar migrações, etc., direto no Cursor.
- Configure em **Cursor** > **Settings** > **MCP** com o servidor Supabase (e credenciais, se pedido).
- O guia **`MD/GUIA_SUPABASE_MCP.md`** tem exemplos de uso.

Esses MCPs são **opcionais**. O app funciona normalmente só com `.env` e o Supabase configurado no dashboard.

---

## 10. Rodar o projeto

No terminal, na raiz do projeto:

```bash
npm run dev
```

O Vite sobe o servidor de desenvolvimento. Abra no navegador:

- **Local:** [http://localhost:5173/](http://localhost:5173/)

Se a porta 5173 estiver em uso, use um dos scripts alternativos (ex.: `npm run dev:3000`).

---

## 11. Build e deploy (opcional)

- **Build de produção:**
  ```bash
  npm run build
  ```
  A saída fica em `dist/`.

- **Deploy na Vercel:**
  - Conecte o repositório na [Vercel](https://vercel.com).
  - Configure as mesmas variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, etc.) no projeto da Vercel.
  - Ou use no terminal: `npm run deploy` / `npm run deploy:prod` (se já configurado).

---

## 12. Checklist rápido (outro computador)

Use esta lista para conferir se está tudo certo:

- [ ] Node.js 18+ instalado
- [ ] Git instalado
- [ ] Cursor instalado e logado
- [ ] Repositório clonado (`git clone`) — *só se for a primeira vez neste computador*
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` criado na raiz com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- [ ] Tabela `professional_profiles` criada no Supabase (SQL em `docs/sql/professional_profiles.sql`)
- [ ] Extensões recomendadas instaladas (Install All no Cursor)
- [ ] `npm run dev` executado e app abrindo em http://localhost:5173/

---

## 13. Documentos úteis no repositório

| Documento | Conteúdo |
|-----------|----------|
| `MD/CURSOR_GUIDE.md` | Contexto do projeto, design system, como usar o Cursor no dia a dia |
| `MD/GUIA_SUPABASE_MCP.md` | Uso do Supabase MCP e exemplos de SQL |
| `docs/sql/professional_profiles.sql` | Criação da tabela de perfil profissional |
| `docs/especificacao-funcional/` | Especificações por funcionalidade (SPEC_*.md) |

---

**Última atualização:** Março 2026  
**Projeto:** Amooora – plataforma mobile pela comunidade sáfica
