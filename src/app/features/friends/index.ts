// Barrel exports for friends feature

export { Amigos } from './pages/Amigos';
export { AmigosSearch } from './pages/AmigosSearch';

export { FriendCard } from './components/FriendCard';
export { RequestCard } from './components/RequestCard';
export { UserSearchCard } from './components/UserSearchCard';
export { MessageBubble } from './components/MessageBubble';
export { ChatComposer } from './components/ChatComposer';

export { useFriends } from './hooks/useFriends';
export { useFriendRequests } from './hooks/useFriendRequests';
export { useConnectionStatus } from './hooks/useConnectionStatus';

export * from './services/friends';
export * from './services/messages';

export type {
  FriendRequest,
  FriendProfile,
  FriendMessage,
  FriendRequestStatus,
  ConnectionStatus,
} from './types';
