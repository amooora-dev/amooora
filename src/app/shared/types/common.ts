// Tipos compartilhados entre features

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
}

export interface Review {
  id: string;
  placeId?: string;
  serviceId?: string;
  eventId?: string;
  communityId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  author?: string;
  avatar?: string;
  rating: number;
  comment: string;
  createdAt?: string;
  date?: string;
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
  isActive?: boolean;
}
