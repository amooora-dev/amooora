import { Star, MapPin, User, Heart, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../shared/components';
import { Tag } from './Tag';
import { useFavorites } from '../shared/hooks';

interface ServiceCardExpandedProps {
  id: string;
  name: string;
  description: string;
  provider: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: string;
  imageUrl: string;
  onClick?: () => void;
}

export function ServiceCardExpanded({
  id,
  name,
  description,
  provider,
  category,
  rating,
  reviewCount,
  price,
  imageUrl,
  onClick,
}: ServiceCardExpandedProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite('services', id);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border/50 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Imagem com badges */}
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <Tag color="#932d6f">{category}</Tag>
        </div>
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite('services', id);
          }}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-5 h-5 ${
              favorite ? 'fill-accent text-accent' : 'text-muted-foreground'
            }`}
          />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        {/* Nome */}
        <div className="mb-2">
          <h3 className="font-semibold text-lg text-primary">{name}</h3>
        </div>

        {/* Descrição */}
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {/* Informações */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-sm text-foreground">{provider}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-sm text-foreground">
              {rating} ({reviewCount} avaliações)
            </span>
          </div>
        </div>

        {/* Footer: Preço e botão */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Preço</p>
            <p className="font-semibold text-lg text-foreground">{price}</p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="px-6 py-3 bg-white border border-[#932d6f] text-[#932d6f] rounded-full font-medium hover:bg-[#932d6f]/5 transition-colors flex items-center gap-2"
          >
            Ver Detalhes
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
