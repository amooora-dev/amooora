import { Clock, MapPin, Users, Heart } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components';
import { useFavorites } from '../../../shared/hooks';

interface EventCardProps {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  imageUrl: string;
  onClick?: () => void;
}

export function EventCard({ id, name, date, time, location, participants, imageUrl, onClick }: EventCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite('events', id);

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-border/50 hover:shadow-md transition-shadow mb-3 cursor-pointer relative"
    >
      {/* Botão de favoritos */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite('events', id);
        }}
        className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            favorite ? 'fill-[#932d6f] text-[#932d6f]' : 'text-gray-400'
          }`}
        />
      </button>

      <div className="flex gap-3 p-3">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <ImageWithFallback 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{name}</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{participants} participantes</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className="bg-[#F8F0ED] text-[#B05E3D] px-3 py-1.5 rounded-full text-xs font-bold">
            {date}
          </span>
        </div>
      </div>
    </div>
  );
}