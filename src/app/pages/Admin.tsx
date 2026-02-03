import { ArrowLeft, UserPlus, MapPin, Calendar, Scissors, LogOut, Edit, Users, Shield, Eye } from 'lucide-react';
import { signOut } from '../../lib/auth';
import { useAdmin } from '../shared/hooks';

interface AdminProps {
  onNavigate: (page: string) => void;
}

export function Admin({ onNavigate }: AdminProps) {
  const { isAdminGeral, canManagePlaces, canManageEvents, canManageServices, loading } = useAdmin();

  const handleLogout = async () => {
    await signOut();
    // Navegar para welcome e recarregar para limpar o estado
    onNavigate('welcome');
    // Pequeno delay antes de recarregar para garantir que a navegação aconteça
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  const adminMenuItems = [
    ...(isAdminGeral
      ? [
          {
            id: 'admin-gerenciar-usuarios',
            title: 'Gerenciar Usuárias',
            description: 'Alterar perfis de acesso (role) e status',
            icon: Shield,
            color: 'bg-[#932d6f]',
          },
          {
            id: 'admin-cadastrar-usuario',
            title: 'Cadastrar Usuário',
            description: 'Criar novo usuário no sistema (MVP)',
            icon: UserPlus,
            color: 'bg-[#932d6f]',
          },
        ]
      : []),
    {
      id: 'admin-editar-conteudos',
      title: 'Editar Conteúdos',
      description: 'Editar locais, eventos, serviços e comunidades cadastrados',
      icon: Edit,
      color: 'bg-accent',
    },
    {
      id: 'admin-conteudos-desativados',
      title: 'Conteúdos Desativados',
      description: 'Visualizar e reativar conteúdos desativados por categoria',
      icon: Eye,
      color: 'bg-gray-500',
    },
    ...(canManagePlaces
      ? [
          {
            id: 'admin-cadastrar-local',
            title: 'Cadastrar Local',
            description: 'Adicionar novo local seguro ao sistema',
            icon: MapPin,
            color: 'bg-blue-500',
          },
        ]
      : []),
    ...(canManageServices
      ? [
          {
            id: 'admin-cadastrar-servico',
            title: 'Cadastrar Serviço',
            description: 'Adicionar novo serviço ao catálogo',
            icon: Scissors,
            color: 'bg-green-500',
          },
        ]
      : []),
    ...(canManageEvents
      ? [
          {
            id: 'admin-cadastrar-evento',
            title: 'Cadastrar Evento',
            description: 'Criar novo evento na plataforma',
            icon: Calendar,
            color: 'bg-orange-500',
          },
        ]
      : []),
    {
      id: 'admin-cadastrar-comunidade',
      title: 'Cadastrar Comunidade',
      description: 'Criar nova comunidade na plataforma',
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
             {/* Header */}
             <div className="px-5 py-4 flex items-center justify-between border-b border-border">
               <button
                 onClick={() => onNavigate('home')}
                 className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
               >
                 <ArrowLeft className="w-5 h-5 text-foreground" />
               </button>
               <h1 className="font-semibold text-lg text-primary">
                 Painel Administrativo
               </h1>
               <button
                 onClick={handleLogout}
                 className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                 title="Sair"
               >
                 <LogOut className="w-5 h-5 text-foreground" />
               </button>
             </div>

        {/* Content */}
        <div className="px-5 py-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Carregando...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Menu Items */}
              <div className="space-y-3">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="w-full p-4 bg-white border border-border rounded-xl hover:bg-muted transition-colors flex items-start gap-4 text-left"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

              {/* Warning */}
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800">
                  ⚠️ Acesso controlado por perfil (role) e status via Supabase (RLS).
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
