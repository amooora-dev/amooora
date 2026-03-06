# Especificação funcional – Fale Conosco

**Última atualização:** 09/02/2025

Este documento descreve o que foi implementado **funcionalmente** na página Fale Conosco do app Amooora.

---

## 1. Visão geral

A página Fale Conosco é um formulário de contato em que o usuário envia nome, e-mail, telefone (opcional), tipo de conteúdo (Denúncia, Sugestão, Dúvida, Elogio, Outro) e mensagem. Os dados podem ser salvos no Supabase (tabela de contatos ou similar) e, se o usuário estiver logado, o `user_id` é associado ao registro.

---

## 2. Rota

| Rota | Componente |
|------|------------|
| `fale-conosco` | `FaleConosco` (`pages/FaleConosco.tsx`) |

---

## 3. Campos do formulário

- **Nome:** obrigatório.
- **E-mail:** obrigatório; validação de formato (regex).
- **Telefone:** opcional.
- **Tipo de conteúdo:** obrigatório; select com opções: Denúncia, Sugestão, Dúvida, Elogio, Outro.
- **Mensagem:** obrigatória; mínimo de caracteres (ex.: 10).

---

## 4. Validação e envio

- Validação no front (campos obrigatórios e formato de e-mail). Mensagens de erro por campo.
- Ao submeter: `setIsSubmitting(true)`; chamada ao backend (ex.: `supabase.from('contacts').insert(...)` com `user_id` se logado). Em sucesso: `setSubmitSuccess(true)` e possível limpeza do formulário ou mensagem de confirmação.
- Em erro de rede/API: exibir mensagem genérica ou retornada pelo servidor.

---

## 5. Navegação

- Header com botão voltar (`onBack` ou navegação para a tela anterior).

---

## 6. Arquivos principais

| Função | Caminho |
|--------|---------|
| Página Fale Conosco | `pages/FaleConosco.tsx` |
| Backend | Supabase (tabela de contatos/feedback); `supabase.auth.getUser()` para user_id opcional |

---

*Documento para referência da equipe de desenvolvimento.*
