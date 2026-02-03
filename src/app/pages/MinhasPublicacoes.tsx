import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Eye, EyeOff, Calendar, MapPin, Users, Loader2 } from 'lucide-react';
import { Header } from '../shared/components';
import { getUserContent, deactivateContent, activateContent } from '../shared/services/userContent';
import type { Event } from '../shared/types';
import type { Place } from '../features/places/types';
import type { Community } from '../features/communities/services/communities';
import { ImageWithFallback } from '../shared/components';

interface MinhasPublicacoesProps {
  onNavigate: (page: string) => void;
}

type ContentType = 'event' | 'place' | 'community';
type TabType = 'all' | 'events' | 'places' | 'communities';

export function MinhasPublicacoes({ onNavigate }: MinhasPublicacoesProps) {
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

  const loadContent = async () => {
    setLoading(true);
    try {
      const userContent = await getUserContent();
      setContent(userContent);
    } catch (error) {
      console.error('Erro ao carregar publicações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleToggleActive = async (type: ContentType, id: string, isActive: boolean) => {
    try {
      if (isActive) {
        await deactivateContent(type, id);
      } else {
        await activateContent(type, id);
      }
      // Recarregar conteúdo
      await loadContent();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status da publicação');
    }
  };

  const handleEdit = (type: ContentType, id: string) => {
    if (type === 'event') {
      onNavigate(`admin-editar-evento:${id}`);
    } else if (type === 'place') {
      onNavigate(`admin-editar-local:${id}`);
    } else if (type === 'community') {
      onNavigate(`admin-editar-comunidade:${id}`);
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
        <Header onNavigate={onNavigate} showBackButton onBack={() => onNavigate('home')} />

        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Header */}
          <div className="px-5 pt-6 pb-4 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-primary mb-4">Minhas Publicações</h1>

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
              <p className="text-muted-foreground">Você ainda não publicou nenhum conteúdo.</p>
            </div>
          ) : (
            <div className="px-5 py-4 space-y-4">
              {/* Events */}
              {filtered.events.map((event) => {
                const isActive = (event as any).isActive ?? true;
                return (
                  <div
                    key={event.id}
                    className={`bg-white border rounded-xl p-4 ${
                      !isActive ? 'opacity-60 border-gray-300' : 'border-gray-200'
                    }`}
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
                          {!isActive && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              Desativado
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEdit('event', event.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleActive('event', event.id, isActive)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {isActive ? (
                              <>
                                <EyeOff className="w-4 h-4" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                Ativar
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Places */}
              {filtered.places.map((place) => {
                const isActive = place.isSafe ?? true;
                return (
                  <div
                    key={place.id}
                    className={`bg-white border rounded-xl p-4 ${
                      !isActive ? 'opacity-60 border-gray-300' : 'border-gray-200'
                    }`}
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
                          {!isActive && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              Desativado
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEdit('place', place.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleActive('place', place.id, isActive)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {isActive ? (
                              <>
                                <EyeOff className="w-4 h-4" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                Ativar
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Communities */}
              {filtered.communities.map((community) => {
                const isActive = community.isActive ?? true;
                return (
                  <div
                    key={community.id}
                    className={`bg-white border rounded-xl p-4 ${
                      !isActive ? 'opacity-60 border-gray-300' : 'border-gray-200'
                    }`}
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
                          {!isActive && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              Desativado
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEdit('community', community.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleActive('community', community.id, isActive)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {isActive ? (
                              <>
                                <EyeOff className="w-4 h-4" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                Ativar
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
