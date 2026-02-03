interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">
        {title}
      </h2>
      <div className="bg-white">{children}</div>
    </div>
  );
}
