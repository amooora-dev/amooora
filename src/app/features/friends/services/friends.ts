import { supabase } from '../../../infra/supabase';
import type { FriendRequest, FriendProfile, ConnectionStatus } from '../types';

const REJECT_COOLDOWN_DAYS = 7;

function makePairKey(a: string, b: string): string {
  return [a, b].sort().join(':');
}

async function getProfilesByIds(ids: string[]): Promise<Map<string, FriendProfile>> {
  if (ids.length === 0) return new Map();
  const { data } = await supabase
    .from('profiles')
    .select('id, name, avatar, city, bio, whatsapp, phone')
    .in('id', ids);
  const map = new Map<string, FriendProfile>();
  for (const p of data || []) {
    map.set(p.id, {
      id: p.id,
      name: p.name,
      avatar: p.avatar ?? undefined,
      city: p.city ?? undefined,
      bio: p.bio ?? undefined,
      whatsapp: p.whatsapp ?? p.phone ?? undefined,
      phone: p.phone ?? undefined,
    });
  }
  return map;
}

/**
 * Lista de amigos (conexões aceitas) do usuário logado
 */
export async function getFriends(): Promise<FriendProfile[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('friend_requests')
    .select('requester_id, addressee_id, responded_at')
    .eq('status', 'accepted')
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .order('responded_at', { ascending: false });

  if (error) {
    console.error('[friends] getFriends error:', error);
    return [];
  }

  const rows = data || [];
  const otherIds = rows.map((r) => (r.requester_id === user.id ? r.addressee_id : r.requester_id));
  const profileMap = await getProfilesByIds(otherIds);
  return otherIds.map((id) => profileMap.get(id)).filter(Boolean) as FriendProfile[];
}

/**
 * Solicitações enviadas (pending) pelo usuário logado
 */
export async function getRequestsSent(): Promise<FriendRequest[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('friend_requests')
    .select('id, requester_id, addressee_id, status, pair_key, created_at, responded_at')
    .eq('requester_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[friends] getRequestsSent error:', error);
    return [];
  }

  const rows = data || [];
  const addresseeIds = rows.map((r) => r.addressee_id);
  const profileMap = await getProfilesByIds(addresseeIds);
  return rows.map((r) => ({
    ...r,
    addressee: profileMap.get(r.addressee_id) ?? { id: r.addressee_id, name: 'Usuária' },
  })) as FriendRequest[];
}

/**
 * Solicitações recebidas (pending) pelo usuário logado
 */
export async function getRequestsReceived(): Promise<FriendRequest[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('friend_requests')
    .select('id, requester_id, addressee_id, status, pair_key, created_at, responded_at')
    .eq('addressee_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[friends] getRequestsReceived error:', error);
    return [];
  }

  const rows = data || [];
  const requesterIds = rows.map((r) => r.requester_id);
  const profileMap = await getProfilesByIds(requesterIds);
  return rows.map((r) => ({
    ...r,
    requester: profileMap.get(r.requester_id) ?? { id: r.requester_id, name: 'Usuária' },
  })) as FriendRequest[];
}

/**
 * Status da conexão entre usuário logado e outro usuário
 */
export async function getConnectionStatus(otherUserId: string): Promise<ConnectionStatus> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id === otherUserId) return 'none';

  const pairKey = makePairKey(user.id, otherUserId);
  const { data, error } = await supabase
    .from('friend_requests')
    .select('requester_id, status')
    .eq('pair_key', pairKey)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return 'none';
  if (data.status === 'accepted') return 'accepted';
  if (data.status === 'rejected') return 'rejected';
  if (data.status === 'pending') {
    return data.requester_id === user.id ? 'pending_sent' : 'pending_received';
  }
  return 'none';
}

/**
 * Retorna o id do pedido de conexão pendente que a pessoa (requesterId) enviou para a usuária logada.
 * Usado na página do perfil para mostrar "Fulana enviou um pedido" e botões Aprovar/Recusar.
 */
