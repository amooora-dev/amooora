import { Search, X, MapPin, Calendar, Briefcase, Loader2 } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { usePlaces } from '../features/places';
import { useEvents } from '../features/events';
import { useServices } from '../features/services';
import { EmptyState } from './EmptyState';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function GlobalSearch({ isOpen, onClose, onNavigate }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { places, loading: placesLoading } = usePlaces();
  const { events, loading: eventsLoading } = useEvents();
  const { services, loading: servicesLoading } = useServices();

  const loading = placesLoading || eventsLoading || servicesLoading;

  // Buscar em todos os tipos simultaneamente
  const results = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        places: [],
        events: [],
        services: [],
      };
    }

    const query = searchQuery.toLowerCase().trim();

    const filteredPlaces = places.filter(
      (place) =>
        place.name.toLowerCase().includes(query) ||
        place.description?.toLowerCase().includes(query) ||
        place.address?.toLowerCase().includes(query) ||
        place.category?.toLowerCase().includes(query)
    );

    const filteredEvents = events.filter(
      (event) =>
        event.name.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query) ||
        event.category?.toLowerCase().includes(query)
    );

    const filteredServices = services.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        service.category?.toLowerCase().includes(query) ||
        service.provider?.toLowerCase().includes(query)
    );

    return {
      places: filteredPlaces.slice(0, 5), // Limitar a 5 resultados por tipo
      events: filteredEvents.slice(0, 5),
      services: filteredServices.slice(0, 5),
    };
  }, [searchQuery, places, events, services]);

  const totalResults = results.places.length + results.events.length + results.services.length;

  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Focar no input quando abrir
  useEffect(() => {
    if (isOpen) {
      const input = document.getElementById('global-search-input');
      input?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlaceClick = (placeId: string) => {
    onNavigate(`place-details:${placeId}`);
    onClose();
  };

  const handleEventClick = (eventId: string) => {
    onNavigate(`event-details:${eventId}`);
    onClose();
  };

  const handleServiceClick = (serviceId: string) => {
    onNavigate(`service-details:${serviceId}`);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal de Busca */}
      <div className="fixed inset-0 z-50 flex flex-col max-w-md mx-auto bg-white animate-in slide-in-from-top duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Buscar locais, eventos, serviços..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-primary text-base"
            />
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="ml-2 text-muted-foreground">Buscando...</span>
            </div>
          ) : searchQuery.trim() === '' ? (
            <div className="px-5 py-12">
              <div className="text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-muted-foreground">Digite para buscar locais, eventos e serviços</p>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="px-5">
              <EmptyState
                icon={Search}
                title="Nenhum resultado encontrado"
                description={`Não encontramos resultados para "${searchQuery}". Tente usar termos diferentes.`}
              />
            </div>
          ) : (
            <div className="px-5 py-4 space-y-6">
              {/* Locais */}
              {results.places.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg text-primary">Locais ({results.places.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {results.places.map((place) => (
                      <button
                        key={place.id}
                        onClick={() => handlePlaceClick(place.id)}
                        className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <p className="font-medium text-foreground">{place.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {place.address || place.category}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Eventos */}
              {results.events.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg text-primary">Eventos ({results.events.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {results.events.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => handleEventClick(event.id)}
                        className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <p className="font-medium text-foreground">{event.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {event.location || event.category}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Serviços */}
              {results.services.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg text-primary">Serviços ({results.services.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {results.services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceClick(service.id)}
                        className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <p className="font-medium text-foreground">{service.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {service.provider || service.category}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
