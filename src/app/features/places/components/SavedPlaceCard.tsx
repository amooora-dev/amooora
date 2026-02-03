import { ImageWithFallback } from '../../../shared/components';

interface SavedPlaceCardProps {
  name: string;
  category: string;
  imageUrl: string;
}

export function SavedPlaceCard({ name, category, imageUrl }: SavedPlaceCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-32 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-sm text-primary mb-0.5">{name}</h4>
        <p className="text-xs text-muted-foreground">{category}</p>
      </div>
    </div>
  );
}

