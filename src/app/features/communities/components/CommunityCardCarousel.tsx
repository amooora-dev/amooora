import { Users, MessageCircle, Star } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components';

export interface CommunityCard {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  icon?: React.ReactNode;
  membersCount: number;
  postsCount?: number;
}

interface CommunityCardCarouselProps {
  communities: CommunityCard[];
  onCommunityClick?: (communityId: string) => void;
  onJoinClick?: (communityId: string) => void;
  onViewAll?: () => void;
}

export function CommunityCardCarousel({ 
  communities, 
  onCommunityClick,
  onJoinClick,
  onViewAll
}: CommunityCardCarouselProps) {
  return (
    <div className="px-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5" style={{ color: '#c4532f' }} />
        <h2 className="text-xl font-bold text-gray-900">Em destaque</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
        {communities.map((community) => (
          <div
            key={community.id}
            className="flex-shrink-0 w-[280px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            {/* Imagem do card */}
            <div className="relative w-full h-40 overflow-hidden">
              <ImageWithFallback
                src={community.imageUrl}
                alt={community.name}
                className="w-full h-full object-cover"
              />
              {/* Overlay escuro no fundo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              {/* Ícone circular sobreposto na parte inferior esquerda */}
              <div className="absolute bottom-3 left-3 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                {community.icon || (
                  <MessageCircle className="w-6 h-6 text-white" />
                )}
              </div>
            </div>

            {/* Conteúdo do card */}
            <div className="p-4">
              {/* Nome e descrição */}
              <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                {community.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {community.description}
              </p>

              {/* Botões de ação */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {/* Botão de membros */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors relative z-10"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    {community.membersCount >= 1000
                      ? `${(community.membersCount / 1000).toFixed(1)}k`
                      : community.membersCount}
                  </span>
                </button>

                {/* Botão Entrar */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onCommunityClick?.(community.id);
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-full text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Entrar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
