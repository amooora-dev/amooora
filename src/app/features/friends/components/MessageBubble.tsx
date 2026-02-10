import type { FriendMessage } from '../types';

interface MessageBubbleProps {
  message: FriendMessage;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
          isOwn
            ? 'bg-[#932d6f] text-white rounded-br-md'
            : 'bg-muted text-foreground rounded-bl-md'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.body}</p>
        <p
          className={`text-xs mt-1 ${isOwn ? 'text-white/80' : 'text-muted-foreground'}`}
        >
          {new Date(message.created_at).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
