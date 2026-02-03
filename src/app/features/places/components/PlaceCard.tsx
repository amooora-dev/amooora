import { Star, Heart } from 'lucide-react';
import { ImageWithFallback, Badge } from '../../../shared/components';
import { useFavorites } from '../../../shared/hooks';

interface PlaceCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance: string;
  imageUrl: string;
  isSafe?: boolean;
  onClick?: () => void;
  showFavorite?: boolean; // Controla se o botão de favorito deve ser exibido
}

export function PlaceCard({ 
  id,
  name, 
  category, 
  rating, 
  reviewCount, 
  distance, 
  imageUrl, 
  isSafe = true,
  onClick,
  showFavorite = true // Por padrão, mostra o botão de favorito
}: PlaceCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite('places', id);

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-border/50 hover:shadow-md transition-shadow mb-3 cursor-pointer relative"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Botão de favoritos */}
      {showFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite('places', id);
          }}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-4 h-4 transition-colors ${
            favorite ? 'fill-[#932d6f] text-[#932d6f]' : 'text-gray-400'
          }`} />
        </button>
      )}

      <div className="flex gap-3 p-3">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <ImageWithFallback 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground line-clamp-1 flex-1">{name}</h3>
            {isSafe && <Badge variant="primary">Seguro</Badge>}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{category}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                <span className="text-xs text-foreground font-medium">{rating}</span>
                <span className="text-xs text-muted-foreground">({reviewCount})</span>
              </div>
              <span className="text-xs text-muted-foreground">• {distance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