export async function getPendingRequestFromRequester(requesterId: string): Promise<{ requestId: string } | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('friend_requests')
    .select('id')
    .eq('requester_id', requesterId)
    .eq('addressee_id', user.id)
    .eq('status', 'pending')
    .maybeSingle();
  return data ? { requestId: data.id } : null;
}

/**
 * Verifica se pode enviar nova solicitação (não rejeitada nos últimos 7 dias)
 */
export async function canSendRequest(otherUserId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id === otherUserId) return false;

  const pairKey = makePairKey(user.id, otherUserId);
  const { data } = await supabase
    .from('friend_requests')
    .select('status, responded_at')
    .eq('pair_key', pairKey)
    .in('status', ['pending', 'accepted', 'rejected'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return true;
  if (data.status === 'pending' || data.status === 'accepted') return false;
  if (data.status === 'rejected' && data.responded_at) {
    const responded = new Date(data.responded_at);
    const now = new Date();
    const days = (now.getTime() - responded.getTime()) / (1000 * 60 * 60 * 24);
    return days >= REJECT_COOLDOWN_DAYS;
  }
  return true;
}

/**
 * Enviar solicitação de conexão
 */
export async function sendRequest(addresseeId: string): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Não autenticada' };
  if (user.id === addresseeId) return { ok: false, error: 'Não é possível conectar consigo mesma' };

  const canSend = await canSendRequest(addresseeId);
  if (!canSend) return { ok: false, error: 'Já existe solicitação ou conexão, ou aguarde 7 dias após recusa' };

  const { error } = await supabase.from('friend_requests').insert({
    requester_id: user.id,
    addressee_id: addresseeId,
    status: 'pending',
  });

  if (error) {
    if (error.code === '23505') return { ok: false, error: 'Já existe uma solicitação entre vocês' };
    console.error('[friends] sendRequest error:', error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/**
 * Aceitar solicitação
 */
export async function acceptRequest(requestId: string): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Não autenticada' };

  const { data: req, error: fetchError } = await supabase
    .from('friend_requests')
    .select('addressee_id, status')
    .eq('id', requestId)
    .single();

  if (fetchError || !req) return { ok: false, error: 'Solicitação não encontrada' };
  if (req.addressee_id !== user.id) return { ok: false, error: 'Não autorizado' };
  if (req.status !== 'pending') return { ok: false, error: 'Solicitação já respondida' };

  const { error } = await supabase
    .from('friend_requests')
    .update({ status: 'accepted', responded_at: new Date().toISOString() })
    .eq('id', requestId);

  if (error) {
    console.error('[friends] acceptRequest error:', error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/**
 * Recusar solicitação
 */
export async function rejectRequest(requestId: string): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Não autenticada' };

  const { data: req } = await supabase
    .from('friend_requests')
    .select('addressee_id, status')
    .eq('id', requestId)
    .single();

  if (!req || req.addressee_id !== user.id || req.status !== 'pending') {
    return { ok: false, error: 'Solicitação não encontrada ou já respondida' };
  }

  const { error } = await supabase
    .from('friend_requests')
    .update({ status: 'rejected', responded_at: new Date().toISOString() })
    .eq('id', requestId);

  if (error) {
    console.error('[friends] rejectRequest error:', error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/**
 * Cancelar solicitação enviada
 */
export async function cancelRequest(requestId: string): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Não autenticada' };

  const { data: req } = await supabase
    .from('friend_requests')
    .select('requester_id, status')
    .eq('id', requestId)
    .single();

  if (!req || req.requester_id !== user.id || req.status !== 'pending') {
    return { ok: false, error: 'Solicitação não encontrada ou já respondida' };
  }

  const { error } = await supabase
    .from('friend_requests')
    .update({ status: 'cancelled', responded_at: new Date().toISOString() })
    .eq('id', requestId);

  if (error) {
    console.error('[friends] cancelRequest error:', error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/**
 * Buscar perfis por nome (para conexão) - exclui a própria usuária e retorna só dados básicos
 */
export async function searchProfilesForConnection(
  query: string
): Promise<{ profile: FriendProfile; status: ConnectionStatus }[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const q = query.trim().toLowerCase();
  if (!q) return [];

  const { data: profilesData, error: profError } = await supabase
    .from('profiles')
    .select('id, name, avatar, city')
    .neq('id', user.id)
    .or(`name.ilike.%${q}%,city.ilike.%${q}%`)
    .limit(30);

  if (profError || !profilesData?.length) return [];

  const ids = profilesData.map((p) => p.id);
  const statusMap = await getConnectionStatusesBatch(user.id, ids);
  return profilesData.map((p) => ({
    profile: {
      id: p.id,
      name: p.name,
      avatar: p.avatar ?? undefined,
      city: p.city ?? undefined,
    },
    status: statusMap.get(p.id) ?? 'none',
  }));
}

/**
 * Status de conexão em lote (para busca). Retorna mapa vazio se tabela não existir.
 */
async function getConnectionStatusesBatch(
  myId: string,
  otherIds: string[]
): Promise<Map<string, ConnectionStatus>> {
  if (otherIds.length === 0) return new Map();
  try {
    const pairKeys = otherIds.map((id) => makePairKey(myId, id));
    const { data } = await supabase
      .from('friend_requests')
      .select('pair_key, requester_id, status')
      .in('pair_key', pairKeys)
      .order('created_at', { ascending: false });

    const map = new Map<string, ConnectionStatus>();
    const seen = new Set<string>();
    for (const r of data || []) {
      const otherId = r.requester_id === myId
        ? r.pair_key.split(':')[1]
        : r.pair_key.split(':')[0];
      if (seen.has(otherId)) continue;
      seen.add(otherId);
      if (r.status === 'accepted') map.set(otherId, 'accepted');
      else if (r.status === 'rejected') map.set(otherId, 'rejected');
      else if (r.status === 'pending') {
        map.set(otherId, r.requester_id === myId ? 'pending_sent' : 'pending_received');
      }
    }
    return map;
  } catch {
    return new Map();
  }
}

/**
 * Lista usuárias cadastradas na plataforma (para exibir na busca). Exclui a usuária logada.
 */
export async function listProfiles(): Promise<FriendProfile[]> {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, avatar, city')
    .order('name', { ascending: true })
    .limit(100);

  if (error) {
    console.error('[friends] listProfiles error:', error);
    return [];
  }

  return (data || [])
    .filter((p) => p.id !== user?.id)
    .map((p) => ({
      id: p.id,
      name: p.name ?? 'Usuária',
      avatar: p.avatar ?? undefined,
      city: p.city ?? undefined,
    }));
}

/**
 * Dado uma lista de perfis (ex.: membros de comunidade, participantes de evento), retorna com status de conexão.
 */
export async function addConnectionStatusToProfiles(
  profiles: { id: string; name: string; avatar?: string; city?: string }[]
): Promise<{ profile: FriendProfile; status: ConnectionStatus }[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || profiles.length === 0) {
    return profiles.map((p) => ({ profile: p, status: 'none' as ConnectionStatus }));
  }
  const filtered = profiles.filter((p) => p.id !== user.id);
  const statusMap = await getConnectionStatusesBatch(user.id, filtered.map((p) => p.id));
  return filtered.map((p) => ({
    profile: p,
    status: statusMap.get(p.id) ?? 'none',
  }));
}

/**
 * Lista de perfis com status de conexão (para página que lista usuárias cadastradas)
 */
export async function listProfilesWithStatus(): Promise<{ profile: FriendProfile; status: ConnectionStatus }[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, avatar, city')
    .neq('id', user.id)
    .order('name', { ascending: true })
    .limit(100);

  if (error) {
    console.error('[friends] listProfilesWithStatus error:', error);
    return [];
  }

  const profiles: FriendProfile[] = (data || []).map((p) => ({
    id: p.id,
    name: p.name ?? 'Usuária',
    avatar: p.avatar ?? undefined,
    city: p.city ?? undefined,
  }));

  if (profiles.length === 0) return [];
  const statusMap = await getConnectionStatusesBatch(user.id, profiles.map((p) => p.id));
  return profiles.map((p) => ({
    profile: p,
    status: statusMap.get(p.id) ?? 'none',
  }));
}
