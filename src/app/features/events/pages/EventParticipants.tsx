import { ArrowLeft, Users } from 'lucide-react';
import { Header, BottomNav, ImageWithFallback } from '../../../shared/components';
import { useEventParticipants } from '../hooks/useEventParticipants';
import { useEvent } from '../hooks/useEvents';

interface EventParticipantsProps {
  eventId?: string;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function EventParticipants({ eventId, onNavigate, onBack }: EventParticipantsProps) {
  const { participants, count, loading } = useEventParticipants(eventId);
  const { event } = useEvent(eventId);

  const handleParticipantClick = (userId: string) => {
    onNavigate?.(`view-profile:${userId}`);
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <Header onNavigate={onNavigate} showBackButton onBack={onBack} />

        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-semibold text-primary mb-2">
              {event?.name || 'Evento'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Users className="w-4 h-4" />
              <span>{count} {count === 1 ? 'participante confirmado' : 'participantes confirmados'}</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : participants.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum participante confirmado ainda</p>
            </div>
          ) : (
            <div className="px-5 space-y-3 pb-6">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  onClick={() => handleParticipantClick(participant.user_id)}
                  className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <ImageWithFallback
                    src={participant.profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTcwMTY1NzYwMHww&ixlib=rb-4.1.0&q=80&w=1080'}
                    alt={participant.profile.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{participant.profile.name}</h3>
                    {participant.profile.bio && (
                      <p className="text-sm text-gray-600 line-clamp-1">{participant.profile.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomNav activeItem="events" onItemClick={onNavigate!} />
      </div>
    </div>
  );
}
