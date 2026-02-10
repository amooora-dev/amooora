import { ImageWithFallback } from '../../../shared/components';
import type { FriendRequest } from '../types';

interface RequestCardProps {
  request: FriendRequest;
  variant: 'received' | 'sent';
  onAccept?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onCancel?: (requestId: string) => void;
  onViewProfile?: (userId: string) => void;
}

export function RequestCard({
  request,
  variant,
  onAccept,
  onReject,
  onCancel,
  onViewProfile,
}: RequestCardProps) {
  const profile = variant === 'received' ? request.requester : request.addressee;
  const p = profile as { id: string; name: string; avatar?: string; city?: string } | undefined;
  const name = p?.name ?? 'Usuária';
  const avatar = p?.avatar;
  const city = p?.city;
  const userId = p?.id ?? (variant === 'received' ? request.requester_id : request.addressee_id);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden p-4">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => onViewProfile?.(userId)}
        onKeyDown={(e) => e.key === 'Enter' && onViewProfile?.(userId)}
        role="button"
        tabIndex={0}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
          {avatar ? (
            <ImageWithFallback src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#932d6f] to-[#dca0c8] text-white font-bold">
              {name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{name}</h3>
          {city && <p className="text-xs text-muted-foreground truncate">{city}</p>}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {variant === 'received' && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAccept?.(request.id);
              }}
              className="flex-1 min-w-[100px] px-3 py-2 rounded-xl bg-[#932d6f] text-white text-sm font-medium hover:bg-[#83285f] transition-colors"
            >
              Aceitar
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReject?.(request.id);
              }}
              className="flex-1 min-w-[100px] px-3 py-2 rounded-xl border border-gray-200 text-muted-foreground text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Recusar
            </button>
          </>
        )}
        {variant === 'sent' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.(request.id);
            }}
            className="px-3 py-2 rounded-xl border border-gray-200 text-muted-foreground text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar solicitação
          </button>
        )}
      </div>
    </div>
  );
}
