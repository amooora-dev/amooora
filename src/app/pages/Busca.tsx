import { useState, useEffect, useCallback } from 'react';
import { Header, BottomNav, EmptyState, SkeletonListExpanded } from '../shared/components';
import { Search, Users, MapPin, Calendar, MessageCircle, ChevronLeft } from 'lucide-react';
import { useAdmin } from '../shared/hooks';
import { listProfilesWithStatus, sendRequest, addConnectionStatusToProfiles } from '../features/friends';
import { UserSearchCard } from '../features/friends';
import { getCommunities, getCommunityMemberProfiles } from '../features/communities/services/communities';
import { CommunityCard } from '../features/communities/components/CommunityCard';
import { getPlaces } from '../features/places/services/places';
import { PlaceCard } from '../features/places/components/PlaceCard';
import { getPlaceFollowerProfiles } from '../features/places/services/placeFollows';
import { getEvents } from '../features/events/services/events';
import { EventCard } from '../features/events/components/EventCard';
import { getEventParticipants } from '../features/events/services/eventParticipants';
import { toast } from 'sonner';

type TabType = 'pessoas' | 'comunidades' | 'locais' | 'eventos';

type SelectedContent = { type: 'community' | 'place' | 'event'; id: string; name: string };

interface BuscaProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

type PeopleWithStatus = { profile: { id: string; name: string; avatar?: string; city?: string }; status: string };

