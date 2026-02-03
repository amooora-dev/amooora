# Integração Google Maps - Guia Completo

**Data:** Janeiro de 2025  
**Versão do Projeto:** V2.0.0  
**Objetivo:** Implementar mapas interativos com múltiplos pins para locais e eventos

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Google Maps API - Uso Gratuito](#google-maps-api---uso-gratuito)
3. [Configuração Inicial](#configuração-inicial)
4. [Preparação dos Dados](#preparação-dos-dados)
5. [Implementação Técnica](#implementação-técnica)
6. [Alternativas Gratuitas](#alternativas-gratuitas)
7. [Custos e Limites](#custos-e-limites)
8. [Exemplos de Código](#exemplos-de-código)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

### Objetivo
Implementar mapas interativos no Amooora que permitam:
- ✅ Visualizar múltiplos locais no mesmo mapa
- ✅ Visualizar múltiplos eventos no mesmo mapa
- ✅ Marcar pins (marcadores) para cada local/evento
- ✅ Clicar nos pins para ver detalhes
- ✅ Filtrar pins por categoria/tipo

### Situação Atual
O projeto já usa Google Maps, mas de forma limitada:
- ❌ Apenas iframes embutidos (sem API key)
- ❌ Mostra apenas um endereço por vez
- ❌ Não permite múltiplos pins no mesmo mapa
- ✅ Funciona, mas com limitações

### Solução Proposta
- ✅ Usar Google Maps JavaScript API
- ✅ Criar componente React reutilizável
- ✅ Integrar com dados do Supabase
- ✅ Suportar múltiplos marcadores

---

## 💰 Google Maps API - Uso Gratuito

### Crédito Mensal Gratuito

O Google oferece **$200 USD em créditos mensais gratuitos** que cobrem:

| Serviço | Crédito Mensal | Custo Após Crédito |
|---------|----------------|-------------------|
| **Maps JavaScript API** | $200 (≈28.000 carregamentos) | $7 por 1.000 carregamentos |
| **Geocoding API** | $200 (≈40.000 requisições) | $5 por 1.000 requisições |
| **Static Maps API** | $200 (≈28.000 imagens) | $2 por 1.000 imagens |
| **Directions API** | $200 (≈40.000 rotas) | $5 por 1.000 rotas |

### O que o Crédito Cobre

#### Cenário Pequeno (100-500 usuários/mês)
- ✅ **$0/mês** - Totalmente coberto pelo crédito
- ✅ ~1.000-5.000 carregamentos de mapa
- ✅ ~500-2.000 geocodings

#### Cenário Médio (1.000-5.000 usuários/mês)
- ⚠️ **$0-50/mês** - Dependendo do uso
- ⚠️ ~10.000-50.000 carregamentos
- ⚠️ ~5.000-25.000 geocodings

#### Cenário Grande (10.000+ usuários/mês)
- ⚠️ **$50-200+/mês** - Pode exceder crédito
- ⚠️ 100.000+ carregamentos
- ⚠️ 50.000+ geocodings

### Limites Importantes

- **Sem cartão de crédito:** Crédito limitado a $200/mês
- **Com cartão:** Crédito ilimitado, mas cobrança após $200
- **Billing account:** Necessário para produção

---

## ⚙️ Configuração Inicial

### Passo 1: Criar Projeto no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione existente
3. Anote o **Project ID**

### Passo 2: Ativar APIs Necessárias

Ative as seguintes APIs:
- ✅ **Maps JavaScript API** (obrigatório)
- ✅ **Geocoding API** (para converter endereços em coordenadas)
- ✅ **Places API** (opcional, para autocomplete de endereços)

**Como ativar:**
1. Vá em "APIs & Services" → "Library"
2. Busque por cada API
3. Clique em "Enable"

### Passo 3: Criar Chave de API

1. Vá em "APIs & Services" → "Credentials"
2. Clique em "Create Credentials" → "API Key"
3. Copie a chave gerada
4. **IMPORTANTE:** Configure restrições de segurança:
   - **Application restrictions:** HTTP referrers
   - **Website restrictions:** Adicione seus domínios:
     - `localhost:*` (desenvolvimento)
     - `*.vercel.app` (staging)
     - `amooora.com.br` (produção)

### Passo 4: Configurar Variáveis de Ambiente

Adicione no arquivo `.env`:

```env
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

**⚠️ IMPORTANTE:** Nunca commite a chave no Git! Adicione `.env` ao `.gitignore`.

### Passo 5: Configurar no Vercel (Produção)

1. Vá em "Settings" → "Environment Variables"
2. Adicione: `VITE_GOOGLE_MAPS_API_KEY` = sua chave
3. Faça redeploy

---

## 📊 Preparação dos Dados

### Estrutura Atual no Supabase

#### Tabela `places`
```sql
- id (uuid)
- name (text)
- address (text)  -- ✅ Já existe
- latitude (numeric)  -- ⚠️ Pode não existir
- longitude (numeric)  -- ⚠️ Pode não existir
- category (text)
- ...
```

#### Tabela `events`
```sql
- id (uuid)
- name (text)
- location (text)  -- ✅ Já existe (endereço)
- address (text)  -- ⚠️ Pode não existir
- latitude (numeric)  -- ⚠️ Pode não existir
- longitude (numeric)  -- ⚠️ Pode não existir
- ...
```

### Opção 1: Adicionar Campos de Coordenadas

Se não existirem, adicione:

```sql
-- Para places
ALTER TABLE places 
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Para events
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC;
```

### Opção 2: Geocoding em Tempo Real

Converter endereços para coordenadas quando necessário:

```typescript
// Função para geocodificar endereço
async function geocodeAddress(address: string) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
  );
  const data = await response.json();
  return {
    lat: data.results[0].geometry.location.lat,
    lng: data.results[0].geometry.location.lng
  };
}
```

### Recomendação

**Híbrido:**
1. ✅ Adicionar campos `latitude` e `longitude` nas tabelas
2. ✅ Fazer geocoding no cadastro (quando criar local/evento)
3. ✅ Salvar coordenadas no banco
4. ✅ Usar coordenadas salvas para exibir no mapa (mais rápido)

---

## 💻 Implementação Técnica

### Instalação de Dependências

```bash
npm install @react-google-maps/api
# ou
npm install @googlemaps/js-api-loader
```

### Opção 1: Usando @react-google-maps/api (Recomendado)

#### 1. Criar Hook para Google Maps

```typescript
// src/app/hooks/useGoogleMaps.ts
import { useMemo } from 'react';

export const useGoogleMaps = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  const isLoaded = useMemo(() => {
    return typeof window !== 'undefined' && window.google?.maps;
  }, []);

  return {
    apiKey,
    isLoaded,
  };
};
```

#### 2. Criar Componente de Mapa com Múltiplos Pins

```typescript
// src/app/components/InteractiveMap.tsx
import { useMemo, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
  category?: string;
  imageUrl?: string;
}

interface InteractiveMapProps {
  locations: Location[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (location: Location) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: -23.5505, // São Paulo
  lng: -46.6333,
};

const defaultZoom = 12;

export function InteractiveMap({
  locations,
  center,
  zoom = defaultZoom,
  height = '400px',
  onMarkerClick,
}: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Calcular centro do mapa baseado nos locais
  const mapCenter = useMemo(() => {
    if (center) return center;
    
    if (locations.length === 0) return defaultCenter;
    
    const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [locations, center]);

  if (!apiKey) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center" style={{ height }}>
        <div className="text-center p-4">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Chave da API do Google Maps não configurada</p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={{ ...mapContainerStyle, height }}
        center={mapCenter}
        zoom={zoom}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => {
              setSelectedLocation(location);
              onMarkerClick?.(location);
            }}
            title={location.name}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold text-sm mb-1">{selectedLocation.name}</h3>
              {selectedLocation.address && (
                <p className="text-xs text-gray-600">{selectedLocation.address}</p>
              )}
              {selectedLocation.category && (
                <p className="text-xs text-primary mt-1">{selectedLocation.category}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
```

#### 3. Usar na Página de Locais

```typescript
// src/app/pages/Locais.tsx (exemplo de integração)
import { InteractiveMap } from '../components/InteractiveMap';

// Dentro do componente Locais:
const mapLocations = useMemo(() => {
  return filteredPlaces
    .filter(place => place.latitude && place.longitude)
    .map(place => ({
      id: place.id,
      name: place.name,
      address: place.address,
      lat: Number(place.latitude),
      lng: Number(place.longitude),
      category: place.category,
      imageUrl: place.imageUrl,
    }));
}, [filteredPlaces]);

// No JSX:
<InteractiveMap
  locations={mapLocations}
  height="400px"
  onMarkerClick={(location) => {
    onNavigate(`place-details:${location.id}`);
  }}
/>
```

### Opção 2: Usando Google Maps JavaScript API Direto

```typescript
// src/app/components/SimpleInteractiveMap.tsx
import { useEffect, useRef } from 'react';

interface SimpleInteractiveMapProps {
  locations: Array<{ id: string; name: string; lat: number; lng: number }>;
  height?: string;
}

export function SimpleInteractiveMap({ locations, height = '400px' }: SimpleInteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Criar mapa
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: -23.5505, lng: -46.6333 },
      zoom: 12,
    });

    mapInstanceRef.current = map;

    // Limpar marcadores anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Adicionar marcadores
    locations.forEach(location => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
      });

      // Info window ao clicar
      const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${location.name}</strong></div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });

    // Ajustar zoom para mostrar todos os marcadores
    if (locations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach(loc => bounds.extend({ lat: loc.lat, lng: loc.lng }));
      map.fitBounds(bounds);
    }
  }, [locations]);

  // Carregar script do Google Maps
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || window.google) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height }}
      className="rounded-2xl overflow-hidden border border-gray-200"
    />
  );
}
```

---

## 🔄 Geocoding (Converter Endereço → Coordenadas)

### Função de Geocoding

```typescript
// src/app/services/geocoding.ts
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  if (!API_KEY) {
    console.error('Google Maps API key não configurada');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
    );

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
      };
    }

    console.warn('Geocoding falhou:', data.status);
    return null;
  } catch (error) {
    console.error('Erro ao fazer geocoding:', error);
    return null;
  }
}
```

### Usar no Cadastro de Locais/Eventos

```typescript
// Ao cadastrar local/evento, fazer geocoding:
import { geocodeAddress } from '../services/geocoding';

