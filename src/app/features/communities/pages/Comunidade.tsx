import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from '../../../shared/components';
import { CommunityPostCard } from '../../../components/CommunityPostCard';
import { CommunityCardCarousel } from '../../../components/CommunityCardCarousel';
import { CreatePostForm } from '../../../components/CreatePostForm';
import { CategoryFilter } from '../../../shared/components';
import { MessageCircle, Heart, Users, Calendar, Sparkles, Search, Filter } from 'lucide-react';
import { BottomNav } from '../../../shared/components';
import { EmptyState } from '../../../shared/components';
import { SkeletonListExpanded } from '../../../shared/components';
import { InfiniteScroll } from '../../../components/InfiniteScroll';
import { useAdmin } from '../../../shared/hooks';
import { useCommunityPosts } from '../../../hooks/useCommunityPosts';
import { useCommunities } from '../../../hooks/useCommunities';
import { createPost, getCommunityPosts, getPostReplies } from '../services/community';
import { MessageSquare } from 'lucide-react';
import { Community } from '../services/communities';

// Dados mockados removidos - agora usamos apenas dados do banco de dados

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

interface ComunidadeProps {
  onNavigate: (page: string) => void;
}

const categories = ['Todos', 'Apoio', 'Dicas', 'Eventos', 'Geral'];

