import { Calendar, Plus } from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from '../shared/components';
import { SearchBar } from '../shared/components';
import { CategoryFilter } from '../shared/components';
import { EventCardExpanded } from '../components/EventCardExpanded';
import { InteractiveMap } from '../components/InteractiveMap';
import { BottomNav } from '../shared/components';
import { EmptyState } from '../shared/components';
import { SkeletonListExpanded } from '../shared/components';
import { useEvents } from '../features/events';
import { useAdmin } from '../shared/hooks';
import { geocodeAddress } from '../shared/services';

const categories = ['Todos', 'Hoje', 'Semana', 'Gratuitos'];

interface EventosProps {
  onNavigate: (page: string) => void;
}

export function Eventos({ onNavigate }: EventosProps) {
  const { events, loading, error } = useEvents();
  const { isAdmin } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [geocodingCache, setGeocodingCache] = useState<Record<string, { lat: number; lng: number }>>({});
  const geocodingProcessedRef = useRef<Set<string>>(new Set());

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Filtrar eventos por categoria e busca
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Aplicar filtros baseados na categoria selecionada
    if (activeCategory === 'Todos') {
      // Mostrar todos os eventos (sem filtro)
      filtered = events;
    } else if (activeCategory === 'Hoje') {
      // Filtrar apenas eventos de hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      filtered = events.filter((event) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today && eventDate < tomorrow;
      });
    } else if (activeCategory === 'Semana') {
      // Filtrar eventos da semana (próximos 7 dias)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      filtered = events.filter((event) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today && eventDate < nextWeek;
      });
    } else if (activeCategory === 'Gratuitos') {
      // Filtrar apenas eventos gratuitos
      filtered = events.filter((event) => !event.price || event.price === 0);
    }

    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [events, activeCategory, searchQuery]);

  // Converter Event para formato do EventCardExpanded
  const eventsForCards = useMemo(() => {
    return filteredEvents.map((event) => ({
      id: event.id,
      name: event.name,
      description: event.description || 'Sem descrição',
      date: event.date ? formatDate(event.date) : 'Data não informada',
      fullDate: event.date ? formatFullDate(event.date) : 'Data não informada',
      time: event.time || 'Horário não informado',
      location: event.location || 'Local não informado',
      participants: `${event.participants || 0} participantes`,
      imageUrl: event.imageUrl || event.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      category: {
        label: event.category || 'Evento',
        color: '#c4532f', // Accent color
      },
      price: event.price && event.price > 0 ? `R$ ${event.price.toFixed(2)}` : 'Gratuito',
      isPaid: event.price ? event.price > 0 : false,
    }));
  }, [filteredEvents]);

  // Geocoding dos eventos filtrados
  useEffect(() => {
    if (loading || !filteredEvents || filteredEvents.length === 0) return;

    const loadEventCoordinates = async () => {
      const eventsNeedingGeocoding = filteredEvents.filter(
        (event) => event.location && 
                   !geocodingProcessedRef.current.has(event.location)
      );

      if (eventsNeedingGeocoding.length === 0) return;

      try {
        // Marcar todos como processados ANTES de fazer as requisições
        eventsNeedingGeocoding.forEach((event) => {
          if (event.location) {
            geocodingProcessedRef.current.add(event.location);
          }
        });

        const newCache: Record<string, { lat: number; lng: number }> = { ...geocodingCache };

        // Geocodificar eventos que precisam (com delay para evitar rate limiting)
        for (const event of eventsNeedingGeocoding) {
          if (event.location) {
            const result = await geocodeAddress(event.location);
            if (result) {
              newCache[event.location] = { lat: result.lat, lng: result.lng };
            }
            // Delay de 200ms entre requisições
            await new Promise((resolve) => setTimeout(resolve, 200));
          }
        }

        // Atualizar cache apenas uma vez no final
        if (Object.keys(newCache).length > Object.keys(geocodingCache).length) {
          setGeocodingCache(newCache);
        }
      } catch (error) {
        console.error('Erro ao fazer geocoding dos eventos:', error);
      }
    };

    loadEventCoordinates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredEvents.length, loading]);

  // Preparar eventos para o mapa
  const mapEvents = useMemo(() => {
    return filteredEvents
      .filter((event) => {
        // Incluir apenas eventos que têm localização e coordenadas (via geocoding)
        return event.location && geocodingCache[event.location];
      })
      .map((event) => {
        const coords = geocodingCache[event.location!];
        return {
          id: event.id,
          name: event.name,
          address: event.location,
          lat: coords.lat,
          lng: coords.lng,
          category: event.category?.label || 'Evento',
          imageUrl: event.imageUrl,
          type: 'event' as const,
        };
      });
  }, [filteredEvents, geocodingCache]);

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} />
        
        {/* Conteúdo scrollável - padding-top para compensar header fixo */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Page Header */}
          <div className="px-5 pt-6 pb-4">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold text-primary mb-3">Eventos</h1>
              <button
                onClick={() => onNavigate('admin-cadastrar-evento')}
                className="flex items-center gap-2 px-4 py-2 bg-[#F5EBFF] rounded-full hover:bg-[#E5D5F0] transition-colors border border-primary/10 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={2.5} />
                <span className="text-sm font-medium text-primary">Cadastrar um novo evento</span>
              </button>
            </div>
            
            {/* Search */}
            <div className="mb-4">
              <SearchBar
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>

            {/* Category Filters */}
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="px-5 space-y-4 pb-6">
              <SkeletonListExpanded count={3} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-5">
              <EmptyState
                title="Erro ao carregar eventos"
                description={error.message}
              />
            </div>
          )}

          {/* Mapa de Eventos */}
          {!loading && !error && mapEvents.length > 0 && (
            <div className="px-5 mb-6">
              <InteractiveMap
                locations={mapEvents}
                height="300px"
                onMarkerClick={(location) => {
                  onNavigate(`event-details:${location.id}`);
                }}
              />
            </div>
          )}

          {/* Events List */}
          {!loading && !error && (
            <div className="px-5 space-y-4 pb-6">
              {eventsForCards.length > 0 ? (
                eventsForCards.map((event) => (
                  <EventCardExpanded 
                    key={event.id} 
                    {...event} 
                    onClick={() => onNavigate(`event-details:${event.id}`)}
                  />
                ))
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="Nenhum evento encontrado"
                  description={searchQuery || activeCategory !== 'Todos' 
                    ? "Tente ajustar os filtros ou a busca"
                    : "Ainda não há eventos cadastrados"}
                />
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation fixo */}
        <BottomNav activeItem="events" onItemClick={onNavigate} />
      </div>
    </div>
  );
}