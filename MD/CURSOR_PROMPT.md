# 💜 Amooora - Prompt para Desenvolvimento no Cursor

## 📱 Sobre o Projeto

**Amooora** é uma plataforma mobile feita por e para a comunidade sáfica que conecta pessoas, lugares, eventos e serviços com foco em cuidado, afeto e pertencimento.

## 🎨 Design System & Diretrizes

### Paleta de Cores
- **Primary (Roxo):** `#932d6f`
- **Accent (Coral):** `#FF6B7A`
- **Gradientes:** `from-[#A84B8E] to-[#8B3A7A]`

### Princípios de Design
- ✅ Design acolhedor, humano e contemporâneo
- ✅ Tom feminino plural (não estereotipado)
- ✅ Sensação de segurança e pertencimento
- ✅ Mobile-first (390px de largura)
- ✅ Sombras suaves e espaçamentos múltiplos de 8
- ✅ Auto Layout e componentes reutilizáveis
- ❌ Evitar estética corporativa fria

### Tecnologias
- **Framework:** React + TypeScript
- **Estilização:** Tailwind CSS v4
- **Ícones:** lucide-react
- **Imagens:** Unsplash API (via ImageWithFallback)

## 📂 Estrutura Atual do Projeto

```
📁 src/
  📁 app/
    App.tsx (navegação entre páginas)
    📁 pages/
      ✅ Splash.tsx (oculta por padrão)
      ✅ Welcome.tsx (tela inicial)
      ✅ Cadastro.tsx
      ✅ Home.tsx (feed principal)
      ✅ Locais.tsx (lugares seguros)
      ✅ Eventos.tsx (eventos recomendados)
      ✅ Servicos.tsx (serviços sáficos)
      ✅ Comunidade.tsx (conexões)
      ✅ Perfil.tsx (perfil da usuária)
      ✅ EditarPerfil.tsx
      ✅ Configuracoes.tsx
    📁 components/
      ✅ BottomNav.tsx (navegação inferior fixa)
      ✅ FilterModal.tsx (modal de filtros)
      ✅ SimpleMap.tsx (mapa estático)
      ✅ ProfileStatCard.tsx
      ✅ SavedPlaceCard.tsx
      ✅ ActivityItem.tsx
      ✅ VerifiedMemberBadge.tsx
      📁 figma/
        ImageWithFallback.tsx (componente de imagem)
  📁 styles/
    theme.css
    fonts.css
```

## ✨ Páginas Implementadas

### 1. **Welcome** (Tela inicial)
- Logo Amooora
- Slogan "Onde o afeto encontra comunidade"
- Botões: "Entrar" e "Criar Conta"

### 2. **Home** (Feed principal)
- Header personalizado com logo e notificações
- Seção "Lugares Seguros Próximos" (horizontal scroll)
- Seção "Eventos Recomendados"
- Seção "Serviços para Você"
- BottomNav ativo em "home"

### 3. **Locais** (Lugares Seguros)
- Lista de bares, cafés, restaurantes LGBTQIA+ friendly
- Filtros por categoria
- Mapa estático (SimpleMap)
- Avaliações e endereços

### 4. **Eventos**
- Lista de eventos sáficos
- Cards com imagem, data, local
- Sistema de favoritos
- Filtros por data/categoria

### 5. **Serviços**
- Profissionais sáficas: costureiras, marceneiras, pintoras, etc.
- Cards com foto, nome, especialidade, avaliação
- Botão "Ver Perfil"

### 6. **Comunidade**
- Perfis de pessoas da comunidade
- Sistema de match/conexão
- Cards com foto, nome, bio, interesses

### 7. **Perfil**
- Header roxo com avatar
- Estatísticas (eventos, lugares, contribuições)
- Lugares salvos
- Atividade recente
- Badge de membro verificado

### 8. **Configurações**
- Conta, Privacidade, Notificações, Aparência
- Toggle de tema escuro
- Botão "Sair"

## 🔧 Sistema de Navegação

```typescript
// App.tsx gerencia a navegação via state
const [currentPage, setCurrentPage] = useState('welcome');

// Páginas disponíveis:
'welcome' | 'register' | 'home' | 'places' | 'services' | 
'events' | 'community' | 'profile' | 'edit-profile' | 'settings'
```

### BottomNav
```typescript
<BottomNav 
  activeItem="home" // 'home' | 'places' | 'events' | 'community' | 'profile'
  onItemClick={onNavigate} 
/>
```

## 📦 Componentes Reutilizáveis

### ImageWithFallback
```tsx
<ImageWithFallback
  src="url-da-imagem"
  alt="descrição"
  className="w-full h-48 object-cover"
/>
```

### FilterModal
```tsx
<FilterModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  selectedFilters={filters}
  onApplyFilters={(newFilters) => setFilters(newFilters)}
  filterOptions={['Bar', 'Café', 'Restaurante']}
/>
```

### SimpleMap
```tsx
<SimpleMap
  latitude={-23.5505}
  longitude={-46.6333}
  placeName="São Paulo, SP"
/>
```

## 🎯 Dados Mock

Todos os dados são mockados com:
- Imagens do Unsplash
- Nomes fictícios
- Localidades de SP
- Avaliações e descrições realistas

## 🚀 Próximos Passos Sugeridos

### Opção A: PWA (Progressive Web App)
1. Adicionar Service Worker
2. Criar manifest.json
3. Configurar cache offline
4. Adicionar "Add to Home Screen"

### Opção B: React Native/Expo
1. Migrar componentes para React Native
2. Usar React Navigation
3. Implementar funcionalidades nativas (GPS, câmera)
4. Publicar nas stores

### Funcionalidades Futuras
- [ ] Sistema de autenticação (Firebase/Supabase)
- [ ] Chat entre usuárias
- [ ] Integração com Google Maps
- [ ] Sistema de avaliações real
- [ ] Upload de fotos
- [ ] Stories/Feed social
- [ ] Sistema de denúncias/moderação
- [ ] Filtros de busca avançados
- [ ] Notificações push

## 💡 Como Usar Este Prompt no Cursor

1. Copie todo o conteúdo deste arquivo
2. Abra o Cursor no diretório do projeto
3. Cole este prompt no chat do Cursor
4. Peça ajuda específica, como:
   - "Adicionar funcionalidade de busca na Home"
   - "Implementar tema escuro completo"
   - "Criar sistema de autenticação"
   - "Converter para PWA"
   - "Adicionar animações nas transições"

## 📝 Convenções de Código

- Componentes: PascalCase (`Home.tsx`)
- Props: interfaces com sufixo `Props` (`HomeProps`)
- Classes CSS: Tailwind inline
- State: hooks do React (`useState`, `useEffect`)
- Navegação: prop `onNavigate` em todas as páginas

## 🎨 Tokens CSS Customizados

Veja `/src/styles/theme.css` para:
- Cores customizadas (`--color-primary`)
- Sombras suaves
- Border radius padrões
- Espaçamentos base

---

**Última atualização:** Janeiro 2025
**Status:** ✅ MVP completo com 9 páginas funcionais
**Objetivo:** Criar uma comunidade digital segura e acolhedora para mulheres sáficas
