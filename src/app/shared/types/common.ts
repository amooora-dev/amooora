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
