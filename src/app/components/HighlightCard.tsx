import { LucideIcon } from 'lucide-react';
import { ImageWithFallback } from '../shared/components';

interface HighlightCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function HighlightCard({ title, subtitle, imageUrl, icon: Icon, onClick }: HighlightCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-[280px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
    >
      {/* Imagem */}
      <div className="relative w-full h-44 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Overlay gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
        {/* Ícone no canto superior direito */}
        <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      
      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base line-clamp-2 mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-gray-600 line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
