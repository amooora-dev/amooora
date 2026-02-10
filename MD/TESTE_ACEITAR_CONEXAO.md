# Teste: Aceitar conexão → ver amiga na lista → abrir perfil

Use este checklist para validar o fluxo de aceitar conexão (na página Amigos ou no Perfil).

## Pré-requisito

- Duas contas (A e B). A envia pedido de conexão para B.

## 1. Aceitar na página Amigos (aba Solicitações)

1. Entrar como **B** (quem recebe o pedido).
2. Ir em **Perfil** (bottom nav) → **Amigos** ou acessar **Amigos** e abrir a aba **Solicitações**.
3. Na seção **RECEBIDAS**, deve aparecer o card de **A** com botões **Aceitar** e **Recusar**.
4. Clicar em **Aceitar**.
   - Deve aparecer toast "Conexão aceita".
   - O card de A deve sumir da lista de solicitações recebidas.
5. Clicar na aba **Amigos** (no topo da mesma página).
   - **Esperado:** o thumb/foto de **A** deve aparecer na lista de amigos.
6. Clicar no **card da amiga A**.
   - **Esperado:** abrir o **perfil público** de A (ViewProfile), com opção de chat, etc.

## 2. Aceitar na página Perfil (seção Pedidos de conexão)

1. Entrar como **B**.
2. Ir em **Perfil** (bottom nav).
3. Se houver pedidos, a seção **Pedidos de conexão** mostra até 3 cards; clicar em **Aceitar** no card de **A**.
   - Deve aparecer toast "Conexão aceita".
   - O card de A deve sumir dos pedidos de conexão.
4. Rolar até a seção **Amigos** (abaixo de Pedidos de conexão).
   - **Esperado:** o thumb de **A** deve aparecer na lista de amigos (entre os primeiros 5).
5. Clicar no **card da amiga A** na seção Amigos.
   - **Esperado:** abrir o **perfil público** de A.

## 3. Aceitar no perfil da pessoa (ViewProfile)

1. Entrar como **B**.
2. Abrir o perfil de **A** (por exemplo pela busca ou por um link view-profile).
3. Se A tiver enviado pedido, deve aparecer o bloco “[Nome] enviou um pedido de conexão” com **Aprovar** e **Recusar**.
4. Clicar em **Aprovar**.
   - Toast "Conexão aceita"; o bloco some e aparece a área de **Conversa**.
5. Voltar (botão voltar) e ir em **Amigos** (ou **Perfil** → seção Amigos).
   - **Esperado:** **A** deve aparecer na lista de amigos com thumb.
6. Clicar no card de **A**.
   - **Esperado:** abrir o perfil público de A.

## O que foi ajustado no código

- **getFriends()** passa a ordenar por `responded_at` DESC, para a conexão mais recente (recém-aceita) aparecer no topo e entrar nos primeiros 5 do preview do Perfil.
- **RequestCard**: botões Aceitar/Recusar/Cancelar usam `stopPropagation` para não disparar o clique “ver perfil” ao aceitar/recusar.
- **Perfil**: ao aceitar um pedido na seção “Pedidos de conexão”, além de atualizar pedidos e stats, a lista de amigos do perfil é recarregada (`getFriends`) e o preview é atualizado para mostrar a nova amiga.

Se algum passo falhar, anote em qual conta (A ou B), em qual tela e o que aconteceu (ex.: “Ao clicar em Amigos, a lista continua vazia”).
