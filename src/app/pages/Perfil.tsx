import { useState, useEffect } from 'react';
import { Star, Users, ChevronRight, MessageCircle, UserPlus, Calendar, Briefcase, FileText } from 'lucide-react';
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
import { getRequestsReceived, acceptRequest, rejectRequest } from '../features/friends';
import { RequestCard } from '../features/friends';
import { toast } from 'sonner';

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
  const [loading, setLoading] = useState(true);

  // Recarregar perfil quando receber evento de atualização
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('🔄 [Perfil] Evento profile-updated recebido, recarregando perfil...');
      refetchProfile();
    };
    
    window.addEventListener('profile-updated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, [refetchProfile]);

  useEffect(() => {
    const loadProfileData = async () => {
      console.log('🔍 [Perfil] loadProfileData chamado, profile:', {
        id: profile?.id,
        name: profile?.name,
        avatar: profile?.avatar,
        hasAvatar: !!profile?.avatar,
        avatarType: typeof profile?.avatar,
        avatarLength: profile?.avatar?.length,
        isUrl: profile?.avatar?.startsWith('http'),
      });
      
      if (!profile?.id) {
        console.log('⚠️ [Perfil] Profile.id não disponível, aguardando...');
        setLoading(false);
        return;
      }

      console.log('✅ [Perfil] Profile.id disponível:', profile.id);
      console.log('📸 [Perfil] Avatar do perfil:', {
        avatar: profile.avatar,
        hasAvatar: !!profile.avatar,
        isUrl: profile.avatar?.startsWith('http'),
        avatarType: typeof profile.avatar,
      });
      console.log('📸 [Perfil] Avatar do perfil:', profile.avatar);

      try {
        setLoading(true);
        
        // Verificar sessão antes de buscar dados
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        console.log('🔍 [Perfil] Verificação de sessão:', {
          authUser: authUser?.id,
          profileId: profile.id,
          match: authUser?.id === profile.id,
          authError: authError?.message,
        });
        
        if (authError || !authUser) {
          console.error('❌ [Perfil] Erro de autenticação:', authError);
          setLoading(false);
          return;
        }
        
        // Carregar dados do perfil (sem amigos, locais favoritos e eventos — acessados por botões)
        console.log('🔄 [Perfil] Iniciando busca de dados para userId:', profile.id);
        const [statsData, communitiesData, receivedRequestsData] = await Promise.all([
          getProfileStats(profile.id),
          getFollowedCommunities(profile.id),
          getRequestsReceived().catch(() => []),
        ]);

        setStats(statsData);
        setFollowedCommunities(communitiesData);
        setReceivedRequests(Array.isArray(receivedRequestsData) ? receivedRequestsData : []);
      } catch (error) {
        console.error('❌ [Perfil] Erro ao carregar dados do perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();

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
  const favoritePlacesCount = getFavoritesByType('places').length;
  const favoriteServicesCount = getFavoritesByType('services').length;
  const favoriteEventsCount = getFavoritesByType('events').length;
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

            {/* Botão Editar Perfil - largura total */}
            <div className="mb-6">
              <button
                onClick={() => onNavigate('edit-profile')}
                className="w-full px-4 py-3 rounded-full font-medium text-sm transition-colors bg-primary/10 text-primary hover:bg-primary/20"
              >
                Editar Perfil
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

          {/* Botão Ver amigos */}
          <div className="px-5 mb-6">
            <button
              type="button"
              onClick={() => onNavigate('friends')}
              className="w-full py-4 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-[#932d6f]/30 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Ver amigos</h2>
                  <p className="text-sm text-muted-foreground">
                    {displayFriendsCount > 0 ? `${displayFriendsCount} conexão(ões)` : 'Conectar com alguém'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Botão Locais Favoritos */}
          <div className="px-5 mb-6">
            <button
              type="button"
              onClick={() => onNavigate('perfil-locais-favoritos')}
              className="w-full py-4 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-[#932d6f]/30 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Locais Favoritos</h2>
                  <p className="text-sm text-muted-foreground">
                    {displayPlacesCount > 0 ? `${displayPlacesCount} local(is)` : 'Lugares que você salvou'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Botão Meus Eventos */}
          <div className="px-5 mb-6">
            <button
              type="button"
              onClick={() => onNavigate('perfil-meus-eventos')}
              className="w-full py-4 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-[#932d6f]/30 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Meus Eventos</h2>
                  <p className="text-sm text-muted-foreground">
                    {displayEventsCount > 0 ? `${displayEventsCount} evento(s)` : 'Favoritos, próximos e participados'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Botão Serviços favoritados */}
          <div className="px-5 mb-6">
            <button
              type="button"
              onClick={() => onNavigate('perfil-servicos-favoritos')}
              className="w-full py-4 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-[#932d6f]/30 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Serviços favoritados</h2>
                  <p className="text-sm text-muted-foreground">
                    {favoriteServicesCount > 0 ? `${favoriteServicesCount} serviço(s)` : 'Serviços que você salvou'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Botão Minhas Publicações */}
          <div className="px-5 mb-6">
            <button
              type="button"
              onClick={() => onNavigate('minhas-publicacoes')}
              className="w-full py-4 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-[#932d6f]/30 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Minhas Publicações</h2>
                  <p className="text-sm text-muted-foreground">Editar e desativar seus conteúdos</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

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
