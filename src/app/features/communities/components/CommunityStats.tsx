import { Users, MessageCircle, TrendingUp } from 'lucide-react';

interface CommunityStatsProps {
  members: number;
  posts: number;
  activeToday: number;
}

export function CommunityStats({ members, posts, activeToday }: CommunityStatsProps) {
  return (
    <div className="px-5 mb-6">
      <div className="grid grid-cols-3 gap-3">
        {/* Membros */}
        <div className="bg-white rounded-2xl p-4 shadow-md text-center">
          <Users className="w-5 h-5 text-[#932d6f] mx-auto mb-2" />
          <div className="font-bold text-lg text-gray-900">{members.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Membros</div>
        </div>

        {/* Posts */}
        <div className="bg-white rounded-2xl p-4 shadow-md text-center">
          <MessageCircle className="w-5 h-5 text-[#932d6f] mx-auto mb-2" />
          <div className="font-bold text-lg text-gray-900">{posts.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Posts</div>
        </div>

        {/* Ativas hoje */}
        <div className="bg-white rounded-2xl p-4 shadow-md text-center">
          <TrendingUp className="w-5 h-5 text-[#932d6f] mx-auto mb-2" />
          <div className="font-bold text-lg text-gray-900">{activeToday}</div>
          <div className="text-xs text-gray-600">Ativas hoje</div>
        </div>
      </div>
    </div>
  );
}