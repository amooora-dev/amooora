import { UserPlus, Check, Clock } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components';
import type { FriendProfile } from '../types';
import type { ConnectionStatus } from '../types';

interface UserSearchCardProps {
  profile: FriendProfile;
  status: ConnectionStatus;
  onConnect: () => void;
  onViewProfile: () => void;
}

export function UserSearchCard({ profile, status, onConnect, onViewProfile }: UserSearchCardProps) {
  const buttonContent = () => {
    if (status === 'accepted') return { text: 'Já é amiga', icon: Check, disabled: true };
    if (status === 'pending_sent') return { text: 'Solicitação enviada', icon: Clock, disabled: true };
    return { text: 'Conectar', icon: UserPlus, disabled: false };
  };
  const { text, icon: Icon, disabled } = buttonContent();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden p-4 flex items-center gap-4">
      <button
        type="button"
        onClick={onViewProfile}
        className="flex items-center gap-4 flex-1 min-w-0 text-left"
      >
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
          {profile.avatar ? (
            <ImageWithFallback
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#932d6f] to-[#dca0c8] text-white font-bold">
              {profile.name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{profile.name}</h3>
          {profile.city && (
            <p className="text-xs text-muted-foreground truncate">{profile.city}</p>
          )}
        </div>
      </button>
      <button
        type="button"
        onClick={() => !disabled && onConnect()}
        disabled={disabled}
        className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
          disabled
            ? 'bg-muted text-muted-foreground cursor-default'
            : 'bg-primary/10 text-primary hover:bg-primary/20'
        }`}
      >
        <Icon className="w-4 h-4" />
        {text}
      </button>
    </div>
  );
}
