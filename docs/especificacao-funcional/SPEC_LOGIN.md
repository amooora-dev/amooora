# Especificação funcional – Login

**Última atualização:** 09/02/2025

Este documento descreve o que foi implementado **funcionalmente** na tela de Login do app Amooora.

---

## 1. Visão geral

A tela de Login permite que o usuário autentique-se com **e-mail** e **senha**. O fluxo utiliza Supabase Auth (signIn). Em sucesso, o usuário é redirecionado (ex.: para a home ou para a tela que estava tentando acessar). Há link para a tela de Cadastro para quem não tem conta.

---

## 2. Rota

| Rota | Componente |
|------|------------|
| `login` | `Login` (`pages/Login.tsx`) |

---

## 3. Campos do formulário

- **E-mail:** obrigatório; validação de formato (regex tipo `\S+@\S+\.\S+`).
- **Senha:** obrigatória.
- **Exibir/ocultar senha:** botão (ícone olho) para alternar entre tipo `password` e `text`.

---

## 4. Validação e envio

- Validação no front antes de chamar a API. Mensagens de erro por campo (ex.: "Por favor, insira seu e-mail", "E-mail inválido", "Por favor, insira sua senha").
- **handleLogin:** chama `signIn({ email, password })` (lib/auth ou Supabase). Em sucesso: `result.user` e `result.session` existem; redirecionamento via `onNavigate` (ex.: `home` ou estado salvo).
- Em erro: `setSubmitError(result.error)` ou mensagem genérica; `setIsLoading(false)`.

---

## 5. Estados da tela

- **Carregando:** durante a requisição de login (botão desabilitado ou spinner).
- **Erro:** mensagem de erro exibida abaixo do formulário ou no topo.
- **Sucesso:** redirecionamento; não permanece na tela de login.

---

## 6. Navegação

- **Voltar:** link ou botão para voltar (ex.: welcome ou home).
- **Cadastro:** link "Não tem conta? Cadastre-se" ou similar → `onNavigate('cadastro')`.

---

## 7. Integração com auth

- O app usa `useAuth()` em outras telas para saber se o usuário está autenticado. Após login bem-sucedido, a sessão do Supabase é atualizada e os hooks que dependem dela passam a refletir o usuário logado.

---

## 8. Arquivos principais

| Função | Caminho |
|--------|---------|
| Página Login | `pages/Login.tsx` |
| Autenticação | `lib/auth.ts` (signIn), `infra/supabase.ts` |

---

*Documento para referência da equipe de desenvolvimento.*
