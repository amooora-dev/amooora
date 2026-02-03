import { LucideIcon } from 'lucide-react';

interface ProfileStatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
}

export function ProfileStatCard({ icon: Icon, value, label }: ProfileStatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
      <Icon className="w-6 h-6 text-accent mb-2" />
      <p className="text-2xl font-bold text-primary mb-1">{value}</p>
      <p className="text-xs text-muted-foreground text-center">{label}</p>
    </div>
  );
}
