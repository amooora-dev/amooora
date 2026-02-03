import { ImageWithFallback } from '../shared/components';

export interface Community {
  id: string;
  name: string;
  avatar: string;
  description?: string;
  membersCount?: number;
  postsCount?: number;
}

interface CommunityListProps {
  communities: Community[];
  onCommunityClick: (communityId: string) => void;
}

export function CommunityList({ communities, onCommunityClick }: CommunityListProps) {
  return (
    <div className="px-5 mb-6">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {communities.map((community) => (
          <button
            key={community.id}
            onClick={() => onCommunityClick(community.id)}
            className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[80px]"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors">
              <ImageWithFallback
                src={community.avatar}
                alt={community.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-foreground text-center max-w-[80px] truncate">
              {community.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
