import { MapPin } from 'lucide-react';
import bannerImage from '../../assets/1a3859e663256aaf6dcb0c3a27f99604e994917b.png';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

interface SimpleMapProps {
  places?: Place[];
  center?: { lat: number; lng: number };
}

export function SimpleMap({ places = [] }: SimpleMapProps) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative bg-gray-100">
      {/* Banner com imagem */}
      <div className="w-full">
        <img 
          src={bannerImage} 
          alt="Ver mapa ampliado" 
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
}