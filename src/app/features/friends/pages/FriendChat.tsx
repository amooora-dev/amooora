import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/components';
import { MessageBubble } from '../components/MessageBubble';
import { ChatComposer } from '../components/ChatComposer';
import { getProfileById } from '../services/friends';
import { getMessages, sendMessage, makePairKey } from '../services/messages';
import type { FriendProfile } from '../types';
import type { FriendMessage } from '../types';
import { supabase } from '../../../infra/supabase';
import { toast } from 'sonner';

interface FriendChatProps {
  friendId: string;
  onNavigate: (page: string) => void;
  onBack: () => void;
}

function formatDateLabel(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  if (d.getTime() === today.getTime()) return 'Hoje';
  if (d.getTime() === yesterday.getTime()) return 'Ontem';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
}

export function FriendChat({ friendId, onNavigate, onBack }: FriendChatProps) {
  const [profile, setProfile] = useState<FriendProfile | null>(null);
  const [messages, setMessages] = useState<FriendMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !friendId) {
        if (mounted) setLoading(false);
        return;
      }
      setCurrentUserId(user.id);
      const pairKey = makePairKey(user.id, friendId);
      const [profileData, messagesData] = await Promise.all([
        getProfileById(friendId),
        getMessages(pairKey),
      ]);
      if (mounted) {
        setProfile(profileData ?? null);
        setMessages(messagesData ?? []);
      }
      if (mounted) setLoading(false);
    }

    load();
    return () => { mounted = false; };
  }, [friendId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (body: string) => {
    if (!currentUserId || !friendId || !body.trim()) return;
    setSending(true);
    const pairKey = makePairKey(currentUserId, friendId);
    const { ok, error } = await sendMessage(pairKey, friendId, body.trim());
    if (ok) {
      const list = await getMessages(pairKey);
      setMessages(list);
      scrollToBottom();
    } else {
      toast.error(error ?? 'Não foi possível enviar');
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-muted flex flex-col items-center justify-center px-6">
        <p className="text-muted-foreground text-center mb-4">Perfil não encontrado.</p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium"
        >
          Voltar
        </button>
      </div>
    );
  }

  const groupedMessages = messages.reduce<{ dateLabel: string; items: FriendMessage[] }[]>((acc, msg) => {
    const dateLabel = formatDateLabel(new Date(msg.created_at));
    const last = acc[acc.length - 1];
    if (last && last.dateLabel === dateLabel) {
      last.items.push(msg);
    } else {
      acc.push({ dateLabel, items: [msg] });
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <div className="max-w-md mx-auto w-full bg-white shadow-xl flex flex-col flex-1 min-h-0">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate(`view-profile:${friendId}`)}
            className="flex flex-1 items-center gap-3 min-w-0"
          >
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-100">
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
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"
                aria-hidden
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-gray-900 truncate">{profile.name}</h1>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </button>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Ligar"
            >
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Vídeo"
            >
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Mais opções"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <p className="text-muted-foreground text-sm">
                Ainda não há mensagens com {profile.name}. Envie a primeira!
              </p>
            </div>
          ) : (
            groupedMessages.map((group) => (
              <div key={group.dateLabel} className="mb-4">
                <div className="flex justify-center mb-3">
                  <span className="px-3 py-1 rounded-full bg-gray-200/80 text-gray-600 text-xs font-medium">
                    {group.dateLabel}
                  </span>
                </div>
                {group.items.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.sender_id === currentUserId}
                  />
                ))}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatComposer
          onSend={handleSend}
          disabled={sending}
          placeholder="Digite sua mensagem..."
        />
      </div>
    </div>
  );
}
