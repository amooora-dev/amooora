import { Heart, MapPin, Calendar, Briefcase } from 'lucide-react';
import { useMemo } from 'react';
import { Header } from '../shared/components';
import { BottomNav } from '../shared/components';
import { PlaceCardExpanded } from '../features/places';
import { EventCardExpanded, useEvents } from '../features/events';
import { ServiceCardExpanded, useServices } from '../features/services';
import { EmptyState } from '../shared/components';
import { useFavorites } from '../shared/hooks';
import { usePlaces } from '../features/places';
import { useAdmin } from '../shared/hooks';

interface MeusFavoritosProps {
  onNavigate: (page: string) => void;
}

export function MeusFavoritos({ onNavigate }: MeusFavoritosProps) {
  const { isAdmin } = useAdmin();
  const { getFavoritesByType } = useFavorites();
  const { places, loading: placesLoading } = usePlaces();
  const { events, loading: eventsLoading } = useEvents();
  const { services, loading: servicesLoading } = useServices();

  const favoritePlacesIds = getFavoritesByType('places');
  const favoriteEventsIds = getFavoritesByType('events');
  const favoriteServicesIds = getFavoritesByType('services');

  // Filtrar apenas os favoritos
  const favoritePlaces = useMemo(() => {
    return places.filter(place => favoritePlacesIds.includes(place.id));
  }, [places, favoritePlacesIds]);

  const favoriteEvents = useMemo(() => {
    return events.filter(event => favoriteEventsIds.includes(event.id));
  }, [events, favoriteEventsIds]);

  const favoriteServices = useMemo(() => {
    return services.filter(service => favoriteServicesIds.includes(service.id));
  }, [services, favoriteServicesIds]);

  // Converter para formato dos cards
  const placesForCards = useMemo(() => {
    return favoritePlaces.map((place) => ({
      id: place.id,
      name: place.name,
      description: place.description || 'Sem descrição',
      rating: place.rating || 0,
      reviewCount: place.reviewCount || 0,
      distance: place.distance || 'N/A',
      address: place.address || 'Endereço não informado',
      imageUrl: place.imageUrl || place.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
      tags: [
        { label: place.category, color: '#932d6f' },
      ],
      isSafe: place.isSafe ?? true,
    }));
  }, [favoritePlaces]);

  const eventsForCards = useMemo(() => {
    return favoriteEvents.map((event) => {
      const eventDate = event.date ? new Date(event.date) : new Date();
      const formattedDate = eventDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
      const fullDate = eventDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
      
      return {
        id: event.id,
        name: event.name,
        description: event.description || 'Sem descrição',
        date: formattedDate,
        fullDate: fullDate,
        time: event.time || 'Horário não informado',
        location: event.location || 'Local não informado',
        participants: `${event.participants || 0} participantes`,
        imageUrl: event.imageUrl || event.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        category: {
          label: event.category || 'Evento',
          color: '#932d6f',
        },
        price: event.price && event.price > 0 ? `R$ ${event.price.toFixed(2)}` : 'Gratuito',
        isPaid: event.price ? event.price > 0 : false,
      };
    });
  }, [favoriteEvents]);

  const servicesForCards = useMemo(() => {
    return favoriteServices.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description || 'Sem descrição',
      provider: service.provider || 'Prestador não informado',
      category: service.category,
      rating: service.rating || 0,
      reviewCount: 0,
      price: service.price ? `R$ ${service.price.toFixed(2)}` : 'A consultar',
      imageUrl: service.imageUrl || service.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
    }));
  }, [favoriteServices]);

  const totalFavorites = favoritePlaces.length + favoriteEvents.length + favoriteServices.length;
  const loading = placesLoading || eventsLoading || servicesLoading;

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} />
        
        {/* Conteúdo scrollável - padding-top para compensar header fixo */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Page Header */}
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-semibold text-primary mb-2">Meus Favoritos</h1>
            <p className="text-sm text-muted-foreground">
              {totalFavorites === 0 
                ? 'Você ainda não tem favoritos salvos' 
                : `${totalFavorites} ${totalFavorites === 1 ? 'item favoritado' : 'itens favoritados'}`
              }
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="px-5 py-12 text-center">
              <p className="text-muted-foreground">Carregando favoritos...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && totalFavorites === 0 && (
            <EmptyState
              icon={Heart}
              title="Nenhum favorito ainda"
              description="Explore locais, eventos e serviços e salve seus favoritos para encontrar facilmente depois!"
              action={{
                label: 'Explorar Locais',
                onClick: () => onNavigate('places')
              }}
            />
          )}

          {/* Conteúdo */}
          {!loading && totalFavorites > 0 && (
            <div className="px-5 space-y-6 pb-6">
              {/* Locais Favoritos */}
              {placesForCards.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-primary">Locais ({placesForCards.length})</h2>
                  </div>
                  <div className="space-y-4">
                    {placesForCards.map((place) => (
                      <PlaceCardExpanded
                        key={place.id}
                        {...place}
                        onClick={() => onNavigate(`place-details:${place.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Eventos Favoritos */}
              {eventsForCards.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-primary">Eventos ({eventsForCards.length})</h2>
                  </div>
                  <div className="space-y-4">
                    {eventsForCards.map((event) => (
                      <EventCardExpanded
                        key={event.id}
                        {...event}
                        onClick={() => onNavigate(`event-details:${event.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Serviços Favoritos */}
              {servicesForCards.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-primary">Serviços ({servicesForCards.length})</h2>
                  </div>
                  <div className="space-y-4">
                    {servicesForCards.map((service) => (
                      <ServiceCardExpanded
                        key={service.id}
                        {...service}
                        onClick={() => onNavigate(`service-details:${service.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation fixo */}
        <BottomNav activeItem="" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
