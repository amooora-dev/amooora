interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
}

export function Badge({ children, variant = 'primary' }: BadgeProps) {
  const variantStyles = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
