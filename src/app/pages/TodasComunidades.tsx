import { useState, useMemo } from 'react';
import { Header, BottomNav, ImageWithFallback, EmptyState, SkeletonListExpanded } from '../shared/components';
import { useCommunities } from '../hooks/useCommunities';
import { Search, Users, MessageCircle, Heart, Calendar, Sparkles } from 'lucide-react';
import { Community } from '../services/communities';

interface TodasComunidadesProps {
  onNavigate: (page: string) => void;
}

const categories = ['Todos', 'Apoio', 'Dicas', 'Eventos', 'Geral'];

export function TodasComunidades({ onNavigate }: TodasComunidadesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  // Buscar comunidades do banco de dados
  const { communities: dbCommunities, loading: communitiesLoading } = useCommunities();

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

  // Filtrar comunidades
  const filteredCommunities = useMemo(() => {
    let filtered = dbCommunities || [];

    // Filtrar por categoria
    if (activeCategory !== 'Todos') {
      filtered = filtered.filter((c) => c.category === activeCategory);
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((community) => {
        if (community.name.toLowerCase().includes(query)) {
          return true;
        }
        if (community.description?.toLowerCase().includes(query)) {
          return true;
        }
        return false;
      });
    }

    return filtered;
  }, [dbCommunities, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <Header onNavigate={onNavigate} showBackButton onBack={() => onNavigate('home')} />

        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Título */}
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Todas as Comunidades</h1>
            <p className="text-sm text-gray-600">Explore e participe das comunidades da Amooora</p>
          </div>

          {/* Busca */}
          <div className="px-5 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar comunidades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Filtro de Categorias */}
          <div className="px-5 mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                      isActive
                        ? 'bg-[#932d6f] text-white'
                        : 'bg-white text-foreground border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lista de Comunidades */}
          <div className="px-5 pb-6">
            {communitiesLoading ? (
              <SkeletonListExpanded count={5} />
            ) : filteredCommunities.length === 0 ? (
              <EmptyState
                icon={MessageCircle}
                title="Nenhuma comunidade encontrada"
                description={
                  searchQuery.trim()
                    ? 'Tente buscar com outros termos ou limpe o filtro.'
                    : 'Ainda não há comunidades cadastradas.'
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredCommunities.map((community) => (
                  <div
                    key={community.id}
                    onClick={() => onNavigate(`community-details:${community.id}`)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
                  >
                    {/* Imagem do card */}
                    <div className="relative w-full h-48 overflow-hidden">
                      <ImageWithFallback
                        src={community.image || community.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80'}
                        alt={community.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay escuro no fundo */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      
                      {/* Ícone circular sobreposto na parte inferior esquerda */}
                      <div className="absolute bottom-3 left-3 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        {getCommunityIcon(community)}
                      </div>
                    </div>

                    {/* Conteúdo do card */}
                    <div className="p-4">
                      {/* Nome e descrição */}
                      <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                        {community.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {community.description}
                      </p>

                      {/* Informações e botão */}
                      <div className="flex items-center justify-between">
                        {/* Botão de membros */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                          <Users className="w-3.5 h-3.5" />
                          <span>
                            {community.membersCount >= 1000
                              ? `${(community.membersCount / 1000).toFixed(1)}k`
                              : community.membersCount || 0}
                          </span>
                        </div>

                        {/* Badge de categoria */}
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {community.category || 'Geral'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <BottomNav activeItem="community" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
