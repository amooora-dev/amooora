import { useMemo, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';
import customPinIcon from '../../assets/map-pin.PNG';

interface Location {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
  category?: string;
  imageUrl?: string;
  type?: 'place' | 'event';
  eventStatus?: 'upcoming' | 'attended'; // Status do evento: próximo ou participado
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
  lat: -23.5259152,
  lng: -46.6709052,
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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_K;

  if (import.meta.env.DEV) {
    console.log('🗺️ Google Maps: chave', apiKey ? 'configurada' : 'ausente');
  }

  // Calcular centro do mapa baseado nos locais
  const mapCenter = useMemo(() => {
    if (center) return center;
    
    if (locations.length === 0) return defaultCenter;
    
    const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [center, locations.length]);

  // Calcular zoom inicial baseado na distribuição dos pins
  // Zoom mais amplo para mostrar área maior (similar à imagem)
  const calculatedZoom = useMemo(() => {
    if (locations.length === 0) return 11; // Zoom amplo padrão
    if (locations.length === 1) return 13; // Zoom médio para um único local
    
    // Calcular a extensão geográfica dos pins
    const lats = locations.map(loc => loc.lat);
    const lngs = locations.map(loc => loc.lng);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Calcular a diferença (span) em graus
    const latSpan = maxLat - minLat;
    const lngSpan = maxLng - minLng;
    const maxSpan = Math.max(latSpan, lngSpan);
    
    // Ajustar zoom baseado no span - valores mais baixos = zoom mais amplo
    // A imagem mostra uma visão bem ampla da cidade, então vamos usar zooms menores
    if (maxSpan < 0.01) return 12; // Muito próximos (menos de ~1km)
    if (maxSpan < 0.05) return 11; // Próximos (menos de ~5km)
    if (maxSpan < 0.1) return 10;  // Médio (menos de ~10km)
    if (maxSpan < 0.2) return 9;   // Amplo (menos de ~20km)
    return 8; // Muito amplo (mais de ~20km) - visão da cidade inteira
  }, [locations.length]);

  // Removido fitBounds automático para evitar loops
  // O mapa usa o centro calculado automaticamente via mapCenter

  if (!apiKey) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center" style={{ height }}>
        <div className="text-center p-4">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Mapa não disponível</p>
          <p className="text-xs text-gray-500">Toque para ver o mapa completo</p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center" style={{ height }}>
        <div className="text-center p-4">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Erro ao carregar mapa</p>
          <p className="text-xs text-gray-500">{mapError}</p>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center" style={{ height }}>
        <div className="text-center p-4">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Nenhum local encontrado</p>
        </div>
      </div>
    );
  }

  // Configurar ícone customizado do pin com cores diferentes por tipo
  const getCustomIcon = (location: Location) => {
    if (typeof google === 'undefined' || !google.maps) {
      return undefined;
    }
    
    // Se for evento, usar cor diferente baseado no status
    if (location.type === 'event' && location.eventStatus) {
      // Criar um ícone SVG com cor baseado no status
      const color = location.eventStatus === 'upcoming' ? '#932d6f' : '#ec4899'; // Roxo para próximos, rosa para participados
      const svgIcon = `
        <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 11.045 16 24 16 24s16-12.955 16-24C32 7.163 24.837 0 16 0z" fill="${color}"/>
          <circle cx="16" cy="16" r="8" fill="white"/>
        </svg>
      `;
      
      const svgBlob = new Blob([svgIcon], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      return {
        url: svgUrl,
        scaledSize: new google.maps.Size(32, 40),
        anchor: new google.maps.Point(16, 40),
      };
    }
    
    // Para locais ou eventos sem status, usar o ícone padrão
    return {
      url: customPinIcon,
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 32),
    };
  };

  const onMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    
    // Ajustar o mapa para mostrar todos os pins quando houver múltiplos locais
    // Usar fitBounds para mostrar área ampla similar à imagem
    if (locations.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach(location => {
        bounds.extend(new google.maps.LatLng(location.lat, location.lng));
      });
      
      // Aplicar padding maior para mostrar área mais ampla (similar à imagem)
      // E definir zoom máximo para não ficar muito próximo
      mapInstance.fitBounds(bounds, {
        padding: { top: 100, right: 100, bottom: 100, left: 100 }
      });
      
      // Garantir que o zoom não fique muito próximo (máximo zoom 13)
      // Isso mantém a visão ampla mostrada na imagem
      const currentZoom = mapInstance.getZoom();
      if (currentZoom && currentZoom > 13) {
        mapInstance.setZoom(13);
      }
    }
  };

  return (
    <LoadScript 
      googleMapsApiKey={apiKey}
      loadingElement={
        <div className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center" style={{ height }}>
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      }
      onError={(error) => {
        console.error('❌ Erro ao carregar Google Maps:', error);
        setMapError('Não foi possível carregar o mapa. Verifique sua conexão.');
      }}
    >
      <GoogleMap
        mapContainerStyle={{ ...mapContainerStyle, height }}
        center={mapCenter}
        zoom={calculatedZoom}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: false,
          zoomControl: false,
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
            icon={getCustomIcon(location)}
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
