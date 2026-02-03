import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  reviewCount: number;
}

export function Rating({ rating, reviewCount }: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 fill-accent text-accent" />
      <span className="text-sm font-medium text-foreground">{rating}</span>
      <span className="text-sm text-muted-foreground">({reviewCount})</span>
    </div>
  );
}
