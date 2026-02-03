import { Star, TrendingUp, Users } from 'lucide-react';

interface CommunityFiltersProps {
  activeView: 'feed' | 'trending' | 'members';
  activeCategory: string;
  categories: string[];
  onViewChange: (view: 'feed' | 'trending' | 'members') => void;
  onCategoryChange: (category: string) => void;
}

export function CommunityFilters({
  activeView,
  activeCategory,
  categories,
  onViewChange,
  onCategoryChange,
}: CommunityFiltersProps) {
  return (
    <div className="px-5 mb-4">
      {/* Primeira linha: Feed, Em Alta, Membros */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onViewChange('feed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeView === 'feed'
              ? 'bg-[#932d6f] text-white'
              : 'bg-white text-foreground border border-gray-200'
          }`}
        >
          <Star className="w-4 h-4" />
          Feed
        </button>
        <button
          onClick={() => onViewChange('trending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeView === 'trending'
              ? 'bg-[#932d6f] text-white'
              : 'bg-white text-foreground border border-gray-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Em Alta
        </button>
        <button
          onClick={() => onViewChange('members')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeView === 'members'
              ? 'bg-[#932d6f] text-white'
              : 'bg-white text-foreground border border-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Membros
        </button>
      </div>

      {/* Segunda linha: Categorias */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#932d6f] text-white'
                  : 'bg-white text-foreground border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}