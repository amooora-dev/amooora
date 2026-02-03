import { ImageWithFallback } from '../shared/components';

interface ActivityItemProps {
  description: string;
  date: string;
  thumbnailUrl: string;
}

export function ActivityItem({ description, date, thumbnailUrl }: ActivityItemProps) {
  return (
    <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
      <ImageWithFallback
        src={thumbnailUrl}
        alt={description}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground font-medium mb-1">{description}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}
