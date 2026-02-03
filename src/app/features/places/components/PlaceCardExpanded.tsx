import { Star, MapPin, ArrowRight, Heart } from 'lucide-react';
import { ImageWithFallback, Badge, Tag } from '../../../shared/components';
import { useFavorites } from '../../../shared/hooks';

interface PlaceCardExpandedProps {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  distance: string;
  address: string;
  imageUrl: string;
  tags: Array<{ label: string; color: string }>;
  isSafe?: boolean;
  onClick?: () => void;
}

export function PlaceCardExpanded({
  id,
  name,
  description,
  rating,
  reviewCount,
  distance,
  address,
  imageUrl,
  tags,
  isSafe = true,
  onClick,
}: PlaceCardExpandedProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite('places', id);

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border/50 hover:shadow-md transition-shadow cursor-pointer relative"
    >
      {/* Imagem */}
      <div className="relative h-52 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        {isSafe && (
          <div className="absolute top-3 left-3">
            <Badge variant="primary">Seguro</Badge>
          </div>
        )}
        {/* Botão de favoritos */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite('places', id);
          }}
          className="absolute top-3 right-3 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-5 h-5 transition-colors ${
            favorite ? 'fill-[#932d6f] text-[#932d6f]' : 'text-gray-400'
          }`} />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        {/* Nome e descrição */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-foreground mb-1">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Rating e distância */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium text-foreground">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{distance}</span>
          </div>
        </div>

        {/* Endereço */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <span className="text-sm text-muted-foreground">{address}</span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Tag key={index} color={tag.color}>
                {tag.label}
              </Tag>
            ))}
          </div>
        )}

        {/* Botão Ver Local - mantido para indicar ação, mas card inteiro já é clicável */}
        <div className="w-full bg-white border border-[#932d6f] text-[#932d6f] font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 pointer-events-none">
          Ver Local
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

