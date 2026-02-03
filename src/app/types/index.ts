// Re-export shared types
export * from '../shared/types';

// Feature-specific types (mantidos aqui para compatibilidade)
export interface Place {
  id: string;
  name: string;
  description?: string;
  image: string;
  imageUrl?: string;
  address?: string;
  rating: number;
  category: string;
  latitude?: number;
  longitude?: number;
  reviewCount?: number;
  distance?: string;
  isSafe?: boolean;
  tags?: string[]; // Tags como: 'vegano', 'aceita-pets', 'acessivel', 'drag-shows', etc.
}

export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  imageUrl?: string;
  price?: number;
  category: string;
  categorySlug: string;
  rating: number;
  provider?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  specialties?: string[];
  hours?: Record<string, string>;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  image?: string;
  imageUrl?: string;
  date: string;
  time?: string;
  endTime?: string;
  location: string;
  category: string;
  price?: number;
  participants?: number;
}

export interface CommunityPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  image?: string;
  likesCount: number;
  repliesCount: number;
  isTrending: boolean;
  createdAt: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

export interface PostReply {
  id: string;
  postId: string;
  userId?: string;
  authorName?: string;
  content: string;
  parentReplyId?: string;
  createdAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  likes?: number;
  replies?: PostReply[];
}
