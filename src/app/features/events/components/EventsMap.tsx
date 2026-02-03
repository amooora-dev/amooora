import { useMemo } from 'react';
import { MapPin } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  location: string;
}

interface EventsMapProps {
  events: Event[];
  height?: string;
}

/**
 * Componente de mapa que exibe eventos usando Google Maps
 * Converte endereços em visualização de mapa via Google Maps
 * Usa iframe do Google Maps que funciona sem chave de API para visualização
 */
export function EventsMap({ events, height = '300px' }: EventsMapProps) {
  // Filtrar eventos que têm localização válida
  const eventsWithLocation = useMemo(() => {
    return events.filter((event) => event.location && event.location.trim().length > 0);
  }, [events]);

  // Se não houver eventos com localização, não mostrar mapa
  if (eventsWithLocation.length === 0) {
    return null;
  }

  // Usar a primeira localização como centro do mapa
  // Para múltiplos eventos, o mapa mostrará o primeiro e o usuário pode navegar
  const firstLocation = eventsWithLocation[0].location;
  const encodedLocation = encodeURIComponent(firstLocation);
  
  // URL do Google Maps para busca (abre no Google Maps completo)
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  
  // URL do Google Maps para embed usando pesquisa
  // Esta URL funciona para mostrar o mapa com o endereço pesquisado
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
  
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-200 relative bg-gray-100" style={{ height }}>
      {/* Botão "Ver mapa ampliado" */}
      <a
        href={mapSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 left-3 z-10 bg-white px-3 py-1.5 rounded-lg shadow-md text-sm text-blue-600 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <MapPin className="w-4 h-4" />
        Ver mapa ampliado
      </a>

      {/* Mapa usando iframe do Google Maps */}
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapEmbedUrl}
        title="Mapa de Eventos"
        className="absolute inset-0"
      />
      
      {/* Overlay com informações sobre múltiplos eventos */}
      {eventsWithLocation.length > 1 && (
        <div className="absolute bottom-3 left-3 right-3 z-10 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
          <p className="text-xs text-gray-700 font-medium">
            {eventsWithLocation.length} eventos encontrados. Use o botão acima para ver todos no Google Maps.
          </p>
        </div>
      )}
    </div>
  );
}
