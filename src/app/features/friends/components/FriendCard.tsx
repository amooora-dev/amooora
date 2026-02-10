import { ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components';
import type { FriendProfile } from '../types';

interface FriendCardProps {
  friend: FriendProfile;
  onViewProfile: () => void;
}

export function FriendCard({ friend, onViewProfile }: FriendCardProps) {
  return (
    <div
      onClick={onViewProfile}
      className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4 p-4"
    >
      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
        {friend.avatar ? (
          <ImageWithFallback
            src={friend.avatar}
            alt={friend.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#932d6f] to-[#dca0c8] text-white text-xl font-bold">
            {friend.name?.charAt(0).toUpperCase() || '?'}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">{friend.name}</h3>
        {friend.city && (
          <p className="text-xs text-muted-foreground truncate">{friend.city}</p>
        )}
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onViewProfile();
        }}
        className="p-2 rounded-full text-primary hover:bg-primary/10 transition-colors"
        aria-label="Ver perfil"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
