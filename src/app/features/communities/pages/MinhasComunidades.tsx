import { useState, useMemo } from 'react';
import { Header } from '../../../shared/components';
import { BottomNav } from '../../../shared/components';
import { CommunityCard } from '../../../components/CommunityCard';
import { CategoryFilter } from '../../../shared/components';
import { EmptyState } from '../../../shared/components';
import { SkeletonListExpanded } from '../../../shared/components';
import { Users, Search } from 'lucide-react';
import { useAdmin } from '../../../shared/hooks';
import { useCommunities } from '../../../hooks/useCommunities';
import { Community } from '../services/communities';

interface MinhasComunidadesProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

const categories = ['Todos', 'Apoio', 'Dicas', 'Eventos', 'Geral'];

export function MinhasComunidades({ onNavigate, onBack }: MinhasComunidadesProps) {
  const { isAdmin } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  
  // Buscar comunidades do banco de dados
  const { communities: dbCommunities, loading, refetch } = useCommunities();

  // Converter comunidades do banco para o formato do CommunityCard
  const communities = useMemo(() => {
    return dbCommunities.map((community: Community) => ({
      id: community.id,
      name: community.name,
      avatar: community.image || community.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
      description: community.description,
      membersCount: community.membersCount || 0,
      postsCount: community.postsCount || 0,
      rating: 4.5, // Rating padrão (pode ser calculado depois)
      category: community.category,
    }));
  }, [dbCommunities]);

  // Filtrar comunidades baseado na busca e categoria
  const filteredCommunities = useMemo(() => {
    let filtered = communities;

    // Filtro por categoria
    if (activeCategory !== 'Todos') {
      filtered = filtered.filter((community) => community.category === activeCategory);
    }

    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (community) =>
          community.name.toLowerCase().includes(query) ||
          community.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [communities, activeCategory, searchQuery]);

  const handleCommunityClick = (communityId: string) => {
    onNavigate(`community-details:${communityId}`);
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />
        
        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Page Header */}
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-semibold text-primary mb-4">Todas as Comunidades</h1>
            
            {/* Campo de Busca */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar comunidades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>

            {/* Filtro de Categorias */}
            <div className="mb-4">
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>

          {/* Lista de Comunidades em Grid 2 Colunas */}
          <div className="px-5 pb-6">
            {loading ? (
              <SkeletonListExpanded count={3} />
            ) : filteredCommunities.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Nenhuma comunidade encontrada"
                description={searchQuery || activeCategory !== 'Todos' 
                  ? 'Tente ajustar sua busca ou filtros.' 
                  : 'Ainda não há comunidades disponíveis.'}
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredCommunities.map((community) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    onClick={() => handleCommunityClick(community.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation fixo */}
        <BottomNav activeItem="community" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
