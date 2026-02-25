import { useState, useEffect } from 'react';
import { Users, ChevronRight, MessageCircle, Calendar, Briefcase, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../shared/components';
import { BottomNav } from '../shared/components';
import { Header } from '../shared/components';
import { useProfile } from '../hooks/useProfile';
import { useAdmin, useFavorites } from '../shared/hooks';
import { supabase } from '../infra/supabase';
import {
  getProfileStats,
  getFollowedCommunities,
  type FollowedCommunity,
} from '../services/profile';
import { getRequestsReceived, acceptRequest, rejectRequest, getFriends } from '../features/friends';
import type { FriendProfile } from '../features/friends';
import { RequestCard } from '../features/friends';
import { toast } from 'sonner';
import { getUserContent } from '../shared/services/userContent';
import { getPlaceById } from '../features/places/services/places';
import { getEventById } from '../services/events';
import { getServiceById } from '../services/services';

interface PerfilProps {
  onNavigate: (page: string) => void;
}

export function Perfil({ onNavigate }: PerfilProps) {
  const { profile, loading: profileLoading, refetch: refetchProfile } = useProfile();
  const { isAdmin } = useAdmin();
  const { getFavoritesByType } = useFavorites();
  const [stats, setStats] = useState({ eventsCount: 0, placesCount: 0, friendsCount: 0 });
  const [followedCommunities, setFollowedCommunities] = useState<FollowedCommunity[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<Array<{
    id: string;
    requester_id: string;
    addressee_id: string;
    status: string;
    pair_key: string;
    created_at: string;
    responded_at: string | null;
    requester?: { id: string; name: string; avatar?: string; city?: string };
  }>>([]);
  const [friendsList, setFriendsList] = useState<FriendProfile[]>([]);
  const [userPublications, setUserPublications] = useState<{ events: Array<{ id: string; name: string; image?: string; date?: string }>; places: Array<{ id: string; name: string; image?: string; category?: string }>; communities: Array<{ id: string; name: string; image?: string }> }>({ events: [], places: [], communities: [] });
  const [loading, setLoading] = useState(true);
  const [previewPlaces, setPreviewPlaces] = useState<Array<{ id: string; name: string; image?: string; imageUrl?: string; category?: string }>>([]);
  const [previewEvents, setPreviewEvents] = useState<Array<{ id: string; name: string; image?: string; imageUrl?: string; date?: string }>>([]);
  const [previewServices, setPreviewServices] = useState<Array<{ id: string; name: string; image?: string; imageUrl?: string; category?: string; provider?: string }>>([]);

  // Recarregar perfil quando receber evento de atualização
  useEffect(() => {
    const handleProfileUpdate = () => refetchProfile();
    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate);
  }, [refetchProfile]);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
          if (import.meta.env.DEV) console.error('[Perfil] Erro de autenticação:', authError);
          setLoading(false);
          return;
        }

        const [statsData, communitiesData, receivedRequestsData, friendsData, contentData] = await Promise.all([
          getProfileStats(profile.id).catch(() => ({ eventsCount: 0, placesCount: 0, friendsCount: 0 })),
          getFollowedCommunities(profile.id).catch(() => []),
          getRequestsReceived().catch(() => []),
          getFriends().catch(() => []),
          getUserContent().catch(() => ({ events: [], places: [], communities: [] })),
        ]);

        setStats(statsData);
        setFollowedCommunities(Array.isArray(communitiesData) ? communitiesData : []);
        setReceivedRequests(Array.isArray(receivedRequestsData) ? receivedRequestsData : []);
        setFriendsList(Array.isArray(friendsData) ? friendsData : []);
        const ev = Array.isArray(contentData?.events) ? contentData.events : [];
        const pl = Array.isArray(contentData?.places) ? contentData.places : [];
        const co = Array.isArray(contentData?.communities) ? contentData.communities : [];
        setUserPublications({
          events: ev.slice(0, 4).map((e: { id: string; name: string; image?: string; imageUrl?: string; date?: string }) => ({ id: e.id, name: e.name, image: e.image ?? e.imageUrl, date: e.date })),
          places: pl.slice(0, 4).map((p: { id: string; name: string; image?: string; imageUrl?: string; category?: string }) => ({ id: p.id, name: p.name, image: p.image ?? p.imageUrl, category: p.category })),
          communities: co.slice(0, 4).map((c: { id: string; name: string; image?: string }) => ({ id: c.id, name: c.name, image: c.image })),
        });

        const placeIds = (Array.isArray(getFavoritesByType?.('places')) ? getFavoritesByType('places') : []).filter((id): id is string => Boolean(id && typeof id === 'string'));
        const eventIds = (Array.isArray(getFavoritesByType?.('events')) ? getFavoritesByType('events') : []).filter((id): id is string => Boolean(id && typeof id === 'string'));
        const serviceIds = (Array.isArray(getFavoritesByType?.('services')) ? getFavoritesByType('services') : []).filter((id): id is string => Boolean(id && typeof id === 'string'));
        const [placesRes, eventsRes, servicesRes] = await Promise.all([
          Promise.all(placeIds.slice(0, 4).map((id) => getPlaceById(id).catch(() => null))),
          Promise.all(eventIds.slice(0, 4).map((id) => getEventById(id).catch(() => null))),
          Promise.all(serviceIds.slice(0, 4).map((id) => getServiceById(id).catch(() => null))),
        ]);
        setPreviewPlaces((placesRes.filter(Boolean) as Array<{ id: string; name: string; image?: string; imageUrl?: string; category?: string }>).map((p) => ({ id: p.id, name: p.name, image: p.image ?? p.imageUrl, category: p.category })));
        setPreviewEvents((eventsRes.filter(Boolean) as Array<{ id: string; name: string; image?: string; imageUrl?: string; date?: string }>).map((e) => ({ id: e.id, name: e.name, image: e.image ?? e.imageUrl, date: e.date })));
        setPreviewServices((servicesRes.filter(Boolean) as Array<{ id: string; name: string; image?: string; imageUrl?: string; category?: string; provider?: string }>).map((s) => ({ id: s.id, name: s.name, image: s.image ?? s.imageUrl, imageUrl: s.image ?? s.imageUrl, category: s.category, provider: s.provider })));
      } catch (error) {
        if (import.meta.env.DEV) console.error('[Perfil] Erro ao carregar dados do perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intencional: rodar só quando profile.id mudar; getFavoritesByType é lido no closure
  }, [profile?.id]);

  // Se não houver perfil, mostrar mensagem ou redirecionar
  if (profileLoading || loading) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate} isAdmin={isAdmin} />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  // Se não houver perfil, mostrar mensagem
  if (!profile) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate} isAdmin={isAdmin} />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Perfil não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  // Contagens alinhadas aos conteúdos salvos (localStorage + API)
  const favoritePlaceIds = Array.isArray(getFavoritesByType?.('places')) ? getFavoritesByType('places') : [];
  const favoriteEventIds = Array.isArray(getFavoritesByType?.('events')) ? getFavoritesByType('events') : [];
  const favoriteServiceIds = Array.isArray(getFavoritesByType?.('services')) ? getFavoritesByType('services') : [];
  const favoritePlacesCount = favoritePlaceIds.length;
  const favoriteServicesCount = favoriteServiceIds.length;
  const favoriteEventsCount = favoriteEventIds.length;
  const displayPlacesCount = favoritePlacesCount;
  const displayEventsCount = stats.eventsCount + favoriteEventsCount;
  const displayFriendsCount = stats.friendsCount;

  // Gerar username a partir do email se não existir
  const username = profile.username || profile.email?.split('@')[0] || 'usuario';
  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} />

        {/* Conteúdo scrollável - padding-top para compensar header fixo */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Perfil Header - Estrutura similar à imagem */}
          <div className="px-5 pt-6 pb-4">
            {/* Avatar centralizado */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
                {profile.avatar ? (
                  <ImageWithFallback
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#932d6f] to-[#dca0c8] text-white text-2xl font-bold">
                    {profile.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </div>

            {/* Nome */}
            <h1 className="text-2xl font-bold text-foreground text-center mb-2">
              {profile.name}
            </h1>

            {/* Bio */}
            {profile.bio && (
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs mx-auto">
                {profile.bio}
              </p>
            )}

            {/* Stats - 3 colunas - conforme conteúdos salvos por área */}
            {(displayEventsCount > 0 || displayPlacesCount > 0 || displayFriendsCount > 0) && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{displayEventsCount}</div>
                  <div className="text-xs text-muted-foreground">Eventos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{displayPlacesCount}</div>
                  <div className="text-xs text-muted-foreground">Lugares</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{displayFriendsCount}</div>
                  <div className="text-xs text-muted-foreground">Amigos</div>
                </div>
              </div>
            )}

            {/* Botões Editar Perfil e Minhas publicações */}
            <div className="mb-6 flex gap-3">
              <button
                onClick={() => onNavigate('edit-profile')}
                className="flex-1 px-4 py-3 rounded-full font-medium text-sm transition-colors bg-primary/10 text-primary hover:bg-primary/20"
              >
                Editar Perfil
              </button>
              <button
                onClick={() => onNavigate('minhas-publicacoes')}
                className="flex-1 px-4 py-3 rounded-full font-medium text-sm transition-colors bg-primary/10 text-primary hover:bg-primary/20"
              >
                Minhas publicações
              </button>
            </div>
          </div>

          {/* Pedidos de conexão recebidos */}
          {receivedRequests.length > 0 && (
            <div className="px-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Pedidos de conexão</h2>
                <button
                  type="button"
                  onClick={() => onNavigate('friends-requests')}
                  className="text-sm text-[#932d6f] font-medium flex items-center gap-1"
                >
                  Ver todos
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {receivedRequests.slice(0, 3).map((req) => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    variant="received"
                    onAccept={async (requestId) => {
                      const { ok } = await acceptRequest(requestId);
                      if (ok) {
                        toast.success('Conexão aceita');
                        const [list, newStats] = await Promise.all([
                          getRequestsReceived(),
                          profile?.id ? getProfileStats(profile.id) : null,
                        ]);
                        setReceivedRequests(list);
                        if (newStats) setStats(newStats);
                      }
                    }}
                    onReject={async (requestId) => {
                      if (!window.confirm('Recusar este pedido de conexão?')) return;
                      const { ok } = await rejectRequest(requestId);
                      if (ok) {
                        toast.success('Pedido recusado');
                        const list = await getRequestsReceived();
                        setReceivedRequests(list);
                      }
                    }}
                    onViewProfile={(id) => onNavigate(`view-profile:${id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Módulo Ver amigos */}
          <section className="px-5 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Ver amigos</h2>
                <p className="text-sm text-muted-foreground">
                  {displayFriendsCount > 0 ? `${displayFriendsCount} conexão(ões)` : 'Conectar com alguém'}
                </p>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {friendsList.slice(0, 4).map((friend) => (
                <button
                  key={friend.id}
                  type="button"
                  onClick={() => onNavigate(`view-profile:${friend.id}`)}
                  className="flex flex-col items-center gap-2 flex-shrink-0"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-border bg-muted">
                    <ImageWithFallback
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground truncate max-w-[72px]">{friend.name}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-2">
              <button type="button" onClick={() => onNavigate('friends')} className="text-sm font-medium text-primary flex items-center gap-0.5">
                Ver mais <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Módulo Locais Favoritos */}
          <section className="px-5 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Locais Favoritos</h2>
                <p className="text-sm text-muted-foreground">
                  {displayPlacesCount > 0 ? `${displayPlacesCount} local(is)` : 'Lugares que você salvou'}
                </p>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {previewPlaces.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => onNavigate(`place-details:${place.id}`)}
                  className="flex-shrink-0 w-28 rounded-xl overflow-hidden border border-border bg-white text-left"
                >
                  <div className="h-20 w-full bg-muted">
                    <ImageWithFallback src={place.imageUrl || place.image} alt={place.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="p-2 text-xs font-medium text-foreground truncate">{place.category || place.name}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-2">
              <button type="button" onClick={() => onNavigate('perfil-locais-favoritos')} className="text-sm font-medium text-primary flex items-center gap-0.5">
                Ver mais <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Módulo Meus Eventos */}
          <section className="px-5 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Meus Eventos</h2>
                <p className="text-sm text-muted-foreground">
                  {displayEventsCount > 0 ? `${displayEventsCount} evento(s)` : 'Favoritos, próximos e participados'}
                </p>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {previewEvents.map((event) => {
                const d = event.date ? new Date(event.date) : null;
                const dateLabel = d && !Number.isNaN(d.getTime()) ? `${d.getDate()} ${['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][d.getMonth()]}` : '';
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => onNavigate(`event-details:${event.id}`)}
                    className="flex-shrink-0 w-28 rounded-xl overflow-hidden border border-border bg-white text-left relative"
                  >
                    <div className="h-20 w-full bg-muted relative">
                      <ImageWithFallback src={event.image || event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
                      {dateLabel ? <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-white/90 text-xs font-medium text-foreground">{dateLabel}</span> : null}
                    </div>
                    <p className="p-2 text-xs font-medium text-foreground truncate">{event.name}</p>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end mt-2">
              <button type="button" onClick={() => onNavigate('perfil-meus-eventos')} className="text-sm font-medium text-primary flex items-center gap-0.5">
                Ver mais <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Módulo Serviços favoritados */}
          <section className="px-5 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Serviços favoritados</h2>
                <p className="text-sm text-muted-foreground">
                  {favoriteServicesCount > 0 ? `${favoriteServicesCount} serviço(s)` : 'Serviços que você salvou'}
                </p>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {previewServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => onNavigate(`service-details:${service.id}`)}
                  className="flex-shrink-0 w-28 rounded-xl overflow-hidden border border-border bg-white text-left relative"
                >
                  <div className="h-20 w-full bg-muted relative">
                    {(service.image || service.imageUrl) ? (
                      <ImageWithFallback src={service.image || service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <Briefcase className="w-8 h-8 text-primary/60" />
                      </div>
                    )}
                    {service.category ? (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-white/90 text-xs font-medium text-foreground truncate max-w-[90%]">
                        {service.category}
                      </span>
                    ) : null}
                  </div>
                  <p className="p-2 text-xs font-medium text-foreground truncate">{service.name}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-2">
              <button type="button" onClick={() => onNavigate('perfil-servicos-favoritos')} className="text-sm font-medium text-primary flex items-center gap-0.5">
                Ver mais <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Comunidades que Sigo - apenas se houver dados */}
          {followedCommunities.length > 0 && (
            <div className="px-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Comunidades que Sigo</h2>
                <button 
                  onClick={() => onNavigate('minhas-comunidades')}
                  className="text-sm text-[#932d6f] font-medium flex items-center gap-1"
                >
                  Ver todas
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {followedCommunities.slice(0, 4).map((community) => (
                  <div 
                    key={community.id} 
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onNavigate(`community-details:${community.community_id}`)}
                  >
                    <div className="relative h-24">
                      <ImageWithFallback
                        src={community.imageUrl}
                        alt={community.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">{community.name}</h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">{community.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>{community.membersCount >= 1000 ? `${(community.membersCount / 1000).toFixed(1)}k` : community.membersCount}</span>
                        <MessageCircle className="w-3 h-3 ml-1" />
                        <span>{community.postsCount || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="profile" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
