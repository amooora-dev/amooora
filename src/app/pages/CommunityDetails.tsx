import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Users, MessageCircle, Heart, Calendar, Palette, Briefcase, Plane, Sparkles, Home, Star, Share2, Flag, UserPlus } from 'lucide-react';
import { Header } from '../shared/components';
import { CommunityPostCard } from '../components/CommunityPostCard';
import { CreatePostForm } from '../components/CreatePostForm';
import { ImageWithFallback } from '../shared/components';
import { EmptyState } from '../shared/components';
import { SkeletonListExpanded } from '../shared/components';
import { InfiniteScroll } from '../components/InfiniteScroll';
import { BottomNav } from '../shared/components';
import { useAdmin } from '../shared/hooks';
import { useCommunity } from '../hooks/useCommunities';
import { useCommunityPosts } from '../hooks/useCommunityPosts';
import { createPost } from '../services/community';
import { MessageSquare } from 'lucide-react';
import { shareContent, getShareUrl, getShareText } from '../shared/utils';
import { joinCommunity, leaveCommunity, isUserMember } from '../services/communities';
import { supabase } from '../infra/supabase';

// Mapear categoria para cor
const categoryColors: Record<string, string> = {
  'Apoio': '#932d6f', // Primary
  'Dicas': '#dca0c8', // Secondary (rosa claro)
  'Eventos': '#c4532f', // Accent (laranja)
  'Geral': '#3a184f', // Tertiary (roxo escuro)
};

// Função para calcular tempo relativo
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Agora';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d atrás`;
  return date.toLocaleDateString('pt-BR');
};

// Função para obter ícone baseado na categoria
const getCommunityIcon = (category?: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    'Apoio': <Heart className="w-6 h-6 text-white" />,
    'Dicas': <Sparkles className="w-6 h-6 text-white" />,
    'Eventos': <Calendar className="w-6 h-6 text-white" />,
    'Geral': <Users className="w-6 h-6 text-white" />,
  };
  
  return iconMap[category || ''] || <MessageCircle className="w-6 h-6 text-white" />;
};

