import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Calendar, MapPin, Users, Loader2 } from 'lucide-react';
import { Header } from '../shared/components';
import { supabase } from '../infra/supabase';
import type { Event } from '../shared/types';
import type { Place } from '../features/places/types';
import type { Community } from '../features/communities/services/communities';
import { ImageWithFallback } from '../shared/components';
import { activateContent } from '../shared/services/userContent';

interface AdminConteudosDesativadosProps {
  onNavigate: (page: string) => void;
}

type ContentType = 'event' | 'place' | 'community';
type TabType = 'all' | 'events' | 'places' | 'communities';

export function AdminConteudosDesativados({ onNavigate }: AdminConteudosDesativadosProps) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [content, setContent] = useState<{
    events: Event[];
    places: Place[];
    communities: Community[];
  }>({
    events: [],
    places: [],
    communities: [],
  });

  const loadDeactivatedContent = async () => {
    setLoading(true);
    try {
      // Buscar eventos desativados
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', false)
        .order('created_at', { ascending: false });

      // Buscar locais desativados (is_safe = false)
      const { data: placesData } = await supabase
        .from('places')
        .select('*')
        .eq('is_safe', false)
        .order('created_at', { ascending: false });

      // Buscar comunidades desativadas
      const { data: communitiesData } = await supabase
        .from('communities')
        .select('*')
        .eq('is_active', false)
        .order('created_at', { ascending: false });

      const events: Event[] = (eventsData || []).map((event) => ({
        id: event.id,
        name: event.name,
        description: event.description,
        image: event.image || undefined,
        imageUrl: event.image || undefined,
        date: event.date,
        time: event.date ? new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined,
        endTime: event.end_time || undefined,
        location: event.location,
        category: event.category,
        price: event.price ? Number(event.price) : undefined,
        participants: event.participants_count || 0,
      }));

      const places: Place[] = (placesData || []).map((place) => ({
        id: place.id,
        name: place.name,
        description: place.description || undefined,
        image: place.image,
        imageUrl: place.image,
        address: place.address || undefined,
        rating: Number(place.rating) || 0,
        category: place.category,
        latitude: place.latitude ? Number(place.latitude) : undefined,
        longitude: place.longitude ? Number(place.longitude) : undefined,
        reviewCount: place.review_count || 0,
        isSafe: place.is_safe ?? false,
        distance: undefined,
      }));

      const communities: Community[] = (communitiesData || []).map((community: any) => ({
        id: community.id,
        name: community.name,
        description: community.description || '',
        image: community.image || undefined,
        imageUrl: community.image || undefined,
        icon: community.icon || undefined,
        category: community.category || undefined,
        membersCount: community.members_count || 0,
        postsCount: community.posts_count || 0,
        isActive: community.is_active ?? false,
        createdAt: community.created_at,
      }));

      setContent({ events, places, communities });
    } catch (error) {
      console.error('Erro ao carregar conteúdos desativados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeactivatedContent();
  }, []);

  const handleActivate = async (type: ContentType, id: string) => {
    try {
      await activateContent(type, id);
      // Recarregar conteúdo
      await loadDeactivatedContent();
    } catch (error) {
      console.error('Erro ao ativar conteúdo:', error);
      alert('Erro ao ativar conteúdo');
    }
  };

  const getFilteredContent = () => {
    if (activeTab === 'events') {
      return { events: content.events, places: [], communities: [] };
    } else if (activeTab === 'places') {
      return { events: [], places: content.places, communities: [] };
    } else if (activeTab === 'communities') {
      return { events: [], places: [], communities: content.communities };
    }
    return content;
  };

  const filtered = getFilteredContent();
  const totalCount = filtered.events.length + filtered.places.length + filtered.communities.length;

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <Header onNavigate={onNavigate} showBackButton onBack={() => onNavigate('admin')} />

        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Header */}
          <div className="px-5 pt-6 pb-4 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-primary mb-4">Conteúdos Desativados</h1>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos ({content.events.length + content.places.length + content.communities.length})
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'events'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Eventos ({content.events.length})
              </button>
              <button
                onClick={() => setActiveTab('places')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'places'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Locais ({content.places.length})
              </button>
              <button
                onClick={() => setActiveTab('communities')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === 'communities'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Comunidades ({content.communities.length})
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : totalCount === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-muted-foreground">Nenhum conteúdo desativado encontrado.</p>
            </div>
          ) : (
            <div className="px-5 py-4 space-y-4">
              {/* Events */}
              {filtered.events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-gray-300 rounded-xl p-4 opacity-60"
                >
                  <div className="flex gap-3">
                    {event.image && (
                      <ImageWithFallback
                        src={event.image}
                        alt={event.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{event.name}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(event.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          Desativado
                        </span>
                      </div>
                      <button
                        onClick={() => handleActivate('event', event.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors mt-3"
                      >
                        <Eye className="w-4 h-4" />
                        Ativar
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Places */}
              {filtered.places.map((place) => (
                <div
                  key={place.id}
                  className="bg-white border border-gray-300 rounded-xl p-4 opacity-60"
                >
                  <div className="flex gap-3">
                    {place.image && (
                      <ImageWithFallback
                        src={place.image}
                        alt={place.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{place.name}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {place.address || place.category}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          Desativado
                        </span>
                      </div>
                      <button
                        onClick={() => handleActivate('place', place.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors mt-3"
                      >
                        <Eye className="w-4 h-4" />
                        Ativar
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Communities */}
              {filtered.communities.map((community) => (
                <div
                  key={community.id}
                  className="bg-white border border-gray-300 rounded-xl p-4 opacity-60"
                >
                  <div className="flex gap-3">
                    {community.image && (
                      <ImageWithFallback
                        src={community.image}
                        alt={community.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{community.name}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Users className="w-3 h-3" />
                            {community.membersCount || 0} membros
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          Desativado
                        </span>
                      </div>
                      <button
                        onClick={() => handleActivate('community', community.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors mt-3"
                      >
                        <Eye className="w-4 h-4" />
                        Ativar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
