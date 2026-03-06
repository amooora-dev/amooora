import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { Header } from '../shared/components';
import { useAdmin } from '../shared/hooks';
import { useProfile } from '../hooks/useProfile';
import { getProfileById, getRecentMessagesReceived } from '../features/friends';

/** Apenas mensagens de amigos e (futuramente) respostas a publicações. */
interface Notification {
  id: string;
  type: 'friend_message' | 'post_reply';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  icon: React.ReactNode;
  iconColor: string;
  navigateTo?: string;
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `Há ${diffMins} min`;
  if (diffHours < 24) return `Há ${diffHours}h`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

interface NotificacoesProps {
  onNavigate: (page: string) => void;
}

export function Notificacoes({ onNavigate }: NotificacoesProps) {
  const { isAdmin } = useAdmin();
  const { profile } = useProfile();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('unread');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!profile?.id) {
      setLoading(false);
      setNotifications([]);
      return;
    }

    const items: Notification[] = [];

    try {
      const recentSenders = await getRecentMessagesReceived(profile.id);

      const senderNames = await Promise.all(
        recentSenders.map((s) =>
          getProfileById(s.senderId).then((p) => ({
            senderId: s.senderId,
            name: p?.name ?? 'Amiga',
            lastMessageAt: s.lastMessageAt,
          }))
        )
      );
      senderNames.forEach(({ senderId, name, lastMessageAt }) => {
        const ts = lastMessageAt ? new Date(lastMessageAt) : new Date();
        if (Number.isNaN(ts.getTime())) return;
        items.push({
          id: `friend_message_${senderId}`,
          type: 'friend_message',
          title: 'Nova mensagem de amiga',
          description: `${name} enviou uma mensagem`,
          timestamp: formatTimestamp(ts),
          isRead: false,
          icon: <MessageCircle className="w-5 h-5" />,
          iconColor: 'bg-primary',
          navigateTo: `friend-chat:${senderId}`,
        });
      });

      setNotifications(items);
    } catch (e) {
      console.error('[Notificacoes] load error', e);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications =
    activeFilter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (n: Notification) => {
    handleMarkAsRead(n.id);
    if (n.navigateTo) onNavigate(n.navigateTo);
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={() => onNavigate('home')} />

        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          <div className="px-5 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Notificações</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-foreground mt-1">{unreadCount} novas</p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'all' ? 'bg-muted text-foreground' : 'text-primary hover:text-primary/80'
                }`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('unread')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors relative ${
                  activeFilter === 'unread' ? 'bg-muted text-foreground' : 'text-primary hover:text-primary/80'
                }`}
              >
                Não lidas
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {activeFilter === 'all' && (
            <div className="px-5 pb-3">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  As notificações são apagadas após 2 semanas.
                </p>
              </div>
            </div>
          )}

          <div className="px-5 space-y-0">
            {loading ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground text-sm">Carregando notificações...</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full flex items-start gap-3 py-4 border-b border-border last:border-b-0 text-left hover:bg-muted/50 active:bg-muted transition-colors"
                >
                  <div
                    className={`${notification.iconColor} rounded-full w-10 h-10 flex items-center justify-center text-white flex-shrink-0`}
                  >
                    {notification.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{notification.description}</p>
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                  )}
                </button>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground text-sm">
                  Você não possui notificações em destaque
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
