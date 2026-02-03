# 🗺️ Configurações Disponíveis no Mapa Google Maps

**Data:** Janeiro de 2025  
**Componente:** `InteractiveMap.tsx`  
**Biblioteca:** `@react-google-maps/api`

---

## 📋 Índice

1. [Configurações Atuais](#configurações-atuais)
2. [Opções de Controles do Mapa](#opções-de-controles-do-mapa)
3. [Estilos e Aparência](#estilos-e-aparência)
4. [Configurações de Zoom](#configurações-de-zoom)
5. [Configurações de Marcadores (Pins)](#configurações-de-marcadores-pins)
6. [Configurações de InfoWindow](#configurações-de-infowindow)
7. [Configurações de Interação](#configurações-de-interação)
8. [Exemplos de Configurações](#exemplos-de-configurações)

---

## ⚙️ Configurações Atuais

### O que está configurado atualmente:

```typescript
options={{
  disableDefaultUI: false,      // ✅ UI padrão habilitada
  zoomControl: true,            // ✅ Controle de zoom visível
  streetViewControl: false,     // ❌ Controle do Street View desabilitado
  mapTypeControl: false,        // ❌ Controle de tipo de mapa desabilitado
  fullscreenControl: true,      // ✅ Controle de tela cheia habilitado
}}
```

---

## 🎮 Opções de Controles do Mapa

### Controles Disponíveis:

| Opção | Tipo | Descrição | Padrão |
|-------|------|-----------|--------|
| `zoomControl` | boolean | Mostra controles de zoom (+/-) | `true` |
| `streetViewControl` | boolean | Mostra botão do Street View | `false` |
| `mapTypeControl` | boolean | Mostra seletor de tipo (Satélite, Mapa) | `false` |
| `fullscreenControl` | boolean | Mostra botão de tela cheia | `true` |
| `rotateControl` | boolean | Mostra controles de rotação | `false` |
| `scaleControl` | boolean | Mostra escala do mapa | `false` |
| `panControl` | boolean | Mostra setas de navegação (deprecated) | `false` |
| `disableDefaultUI` | boolean | Desabilita TODOS os controles padrão | `false` |

### Exemplo de Configuração Completa:

```typescript
options={{
  // Controles básicos
  zoomControl: true,
  fullscreenControl: true,
  
  // Controles opcionais
  streetViewControl: true,      // Habilitar Street View
  mapTypeControl: true,         // Habilitar seletor de tipo
  rotateControl: true,          // Habilitar rotação
  scaleControl: true,          // Mostrar escala
  
  // Ou desabilitar tudo e usar controles customizados
  disableDefaultUI: true,
}}
```

---

## 🎨 Estilos e Aparência

### Tipos de Mapa Disponíveis:

```typescript
options={{
  mapTypeId: 'roadmap',  // Opções: 'roadmap', 'satellite', 'hybrid', 'terrain'
}}
```

### Estilos Personalizados (Map Styles):

Você pode aplicar estilos personalizados ao mapa usando JSON:

```typescript
const customMapStyle = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#dca0c8' }]  // Cor secundária do Amooora
  }
];

options={{
  styles: customMapStyle,
}}
```

### Cores e Temas:

```typescript
options={{
  // Tema escuro
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  ],
  
  // Ou usar tema claro personalizado
  styles: [
    { featureType: 'water', stylers: [{ color: '#dca0c8' }] },
    { featureType: 'landscape', stylers: [{ color: '#f5f5f5' }] },
  ],
}}
```

---

## 🔍 Configurações de Zoom

### Limites de Zoom:

```typescript
options={{
  minZoom: 5,   // Zoom mínimo (mais distante)
  maxZoom: 20,  // Zoom máximo (mais próximo)
  zoom: 12,     // Zoom inicial
}}
```

### Restrições de Área:

```typescript
options={{
  // Limitar o mapa a uma região específica
  restriction: {
    latLngBounds: {
      north: -23.4,
      south: -23.7,
      west: -46.8,
      east: -46.4,
    },
    strictBounds: true,  // Impede zoom fora dos limites
  },
}}
```

### Zoom Adaptativo (já implementado):

```typescript
// O componente já calcula zoom baseado no número de locais:
// - 1 local: zoom 15 (próximo)
// - 2-5 locais: zoom 13 (médio)
// - 6+ locais: zoom 11 (amplo)
```

---

## 📍 Configurações de Marcadores (Pins)

### Pins Padrão (atual):

```typescript
<Marker
  position={{ lat: location.lat, lng: location.lng }}
  title={location.name}
/>
```

### Pins Customizados (opções):

#### 1. Pins com Ícones Personalizados:

```typescript
<Marker
  position={{ lat: location.lat, lng: location.lng }}
  icon={{
    url: '/path/to/custom-pin.png',
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 40),
  }}
/>
```

#### 2. Pins com Cores Diferentes:

```typescript
// Para locais (roxo)
const placeIcon = {
  path: google.maps.SymbolPath.CIRCLE,
  fillColor: '#932d6f',
  fillOpacity: 1,
  strokeColor: '#ffffff',
  strokeWeight: 3,
  scale: 10,
};

// Para eventos (laranja)
const eventIcon = {
  path: google.maps.SymbolPath.CIRCLE,
  fillColor: '#c4532f',
  fillOpacity: 1,
  strokeColor: '#ffffff',
  strokeWeight: 3,
  scale: 10,
};

<Marker
  icon={location.type === 'event' ? eventIcon : placeIcon}
/>
```

#### 3. Pins com Formas Diferentes:

```typescript
// Círculo
path: google.maps.SymbolPath.CIRCLE

// Pin (gota)
path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW

// Estrela
path: 'M 0,0 -1,-2 0,-4 1,-2 z'

// Círculo com borda
{
  path: google.maps.SymbolPath.CIRCLE,
  fillColor: '#932d6f',
  fillOpacity: 1,
  strokeColor: '#ffffff',
  strokeWeight: 3,
  scale: 12,
}
```

#### 4. Pins com Labels/Texto:

```typescript
<Marker
  label={{
    text: '1',           // Número ou letra
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
  }}
/>
```

#### 5. Pins Animados:

```typescript
<Marker
  animation={google.maps.Animation.DROP}  // Animação de queda
  // ou
  animation={google.maps.Animation.BOUNCE} // Animação de pulo
/>
```

#### 6. Clustering (agrupar pins próximos):

```typescript
// Requer biblioteca adicional: @react-google-maps/marker-clusterer
import { MarkerClusterer } from '@react-google-maps/marker-clusterer';

<MarkerClusterer>
  {locations.map((location) => (
    <Marker key={location.id} position={{ lat: location.lat, lng: location.lng }} />
  ))}
</MarkerClusterer>
```

---

## 💬 Configurações de InfoWindow

### InfoWindow Atual:

```typescript
<InfoWindow
  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
  onCloseClick={() => setSelectedLocation(null)}
>
  <div className="p-2">
    <h3>{selectedLocation.name}</h3>
    <p>{selectedLocation.address}</p>
  </div>
</InfoWindow>
```

### Opções Adicionais:

```typescript
<InfoWindow
  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
  onCloseClick={() => setSelectedLocation(null)}
  options={{
    pixelOffset: new google.maps.Size(0, -40),  // Ajustar posição
    maxWidth: 300,                              // Largura máxima
    disableAutoPan: false,                      // Auto-pan ao abrir
  }}
>
  {/* Conteúdo customizado */}
</InfoWindow>
```

### InfoWindow com Imagem:

```typescript
<InfoWindow>
  <div>
    <img src={location.imageUrl} alt={location.name} className="w-32 h-24 object-cover rounded mb-2" />
    <h3>{location.name}</h3>
    <p>{location.address}</p>
    <button onClick={() => onNavigate(`place-details:${location.id}`)}>
      Ver detalhes
    </button>
  </div>
</InfoWindow>
```

---

## 🖱️ Configurações de Interação

### Interações do Usuário:

```typescript
options={{
  // Interações básicas
  draggable: false,              // Permitir arrastar o mapa
  clickableIcons: true,          // Clicar em POIs (pontos de interesse)
  keyboardShortcuts: true,       // Atalhos de teclado
  scrollwheel: true,             // Zoom com scroll do mouse
  disableDoubleClickZoom: false, // Zoom com duplo clique
  
  // Gestos (mobile)
  gestureHandling: 'auto',       // 'auto', 'greedy', 'cooperative', 'none'
  draggableCursor: 'pointer',    // Cursor ao arrastar
  draggingCursor: 'grabbing',    // Cursor durante arraste
}}
```

### Gestos em Mobile:

```typescript
options={{
  gestureHandling: 'greedy',  // Permite zoom com um dedo
  // ou
  gestureHandling: 'cooperative',  // Requer dois dedos para zoom
}}
```

---

## 🎯 Configurações Especiais

### Limitar Visibilidade de Elementos:

```typescript
options={{
  // Esconder elementos do mapa
  styles: [
    {
      featureType: 'poi',           // Pontos de interesse
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',       // Transporte público
      stylers: [{ visibility: 'off' }]
    },
  ],
}}
```

### Modo de Trânsito:

```typescript
options={{
  mapTypeId: 'roadmap',
  // Mostrar linhas de ônibus, metrô, etc.
  styles: [
    {
      featureType: 'transit',
      stylers: [{ visibility: 'on' }]
    },
  ],
}}
```

### Controles Customizados:

```typescript
// Criar controles customizados
const customControl = document.createElement('div');
customControl.innerHTML = '<button>Meu Botão</button>';
customControl.style.padding = '10px';

map.controls[google.maps.ControlPosition.TOP_RIGHT].push(customControl);
```

---

## 📝 Exemplos de Configurações

### Exemplo 1: Mapa Minimalista

```typescript
options={{
  disableDefaultUI: true,        // Remove todos os controles
  zoomControl: true,             // Mantém apenas zoom
  styles: [
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  ],
  gestureHandling: 'greedy',
}}
```

### Exemplo 2: Mapa com Tema Escuro

```typescript
const darkTheme = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
];

options={{
  styles: darkTheme,
  mapTypeControl: false,
}}
```

### Exemplo 3: Mapa com Cores do Amooora

```typescript
const amoooraTheme = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#dca0c8' }]  // Secundária
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  },
];

options={{
  styles: amoooraTheme,
  zoomControl: true,
  fullscreenControl: true,
}}
```

### Exemplo 4: Mapa Interativo Completo

```typescript
options={{
  // Controles
  zoomControl: true,
  fullscreenControl: true,
  mapTypeControl: true,
  streetViewControl: true,
  
  // Zoom
  minZoom: 10,
  maxZoom: 18,
  
  // Interação
  draggable: true,
  scrollwheel: true,
  gestureHandling: 'greedy',
  
  // Estilo
  mapTypeId: 'roadmap',
  styles: customStyles,
}}
```

---

## 🔧 Como Aplicar Configurações

### Opção 1: Modificar o Componente Diretamente

Edite `src/app/components/InteractiveMap.tsx`:

```typescript
options={{
  // Adicione suas configurações aqui
  zoomControl: true,
  mapTypeControl: true,
  styles: customStyles,
}}
```

### Opção 2: Passar Configurações via Props

Modifique a interface para aceitar opções customizadas:

```typescript
interface InteractiveMapProps {
  locations: Location[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (location: Location) => void;
  mapOptions?: google.maps.MapOptions;  // Nova prop
}

export function InteractiveMap({
  locations,
  center,
  zoom = defaultZoom,
  height = '400px',
  onMarkerClick,
  mapOptions = {},  // Opções customizadas
}: InteractiveMapProps) {
  // ...
  
  const defaultOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
  };
  
  options={{
    ...defaultOptions,
    ...mapOptions,  // Sobrescrever com opções customizadas
  }}
}
```

---

## 📚 Recursos Adicionais

### Documentação Oficial:

- **Google Maps JavaScript API:** https://developers.google.com/maps/documentation/javascript
- **React Google Maps API:** https://react-google-maps-api-docs.netlify.app/
- **Map Styles:** https://mapstyle.withgoogle.com/ (gerador visual de estilos)

### Bibliotecas Úteis:

- **Marker Clustering:** `@react-google-maps/marker-clusterer`
- **Drawing Tools:** `@react-google-maps/drawing`
- **Directions:** `@react-google-maps/directions`

---

## ✅ Checklist de Configurações Recomendadas

Para o Amooora, recomendo:

- [x] **Zoom Control** - Habilitado (já está)
- [x] **Fullscreen Control** - Habilitado (já está)
- [ ] **Map Type Control** - Considerar habilitar para usuários verem satélite
- [ ] **Street View Control** - Manter desabilitado (não necessário)
- [ ] **Estilos Personalizados** - Aplicar cores do Amooora na água
- [ ] **POI Labels** - Desabilitar para mapa mais limpo
- [ ] **Clustering** - Implementar quando houver muitos pins
- [ ] **Gestos Mobile** - Configurar `gestureHandling: 'greedy'`

---

**Última Atualização:** Janeiro de 2025  
**Status:** Documentação Completa ✅
