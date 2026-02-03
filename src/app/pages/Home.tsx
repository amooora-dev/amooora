import { useMemo, useState } from 'react';
import { MapPin, Calendar, Scissors, MessageCircle, Scale, Heart, Sparkles, Briefcase, Stethoscope, GraduationCap, ShoppingBag, UtensilsCrossed, Palette, Dumbbell, Music, BookOpen, Camera, Car, Home as HomeIcon, UserCheck, Building2, Search, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Header } from '../shared/components';
import { SectionHeader } from '../components/SectionHeader';
import { PlaceCard, usePlaces } from '../features/places';
import { EventCard, useEvents } from '../features/events';
import { ServiceCardGrid, useServices } from '../features/services';
import { BottomNav } from '../shared/components';
import { GlobalSearch } from '../components/GlobalSearch';
import { useAdmin } from '../shared/hooks';
import { HighlightCard } from '../components/HighlightCard';
import { InteractiveMap } from '../components/InteractiveMap';
import lugaresSegurosImage from '../../assets/lugaresseguros.png';
import comunidadesImage from '../../assets/comunidades.png';
import eventosImage from '../../assets/eventos.png';

// Mapeamento de categorias para ícones
const categoryIconMap: { [key: string]: LucideIcon } = {
  'Terapia': MessageCircle,
  'Advocacia': Scale,
  'Saúde': Heart,
  'Carreira': Briefcase,
  'Saude': Heart,
  'Beleza': Sparkles,
  'Educação': GraduationCap,
  'Comércio': ShoppingBag,
  'Alimentação': UtensilsCrossed,
  'Arte': Palette,
  'Esporte': Dumbbell,
  'Música': Music,
  'Livros': BookOpen,
  'Fotografia': Camera,
  'Transporte': Car,
  'Construção': HomeIcon,
  'Recursos Humanos': UserCheck,
  'Negócios': Building2,
  // Adicionar mais mapeamentos conforme necessário
};