interface CommunityDetailsProps {
  communityId: string;
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

export function CommunityDetails({ communityId, onNavigate, onBack }: CommunityDetailsProps) {
  const { isAdmin } = useAdmin();
  const { community, loading: communityLoading, error: communityError } = useCommunity(communityId);
  const [isFollowing, setIsFollowing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [communityRating, setCommunityRating] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);
  
  // Buscar posts da categoria da comunidade
  const { posts, loading: postsLoading, error: postsError, hasMore, loadMore, refetch } = useCommunityPosts({
    category: community?.category,
    searchQuery: undefined,
    limit: 20,
  });

  // Verificar se usuário está seguindo a comunidade
  useEffect(() => {
    const checkFollowing = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && communityId) {
          const member = await isUserMember(communityId, user.id);
          setIsFollowing(member);
        }
      } catch (error) {
        console.error('Erro ao verificar se está seguindo:', error);
      }
    };
    checkFollowing();
  }, [communityId]);

  // Buscar avaliações da comunidade (placeholder - será implementado depois)
  useEffect(() => {
    // Por enquanto, usar rating mockado ou do banco se existir
    // TODO: Implementar sistema de avaliações para comunidades
    if (community) {
      // Mock: usar rating se existir, senão usar valor padrão
      // Quando sistema de avaliações estiver pronto, buscar do banco
      setCommunityRating(4.5); // Valor mockado por enquanto
      setRatingCount(0); // Será atualizado quando avaliações estiverem implementadas
    }
  }, [community]);

  // Handler para seguir/deixar de seguir
  const handleFollow = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Se não estiver logado, preparar para quando login estiver ativo
        console.log('Usuário não logado - funcionalidade será ativada quando login estiver funcionando');
        // Por enquanto, apenas alternar visualmente
        setIsFollowing(!isFollowing);
        return;
      }

      if (isFollowing) {
        await leaveCommunity(communityId, user.id);
        setIsFollowing(false);
      } else {
        await joinCommunity(communityId, user.id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir comunidade:', error);
    }
  };

  // Handler para compartilhar
  const handleShare = async () => {
    if (!community) return;
    
    const shared = await shareContent({
      title: community.name,
      text: getShareText('community', community.name),
      url: getShareUrl('community', communityId),
    });

    if (shared) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  // Handler para avaliar - mostrar avaliações existentes
  const handleRate = () => {
    // Por enquanto, apenas mostrar avaliações
    // Quando sistema de avaliações estiver pronto, pode navegar para página de avaliação
    // onNavigate(`create-review:community:${communityId}`);
    // Por enquanto, apenas scroll para seção de avaliações se existir
  };

  // Handler para denunciar
  const handleReport = () => {
    // Navegar para página de denúncia (será criada depois)
    onNavigate(`report:community:${communityId}`);
  };

  // Renderizar estrelas de avaliação
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating) ? 'fill-primary text-primary' : 'text-gray-300'
            }`}
          />
        ))}
        {ratingCount > 0 && (
          <span className="text-sm text-gray-600 ml-1">({ratingCount})</span>
        )}
      </div>
    );
  };

  // Converter posts para o formato esperado pelo CommunityPostCard
  const postsForCards = useMemo(() => {
    return posts.map((post) => ({
      id: post.id,
      author: {
        name: post.author?.name || 'Usuário',
        avatarUrl: post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTcwMTY1NzYwMHww&ixlib=rb-4.1.0&q=80&w=1080',
      },
      timeAgo: getTimeAgo(post.createdAt),
      title: post.title,
      description: post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content,
      category: {
        label: post.category,
        color: categoryColors[post.category] || '#932d6f',
      },
      likes: post.likesCount,
      replies: post.repliesCount,
      isTrending: post.isTrending,
    }));
  }, [posts]);

  // Mapear comunidade para o formato do CreatePostForm
  const communitiesForForm = useMemo(() => {
    if (!community) return [];
    return [{
      id: community.id,
      name: community.name,
      avatar: community.image || community.imageUrl || '',
    }];
  }, [community]);

  const handleCreatePost = async (content: string, selectedCommunityId: string) => {
    if (!community?.category) return;
    
    const title = content.split('\n')[0].substring(0, 100) || 'Novo Post';
    await createPost(title, content, community.category);
    await refetch();
  };

  // Loading state
  if (communityLoading) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando comunidade...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (communityError || !community) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <p className="text-red-500 mb-2">Erro ao carregar comunidade</p>
              <p className="text-sm text-muted-foreground">
                {communityError?.message || 'Comunidade não encontrada'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />
        
        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Banner da Comunidade */}
          <div className="relative w-full h-48 overflow-hidden">
            <ImageWithFallback
              src={community.image || community.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80'}
              alt={community.name}
              className="w-full h-full object-cover"
            />
            {/* Overlay escuro */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
            
            {/* Ícone circular sobreposto */}
            <div className="absolute bottom-4 left-5 w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
              {getCommunityIcon(community.category)}
            </div>

            {/* Informações da comunidade */}
            <div className="absolute bottom-4 left-24 right-5">
              <h1 className="text-2xl font-bold text-white mb-1">{community.name}</h1>
              <p className="text-sm text-white/90 line-clamp-2">{community.description}</p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="px-5 py-4 bg-white border-b border-gray-100">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {community.membersCount >= 1000
                      ? `${(community.membersCount / 1000).toFixed(1)}k`
                      : community.membersCount}
                  </p>
                  <p className="text-xs text-gray-500">Membros</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {community.postsCount || posts.length}
                  </p>
                  <p className="text-xs text-gray-500">Posts</p>
                </div>
              </div>
              {community.category && (
                <div className="ml-auto">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: categoryColors[community.category] || '#932d6f' }}
                  >
                    {community.category}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="px-5 py-4 bg-white border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={handleFollow}
                className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap hover:bg-[rgba(147,45,111,0.2)] transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                {isFollowing ? 'Seguindo' : 'Seguir'}
              </button>
              <button
                onClick={handleRate}
                className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap hover:bg-[rgba(147,45,111,0.2)] transition-colors"
              >
                <Star className="w-4 h-4" />
                Avaliar
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap hover:bg-[rgba(147,45,111,0.2)] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {shareSuccess ? 'Link copiado!' : 'Compartilhar'}
              </button>
              <button
                onClick={handleReport}
                className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap hover:bg-[rgba(147,45,111,0.2)] transition-colors"
              >
                <Flag className="w-4 h-4" />
                Denunciar
              </button>
            </div>
          </div>

          {/* Avaliação - sempre mostrar quando houver avaliações */}
          {ratingCount > 0 && (
            <div className="px-5 py-3 bg-white border-b border-gray-100">
              <div className="flex items-center gap-2">
                {renderStars(communityRating)}
              </div>
            </div>
          )}

          {/* Formulário de Criação de Post */}
          {community.category && (
            <div className="px-5 pt-6">
              <CreatePostForm
                communities={communitiesForForm}
                defaultCommunityId={community.id}
                onSubmit={handleCreatePost}
              />
            </div>
          )}

          {/* Feed de Posts */}
          <div className="px-5 pt-6 pb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Posts da Comunidade</h2>
            
            {postsLoading && posts.length === 0 ? (
              <SkeletonListExpanded count={3} />
            ) : postsError ? (
              <EmptyState
                icon={MessageSquare}
                title="Erro ao carregar posts"
                description={postsError.message || 'Não foi possível carregar os posts da comunidade.'}
              />
            ) : postsForCards.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="Nenhum post ainda"
                description="Seja o primeiro a compartilhar algo nesta comunidade!"
              />
            ) : (
              <InfiniteScroll
                onLoadMore={loadMore}
                hasMore={hasMore}
                loading={postsLoading}
              >
                {postsForCards.map((post) => (
                  <CommunityPostCard 
                    key={post.id} 
                    {...post} 
                    onClick={() => onNavigate(`post-details:${post.id}`)}
                  />
                ))}
              </InfiniteScroll>
            )}
          </div>
        </div>

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="community" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
