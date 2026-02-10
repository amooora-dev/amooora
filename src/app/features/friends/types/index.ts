export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface FriendRequest {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendRequestStatus;
  pair_key: string;
  created_at: string;
  responded_at: string | null;
  requester?: { id: string; name: string; avatar?: string; city?: string };
  addressee?: { id: string; name: string; avatar?: string; city?: string };
}

export interface FriendProfile {
  id: string;
  name: string;
  avatar?: string;
  city?: string;
  bio?: string;
  whatsapp?: string;
  phone?: string;
}

export interface FriendMessage {
  id: string;
  connection_pair_key: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  created_at: string;
  expires_at: string;
}

export type ConnectionStatus = 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'rejected';