const handleSubmit = async (formData) => {
  // Fazer geocoding do endereço
  const geocode = await geocodeAddress(formData.address);
  
  if (geocode) {
    // Salvar com coordenadas
    await createPlace({
      ...formData,
      latitude: geocode.lat,
      longitude: geocode.lng,
    });
  } else {
    // Salvar sem coordenadas (usuário pode editar depois)
    await createPlace(formData);
  }
};
```

---

## 🆓 Alternativas Gratuitas

### Opção 1: Leaflet.js + OpenStreetMap

**Vantagens:**
- ✅ Totalmente gratuito
- ✅ Sem limites de uso
- ✅ Open source
- ✅ Funciona offline (com tiles locais)

**Desvantagens:**
- ⚠️ Menos familiar para usuários
- ⚠️ Menos recursos avançados
- ⚠️ Tiles podem ser mais lentos

**Instalação:**
```bash
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
```

**Exemplo:**
```typescript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LeafletMap({ locations }) {
  return (
    <MapContainer center={[-23.5505, -46.6333]} zoom={12} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {locations.map(loc => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

### Opção 2: Mapbox

**Vantagens:**
- ✅ Boa qualidade visual
- ✅ 50.000 carregamentos/mês grátis
- ✅ API moderna

**Desvantagens:**
- ⚠️ Após limite, $5 por 1.000 carregamentos
- ⚠️ Requer conta e chave

---

## 💵 Custos e Limites

### Estimativa de Custos

#### Cenário 1: App Pequeno (100-500 usuários/mês)
- **Carregamentos de mapa:** ~1.000-5.000/mês
- **Geocodings:** ~500-2.000/mês
- **Custo:** **$0/mês** ✅ (dentro do crédito)

#### Cenário 2: App Médio (1.000-5.000 usuários/mês)
- **Carregamentos:** ~10.000-50.000/mês
- **Geocodings:** ~5.000-25.000/mês
- **Custo:** **$0-50/mês** ⚠️ (pode exceder crédito)

#### Cenário 3: App Grande (10.000+ usuários/mês)
- **Carregamentos:** 100.000+/mês
- **Geocodings:** 50.000+/mês
- **Custo:** **$50-200+/mês** ⚠️ (excede crédito)

### Estratégias para Reduzir Custos

1. **Cache de Geocodings**
   - Salvar coordenadas no banco
   - Evitar geocodings repetidos

2. **Lazy Loading**
   - Carregar mapa apenas quando necessário
   - Não carregar em todas as páginas

3. **Clustering**
   - Agrupar pins próximos
   - Reduzir número de marcadores visíveis

4. **Static Maps para Listagens**
   - Usar imagens estáticas em listas
   - Mapa interativo apenas na página de detalhes

---

## 📝 Exemplos de Código Completos

### Exemplo 1: Mapa na Página de Locais

```typescript
// src/app/pages/Locais.tsx
import { InteractiveMap } from '../components/InteractiveMap';
import { usePlaces } from '../hooks/usePlaces';

export function Locais({ onNavigate }: LocaisProps) {
  const { places, loading } = usePlaces();

  const mapLocations = useMemo(() => {
    return places
      .filter(place => place.latitude && place.longitude)
      .map(place => ({
        id: place.id,
        name: place.name,
        address: place.address,
        lat: Number(place.latitude),
        lng: Number(place.longitude),
        category: place.category,
      }));
  }, [places]);

  return (
    <div>
      {/* ... outros componentes ... */}
      
      {/* Mapa Interativo */}
      <div className="px-5 mb-6">
        <h2 className="text-xl font-semibold text-primary mb-3">Mapa de Locais</h2>
        <InteractiveMap
          locations={mapLocations}
          height="400px"
          onMarkerClick={(location) => {
            onNavigate(`place-details:${location.id}`);
          }}
        />
      </div>
    </div>
  );
}
```

### Exemplo 2: Mapa na Página de Eventos

```typescript
// src/app/pages/Eventos.tsx
import { InteractiveMap } from '../components/InteractiveMap';
import { useEvents } from '../hooks/useEvents';

export function Eventos({ onNavigate }: EventosProps) {
  const { events, loading } = useEvents();

  const mapLocations = useMemo(() => {
    return events
      .filter(event => event.latitude && event.longitude)
      .map(event => ({
        id: event.id,
        name: event.name,
        address: event.address || event.location,
        lat: Number(event.latitude),
        lng: Number(event.longitude),
        category: event.category,
      }));
  }, [events]);

  return (
    <div>
      {/* ... outros componentes ... */}
      
      <InteractiveMap
        locations={mapLocations}
        height="400px"
        onMarkerClick={(location) => {
          onNavigate(`event-details:${location.id}`);
        }}
      />
    </div>
  );
}
```

---

## 🔧 Troubleshooting

### Problema 1: "Google Maps API key not found"

**Solução:**
1. Verificar se `VITE_GOOGLE_MAPS_API_KEY` está no `.env`
2. Verificar se está no formato correto (sem espaços)
3. Reiniciar servidor de desenvolvimento
4. Verificar no Vercel se a variável está configurada

### Problema 2: "This API key is not authorized"

**Solução:**
1. Verificar restrições de HTTP referrers no Google Cloud Console
2. Adicionar domínios permitidos:
   - `localhost:*`
   - `*.vercel.app`
   - Seu domínio de produção

### Problema 3: Mapa não carrega

**Solução:**
1. Verificar console do navegador para erros
2. Verificar se APIs estão ativadas no Google Cloud
3. Verificar se billing account está configurado (mesmo que free tier)

### Problema 4: Pins não aparecem

**Solução:**
1. Verificar se `latitude` e `longitude` estão preenchidos
2. Verificar se valores são números válidos
3. Verificar se `locations` array não está vazio

### Problema 5: Custos altos

**Solução:**
1. Implementar cache de geocodings
2. Usar lazy loading de mapas
3. Considerar migrar para Leaflet (gratuito)

---

## ✅ Checklist de Implementação

### Fase 1: Configuração
- [ ] Criar projeto no Google Cloud Console
- [ ] Ativar APIs necessárias
- [ ] Criar chave de API
- [ ] Configurar restrições de segurança
- [ ] Adicionar variável de ambiente `.env`
- [ ] Configurar no Vercel

### Fase 2: Preparação de Dados
- [ ] Verificar campos `latitude`/`longitude` nas tabelas
- [ ] Adicionar campos se não existirem
- [ ] Criar função de geocoding
- [ ] Implementar geocoding no cadastro

### Fase 3: Implementação
- [ ] Instalar dependências (`@react-google-maps/api`)
- [ ] Criar componente `InteractiveMap`
- [ ] Integrar na página de Locais
- [ ] Integrar na página de Eventos
- [ ] Testar com dados reais

### Fase 4: Otimização
- [ ] Implementar cache de geocodings
- [ ] Adicionar lazy loading
- [ ] Implementar clustering (se muitos pins)
- [ ] Monitorar uso e custos

---

## 📚 Recursos Adicionais

- **Documentação Google Maps:** https://developers.google.com/maps/documentation
- **React Google Maps:** https://react-google-maps-api-docs.netlify.app/
- **Pricing Calculator:** https://mapsplatform.google.com/pricing/
- **Leaflet Documentation:** https://leafletjs.com/

---

**Última Atualização:** Janeiro de 2025  
**Status:** Guia Completo  
**Próximos Passos:** Implementar componente InteractiveMap
