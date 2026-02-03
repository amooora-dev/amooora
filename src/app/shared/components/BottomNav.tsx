import { Home, MapPin, Calendar, Users, Scissors } from 'lucide-react';

type NavItem = {
  id: string;
  label: string;
  icon: typeof Home;
};

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'places', label: 'Locais', icon: MapPin },
  { id: 'services', label: 'Serviços', icon: Scissors },
  { id: 'events', label: 'Eventos', icon: Calendar },
  { id: 'community', label: 'Comunidade', icon: Users },
];

interface BottomNavProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
}

export function BottomNav({ activeItem = 'home', onItemClick }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-50">
      <div className="flex items-center justify-around max-w-md mx-auto px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]"
            >
              <Icon 
                className={`w-5 h-5 ${isActive ? 'text-secondary' : 'text-muted-foreground'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span 
                className={`text-xs ${isActive ? 'text-secondary font-semibold' : 'text-muted-foreground font-medium'}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}