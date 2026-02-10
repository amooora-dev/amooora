import { useState, useEffect } from 'react';
import { Calendar, Heart, MessageCircle, MapPin, UserPlus, Star, Briefcase, Users, AlertCircle, X } from 'lucide-react';
import { Header } from '../shared/components';
import { useAdmin } from '../shared/hooks';
import { getRequestsReceived } from '../features/friends';

interface Notification {
  id: string;
  type: 'event' | 'like' | 'comment' | 'place' | 'follower' | 'review' | 'service' | 'community' | 'reminder' | 'cancelled' | 'friend_request';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  icon: React.ReactNode;
  iconColor: string;
  /** Ao clicar, navega para esta página (ex.: friends-requests) */
  navigateTo?: string;
}

interface NotificacoesProps {
  onNavigate: (page: string) => void;
}

export function Notificacoes({ onNavigate }: NotificacoesProps) {
  const { isAdmin } = useAdmin();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('unread');
  const [connectionRequestNotifications, setConnectionRequestNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getRequestsReceived().then((received) => {
      const items: Notification[] = received.map((req) => {
        const name = (req.requester as { name?: string })?.name ?? 'Alguém';
        return {
          id: `friend_request_${req.id}`,
          type: 'friend_request' as const,
          title: 'Novo pedido de conexão',
          description: `${name} quer conectar com você`,
          timestamp: 'Agora',
          isRead: false,
          icon: <UserPlus className="w-5 h-5" />,
          iconColor: 'bg-primary',
          navigateTo: 'friends-requests',
        };
      });
      setConnectionRequestNotifications(items);
    }).catch(() => setConnectionRequestNotifications([]));
  }, []);

  // Dados mockados de notificações
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'event',
      title: 'Novo evento próximo',
      description: 'Sarau Sáfico acontece amanhã no Centro Cultural. Não perca!',
      timestamp: 'Há 5 minutos',
      isRead: false,
      icon: <Calendar className="w-5 h-5" />,
      iconColor: 'bg-accent',
    },
    {
      id: '2',
      type: 'like',
      title: 'Ana curtiu sua avaliação',
      description: 'Ana curtiu sua avaliação do Café da Vila',
      timestamp: 'Há 15 minutos',
      isRead: false,
      icon: <Heart className="w-5 h-5" />,
      iconColor: 'bg-accent',
    },
    {
      id: '3',
      type: 'comment',
      title: 'Novo comentário',
      description: 'Marina comentou: "Adorei essa indicação! Vou conhecer..."',
      timestamp: 'Há 1 hora',
      isRead: false,
      icon: <MessageCircle className="w-5 h-5" />,
      iconColor: 'bg-primary',
    },
    {
      id: '4',
      type: 'place',
      title: 'Novo lugar seguro próximo',
      description: 'Bar da Lua foi adicionado como lugar seguro na sua região',
      timestamp: 'Há 2 horas',
      isRead: true,
      icon: <MapPin className="w-5 h-5" />,
      iconColor: 'bg-primary',
    },
    {
      id: '5',
      type: 'follower',
      title: 'Nova seguidora',
      description: 'Júlia começou a seguir você',
      timestamp: 'Há 3 horas',
      isRead: true,
      icon: <UserPlus className="w-5 h-5" />,
      iconColor: 'bg-accent',
    },
    {
      id: '6',
      type: 'review',
      title: 'Avaliação recebida',
      description: 'Você recebeu 5 estrelas no seu perfil de terapeuta',
      timestamp: 'Há 5 horas',
      isRead: true,
      icon: <Star className="w-5 h-5" />,
      iconColor: 'bg-primary',
    },
    {
      id: '7',
      type: 'service',
      title: 'Novo serviço disponível',
      description: 'Advocacia Feminista agora aceita novos atendimentos',
      timestamp: 'Há 8 horas',
      isRead: true,
      icon: <Briefcase className="w-5 h-5" />,
      iconColor: 'bg-primary',
    },
    {
      id: '8',
      type: 'community',
      title: 'Atividade na comunidade',
      description: '12 novas publicações no tópico "Lugares LGBTQIA+ friendly"',
      timestamp: 'Ontem',
      isRead: true,
      icon: <Users className="w-5 h-5" />,
      iconColor: 'bg-accent',
    },
    {
      id: '9',
      type: 'reminder',
      title: 'Lembrete importante',
      description: 'Confirme sua presença no evento de amanhã',
      timestamp: 'Ontem',
      isRead: true,
      icon: <AlertCircle className="w-5 h-5" />,
      iconColor: 'bg-secondary',
    },
    {
      id: '10',
      type: 'cancelled',
      title: 'Evento cancelado',
      description: 'O evento "Roda de Conversa" foi cancelado. Reembolso disponível.',
      timestamp: '2 dias atrás',
      isRead: true,
      icon: <Calendar className="w-5 h-5" />,
      iconColor: 'bg-accent',
    },
  ];

  const allNotifications = [...connectionRequestNotifications, ...mockNotifications];
  const unreadCount = allNotifications.filter(n => !n.isRead).length;
  const filteredNotifications = activeFilter === 'unread' 
    ? allNotifications.filter(n => !n.isRead)
    : allNotifications;

  const handleMarkAllAsRead = () => {
    // TODO: Implementar quando tiver backend
    console.log('Marcar todas como lidas');
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={() => onNavigate('home')} />
        
        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Page Header */}
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
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-muted text-foreground'
                    : 'text-primary hover:text-primary/80'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setActiveFilter('unread')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors relative ${
                  activeFilter === 'unread'
                    ? 'bg-muted text-foreground'
                    : 'text-primary hover:text-primary/80'
                }`}
              >
                Não lidas
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Lista de Notificações */}
          <div className="px-5 space-y-0">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  role={notification.navigateTo ? 'button' : undefined}
                  onClick={() => notification.navigateTo && onNavigate(notification.navigateTo)}
                  className={`flex items-start gap-3 py-4 border-b border-border last:border-b-0 ${notification.navigateTo ? 'cursor-pointer hover:bg-muted/50 active:bg-muted' : ''}`}
                >
                  {/* Ícone */}
                  <div className={`${notification.iconColor} rounded-full w-10 h-10 flex items-center justify-center text-white flex-shrink-0`}>
                    {notification.icon}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{notification.description}</p>
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                  </div>

                  {/* Indicador de não lida */}
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Nenhuma notificação encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
