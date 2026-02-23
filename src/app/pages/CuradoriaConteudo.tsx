import { useState, useEffect } from 'react';
import { MapPin, Calendar, Scissors, Check, X, Loader2 } from 'lucide-react';
import { Header } from '../shared/components';
import { useAdmin } from '../shared/hooks';
import { ImageWithFallback } from '../shared/components';
import {
  getPendingPlaces,
  getPendingEvents,
  getPendingServices,
  curationApproveOrReject,
  type PendingPlace,
  type PendingEvent,
  type PendingService,
} from '../services/curation';
import { toast } from 'sonner';

interface CuradoriaConteudoProps {
  onNavigate: (page: string) => void;
}

type TabType = 'places' | 'events' | 'services';

export function CuradoriaConteudo({ onNavigate }: CuradoriaConteudoProps) {
  const { canCurationPlaces, canCurationEvents, canCurationServices, canAccessCuration, loading: adminLoading } = useAdmin();
  // Aba inicial: priorizar Locais
  const [activeTab, setActiveTab] = useState<TabType>('places');
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<PendingPlace[]>([]);
  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [services, setServices] = useState<PendingService[]>([]);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadPending = async () => {
    setLoading(true);
    try {
      const [placesData, eventsData, servicesData] = await Promise.all([
        getPendingPlaces(),
        getPendingEvents(),
        getPendingServices(),
      ]);
      setPlaces(placesData);
      setEvents(eventsData);
      setServices(servicesData);
    } catch {
      toast.error('Erro ao carregar itens pendentes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canAccessCuration) loadPending();
  }, [canAccessCuration]);

  const handleApproveReject = async (
    table: 'places' | 'events' | 'services',
    id: string,
    approve: boolean
  ) => {
    setActionId(id);
    const result = await curationApproveOrReject(table, id, approve);
    setActionId(null);
    if (result.ok) {
      toast.success(approve ? 'Conteúdo aprovado' : 'Conteúdo reprovado');
      loadPending();
    } else {
      toast.error(result.error ?? 'Erro ao processar');
    }
  };

  // Quem acessa a página já é admin (menu Curadoria). Sempre mostrar as 3 abas para poder ver locais, eventos e serviços pendentes.
  const tabs: { id: TabType; label: string; icon: typeof MapPin }[] = [
    { id: 'places', label: 'Locais', icon: MapPin },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'services', label: 'Serviços', icon: Scissors },
  ];

  const currentList =
    activeTab === 'places'
      ? places
      : activeTab === 'events'
        ? events
        : services;

  // Só redirecionar para home se o hook já carregou e o usuário não tem acesso
  if (!adminLoading && !canAccessCuration) {
    onNavigate('home');
    return null;
  }

  // Enquanto carrega permissões, mostrar loading para não piscar ou redirecionar por engano
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col items-center justify-center">
          <Header onNavigate={onNavigate} isAdmin={true} showBackButton onBack={() => onNavigate('home')} />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        <Header
          onNavigate={onNavigate}
          isAdmin={true}
          showBackButton
          onBack={() => onNavigate('home')}
        />
        <div className="px-5 pt-4 pb-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Curadoria de conteúdo</h2>

          {tabs.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : currentList.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground px-4">
              <p className="font-medium">Nenhum conteúdo pendente nesta aba</p>
              <p className="text-sm mt-1">
                {activeTab === 'places' && 'Não há locais aguardando aprovação.'}
                {activeTab === 'events' && 'Não há eventos aguardando aprovação.'}
                {activeTab === 'services' && 'Não há serviços aguardando aprovação.'}
              </p>
              {(activeTab === 'services' || activeTab === 'events') ? (
                <p className="text-sm mt-3 text-primary/80">
                  Toque na aba <strong>Locais</strong> para ver locais pendentes de aprovação.
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'places' &&
                places.map((item) => (
                  <div
                    key={item.id}
                    className="border border-border rounded-xl overflow-hidden bg-white"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <ImageWithFallback
                          src={item.image || ''}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                        {item.creator_name && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Por: {item.creator_name}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleApproveReject('places', item.id, true)}
                            disabled={actionId === item.id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-800 text-sm font-medium hover:bg-green-200 disabled:opacity-50"
                          >
                            {actionId === item.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            Aprovar
                          </button>
                          <button
                            onClick={() => handleApproveReject('places', item.id, false)}
                            disabled={actionId === item.id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-800 text-sm font-medium hover:bg-red-200 disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reprovar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {activeTab === 'events' &&
                events.map((item) => (
                  <div
                    key={item.id}
                    className="border border-border rounded-xl overflow-hidden bg-white"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <ImageWithFallback
                          src={item.image || ''}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.location} · {item.category}
                        </p>
                        {item.creator_name && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Por: {item.creator_name}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleApproveReject('events', item.id, true)}
                            disabled={actionId === item.id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-800 text-sm font-medium hover:bg-green-200 disabled:opacity-50"
                          >
                            {actionId === item.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            Aprovar
                          </button>
                          <button
                            onClick={() => handleApproveReject('events', item.id, false)}
                            disabled={actionId === item.id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-800 text-sm font-medium hover:bg-red-200 disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reprovar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {activeTab === 'services' &&
                services.map((item) => (
                  <div
                    key={item.id}
                    className="border border-border rounded-xl overflow-hidden bg-white"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <ImageWithFallback
                          src={item.image || ''}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                        {item.creator_name && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Por: {item.creator_name}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleApproveReject('services', item.id, true)}
                            disabled={actionId === item.id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-800 text-sm font-medium hover:bg-green-200 disabled:opacity-50"
                          >
                            {actionId === item.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            Aprovar
                          </button>
                          <button
                            onClick={() => handleApproveReject('services', item.id, false)}
                            disabled={actionId === item.id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-800 text-sm font-medium hover:bg-red-200 disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reprovar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
