# Prompt para Cursor - App Amooora Mobile

## Contexto do Projeto

Estou desenvolvendo o **Amooora**, uma plataforma mobile feita por e para a comunidade sáfica que conecta pessoas, lugares, eventos e serviços com foco em cuidado, afeto e pertencimento.

## Tecnologias Atuais
- React + TypeScript
- Tailwind CSS v4
- Mobile-first (390px de largura)
- Estrutura de componentes reutilizáveis

## Design System
- **Cor principal:** `#932d6f` (roxo/primary)
- **Cor accent:** `#FF6B7A` (coral/secondary)
- Sombras suaves
- Espaçamentos baseados em múltiplos de 8
- Tom acolhedor, humano e contemporâneo

## Estrutura Atual

### Páginas Implementadas:
1. **Splash** - Tela de entrada com logo (3 segundos)
2. **Welcome** - Tela de boas-vindas com carrossel
3. **Home** - Dashboard principal com seções de lugares, eventos e serviços
4. **Locais** - Listagem de lugares seguros próximos com mapa
5. **Eventos** - Eventos recomendados para a comunidade
6. **Servicos** - Profissionais da comunidade (costureiras, marceneiras, etc.)
7. **Comunidade** - Conectar com outras pessoas
8. **Perfil** - Perfil do usuário com opção de editar
9. **Configuracoes** - Configurações do app

### Componentes:
- `BottomNav` - Navegação inferior fixa
- `FilterModal` - Modal de filtros
- `EditarPerfil` - Modal de edição de perfil
- `SimpleMap` - Mapa estático

## Estrutura de Arquivos
```
/src
  /app
    App.tsx (componente principal com roteamento)
    /pages
      Splash.tsx
      Welcome.tsx
      Home.tsx
      Locais.tsx
      Eventos.tsx
      Servicos.tsx
      Comunidade.tsx
      Perfil.tsx
      Configuracoes.tsx
    /components
      BottomNav.tsx
      FilterModal.tsx
      EditarPerfil.tsx
      SimpleMap.tsx
  /styles
    theme.css
    fonts.css
```

## O que preciso:

**Preciso configurar este projeto React Web para rodar como um aplicativo mobile nativo usando React Native/Expo.**

### Requisitos:
1. Converter o projeto atual para React Native mantendo toda a estrutura e design
2. Configurar Expo ou React Native CLI
3. Adaptar componentes web (divs, buttons, inputs) para componentes nativos (View, TouchableOpacity, TextInput)
4. Converter Tailwind CSS para StyleSheet do React Native (ou usar NativeWind se preferir)
5. Manter o design system com as cores e espaçamentos atuais
6. Garantir que a navegação funcione corretamente no mobile
7. Configurar para testar no iOS e Android

### Prioridades:
- Manter a identidade visual atual
- Preservar toda a funcionalidade implementada
- Garantir performance fluida
- Interface responsiva para diferentes tamanhos de tela mobile

### Instrução:
Por favor, me guie passo a passo para:
1. Criar um novo projeto React Native/Expo
2. Migrar todos os componentes mantendo a estrutura atual
3. Configurar a navegação entre telas
4. Adaptar os estilos para mobile nativo
5. Instruções para rodar no simulador/emulador ou dispositivo físico

---

## Alternativa Simples - PWA

Se preferir manter React Web e apenas tornar mobile-friendly:

Preciso transformar este app React Web em um PWA (Progressive Web App) que funcione como app mobile, com:
- Instalação na tela inicial do celular
- Funcionamento offline básico
- Otimização para telas mobile
- Configuração do manifest.json
- Service Worker para cache

---

## Pergunta para o Cursor

Qual abordagem você recomenda (React Native/Expo vs PWA) e como proceder passo a passo?
