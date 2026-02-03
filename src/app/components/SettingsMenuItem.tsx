import { ChevronRight, LucideIcon } from 'lucide-react';

interface SettingsMenuItemProps {
  icon: LucideIcon;
  label: string;
  rightText?: string;
  onClick?: () => void;
  showArrow?: boolean;
}

export function SettingsMenuItem({
  icon: Icon,
  label,
  rightText,
  onClick,
  showArrow = true,
}: SettingsMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white px-5 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors border-b border-border/30 last:border-b-0"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm text-foreground font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {rightText && (
          <span className="text-sm text-muted-foreground">{rightText}</span>
        )}
        {showArrow && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
      </div>
    </button>
  );
}
