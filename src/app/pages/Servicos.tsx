import { Briefcase } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Header } from '../shared/components';
import { SearchBar } from '../shared/components';
import { CategoryFilter } from '../shared/components';
import { ServiceCardExpanded } from '../components/ServiceCardExpanded';
import { BottomNav } from '../shared/components';
import { EmptyState } from '../shared/components';
import { SkeletonListExpanded } from '../shared/components';
import { useServices } from '../hooks/useServices';
import { useAdmin } from '../shared/hooks';

// Lista de categorias - incluir todas as categorias que podem aparecer no banco de dados
const categories = ['Todos', 'Terapia', 'Advocacia', 'Costura', 'Marcenaria', 'Pintura', 'Reparos', 'Bem-estar', 'Beleza', 'Saúde', 'Carreira', 'Outros'];

interface ServicosProps {
  onNavigate: (page: string) => void;
  initialCategory?: string;
}

export function Servicos({ onNavigate, initialCategory }: ServicosProps) {
  const { services, loading, error } = useServices();
  const { isAdmin } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'Todos');

  // Aplicar categoria inicial quando a página carregar
  useEffect(() => {
    if (initialCategory) {
      // Verificar se a categoria está na lista de categorias disponíveis
      if (categories.includes(initialCategory)) {
        setActiveCategory(initialCategory);
      } else {
        // Se não estiver na lista, tentar encontrar correspondência (case-insensitive)
        const matchedCategory = categories.find(
          cat => cat.toLowerCase() === initialCategory.toLowerCase()
        );
        if (matchedCategory) {
          setActiveCategory(matchedCategory);
        } else {
          // Se não encontrar correspondência, usar 'Outros' se existir, senão 'Todos'
          setActiveCategory(categories.includes('Outros') ? 'Outros' : 'Todos');
        }
      }
    }
  }, [initialCategory]);

  // Filtrar serviços por categoria e busca
  const filteredServices = useMemo(() => {
    let filtered = services;

    // Filtro por categoria (comparação case-insensitive para garantir correspondência)
    if (activeCategory !== 'Todos') {
      filtered = filtered.filter((service) => {
        const serviceCategory = service.category || '';
        return serviceCategory.toLowerCase() === activeCategory.toLowerCase();
      });
    }

    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description?.toLowerCase().includes(query) ||
          service.provider?.toLowerCase().includes(query) ||
          service.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [services, activeCategory, searchQuery]);

  // Converter Service para formato do ServiceCardExpanded
  const servicesForCards = useMemo(() => {
    return filteredServices.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description || 'Sem descrição',
      provider: service.provider || 'Prestador não informado',
      category: service.category,
      rating: service.rating || 0,
      reviewCount: 0, // Será implementado quando houver reviews
      price: service.price ? `R$ ${service.price.toFixed(2)}` : 'A consultar',
      imageUrl: service.imageUrl || service.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
    }));
  }, [filteredServices]);

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} />
        
        {/* Conteúdo scrollável - padding-top para compensar header fixo */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Page Header */}
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-semibold text-primary mb-4">Serviços</h1>
            
            {/* Search */}
            <div className="mb-4">
              <SearchBar
                placeholder="Buscar serviços..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>

            {/* Category Filters */}
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="px-5 space-y-4 pb-6">
              <SkeletonListExpanded count={3} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-5">
              <EmptyState
                title="Erro ao carregar serviços"
                description={error.message}
              />
            </div>
          )}

          {/* Services List */}
          {!loading && !error && (
            <div className="px-5 space-y-4 pb-6">
              {servicesForCards.length > 0 ? (
                servicesForCards.map((service) => (
                  <ServiceCardExpanded 
                    key={service.id} 
                    {...service} 
                    onClick={() => onNavigate(`service-details:${service.id}`)}
                  />
                ))
              ) : (
                <EmptyState
                  icon={Briefcase}
                  title="Nenhum serviço encontrado"
                  description={searchQuery || activeCategory !== 'Todos' 
                    ? "Tente ajustar os filtros ou a busca"
                    : "Ainda não há serviços cadastrados"}
                />
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation fixo */}
        <BottomNav activeItem="services" onItemClick={onNavigate} />
      </div>
    </div>
  );
}