# Especificação funcional – Sobre Amooora

**Última atualização:** 09/02/2025

Este documento descreve o que foi implementado **funcionalmente** na página Sobre Amooora do app Amooora.

---

## 1. Visão geral

A página Sobre Amooora é uma tela institucional que apresenta o manifesto e a identidade da plataforma (comunidade sáfica, visibilidade, acolhimento). Conteúdo predominantemente estático, com imagens e textos em seções.

---

## 2. Rota

| Rota | Componente |
|------|------------|
| `sobre-amooora` | `SobreAmooora` (`pages/SobreAmooora.tsx`) |

---

## 3. Conteúdo (seções)

- **Manifesto:** texto introdutório ("Um sonho, um ideal") e parágrafos explicando o que é a Amooora, para quem é (comunidade sáfica), propósito (visibilidade, segurança, pertencimento).
- **Seções com imagens:** podem existir blocos com imagens locais (ex.: sobre-amooora-1.png, sobre-amooora-2.png, sobre-amooora-3.png) e textos como "Por nós e para nós", "Mi brejo, su brejo", "Um mundo inteiro".
- **Layout:** scroll vertical; padding para não sobrepor header e (se houver) bottom nav.

---

## 4. Navegação

- **Header:** fixo, com botão voltar (`onBack` ou navegação para `home`) e possivelmente menu. Se o usuário for admin, ícone ou link para área admin pode aparecer no header.

---

## 5. Arquivos principais

| Função | Caminho |
|--------|---------|
| Página Sobre Amooora | `pages/SobreAmooora.tsx` |
| Imagens | `src/assets/` (sobre-amooora-1.png, etc.) |

---

*Documento para referência da equipe de desenvolvimento.*
