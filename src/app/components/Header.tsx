import { useState, useRef, useEffect } from 'react';
import { Bell, UserPen, ArrowLeft, Users, Settings, Heart, Search, Menu, X, Home, MapPin, Calendar, Scissors, MessageSquare, Info, Map, LogOut } from 'lucide-react';
import logoAmooora from "../../assets/2bcf17d7cfb76a60c14cf40243974d7d28fb3842.png";
import { supabase } from '../infra/supabase';

interface HeaderProps {
  onNavigate?: (page: string) => void;
  showBackButton?: boolean;
  onBack?: () => void;
  isAdmin?: boolean;
}

export function Header({ onNavigate, showBackButton, onBack, isAdmin = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleMenuClick = async (page: string) => {
    if (page === 'logout') {
      // Fazer logout completo
      try {
        await supabase.auth.signOut();
        // Navegar para welcome após logout
        onNavigate?.('welcome');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        // Mesmo com erro, tentar navegar para welcome
        onNavigate?.('welcome');
      }
    } else {
      onNavigate?.(page);
    }
    setIsMenuOpen(false);
  };

  const menuItems = [
    { icon: Home, label: 'Início', page: 'home' },
    { icon: MapPin, label: 'Locais', page: 'places' },
    { icon: Calendar, label: 'Eventos', page: 'events' },
    { icon: Scissors, label: 'Serviços', page: 'services' },
    { icon: MessageSquare, label: 'Comunidade', page: 'community' },
    { icon: Map, label: 'Mapa', page: 'mapa' },
    { icon: Heart, label: 'Meus Favoritos', page: 'favoritos' },
    ...(isAdmin ? [{ icon: Settings, label: 'Admin', page: 'admin' }] : []),
    { icon: Info, label: 'Sobre Amooora', page: 'sobre-amooora' },
    { icon: LogOut, label: 'Sair', page: 'logout' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 max-w-md mx-auto">
      <div className="flex items-center justify-between px-5 py-4">
        {/* Botão voltar à esquerda (se showBackButton) */}
        {showBackButton && (
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Logo sempre visível no centro/esquerda */}
        <div className={`flex-shrink-0 ${showBackButton ? 'flex-1 flex justify-center' : ''}`}>
          <img
            src={logoAmooora}
            alt="Amooora"
            className="h-[70px]"
          />
        </div>

        {/* Botões à direita */}
        <div className="flex items-center gap-2">
          {/* Botão de Notificação com badge */}
          <button 
            onClick={() => onNavigate?.('notifications')}
            className="relative w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              3
            </span>
          </button>

          {/* Botão de Perfil */}
          <button 
            onClick={() => onNavigate?.('profile')}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/90 transition-colors"
          >
            <UserPen className="w-5 h-5 text-white" />
          </button>

          {/* Menu Hambúrguer - Padrão da tag "Seguro" */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-primary" />
              )}
            </button>

            {/* Menu Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="py-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isLogout = item.page === 'logout';
                    const showSeparator = isLogout && index > 0;
                    
                    return (
                      <div key={item.page}>
                        {showSeparator && (
                          <div className="border-t border-gray-200 my-1" />
                        )}
                        <button
                          onClick={() => handleMenuClick(item.page)}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                            isLogout 
                              ? 'hover:bg-red-50 text-red-600' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isLogout ? 'text-red-600' : 'text-primary'}`} />
                          <span className={`text-sm font-medium ${isLogout ? 'text-red-600' : 'text-foreground'}`}>
                            {item.label}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}