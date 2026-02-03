import { MessageCircle } from 'lucide-react';

interface CommunityRulesCardProps {
  rules: string[];
}

export function CommunityRulesCard({ rules }: CommunityRulesCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#D4B5F0] to-[#932d6f] rounded-2xl p-5 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg text-primary">Nossa Comunidade</h3>
      </div>
      <ul className="space-y-2">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-primary/90">
            <span className="mt-1">•</span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}