export function Comunidade({ onNavigate }: ComunidadeProps) {
  const { isAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState<'feed' | 'communities'>('feed');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [communityPostsMap, setCommunityPostsMap] = useState<Record<string, any[]>>({});

  // Usar hook para buscar posts do banco (sem filtros de busca/categoria por padrão)
  const { posts, loading, error, hasMore, loadMore, refetch } = useCommunityPosts({
    category: activeCategory !== 'Todos' ? activeCategory : undefined,
    searchQuery: undefined,
    limit: 20,
  });

  // Buscar posts de todas as comunidades para busca (incluindo replies)
  // Carregar apenas quando houver busca ativa para otimizar performance
  useEffect(() => {
    if (!searchQuery.trim()) {
      setCommunityPostsMap({});
      return;
    }

    const fetchAllCommunityPosts = async () => {
      try {
        const { data } = await getCommunityPosts(undefined, 500, 0);
        const postsByCommunity: Record<string, any[]> = {};
        
        // Agrupar posts por categoria (que corresponde à comunidade)
        // Limitar busca de replies apenas aos primeiros 50 posts para performance
        const postsToProcess = data.slice(0, 50);
        
        for (const post of postsToProcess) {
          const category = post.category || 'Geral';
          if (!postsByCommunity[category]) {
            postsByCommunity[category] = [];
          }
          
          // Buscar replies do post para incluir na busca (apenas se necessário)
          try {
            const replies = await getPostReplies(post.id);
            const postWithReplies = {
              ...post,
              replies: replies,
            };
            postsByCommunity[category].push(postWithReplies);
          } catch (error) {
            // Se falhar ao buscar replies, adicionar post sem replies
            postsByCommunity[category].push(post);
          }
        }
        
        // Adicionar posts restantes sem replies para busca básica
        for (const post of data.slice(50)) {
          const category = post.category || 'Geral';
          if (!postsByCommunity[category]) {
            postsByCommunity[category] = [];
          }
          postsByCommunity[category].push(post);
        }
        
        setCommunityPostsMap(postsByCommunity);
      } catch (error) {
        console.error('Erro ao buscar posts das comunidades:', error);
      }
    };
    
    // Debounce para evitar muitas buscas
    const timeoutId = setTimeout(() => {
      fetchAllCommunityPosts();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);



  // Filtrar posts baseado no tab ativo
  const filteredPosts = useMemo(() => {
    // "Meu feed" - mostrar todos os posts
    return posts;
  }, [posts]);

  // Buscar comunidades do banco de dados
  const { communities: dbCommunities, loading: communitiesLoading } = useCommunities();

  // Usar apenas comunidades do banco (sem fallback para mock)
  const communities = useMemo(() => {
    // Retornar array vazio enquanto carrega ou se não houver dados
    if (communitiesLoading || !dbCommunities) {
      return [];
    }
    return dbCommunities;
  }, [dbCommunities, communitiesLoading]);

  // Função para obter ícone baseado na categoria
  const getCommunityIcon = (community: Community): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      'Apoio': <Heart className="w-6 h-6 text-white" />,
      'Dicas': <Sparkles className="w-6 h-6 text-white" />,
      'Eventos': <Calendar className="w-6 h-6 text-white" />,
      'Geral': <Users className="w-6 h-6 text-white" />,
    };
    
    return iconMap[community.category || ''] || <MessageCircle className="w-6 h-6 text-white" />;
  };

  // Filtrar comunidades baseado na busca
  const filteredCommunities = useMemo(() => {
    if (!searchQuery.trim()) {
      return communities;
    }

    const query = searchQuery.toLowerCase();
    
    return communities.filter((community) => {
      // Buscar no título
      if (community.name.toLowerCase().includes(query)) {
        return true;
      }
      
      // Buscar na descrição
      if (community.description?.toLowerCase().includes(query)) {
        return true;
      }
      
      // Buscar em posts/comentários da comunidade
      const category = community.category || 'Geral';
      const communityPosts = communityPostsMap[category] || [];
      
      const hasMatchingPost = communityPosts.some((post: any) => {
        // Buscar no título do post
        if (post.title?.toLowerCase().includes(query)) {
          return true;
        }
        // Buscar no conteúdo do post
        if (post.content?.toLowerCase().includes(query)) {
          return true;
        }
        // Buscar em replies/comentários do post
        if (post.replies && Array.isArray(post.replies)) {
          const hasMatchingReply = post.replies.some((reply: any) => {
            // Buscar no conteúdo do comentário
            if (reply.content?.toLowerCase().includes(query)) {
              return true;
            }
            // Buscar em replies aninhadas
            if (reply.replies && Array.isArray(reply.replies)) {
              return reply.replies.some((nestedReply: any) => 
                nestedReply.content?.toLowerCase().includes(query)
              );
            }
            return false;
          });
          if (hasMatchingReply) {
            return true;
          }
        }
        return false;
      });
      
      return hasMatchingPost;
    });
  }, [communities, searchQuery, communityPostsMap]);

  // Mapear comunidades filtradas para o formato do carrossel
  const communitiesForCarousel = useMemo(() => {
    // Aplicar filtro de categoria também
    let filtered = filteredCommunities;
    
    if (activeCategory !== 'Todos') {
      filtered = filtered.filter((c) => c.category === activeCategory);
    }
    
    return filtered.map((community) => ({
      id: community.id,
      name: community.name,
      description: community.description,
      imageUrl: community.image || community.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
      icon: getCommunityIcon(community),
      membersCount: community.membersCount || 0,
      postsCount: community.postsCount || 0,
    }));
  }, [filteredCommunities, activeCategory]);
  
  // Mapear comunidades para o formato do CreatePostForm
  const communitiesForForm = useMemo(() => {
    // Retornar array vazio se não houver comunidades (sem fallback para mock)
    if (!communities || communities.length === 0) {
      return [];
    }
    return communities.map((c) => ({
      id: c.id,
      name: c.name,
      avatar: c.image || c.imageUrl || '',
    }));
  }, [communities]);

  const handleCreatePost = async (content: string, communityId: string) => {
    // Buscar categoria da comunidade selecionada
    const selectedCommunity = communities.find((c) => c.id === communityId);
    const category = selectedCommunity?.category || 'Geral';
    
    // Usar primeiras palavras do conteúdo como título (ou criar um título padrão)
    const title = content.split('\n')[0].substring(0, 100) || 'Novo Post';
    
    await createPost(title, content, category);
    await refetch();
  };

  // Recarregar posts quando a página receber foco (quando voltar de outra página)
  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  // Converter posts filtrados para o formato esperado pelo CommunityPostCard
  const postsForCards = filteredPosts.map((post) => ({
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

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} />
        
        {/* Conteúdo scrollável - padding-top para compensar header fixo */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Page Header */}
          <div className="px-5 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-primary">Comunidade</h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Filtros"
                >
                  <Filter className="w-5 h-5 text-accent" />
                </button>
                <button 
                  onClick={() => onNavigate('minhas-comunidades')}
                  className="text-sm text-accent font-medium hover:opacity-80 transition-opacity"
                >
                  Ver todas
                </button>
              </div>
            </div>

            {/* Campo de Busca */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por título, descrição ou mensagens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>

            {/* Filtro de Categorias (mostrar quando filtro estiver aberto) */}
            {isFilterOpen && (
              <div className="mb-4">
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />
              </div>
            )}
          </div>

          {/* Carrossel de Comunidades em Destaque */}
          {!communitiesLoading && communitiesForCarousel.length > 0 && (
            <CommunityCardCarousel
              communities={communitiesForCarousel}
              onCommunityClick={(communityId) => {
                onNavigate(`community-details:${communityId}`);
              }}
              onJoinClick={(communityId) => {
                onNavigate(`community-details:${communityId}`);
              }}
            />
          )}

          {/* Tabs: Meu feed / Minhas comunidades */}
          <div className="px-5 mb-4">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab('feed');
                  setSelectedCommunityId(null);
                }}
                className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                  activeTab === 'feed'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Meu feed
              </button>
              <button
                onClick={() => {
                  setActiveTab('communities');
                  onNavigate('minhas-comunidades');
                }}
                className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                  activeTab === 'communities'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Minhas comunidades
              </button>
            </div>
          </div>

          {/* Formulário de Criação de Post */}
          <CreatePostForm
            communities={communitiesForForm}
            onSubmit={handleCreatePost}
          />

          {/* Lista de Posts */}
          <div className="px-5 space-y-4 pb-6">
            {loading && posts.length === 0 ? (
              <SkeletonListExpanded count={3} />
            ) : error ? (
              <EmptyState
                icon={MessageSquare}
                title="Erro ao carregar posts"
                description={error.message || 'Não foi possível carregar os posts da comunidade.'}
              />
            ) : postsForCards.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="Nenhum post encontrado"
                description="Ainda não há posts na comunidade. Seja o primeiro a compartilhar!"
              />
            ) : (
              <InfiniteScroll
                onLoadMore={loadMore}
                hasMore={hasMore}
                loading={loading}
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

        {/* Bottom Navigation fixo */}
        <BottomNav activeItem="community" onItemClick={onNavigate} />
      </div>
    </div>
  );
}