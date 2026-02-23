import { ImageWithFallback } from '../../../shared/components';
import type { FriendProfile } from '../types';

export interface FriendCardProps {
  friend: FriendProfile;
  /** Texto abaixo do nome (ex.: última mensagem ou cidade) */
  subtitle?: string;
  /** Data/hora à direita (ex.: "10:30", "Ontem", "Seg") */
  timestamp?: string;
  /** Número de não lidas; se > 0, mostra badge roxa */
  unreadCount?: number;
  /** Mostrar indicador verde de online no avatar */
  online?: boolean;
  onViewProfile: () => void;
}

export function FriendCard({
  friend,
  subtitle,
  timestamp,
  unreadCount = 0,
  online = false,
  onViewProfile,
}: FriendCardProps) {
  const displaySubtitle = subtitle ?? friend.city ?? 'Toque para ver perfil';

  return (
    <button
      type="button"
      onClick={onViewProfile}
      className="w-full flex items-center gap-4 py-4 text-left border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 active:bg-gray-100/50 transition-colors"
    >
      {/* Avatar + indicador online */}
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100">
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
        {online && (
          <span
            className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white"
            aria-hidden
          />
        )}
      </div>

      {/* Nome + preview */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 truncate">{friend.name}</h3>
        <p className="text-sm text-gray-500 truncate">{displaySubtitle}</p>
      </div>

      {/* Data/hora + badge */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {timestamp && (
          <span className="text-xs text-gray-400">{timestamp}</span>
        )}
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#932d6f] text-white text-xs font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
    </button>
  );
}
