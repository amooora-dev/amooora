import { LucideIcon } from 'lucide-react';

interface SettingsToggleItemProps {
  icon: LucideIcon;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SettingsToggleItem({
  icon: Icon,
  label,
  checked,
  onChange,
}: SettingsToggleItemProps) {
  return (
    <div className="w-full bg-white px-5 py-4 flex items-center justify-between border-b border-border/30 last:border-b-0">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm text-foreground font-medium">{label}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-primary transition-colors peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform"></div>
      </label>
    </div>
  );
}
