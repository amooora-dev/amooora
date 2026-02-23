import { supabase } from '../infra/supabase';

export type CurationTable = 'places' | 'events' | 'services';

export interface PendingPlace {
  id: string;
  name: string;
  description: string | null;
  category: string;
  image: string | null;
  created_at: string;
  created_by: string | null;
  creator_name?: string;
}

export interface PendingEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  category: string;
  image: string | null;
  created_at: string;
  created_by: string | null;
  creator_name?: string;
}

export interface PendingService {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string | null;
  created_at: string;
  created_by: string | null;
  creator_name?: string;
}

function normalizeRpcRows(data: unknown): Record<string, unknown>[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as unknown;
      return Array.isArray(parsed) ? (parsed as Record<string, unknown>[]) : [];
    } catch {
      return [];
    }
  }
  if (typeof data === 'object' && data !== null && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: Record<string, unknown>[] }).data;
  }
  return [];
}

async function fetchPendingPlacesViaRpc(): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase.rpc('get_pending_curation', { p_kind: 'places' });
  if (error) return [];
  return normalizeRpcRows(data);
}

async function fetchPendingPlacesViaSelect(): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase
    .from('places')
    .select('id, name, description, category, image, created_at, created_by')
    .eq('curation_status', 'pending')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Record<string, unknown>[];
}

export async function getPendingPlaces(): Promise<PendingPlace[]> {
  let rows = await fetchPendingPlacesViaRpc();
  if (rows.length === 0) {
    rows = await fetchPendingPlacesViaSelect();
  }
  if (rows.length === 0) return [];

  const creatorIds = [...new Set(rows.map((r) => r.created_by as string).filter(Boolean))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name')
    .in('id', creatorIds);
  const nameBy = new Map((profiles || []).map((p) => [p.id, p.name]));

  return rows.map((r) => ({
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) ?? null,
    category: r.category as string,
    image: (r.image as string) ?? null,
    created_at: r.created_at as string,
    created_by: (r.created_by as string) ?? null,
    creator_name: r.created_by ? nameBy.get(r.created_by as string) : undefined,
  }));
}

async function fetchPendingEventsViaSelect(): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase
    .from('events')
    .select('id, name, description, date, location, category, image, created_at, created_by')
    .eq('curation_status', 'pending')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Record<string, unknown>[];
}

export async function getPendingEvents(): Promise<PendingEvent[]> {
  const { data, error } = await supabase.rpc('get_pending_curation', { p_kind: 'events' });
  let rows = normalizeRpcRows(data);
  if (error || rows.length === 0) rows = await fetchPendingEventsViaSelect();
  if (rows.length === 0) return [];

  const creatorIds = [...new Set(rows.map((r) => r.created_by as string).filter(Boolean))];
  const { data: profiles } = await supabase.from('profiles').select('id, name').in('id', creatorIds);
  const nameBy = new Map((profiles || []).map((p) => [p.id, p.name]));

  return rows.map((r) => ({
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) ?? '',
    date: r.date as string,
    location: r.location as string,
    category: r.category as string,
    image: (r.image as string) ?? null,
    created_at: r.created_at as string,
    created_by: (r.created_by as string) ?? null,
    creator_name: r.created_by ? nameBy.get(r.created_by as string) : undefined,
  }));
}

async function fetchPendingServicesViaSelect(): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase
    .from('services')
    .select('id, name, description, category, image, created_at, created_by')
    .eq('curation_status', 'pending')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Record<string, unknown>[];
}

export async function getPendingServices(): Promise<PendingService[]> {
  const { data, error } = await supabase.rpc('get_pending_curation', { p_kind: 'services' });
  let rows = normalizeRpcRows(data);
  if (error || rows.length === 0) rows = await fetchPendingServicesViaSelect();
  if (rows.length === 0) return [];

  const creatorIds = [...new Set(rows.map((r) => r.created_by as string).filter(Boolean))];
  const { data: profiles } = await supabase.from('profiles').select('id, name').in('id', creatorIds);
  const nameBy = new Map((profiles || []).map((p) => [p.id, p.name]));

  return rows.map((r) => ({
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) ?? '',
    category: r.category as string,
    image: (r.image as string) ?? null,
    created_at: r.created_at as string,
    created_by: (r.created_by as string) ?? null,
    creator_name: r.created_by ? nameBy.get(r.created_by as string) : undefined,
  }));
}

export async function curationApproveOrReject(
  tableName: CurationTable,
  rowId: string,
  approve: boolean
): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await supabase.rpc('curation_approve_or_reject', {
    p_table_name: tableName,
    p_row_id: rowId,
    p_approve: approve,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  const result = data as { ok?: boolean; error?: string } | null;
  if (result?.ok === true) return { ok: true };
  return { ok: false, error: result?.error ?? 'Erro ao processar' };
}
