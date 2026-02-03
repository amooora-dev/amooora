import { Calendar, Clock, MapPin, Users, Heart, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../shared/components';
import { Badge } from './Badge';
import { useFavorites } from '../shared/hooks';

interface EventCardExpandedProps {
  id: string;
  name: string;
  description: string;
  date: string;
  fullDate: string;
  time: string;
  location: string;
  participants: string;
  imageUrl: string;
  category: {
    label: string;
    color: string;
  };
  price: string;
  isPaid?: boolean;
  onClick?: () => void;
}

export function EventCardExpanded({
  id,
  name,
  description,
  date,
  fullDate,
  time,
  location,
  participants,
  imageUrl,
  category,
  price,
  isPaid = false,
  onClick,
}: EventCardExpandedProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite('events', id);

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
        {/* Date badge - estilo tag bege com texto laranja/vermelho-escuro */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#F8F0ED] text-[#B05E3D] px-3 py-1.5 rounded-full text-xs font-bold">
            {date}
          </span>
        </div>
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite('events', id);
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
        {/* Nome e categoria */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-lg text-primary flex-1">{name}</h3>
          <Badge variant="accent">{category.label}</Badge>
        </div>

        {/* Descrição */}
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {/* Informações */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-sm text-foreground">{fullDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-sm text-foreground">{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-sm text-foreground">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-sm text-foreground">{participants}</span>
          </div>
        </div>

        {/* Footer: Entrada e botão */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Entrada</p>
            <p
              className={`font-semibold text-lg ${
                isPaid ? 'text-foreground' : 'text-secondary'
              }`}
            >
              {price}
            </p>
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