import { useState } from 'react';
import { Header, BottomNav, EmptyState, SkeletonListExpanded } from '../../../shared/components';
import { UserPlus, Users, Send } from 'lucide-react';
import { useAdmin } from '../../../shared/hooks';
import { useFriends } from '../hooks/useFriends';
import { useFriendRequests } from '../hooks/useFriendRequests';
import { FriendCard } from '../components/FriendCard';
import { RequestCard } from '../components/RequestCard';
import { acceptRequest, rejectRequest, cancelRequest } from '../services/friends';
import { toast } from 'sonner';

interface AmigosProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
  /** Abrir direto na aba Solicitações (ex.: ao clicar em notificação de pedido de conexão) */
  initialTab?: 'amigos' | 'solicitacoes';
}

type Tab = 'amigos' | 'solicitacoes';

export function Amigos({ onNavigate, onBack, initialTab = 'amigos' }: AmigosProps) {
  const { isAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const { friends, loading: friendsLoading, refetch: refetchFriends } = useFriends();
  const { sent, received, loading: requestsLoading, refetch: refetchRequests } = useFriendRequests();

  const handleAccept = async (requestId: string) => {
    const { ok, error } = await acceptRequest(requestId);
    if (ok) {
      toast.success('Conexão aceita');
      refetchFriends();
      refetchRequests();
    } else {
      toast.error(error ?? 'Não foi possível aceitar');
    }
  };

  const handleReject = async (requestId: string) => {
    if (!window.confirm('Tem certeza que deseja recusar esta solicitação?')) return;
    const { ok, error } = await rejectRequest(requestId);
    if (ok) {
      toast.success('Solicitação recusada');
      refetchRequests();
    } else {
      toast.error(error ?? 'Não foi possível recusar');
    }
  };

  const handleCancel = async (requestId: string) => {
    if (!window.confirm('Cancelar esta solicitação?')) return;
    const { ok, error } = await cancelRequest(requestId);
    if (ok) {
      toast.success('Solicitação cancelada');
      refetchRequests();
    } else {
      toast.error(error ?? 'Não foi possível cancelar');
    }
  };

  const loading = activeTab === 'amigos' ? friendsLoading : requestsLoading;

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />

        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-semibold text-primary mb-4">Amigos</h1>

            {/* Tabs */}
            <div className="flex rounded-xl bg-muted p-1 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('amigos')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'amigos'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Amigos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('solicitacoes')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'solicitacoes'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Solicitações
              </button>
            </div>

            {/* CTA Conectar - abre busca (pessoas, comunidades, locais, eventos) */}
            <button
              type="button"
              onClick={() => onNavigate('busca')}
              className="w-full mb-6 py-3 rounded-xl bg-primary/10 text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Conectar com alguém
            </button>
          </div>

          <div className="px-5 pb-6">
            {activeTab === 'amigos' && (
              <>
                {loading ? (
                  <SkeletonListExpanded count={4} />
                ) : friends.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="Você ainda não conectou com ninguém"
                    description="Que tal começar? Convide alguém para ser sua amiga."
                    action={{
                      label: 'Conectar com alguém',
                      onClick: () => onNavigate('busca'),
                    }}
                  />
                ) : (
                  <div className="space-y-3">
                    {friends.map((friend) => (
                      <FriendCard
                        key={friend.id}
                        friend={friend}
                        onViewProfile={() => onNavigate(`view-profile:${friend.id}`)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'solicitacoes' && (
              <>
                {loading ? (
                  <SkeletonListExpanded count={3} />
                ) : received.length === 0 && sent.length === 0 ? (
                  <EmptyState
                    icon={Send}
                    title="Nenhuma solicitação por aqui"
                    description="Quando você enviar ou receber pedidos de conexão, eles aparecerão aqui."
                  />
                ) : (
                  <div className="space-y-6">
                    {received.length > 0 && (
                      <div>
                        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                          Recebidas
                        </h2>
                        <div className="space-y-3">
                          {received.map((req) => (
                            <RequestCard
                              key={req.id}
                              request={req}
                              variant="received"
                              onAccept={handleAccept}
                              onReject={handleReject}
                              onViewProfile={(id) => onNavigate(`view-profile:${id}`)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {sent.length > 0 && (
                      <div>
                        <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                          Enviadas
                        </h2>
                        <div className="space-y-3">
                          {sent.map((req) => (
                            <RequestCard
                              key={req.id}
                              request={req}
                              variant="sent"
                              onCancel={handleCancel}
                              onViewProfile={(id) => onNavigate(`view-profile:${id}`)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <BottomNav activeItem="profile" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
