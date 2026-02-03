import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export function ServiceCard({ name, icon: Icon, color, onClick }: ServiceCardProps) {
  return (
    <button 
      onClick={onClick}
      className="rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform h-40 bg-white border-2 border-[#932d6f]/20"
    >
      <Icon className="w-12 h-12" style={{ color }} strokeWidth={2} />
      <span className="font-medium text-base" style={{ color }}>{name}</span>
    </button>
  );
}