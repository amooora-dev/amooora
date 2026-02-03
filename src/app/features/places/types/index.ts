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
  tags?: string[];
}

