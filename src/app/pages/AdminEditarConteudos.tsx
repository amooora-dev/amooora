import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Scissors, Search, Edit, Trash2, Users } from 'lucide-react';
import { getPlaces } from '../features/places';
import { getEvents } from '../features/events';
import { getServices } from '../features/services';
import { getCommunities, Community } from '../features/communities';
import type { Place, Event, Service } from '../types';

interface AdminEditarConteudosProps {
  onNavigate: (page: string) => void;
}

type ContentType = 'all' | 'places' | 'events' | 'services' | 'communities';

export function AdminEditarConteudos({ onNavigate }: AdminEditarConteudosProps) {
  const [activeTab, setActiveTab] = useState<ContentType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [places, setPlaces] = useState<Place[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const [placesData, eventsData, servicesData, communitiesData] = await Promise.all([
          getPlaces().then(r => r.data || []),
          getEvents(),
          getServices(),
          getCommunities(),
        ]);
        
        setPlaces(placesData);
        setEvents(eventsData);
        setServices(servicesData);
        setCommunities(communitiesData);
      } catch (error) {
        console.error('Erro ao carregar conteúdos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const filteredPlaces = places.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (type: 'place' | 'event' | 'service' | 'community', id: string) => {
    if (type === 'place') {
      onNavigate(`admin-editar-local:${id}`);
    } else if (type === 'event') {
      onNavigate(`admin-editar-evento:${id}`);
    } else if (type === 'service') {
      onNavigate(`admin-editar-servico:${id}`);
    } else if (type === 'community') {
      onNavigate(`admin-editar-comunidade:${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <button
            onClick={() => onNavigate('admin')}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-semibold text-lg text-primary">
            Editar Conteúdos
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Busca */}
        <div className="px-5 py-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 py-3 border-b border-border bg-gray-50">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveTab('places')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === 'places'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-1" />
              Locais
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === 'events'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Eventos
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === 'services'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Scissors className="w-4 h-4 inline mr-1" />
              Serviços
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === 'communities'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4 inline mr-1" />
              Comunidades
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-5 py-4 space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Carregando conteúdos...</p>
            </div>
          ) : (
            <>
              {/* Locais */}
              {(activeTab === 'all' || activeTab === 'places') && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Locais ({filteredPlaces.length})
                  </h2>
                  {filteredPlaces.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4">Nenhum local encontrado</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredPlaces.map((place) => (
                        <div
                          key={place.id}
                          className="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-1 truncate">{place.name}</h3>
                              <p className="text-xs text-gray-600 mb-2">{place.category}</p>
                              {place.address && (
                                <p className="text-xs text-gray-500 truncate">{place.address}</p>
                              )}
                            </div>
                            <button
                              onClick={() => handleEdit('place', place.id)}
                              className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-5 h-5 text-primary" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Eventos */}
              {(activeTab === 'all' || activeTab === 'events') && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Eventos ({filteredEvents.length})
                  </h2>
                  {filteredEvents.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4">Nenhum evento encontrado</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredEvents.map((event) => (
                        <div
                          key={event.id}
                          className="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-1 truncate">{event.name}</h3>
                              <p className="text-xs text-gray-600 mb-2">{event.category}</p>
                              {event.location && (
                                <p className="text-xs text-gray-500 truncate">{event.location}</p>
                              )}
                            </div>
                            <button
                              onClick={() => handleEdit('event', event.id)}
                              className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-5 h-5 text-primary" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Serviços */}
              {(activeTab === 'all' || activeTab === 'services') && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Scissors className="w-4 h-4" />
                    Serviços ({filteredServices.length})
                  </h2>
                  {filteredServices.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4">Nenhum serviço encontrado</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredServices.map((service) => (
                        <div
                          key={service.id}
                          className="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-1 truncate">{service.name}</h3>
                              <p className="text-xs text-gray-600 mb-2">{service.category}</p>
                              {service.provider && (
                                <p className="text-xs text-gray-500 truncate">{service.provider}</p>
                              )}
                            </div>
                            <button
                              onClick={() => handleEdit('service', service.id)}
                              className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-5 h-5 text-primary" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Comunidades */}
              {(activeTab === 'all' || activeTab === 'communities') && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Comunidades ({filteredCommunities.length})
                  </h2>
                  {filteredCommunities.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4">Nenhuma comunidade encontrada</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredCommunities.map((community) => (
                        <div
                          key={community.id}
                          className="bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-1 truncate">{community.name}</h3>
                              <p className="text-xs text-gray-600 mb-2">{community.category}</p>
                              <p className="text-xs text-gray-500 line-clamp-2">{community.description}</p>
                            </div>
                            <button
                              onClick={() => handleEdit('community', community.id)}
                              className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-5 h-5 text-primary" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