export function Busca({ onNavigate, onBack }: BuscaProps) {
  const { isAdmin } = useAdmin();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('pessoas');
  const [loading, setLoading] = useState(true);

  const [people, setPeople] = useState<PeopleWithStatus[]>([]);
  const [communities, setCommunities] = useState<Array<{ id: string; name: string; avatar: string; description?: string; membersCount?: number; postsCount?: number; category?: string }>>([]);
  const [places, setPlaces] = useState<Array<{ id: string; name: string; category: string; rating: number; reviewCount: number; imageUrl: string }>>([]);
  const [events, setEvents] = useState<Array<{ id: string; name: string; date: string; time: string; location: string; participants: number; imageUrl: string }>>([]);

  const [selectedContent, setSelectedContent] = useState<SelectedContent | null>(null);
  const [peopleFromContent, setPeopleFromContent] = useState<PeopleWithStatus[]>([]);
  const [loadingPeopleFromContent, setLoadingPeopleFromContent] = useState(false);

  const loadData = useCallback(async (tab: TabType) => {
    setLoading(true);
    setSelectedContent(null);
    setPeopleFromContent([]);
    try {
      if (tab === 'pessoas') {
        const data = await listProfilesWithStatus();
        setPeople(data);
      } else if (tab === 'comunidades') {
        const data = await getCommunities();
        setCommunities(data.map((c) => ({
          id: c.id,
          name: c.name,
          avatar: c.image || c.imageUrl || '',
          description: c.description,
          membersCount: c.membersCount ?? 0,
          postsCount: c.postsCount ?? 0,
          category: c.category,
        })));
      } else if (tab === 'locais') {
        const { data } = await getPlaces(50);
        setPlaces(data.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category || '',
          rating: p.rating ?? 0,
          reviewCount: p.reviewCount ?? 0,
          imageUrl: p.imageUrl || p.image || '',
        })));
      } else {
        const data = await getEvents();
        setEvents(data.map((e) => ({
          id: e.id,
          name: e.name,
          date: e.date ? new Date(e.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }) : '',
          time: e.time || '',
          location: e.location || '',
          participants: e.participants ?? 0,
          imageUrl: e.imageUrl || e.image || '',
        })));
      }
    } catch (e) {
      console.error('[Busca] loadData', e);
      if (tab === 'pessoas') setPeople([]);
      else if (tab === 'comunidades') setCommunities([]);
      else if (tab === 'locais') setPlaces([]);
      else setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, loadData]);

  const loadPeopleForContent = useCallback(async (content: SelectedContent) => {
    setLoadingPeopleFromContent(true);
    try {
      if (content.type === 'community') {
        const profiles = await getCommunityMemberProfiles(content.id);
        const withStatus = await addConnectionStatusToProfiles(profiles);
        setPeopleFromContent(withStatus);
      } else if (content.type === 'place') {
        const profiles = await getPlaceFollowerProfiles(content.id);
        const withStatus = await addConnectionStatusToProfiles(profiles);
        setPeopleFromContent(withStatus);
      } else {
        const participants = await getEventParticipants(content.id);
        const profiles = participants.map((p) => ({
          id: p.profile.id,
          name: p.profile.name,
          avatar: p.profile.avatar,
          city: undefined as string | undefined,
        }));
        const withStatus = await addConnectionStatusToProfiles(profiles);
        setPeopleFromContent(withStatus);
      }
    } catch (e) {
      console.error('[Busca] loadPeopleForContent', e);
      setPeopleFromContent([]);
    } finally {
      setLoadingPeopleFromContent(false);
    }
  }, []);

  useEffect(() => {
    if (selectedContent) loadPeopleForContent(selectedContent);
  }, [selectedContent, loadPeopleForContent]);

  const q = query.trim().toLowerCase();
  const filteredPeople = q ? people.filter(({ profile }) =>
    profile.name?.toLowerCase().includes(q) || profile.city?.toLowerCase().includes(q)
  ) : people;
  const filteredCommunities = q ? communities.filter((c) =>
    c.name?.toLowerCase().includes(q) || (c.description ?? '').toLowerCase().includes(q) || (c.category ?? '').toLowerCase().includes(q)
  ) : communities;
  const filteredPlaces = q ? places.filter((p) =>
    p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
  ) : places;
  const filteredEvents = q ? events.filter((e) =>
    e.name?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q)
  ) : events;

  const handleConnect = async (profileId: string) => {
    const { ok, error } = await sendRequest(profileId);
    if (ok) {
      toast.success('Solicitação enviada');
      if (selectedContent) loadPeopleForContent(selectedContent);
      else loadData('pessoas');
    } else {
      toast.error(error ?? 'Não foi possível enviar');
    }
  };

  const backToContentList = () => {
    setSelectedContent(null);
    setPeopleFromContent([]);
  };

  const tabs: { id: TabType; label: string; icon: typeof Users }[] = [
    { id: 'pessoas', label: 'Pessoas', icon: Users },
    { id: 'comunidades', label: 'Comunidades', icon: MessageCircle },
    { id: 'locais', label: 'Locais', icon: MapPin },
    { id: 'eventos', label: 'Eventos', icon: Calendar },
  ];

  const statusCast = (s: string) => s as 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'rejected';

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />

        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-semibold text-primary mb-4">Buscar</h1>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar pessoas, comunidades, locais ou eventos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => { setActiveTab(id); setSelectedContent(null); }}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    activeTab === id
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 pb-6">
            {/* Vista: lista de pessoas que seguem/participam do conteúdo selecionado */}
            {selectedContent && activeTab !== 'pessoas' && (
              <>
                <button
                  type="button"
                  onClick={backToContentList}
                  className="flex items-center gap-2 text-sm text-primary font-medium mb-4"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {activeTab === 'comunidades' && 'Ver comunidades'}
                  {activeTab === 'locais' && 'Ver locais'}
                  {activeTab === 'eventos' && 'Ver eventos'}
                </button>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {activeTab === 'comunidades' && `Pessoas que seguem "${selectedContent.name}"`}
                  {activeTab === 'locais' && `Pessoas que seguem "${selectedContent.name}"`}
                  {activeTab === 'eventos' && `Pessoas no evento "${selectedContent.name}"`}
                </h2>
                {loadingPeopleFromContent ? (
                  <SkeletonListExpanded count={5} />
                ) : peopleFromContent.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="Nenhuma pessoa aqui"
                    description="Ainda não há pessoas seguindo ou participando deste conteúdo."
                  />
                ) : (
                  <div className="space-y-3">
                    {peopleFromContent.map(({ profile, status }) => (
                      <UserSearchCard
                        key={profile.id}
                        profile={profile}
                        status={statusCast(status)}
                        onConnect={() => handleConnect(profile.id)}
                        onViewProfile={() => onNavigate(`view-profile:${profile.id}`)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pessoas: lista geral */}
            {!selectedContent && activeTab === 'pessoas' && (
              loading ? (
                <SkeletonListExpanded count={5} />
              ) : filteredPeople.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title={q ? 'Nenhuma pessoa encontrada' : 'Nenhuma usuária cadastrada'}
                  description={q ? 'Tente outro termo de busca.' : 'Quando houver pessoas na plataforma, elas aparecerão aqui.'}
                />
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    {q ? `Resultados (${filteredPeople.length})` : `Usuárias cadastradas (${filteredPeople.length})`}
                  </p>
                  <div className="space-y-3">
                    {filteredPeople.map(({ profile, status }) => (
                      <UserSearchCard
                        key={profile.id}
                        profile={profile}
                        status={statusCast(status)}
                        onConnect={() => handleConnect(profile.id)}
                        onViewProfile={() => onNavigate(`view-profile:${profile.id}`)}
                      />
                    ))}
                  </div>
                </>
              )
            )}

            {/* Comunidades: lista de comunidades (ao tocar, mostra pessoas que seguem) */}
            {!selectedContent && activeTab === 'comunidades' && (
              loading ? (
                <SkeletonListExpanded count={5} />
              ) : filteredCommunities.length === 0 ? (
                <EmptyState
                  icon={MessageCircle}
                  title={q ? 'Nenhuma comunidade encontrada' : 'Nenhuma comunidade'}
                  description={q ? 'Tente outro termo.' : 'Ainda não há comunidades cadastradas.'}
                />
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Toque em uma comunidade para ver as pessoas que seguem
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredCommunities.map((c) => (
                      <CommunityCard
                        key={c.id}
                        community={c}
                        onClick={() => setSelectedContent({ type: 'community', id: c.id, name: c.name })}
                      />
                    ))}
                  </div>
                </>
              )
            )}

            {/* Locais: lista de locais (ao tocar, mostra pessoas que seguem) */}
            {!selectedContent && activeTab === 'locais' && (
              loading ? (
                <SkeletonListExpanded count={5} />
              ) : filteredPlaces.length === 0 ? (
                <EmptyState
                  icon={MapPin}
                  title={q ? 'Nenhum local encontrado' : 'Nenhum local'}
                  description={q ? 'Tente outro termo.' : 'Ainda não há locais cadastrados.'}
                />
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Toque em um local para ver as pessoas que seguem
                  </p>
                  <div className="space-y-3">
                    {filteredPlaces.map((p) => (
                      <PlaceCard
                        key={p.id}
                        id={p.id}
                        name={p.name}
                        category={p.category}
                        rating={p.rating}
                        reviewCount={p.reviewCount}
                        distance=""
                        imageUrl={p.imageUrl}
                        onClick={() => setSelectedContent({ type: 'place', id: p.id, name: p.name })}
                      />
                    ))}
                  </div>
                </>
              )
            )}

            {/* Eventos: lista de eventos (ao tocar, mostra pessoas participantes) */}
            {!selectedContent && activeTab === 'eventos' && (
              loading ? (
                <SkeletonListExpanded count={5} />
              ) : filteredEvents.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title={q ? 'Nenhum evento encontrado' : 'Nenhum evento'}
                  description={q ? 'Tente outro termo.' : 'Ainda não há eventos cadastrados.'}
                />
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Toque em um evento para ver as pessoas que vão participar
                  </p>
                  <div className="space-y-3">
                    {filteredEvents.map((e) => (
                      <EventCard
                        key={e.id}
                        id={e.id}
                        name={e.name}
                        date={e.date}
                        time={e.time}
                        location={e.location}
                        participants={e.participants}
                        imageUrl={e.imageUrl}
                        onClick={() => setSelectedContent({ type: 'event', id: e.id, name: e.name })}
                      />
                    ))}
                  </div>
                </>
              )
            )}
          </div>
        </div>

        <BottomNav activeItem="profile" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
