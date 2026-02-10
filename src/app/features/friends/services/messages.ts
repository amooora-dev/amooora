import { supabase } from '../../../infra/supabase';
import type { FriendMessage } from '../types';

/**
 * Gera pair_key para um par de usuários (ordem determinística)
 */
export function makePairKey(userIdA: string, userIdB: string): string {
  return [userIdA, userIdB].sort().join(':');
}

/**
 * Mensagens do chat entre dois amigos (não expiradas)
 */
export async function getMessages(pairKey: string): Promise<FriendMessage[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('friend_messages')
    .select('id, connection_pair_key, sender_id, receiver_id, body, created_at, expires_at')
    .eq('connection_pair_key', pairKey)
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[friends] getMessages error:', error);
    return [];
  }
  return (data || []) as FriendMessage[];
}

/**
 * Enviar mensagem (apenas entre conexões aceitas; validação no app)
 */
export async function sendMessage(
  pairKey: string,
  receiverId: string,
  body: string
): Promise<{ ok: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Não autenticada' };
  if (!body.trim()) return { ok: false, error: 'Mensagem vazia' };

  const { error } = await supabase.from('friend_messages').insert({
    connection_pair_key: pairKey,
    sender_id: user.id,
    receiver_id: receiverId,
    body: body.trim(),
  });

  if (error) {
    console.error('[friends] sendMessage error:', error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/**
 * Limpar mensagens expiradas (opcional; pode ser chamado ao abrir chat)
 */
export async function cleanupExpiredMessages(): Promise<void> {
  try {
    await supabase.rpc('cleanup_expired_friend_messages');
  } catch (e) {
    console.warn('[friends] cleanupExpiredMessages:', e);
  }
}
