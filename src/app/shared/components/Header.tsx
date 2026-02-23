import { useState, useRef, useEffect } from 'react';
import { Bell, UserPen, ArrowLeft, Users, Settings, Heart, Search, Menu, X, Home, MapPin, Calendar, Scissors, MessageSquare, Info, Map, LogOut, FileText, Mail } from 'lucide-react';
import logoAmooora from "../../../assets/2bcf17d7cfb76a60c14cf40243974d7d28fb3842.png";
import { supabase } from '../../infra/supabase';
import { AuthModal } from './AuthModal';
import { useAdmin } from '../hooks/useAdmin';
import { useUnreadNotificationsCount } from '../hooks/useUnreadNotificationsCount';

interface HeaderProps {
  onNavigate?: (page: string) => void;
  showBackButton?: boolean;
  onBack?: () => void;
  isAdmin?: boolean;
}

export function Header({ onNavigate, showBackButton, onBack, isAdmin: isAdminProp = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Verificar permissões de admin usando o hook
  const { isAdmin: isAdminFromHook, loading: adminLoading } = useAdmin();
  
  // Usar o hook se disponível, senão usar a prop (para compatibilidade)
  const isAdmin = isAdminFromHook || isAdminProp;
  const { count: unreadNotificationsCount } = useUnreadNotificationsCount();
  
  // Debug: log para verificar se admin está sendo detectado
  useEffect(() => {
    if (!adminLoading) {
      console.log('🔐 [Header] Status de admin:', {
        isAdminFromHook,
        isAdminProp,
        isAdmin,
        adminLoading,
      });
    }
  }, [isAdminFromHook, isAdminProp, isAdmin, adminLoading]);

  // Verificar se usuário está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const handleProfileClick = () => {
    if (isAuthenticated) {
      // Se autenticado, navegar para perfil
      onNavigate?.('profile');
    } else {
      // Se não autenticado, abrir modal
      setIsAuthModalOpen(true);
    }
  };

  const handleMenuClick = async (page: string) => {
    if (page === 'logout') {
      // Fazer logout completo
      try {
        console.log('🚪 Fazendo logout...');
        await supabase.auth.signOut();
        console.log('✅ Logout realizado com sucesso');
        
        // Atualizar estado de autenticação
        setIsAuthenticated(false);
        
        // Navegar para home após logout
        onNavigate?.('home');
      } catch (error) {
        console.error('❌ Erro ao fazer logout:', error);
        // Mesmo com erro, tentar navegar para home
        setIsAuthenticated(false);
        onNavigate?.('home');
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
    { icon: MessageSquare, label: 'Comunidade', page: 'todas-comunidades' },
    { icon: Map, label: 'Mapa', page: 'mapa' },
    // Mostrar "Meus Favoritos" e "Minhas Publicações" apenas se estiver logado
    ...(isAuthenticated ? [
      { icon: Heart, label: 'Meus Favoritos', page: 'favoritos' },
      { icon: FileText, label: 'Minhas Publicações', page: 'minhas-publicacoes' },
    ] : []),
    ...(isAdmin ? [{ icon: Settings, label: 'Admin', page: 'admin' }] : []),
    { icon: Mail, label: 'Fale Conosco', page: 'fale-conosco' },
    { icon: Info, label: 'Sobre Amooora', page: 'sobre-amooora' },
    // Mostrar "Sair" apenas se estiver logado
    ...(isAuthenticated ? [{ icon: LogOut, label: 'Sair', page: 'logout' }] : []),
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
          <button
            onClick={() => onNavigate?.('home')}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img
              src={logoAmooora}
              alt="Amooora"
              className="h-[70px]"
            />
          </button>
        </div>

        {/* Botões à direita */}
        <div className="flex items-center gap-2">
          {/* Botão de Notificação com badge */}
          <button 
            onClick={() => onNavigate?.('notifications')}
            className="relative w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <Bell className="w-5 h-5 text-white" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Botão de Perfil */}
          <button 
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-full bg-[#c4532f] flex items-center justify-center hover:bg-[#c4532f]/90 transition-colors"
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

      {/* Modal de Autenticação */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={() => onNavigate?.('login')}
        onSignUp={() => onNavigate?.('cadastro')}
      />
    </header>
  );
}