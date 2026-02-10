import { useState, useEffect, useCallback } from 'react';
import { Header, BottomNav, EmptyState, SkeletonListExpanded } from '../../../shared/components';
import { Search, Users } from 'lucide-react';
import { useAdmin } from '../../../shared/hooks';
import { UserSearchCard } from '../components/UserSearchCard';
import { searchProfilesForConnection, listProfilesWithStatus, sendRequest } from '../services/friends';
import { toast } from 'sonner';

interface AmigosSearchProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

const SEARCH_DEBOUNCE_MS = 400;

export function AmigosSearch({ onNavigate, onBack }: AmigosSearchProps) {
  const { isAdmin } = useAdmin();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ profile: { id: string; name: string; avatar?: string; city?: string }; status: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setSearching(false);
      setLoadingList(true);
      try {
        const data = await listProfilesWithStatus();
        setResults(data);
      } catch (e) {
        console.error('[AmigosSearch] listProfilesWithStatus', e);
        setResults([]);
      } finally {
        setLoadingList(false);
      }
      return;
    }
    setSearching(true);
    try {
      const data = await searchProfilesForConnection(trimmed);
      setResults(data);
    } catch (e) {
      console.error('[AmigosSearch] searchProfilesForConnection', e);
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => runSearch(query), query.trim() ? SEARCH_DEBOUNCE_MS : 0);
    return () => clearTimeout(t);
  }, [query, runSearch]);

  const handleConnect = async (profileId: string) => {
    const { ok, error } = await sendRequest(profileId);
    if (ok) {
      toast.success('Solicitação enviada');
      runSearch(query);
    } else {
      toast.error(error ?? 'Não foi possível enviar');
    }
  };

  const showEmpty = !loadingList && !searching && query.trim().length > 0 && results.length === 0;
  const showInitial = query.trim().length === 0 && !loadingList;
  const loading = loadingList || searching;

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />

        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-semibold text-primary mb-4">Buscar pessoas</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nome ou cidade..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          </div>

          <div className="px-5 pb-6">
            {loading && results.length === 0 ? (
              <SkeletonListExpanded count={6} />
            ) : showInitial && results.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Nenhuma usuária cadastrada"
                description="Quando houver pessoas na plataforma, elas aparecerão aqui."
              />
            ) : showEmpty ? (
              <EmptyState
                icon={Search}
                title="Nenhum resultado"
                description="Tente outro nome ou cidade."
              />
            ) : results.length > 0 ? (
              <>
                {showInitial && (
                  <p className="text-sm text-muted-foreground mb-3">
                    Usuárias cadastradas na plataforma ({results.length})
                  </p>
                )}
                <div className="space-y-3">
                  {results.map(({ profile, status }) => (
                    <UserSearchCard
                      key={profile.id}
                      profile={profile}
                      status={status as 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'rejected'}
                      onConnect={() => handleConnect(profile.id)}
                      onViewProfile={() => onNavigate(`view-profile:${profile.id}`)}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>

        <BottomNav activeItem="profile" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
