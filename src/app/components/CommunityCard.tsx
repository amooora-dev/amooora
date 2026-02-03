import { Star, Users } from 'lucide-react';
import { ImageWithFallback } from '../shared/components';

export interface CommunityCardData {
  id: string;
  name: string;
  avatar: string;
  description?: string;
  membersCount?: number;
  postsCount?: number;
  rating?: number;
  category?: string;
}

interface CommunityCardProps {
  community: CommunityCardData;
  onClick?: () => void;
}

export function CommunityCard({ community, onClick }: CommunityCardProps) {
  const { name, avatar, description, membersCount, rating } = community;
  
  // Formatar número de membros
  const formatMembers = (count?: number) => {
    if (!count) return '0 membros';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K+ membros`;
    return `${count} membros`;
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border/50 hover:shadow-md transition-shadow cursor-pointer relative flex flex-col"
    >
      {/* Imagem de fundo */}
      <div className="relative h-40 overflow-hidden">
        <ImageWithFallback 
          src={avatar} 
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Overlay escuro para melhorar legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        
        {/* Conteúdo sobre a imagem */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-2">{name}</h3>
          <div className="flex items-center gap-1.5 text-white flex-wrap">
            {rating !== undefined && (
              <>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                <span className="text-sm font-semibold">{rating}</span>
              </>
            )}
            {membersCount !== undefined && (
              <>
                <span className="text-sm">•</span>
                <span className="text-xs">({formatMembers(membersCount)})</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Botão "Ver Comunidade" */}
      <div className="p-3 flex-1 flex items-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="w-full px-3 py-2 bg-white border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5 text-sm"
        >
          <span>Abrir</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
