// Barrel exports for communities feature

// Pages
export { Comunidade } from './pages/Comunidade';
export { CommunityDetails } from './pages/CommunityDetails';
export { PostDetails } from './pages/PostDetails';
export { MinhasComunidades } from './pages/MinhasComunidades';
export { AdminCadastrarComunidade } from './pages/AdminCadastrarComunidade';
export { AdminEditarComunidade } from './pages/AdminEditarComunidade';

// Components
export { CommunityCard } from './components/CommunityCard';
export { CommunityCardCarousel } from './components/CommunityCardCarousel';
export { CommunityFilters } from './components/CommunityFilters';
export { CommunityList } from './components/CommunityList';
export { CommunityPostCard } from './components/CommunityPostCard';
export { CommunityRulesCard } from './components/CommunityRulesCard';
export { CommunityStats } from './components/CommunityStats';
export { CreatePostForm } from './components/CreatePostForm';

// Hooks
export { useCommunities, useCommunity } from './hooks/useCommunities';
export { useCommunityPosts, usePost } from './hooks/useCommunityPosts';
export { usePostLikes } from './hooks/usePostLikes';
export { usePostReplies } from './hooks/usePostReplies';

// Services
export * from './services/communities';
export * from './services/community';

// Types
export type { Community, CommunityPost, PostReply } from './types';