// Cores padrão - usar variáveis do tema
const DEFAULT_COLOR = '#932d6f'; // Primary (roxo)

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  // Buscar dados reais do Supabase
  const { places, loading: loadingPlaces, error: errorPlaces } = usePlaces();
  const { events, loading: loadingEvents, error: errorEvents } = useEvents();
  const { services, loading: loadingServices, error: errorServices } = useServices();
  // Sem autenticação: sempre permitir acesso admin
  const { isAdmin } = useAdmin();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Limitar a 3 locais e 3 eventos mais recentes para exibição na home
  // Os dados já vêm ordenados por created_at DESC dos serviços
  const limitedPlaces = places.slice(0, 3);
  const limitedEvents = events.slice(0, 3);

  // Preparar locais e eventos para o mapa (apenas os que têm coordenadas)
  const mapLocations = useMemo(() => {
    const locations: Array<{
      id: string;
      name: string;
      address?: string;
      lat: number;
      lng: number;
      category?: string;
      imageUrl?: string;
      type: 'place' | 'event';
    }> = [];

    // Adicionar locais com coordenadas
    places
      .filter((place) => place.latitude && place.longitude)
      .slice(0, 10) // Limitar a 10 locais para o mapa na home
      .forEach((place) => {
        locations.push({
          id: place.id,
          name: place.name,
          address: place.address,
          lat: Number(place.latitude),
          lng: Number(place.longitude),
          category: place.category,
          imageUrl: place.imageUrl || place.image,
          type: 'place',
        });
      });

    // Adicionar eventos com localização (se tiverem coordenadas no futuro)
    // Por enquanto, eventos precisam de geocoding, então vamos pular
    // Se quiser incluir eventos, precisaria fazer geocoding aqui também

    return locations;
  }, [places]);

  // Pegar os últimos 6 serviços cadastrados para grid 2 colunas (já ordenados por created_at DESC)
  const latestServices = useMemo(() => {
    if (!services || services.length === 0) {
      return [];
    }

    // Pegar os últimos 6 serviços cadastrados para exibir em grid
    return services.slice(0, 6).map((service) => ({
      id: service.id,
      name: service.name || service.category || 'Serviço',
      category: service.category || 'Outros',
      provider: service.provider,
      imageUrl: service.imageUrl || service.image,
      slug: service.categorySlug || service.category?.toLowerCase().replace(/\s+/g, '-') || 'outros',
    }));
  }, [services]);

  const handleServiceClick = (serviceId: string, categoryName?: string) => {
    // Navegar para detalhes do serviço ou página de serviços com categoria
    if (serviceId) {
      onNavigate(`service-details:${serviceId}`);
    } else if (categoryName) {
      onNavigate(`services:${categoryName}`);
    } else {
      onNavigate('services');
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Container mobile-first */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} />
        
        {/* Main content com scroll - padding-top para compensar header fixo */}
        <main className="flex-1 overflow-y-auto px-5 py-6 space-y-8 pb-24 pt-28">
          {/* Campo de Busca */}
          <div className="mb-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors text-left"
            >
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-500 flex-1">Buscar locais, eventos e serviços...</span>
            </button>
          </div>

          {/* Card do Mapa */}
          <section className="mb-8">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-accent" style={{ color: '#c4532f' }} />
                <h2 className="text-xl font-bold text-gray-900">Amooora Recomenda</h2>
              </div>
              <p className="text-sm text-gray-600">Confira os lugares e eventos sáficos.</p>
            </div>
            <div 
              onClick={() => onNavigate('mapa')}
              className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
            >
              <InteractiveMap
                locations={mapLocations}
                height="280px"
                onMarkerClick={(location) => {
                  // Prevenir navegação dupla - o card já navega para o mapa
                  // Se quiser navegar direto para o local, pode descomentar:
                  // if (location.type === 'place') {
                  //   onNavigate(`place-details:${location.id}`);
                  // } else if (location.type === 'event') {
                  //   onNavigate(`event-details:${location.id}`);
                  // }
                }}
              />
            </div>
          </section>

          {/* Seção: Destaques */}
          <section className="mb-8">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 text-accent" style={{ color: '#c4532f' }} />
                <h2 className="text-xl font-bold text-gray-900">Destaques</h2>
              </div>
              <p className="text-sm text-gray-600">Explore os melhores locais, eventos e serviços</p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
              {/* Card Locais */}
              <HighlightCard
                title="Lugares Seguros"
                subtitle="Descubra locais acolhedores"
                imageUrl={lugaresSegurosImage}
                icon={MapPin}
                onClick={() => onNavigate('places')}
              />
              
              {/* Card Eventos */}
              <HighlightCard
                title="Eventos"
                subtitle="Participe de eventos incríveis"
                imageUrl={eventosImage}
                icon={Calendar}
                onClick={() => onNavigate('events')}
              />
              
              {/* Card Serviços */}
              <HighlightCard
                title="Serviços"
                subtitle="Encontre profissionais especializados"
                imageUrl={latestServices.length > 0 && latestServices[0]?.imageUrl 
                  ? latestServices[0].imageUrl 
                  : 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&q=80'}
                icon={Scissors}
                onClick={() => onNavigate('services')}
              />
              
              {/* Card Comunidade */}
              <HighlightCard
                title="Comunidade"
                subtitle="Conecte-se com outras pessoas"
                imageUrl={comunidadesImage}
                icon={MessageCircle}
                onClick={() => onNavigate('community')}
              />
            </div>
          </section>

          {/* Seção: Lugares Seguros Próximos */}
          <section>
            <SectionHeader 
              icon={<MapPin className="w-5 h-5" />}
              title="Lugares Seguros Próximos"
              onViewAll={() => onNavigate('places')}
            />
            <div className="space-y-4">
              {loadingPlaces ? (
                <p className="text-center text-muted-foreground text-sm py-4">Carregando locais...</p>
              ) : errorPlaces ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium">Erro ao carregar locais</p>
                  <p className="text-red-500 text-xs mt-1">{errorPlaces.message}</p>
                </div>
              ) : limitedPlaces.length > 0 ? (
                limitedPlaces.map((place) => (
                  <PlaceCard 
                    key={place.id}
                    id={place.id}
                    name={place.name}
                    category={place.category}
                    rating={place.rating}
                    reviewCount={place.reviewCount || 0}
                    distance={place.distance || 'Distância não disponível'}
                    imageUrl={place.imageUrl || place.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem'}
                    isSafe={place.isSafe}
                    onClick={() => onNavigate(`place-details:${place.id}`)}
                    showFavorite={false}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground text-sm py-4">Nenhum local encontrado</p>
              )}
            </div>
          </section>

          {/* Seção: Eventos Recomendados */}
          <section>
            <SectionHeader 
              icon={<Calendar className="w-5 h-5" />}
              title="Eventos Recomendados"
              onViewAll={() => onNavigate('events')}
            />
            <div>
              {loadingEvents ? (
                <p className="text-center text-muted-foreground text-sm py-4">Carregando eventos...</p>
              ) : errorEvents ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium">Erro ao carregar eventos</p>
                  <p className="text-red-500 text-xs mt-1">{errorEvents.message}</p>
                </div>
              ) : limitedEvents.length > 0 ? (
                limitedEvents.map((event) => {
                  // Formatar data para exibição
                  const eventDate = new Date(event.date);
                  const day = eventDate.getDate().toString().padStart(2, '0');
                  const month = eventDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
                  const time = event.time || eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <EventCard 
                      key={event.id}
                      id={event.id}
                      name={event.name}
                      date={`${day} ${month}`}
                      time={time || 'Horário não disponível'}
                      location={event.location}
                      participants={event.participants || 0}
                      imageUrl={event.imageUrl || event.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'}
                      onClick={() => onNavigate(`event-details:${event.id}`)}
                    />
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground text-sm py-4">Nenhum evento encontrado</p>
              )}
            </div>
          </section>

          {/* Seção: Serviços para Você */}
          <section>
            <SectionHeader 
              icon={<Scissors className="w-5 h-5" />}
              title="Serviços para Você"
              onViewAll={() => onNavigate('services')}
            />
            <div className="grid grid-cols-2 gap-3">
              {loadingServices ? (
                <div className="col-span-2 text-center text-muted-foreground text-sm py-4">
                  Carregando serviços...
                </div>
              ) : errorServices ? (
                <div className="col-span-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium">Erro ao carregar serviços</p>
                  <p className="text-red-500 text-xs mt-1">{errorServices.message}</p>
                </div>
              ) : latestServices.length > 0 ? (
                latestServices.map((service) => (
                  <ServiceCardGrid 
                    key={service.id} 
                    id={service.id}
                    name={service.name}
                    category={service.category}
                    provider={service.provider}
                    imageUrl={service.imageUrl}
                    onClick={() => handleServiceClick(service.id, service.slug)}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center text-muted-foreground text-sm py-4">
                  Nenhum serviço encontrado
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="home" onItemClick={onNavigate} />
      </div>

      {/* Modal de Busca Global */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={onNavigate}
      />
    </div>
  );
}