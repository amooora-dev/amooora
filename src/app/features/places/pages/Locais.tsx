import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, MapPin, Plus } from 'lucide-react';
import { Header, SearchBar, CategoryFilter, BottomNav, EmptyState, SkeletonListExpanded, AuthModal } from '../../../shared/components';
import { PlaceCardExpanded } from '../components/PlaceCardExpanded';
import { FilterModal, FilterOptions } from '../../../components/FilterModal';
import { usePlaces } from '../hooks/usePlaces';
import { useFilterPreferences } from '../../../hooks/useFilterPreferences';
import { useAdmin, useAuth } from '../../../shared/hooks';

const categories = ['Todos', 'Cafés', 'Bares', 'Restaurantes', 'Cultura'];

interface LocaisProps {
  onNavigate: (page: string) => void;
}

export function Locais({ onNavigate }: LocaisProps) {
  const { places, loading, error } = usePlaces();
  const { isAdmin } = useAdmin();
  const { isAuthenticated } = useAuth();
  const { filters, updateFilters, clearFilters } = useFilterPreferences();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [placeRatings, setPlaceRatings] = useState<Record<string, number>>({});
  
  useEffect(() => {
    if (places.length > 0) {
      const ratingsMap: Record<string, number> = {};
      places.forEach(place => {
        ratingsMap[place.id] = place.rating || 0;
      });
      setPlaceRatings(ratingsMap);
    }
  }, [places]);

  const getPlaceTags = useMemo(() => {
    return (place: typeof places[0]): string[] => {
      if (!place) return [];
      
      const tags: string[] = [];
      const desc = (place.description || '').toLowerCase();
      
      if (desc.includes('vegano') || desc.includes('vegetariano')) tags.push('vegano');
      if (desc.includes('pet') || desc.includes('animal')) tags.push('aceita-pets');
      if (desc.includes('acessível') || desc.includes('cadeirante')) tags.push('acessivel');
      if (desc.includes('drag') || desc.includes('show')) tags.push('drag-shows');
      if (desc.includes('wifi') || desc.includes('internet')) tags.push('wifi-gratis');
      if (desc.includes('estacionamento') || desc.includes('parking')) tags.push('estacionamento');
      if (desc.includes('música') || desc.includes('música ao vivo')) tags.push('musica-ao-vivo');
      if (desc.includes('ar livre') || desc.includes('terraço') || desc.includes('varanda')) tags.push('ar-livre');
      
      return tags;
    };
  }, [places]);

  const filteredPlaces = useMemo(() => {
    let filtered = places;

    if (activeCategory !== 'Todos') {
      filtered = filtered.filter((place) => place.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(query) ||
          place.description?.toLowerCase().includes(query) ||
          place.address?.toLowerCase().includes(query)
      );
    }

    if (filters.rating !== 'any') {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter((place) => {
        const placeRating = placeRatings[place.id] || place.rating;
        return placeRating >= minRating;
      });
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((place) => {
        const placeTags = place.tags || getPlaceTags(place);
        return filters.tags!.some(tag => placeTags.includes(tag));
      });
    }

    if (filters.distance !== 'any') {
      // TODO: cálculo real de distância quando tivermos localização do usuário
    }

    return filtered;
  }, [places, activeCategory, searchQuery, filters, placeRatings, getPlaceTags]);

  const placesForCards = useMemo(() => {
    return filteredPlaces.map((place) => {
      const placeTags = place.tags || getPlaceTags(place);
      const realRating = placeRatings[place.id] || place.rating;
      
      const tagColors: Record<string, string> = {
        'vegano': '#10b981',
        'aceita-pets': '#f59e0b',
        'acessivel': '#3b82f6',
        'drag-shows': '#ec4899',
        'wifi-gratis': '#8b5cf6',
        'estacionamento': '#6366f1',
        'musica-ao-vivo': '#ef4444',
        'ar-livre': '#22c55e',
      };
      
      const tagLabels: Record<string, string> = {
        'vegano': 'Vegano',
        'aceita-pets': 'Aceita Pets',
        'acessivel': 'Acessível',
        'drag-shows': 'Drag Shows',
        'wifi-gratis': 'Wifi Grátis',
        'estacionamento': 'Estacionamento',
        'musica-ao-vivo': 'Música ao Vivo',
        'ar-livre': 'Ar Livre',
      };

      const visualTags = [
        { label: place.category, color: '#932d6f' },
        ...placeTags.slice(0, 3).map(tag => ({
          label: tagLabels[tag] || tag,
          color: tagColors[tag] || '#932d6f',
        })),
      ];

      return {
        id: place.id,
        name: place.name,
        description: place.description || 'Sem descrição',
        rating: realRating,
        reviewCount: place.reviewCount || 0,
        distance: place.distance || 'N/A',
        address: place.address || 'Endereço não informado',
        imageUrl: place.imageUrl || place.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
        tags: visualTags,
        isSafe: place.isSafe ?? true,
        lat: place.latitude,
        lng: place.longitude,
      };
    });
  }, [filteredPlaces, placeRatings, getPlaceTags]);

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    updateFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <Header onNavigate={onNavigate} isAdmin={isAdmin} />
        
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          <div className="px-5 pt-6 pb-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h1 className="text-2xl font-semibold text-primary flex-1">Locais Seguros</h1>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    onNavigate('admin-cadastrar-local');
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 bg-[#F5EBFF] rounded-full hover:bg-[#E5D5F0] transition-colors border border-primary/10 flex-shrink-0"
              >
                <Plus className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={2.5} />
                <span className="text-xs font-medium text-primary whitespace-nowrap">Recomendar Local</span>
              </button>
            </div>
            
            <div className="mb-4">
              <SearchBar
                placeholder="Buscar lugares..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>

            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {loading && (
            <div className="px-5 space-y-4 pb-6">
              <SkeletonListExpanded count={3} />
            </div>
          )}

          {error && (
            <div className="px-5">
              <EmptyState
                title="Erro ao carregar locais"
                description={error.message}
              />
            </div>
          )}

          {!loading && !error && (
            <div className="px-5 mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredPlaces.length} {filteredPlaces.length === 1 ? 'lugar encontrado' : 'lugares encontrados'}
              </p>
              <button
                className="flex items-center gap-2 text-primary font-medium text-sm hover:text-primary/80 transition-colors"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="px-5 space-y-4 pb-6">
              {placesForCards.length > 0 ? (
                placesForCards.map((place) => (
                  <PlaceCardExpanded
                    id={place.id} 
                    key={place.id} 
                    {...place} 
                    onClick={() => onNavigate(`place-details:${place.id}`)}
                  />
                ))
              ) : (
                <EmptyState
                  icon={MapPin}
                  title="Nenhum lugar encontrado"
                  description={searchQuery || activeCategory !== 'Todos' || Object.values(filters).some(v => v !== 'any')
                    ? "Tente ajustar os filtros ou a busca"
                    : "Ainda não há lugares cadastrados"}
                />
              )}
            </div>
          )}
        </div>

        <BottomNav activeItem="places" onItemClick={onNavigate} />
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Modal de Autenticação */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={() => onNavigate('login')}
        onSignUp={() => onNavigate('cadastro')}
      />
    </div>
  );
}

