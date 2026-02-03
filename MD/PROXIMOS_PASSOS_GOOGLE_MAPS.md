# ✅ Próximos Passos - Google Maps API

**Data:** Janeiro de 2025  
**Status:** API Key configurada ✅

---

## ✅ O que já foi feito

1. ✅ **Chave da API adicionada ao `.env`**
   - Variável: `VITE_GOOGLE_MAPS_API_KEY`
   - Chave: `AIzaSyDlR1OgLBoDMXf1usqfdKkiG-6x6j7fTwc`

2. ✅ **Dependência instalada**
   - `@react-google-maps/api` já está no `package.json`

3. ✅ **Componente criado**
   - `src/app/components/InteractiveMap.tsx` criado e pronto para uso

---

## 🔧 O que você precisa fazer AGORA

### 1. Reiniciar o servidor de desenvolvimento

A variável de ambiente foi adicionada, mas o servidor precisa ser reiniciado para carregá-la:

```bash
# Pare o servidor atual (Ctrl+C) e inicie novamente:
npm run dev
```

### 2. Configurar no Google Cloud Console

**⚠️ IMPORTANTE:** Configure as restrições de segurança da sua chave:

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Clique na sua chave de API
3. Em **"Application restrictions"**, selecione **"HTTP referrers"**
4. Adicione os seguintes domínios:
   ```
   http://localhost:*
   https://localhost:*
   https://*.vercel.app/*
   https://amooora.com.br/*
   ```
5. Salve as alterações

**Por que isso é importante?**
- Protege sua chave contra uso não autorizado
- Evita que outros sites usem sua quota gratuita
- Boa prática de segurança

### 3. Ativar APIs necessárias

No Google Cloud Console, ative as seguintes APIs:

1. Acesse: https://console.cloud.google.com/apis/library
2. Busque e ative:
   - ✅ **Maps JavaScript API** (obrigatório)
   - ✅ **Geocoding API** (para converter endereços em coordenadas)
   - ⚠️ **Places API** (opcional, para autocomplete)

---

## 🚀 Como usar o componente InteractiveMap

### Exemplo 1: Na página de Locais

```typescript
// src/app/pages/Locais.tsx
import { InteractiveMap } from '../components/InteractiveMap';

// Dentro do componente:
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

// No JSX:
<InteractiveMap
  locations={mapLocations}
  height="400px"
  onMarkerClick={(location) => {
    onNavigate(`place-details:${location.id}`);
  }}
/>
```

### Exemplo 2: Na página de Eventos

```typescript
// src/app/pages/Eventos.tsx
import { InteractiveMap } from '../components/InteractiveMap';

const mapLocations = useMemo(() => {
  return events
    .filter(event => event.latitude && event.longitude)
    .map(event => ({
      id: event.id,
      name: event.name,
      address: event.address || event.location,
      lat: Number(event.latitude),
      lng: Number(event.longitude),
    }));
}, [events]);

<InteractiveMap
  locations={mapLocations}
  height="400px"
  onMarkerClick={(location) => {
    onNavigate(`event-details:${location.id}`);
  }}
/>
```

---

## 📊 Preparar dados no Supabase

### Verificar se os campos existem

Execute no Supabase SQL Editor:

```sql
-- Verificar campos em places
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'places' 
AND column_name IN ('latitude', 'longitude');

-- Verificar campos em events
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'events' 
AND column_name IN ('latitude', 'longitude');
```

### Adicionar campos se não existirem

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

### Geocoding (converter endereço → coordenadas)

Você pode criar uma função de geocoding para preencher automaticamente as coordenadas quando cadastrar novos locais/eventos.

**Arquivo:** `src/app/services/geocoding.ts`

```typescript
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export async function geocodeAddress(address: string) {
  if (!API_KEY) return null;

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
    return null;
  } catch (error) {
    console.error('Erro ao fazer geocoding:', error);
    return null;
  }
}
```

---

## 🧪 Testar a integração

### Teste rápido

1. Reinicie o servidor: `npm run dev`
2. Abra o console do navegador (F12)
3. Verifique se não há erros relacionados ao Google Maps
4. Se aparecer erro de "API key not authorized", verifique as restrições no Google Cloud Console

### Teste com dados reais

1. Certifique-se de que alguns locais/eventos têm `latitude` e `longitude` preenchidos
2. Adicione o componente `InteractiveMap` em uma página
3. Verifique se os pins aparecem no mapa
4. Clique nos pins para ver se o InfoWindow abre

---

## ⚠️ Troubleshooting

### Erro: "Google Maps API key not found"
- ✅ Verifique se `VITE_GOOGLE_MAPS_API_KEY` está no `.env`
- ✅ Reinicie o servidor após adicionar a variável

### Erro: "This API key is not authorized"
- ✅ Verifique se as APIs estão ativadas no Google Cloud Console
- ✅ Verifique se as restrições de HTTP referrers estão configuradas corretamente

### Erro: "RefererNotAllowedMapError"
- ✅ Adicione o domínio atual nas restrições de HTTP referrers
- ✅ Use `*` para permitir todas as portas: `http://localhost:*`

### Mapa não carrega
- ✅ Verifique o console do navegador para erros
- ✅ Verifique se a chave está correta (sem espaços extras)
- ✅ Verifique se o billing account está ativado (mesmo que free tier)

---

## 📝 Checklist

- [ ] Reiniciar servidor de desenvolvimento
- [ ] Configurar restrições de segurança no Google Cloud Console
- [ ] Ativar Maps JavaScript API
- [ ] Ativar Geocoding API (opcional)
- [ ] Verificar campos latitude/longitude no Supabase
- [ ] Adicionar campos se não existirem
- [ ] Testar componente InteractiveMap
- [ ] Integrar em página de Locais
- [ ] Integrar em página de Eventos
- [ ] Configurar variável no Vercel (produção)

---

## 🚀 Próximos passos avançados

1. **Geocoding automático no cadastro**
   - Converter endereço para coordenadas ao criar local/evento
   - Salvar coordenadas no banco

2. **Clustering de pins**
   - Agrupar pins próximos quando há muitos locais
   - Melhorar performance visual

3. **Filtros no mapa**
   - Filtrar pins por categoria
   - Mostrar apenas locais/eventos selecionados

4. **Rotas e direções**
   - Adicionar botão "Como chegar"
   - Integrar com Google Directions API

---

**Última Atualização:** Janeiro de 2025  
**Status:** Pronto para implementação ✅
