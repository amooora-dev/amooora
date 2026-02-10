import { useEffect, useMemo, useState } from 'react';
import { supabase } from './infra/supabase';
import { Welcome } from './pages/Welcome';
import { Home } from './pages/Home';
import { Locais, PlaceDetails, AdminCadastrarLocal, AdminEditarLocal } from './features/places';
import { Servicos } from './features/services';
import { Eventos } from './features/events';
import { Comunidade } from './features/communities';
import { Perfil } from './pages/Perfil';
import { EditarPerfil } from './pages/EditarPerfil';
import { Configuracoes } from './pages/Configuracoes';
import { Notificacoes } from './pages/Notificacoes';
import { PostDetails, MinhasComunidades } from './features/communities';
import { MeusFavoritos } from './pages/MeusFavoritos';
import { SobreAmooora } from './pages/SobreAmooora';
import { Mapa } from './pages/Mapa';
import { ServiceDetails, ServiceCategoryList } from './features/services';
import { EventDetails } from './features/events';
import { EventParticipants } from './features/events/pages/EventParticipants';
import { CreateReview } from './pages/CreateReview';
import { Admin } from './pages/Admin';
import { AdminCadastro } from './pages/AdminCadastro';
import { AdminCadastrarServico, AdminEditarServico } from './features/services';
import { AdminCadastrarEvento } from './features/events';
import { AdminEditarConteudos } from './pages/AdminEditarConteudos';
import { AdminEditarEvento } from './features/events';
import { AdminCadastrarComunidade, AdminEditarComunidade, CommunityDetails } from './features/communities';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { useAdmin, useAuth } from './shared/hooks';
import { AdminGerenciarUsuarios } from './pages/AdminGerenciarUsuarios';
import { MinhasPublicacoes } from './pages/MinhasPublicacoes';
import { AdminConteudosDesativados } from './pages/AdminConteudosDesativados';
import { ViewProfile } from './pages/ViewProfile';
import { FaleConosco } from './pages/FaleConosco';
import { TodasComunidades } from './pages/TodasComunidades';
import { Amigos, AmigosSearch } from './features/friends';
import { Busca } from './pages/Busca';

export default function App() {
  // TEMPORARIAMENTE: começar na home ao invés de welcome
  const [currentPage, setCurrentPage] = useState('home'); // Era 'welcome'
  const [previousPage, setPreviousPage] = useState('home');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(undefined);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>(undefined);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | undefined>(undefined);
  const [selectedParticipantEventId, setSelectedParticipantEventId] = useState<string | undefined>(undefined);
  const [selectedViewProfileUserId, setSelectedViewProfileUserId] = useState<string | undefined>(undefined);

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  // Usar hook useAuth para verificar autenticação corretamente
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isAdmin, isAdminGeral, status: accessStatus, loading: accessLoading } = useAdmin();

  // Todas as páginas são públicas (navegação livre)
  const publicPages = useMemo(
    () =>
      new Set([
        'welcome',
        'login',
        'cadastro',
        'splash',
        'home',
        'places',
        'services',
        'events',
        'community',
        'todas-comunidades',
        'mapa',
        'perfil',
        'edit-profile',
        'favoritos',
        'configuracoes',
        'notificacoes',
        'sobre-amooora',
        'place-details',
        'event-details',
        'service-details',
        'post-details',
        'community-details',
        'event-participants',
        'view-profile',
        'create-review',
        'minhas-comunidades',
        'minhas-publicacoes',
        'friends',
        'friends-requests',
        'friends-search',
        'busca',
      ]),
    []
  );

  // useAuth hook já gerencia a autenticação, não precisamos de useEffect adicional

  // Detectar URL ao carregar a página e navegar para a página correta
  useEffect(() => {
    const hash = window.location.hash;
    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    
    // Verificar se é callback de verificação de email do Supabase
    // O Supabase adiciona tokens na URL quando o usuário clica no link de verificação
    const accessToken = searchParams.get('access_token');
    const type = searchParams.get('type');
    const verified = searchParams.get('verified');
    
    if (accessToken || type === 'recovery' || verified === 'true') {
      // Limpar a URL dos parâmetros de verificação
      const cleanUrl = window.location.origin + window.location.pathname + (hash || '');
      window.history.replaceState({}, '', cleanUrl);
      
      // Se houver token, o Supabase já processou a sessão automaticamente
      // O hook useAuth já detecta mudanças na sessão automaticamente
      
      // Se foi verificação de email, navegar para login com mensagem
      if (verified === 'true' || type === 'signup') {
        setCurrentPage('login');
        return;
      }
    }
    
    // Verificar se há hash na URL (formato: #/event-details/id)
    if (hash) {
      const hashPath = hash.replace('#/', '');
      const parts = hashPath.split('/');
      
      if (parts.length === 2) {
        const [pageType, id] = parts;
        
        if (pageType === 'event-details' && id) {
          setSelectedEventId(id);
          setCurrentPage('event-details');
          setPreviousPage('home');
          return;
        } else if (pageType === 'place-details' && id) {
          setSelectedPlaceId(id);
          setCurrentPage('place-details');
          setPreviousPage('home');
          return;
        } else if (pageType === 'service-details' && id) {
          setSelectedServiceId(id);
          setCurrentPage('service-details');
          setPreviousPage('home');
          return;
        } else if (pageType === 'post-details' && id) {
          setSelectedPostId(id);
          setCurrentPage('post-details');
          setPreviousPage('todas-comunidades');
          return;
        }
      }
    }
    
    // Verificar se há pathname direto (formato: /event-details/id)
    if (pathname && pathname !== '/') {
      const pathParts = pathname.split('/').filter(Boolean);
      
      if (pathParts.length === 2) {
        const [pageType, id] = pathParts;
        
        if (pageType === 'event-details' && id) {
          setSelectedEventId(id);
          setCurrentPage('event-details');
          setPreviousPage('home');
          return;
        } else if (pageType === 'place-details' && id) {
          setSelectedPlaceId(id);
          setCurrentPage('place-details');
          setPreviousPage('home');
          return;
        } else if (pageType === 'service-details' && id) {
          setSelectedServiceId(id);
          setCurrentPage('service-details');
          setPreviousPage('home');
          return;
        } else if (pageType === 'post-details' && id) {
          setSelectedPostId(id);
          setCurrentPage('post-details');
          setPreviousPage('todas-comunidades');
          return;
        }
      }
    }
    
    // Verificar formato antigo com dois pontos (compatibilidade)
    const url = window.location.href;
    const oldFormatMatch = url.match(/(event-details|place-details|service-details|post-details):([a-f0-9-]+)/i);
    
    if (oldFormatMatch) {
      const [, pageType, id] = oldFormatMatch;
      
      if (pageType === 'event-details') {
        setSelectedEventId(id);
        setCurrentPage('event-details');
        setPreviousPage('home');
      } else if (pageType === 'place-details') {
        setSelectedPlaceId(id);
        setCurrentPage('place-details');
        setPreviousPage('home');
      } else if (pageType === 'service-details') {
        setSelectedServiceId(id);
        setCurrentPage('service-details');
        setPreviousPage('home');
      } else if (pageType === 'post-details') {
        setSelectedPostId(id);
        setCurrentPage('post-details');
        setPreviousPage('todas-comunidades');
      }
    }
  }, []);

  const handleNavigate = (page: string) => {
    console.log('🧭 handleNavigate chamado:', { page, authLoading, isAuthenticated, isPublic: publicPages.has(page) });
    
    // Redirecionar 'community' para 'todas-comunidades' quando vindo do BottomNav
    if (page === 'community') {
      page = 'todas-comunidades';
    }
    
    // TEMPORARIAMENTE: remover gate de acesso - permitir navegação livre
    // TODO: Reativar quando necessário
    /* CÓDIGO ORIGINAL COMENTADO - REATIVAR QUANDO NECESSÁRIO
    // Gate de acesso: site fechado
    if (!authLoading && !isAuthenticated && !publicPages.has(page)) {
      console.log('🚫 Acesso negado - redirecionando para welcome');
      setPreviousPage(currentPage);
      setCurrentPage('welcome');
      return;
    }
    */

    console.log('✅ Navegação permitida para:', page);
    setPreviousPage(currentPage);
    
    // Verificar se a página contém um ID (formato: 'place-details:id', 'event-details:id' ou 'service-details:id')
    if (page.startsWith('place-details:')) {
      const placeId = page.split(':')[1];
      setSelectedPlaceId(placeId);
      setCurrentPage('place-details');
    } else if (page.startsWith('event-details:')) {
      const eventId = page.split(':')[1];
      setSelectedEventId(eventId);
      setCurrentPage('event-details');
    } else if (page.startsWith('service-details:')) {
      const serviceId = page.split(':')[1];
      setSelectedServiceId(serviceId);
      setCurrentPage('service-details');
    } else if (page.startsWith('services:')) {
      // Formato: 'services:Categoria' - navegar para serviços com categoria pré-selecionada
      const category = page.split(':')[1];
      setSelectedCategory(category);
      setCurrentPage('services');
    } else if (page.startsWith('post-details:')) {
      const postId = page.split(':')[1];
      setSelectedPostId(postId);
      setCurrentPage('post-details');
    } else if (page.startsWith('event-participants:')) {
      const eventId = page.split(':')[1];
      setSelectedParticipantEventId(eventId);
      setCurrentPage('event-participants');
    } else if (page.startsWith('view-profile:')) {
      const userId = page.split(':')[1];
      setSelectedViewProfileUserId(userId);
      setCurrentPage('view-profile');
    } else if (page.startsWith('create-review:')) {
      // Formato: 'create-review:place:id', 'create-review:service:id', 'create-review:event:id', 'create-review:community:id'
      const parts = page.split(':');
      const itemType = parts[1]; // place, service, event ou community
      const itemId = parts[2];
      
      if (itemType === 'place') {
        setSelectedPlaceId(itemId);
      } else if (itemType === 'service') {
        setSelectedServiceId(itemId);
      } else if (itemType === 'event') {
        setSelectedEventId(itemId);
      } else if (itemType === 'community') {
        setSelectedCommunityId(itemId);
      }
      setCurrentPage('create-review');
    } else if (page.startsWith('admin-editar-local:')) {
      const placeId = page.split(':')[1];
      setSelectedPlaceId(placeId);
      setCurrentPage('admin-editar-local');
    } else if (page.startsWith('admin-editar-evento:')) {
      const eventId = page.split(':')[1];
      setSelectedEventId(eventId);
      setCurrentPage('admin-editar-evento');
    } else if (page.startsWith('admin-editar-servico:')) {
      const serviceId = page.split(':')[1];
      setSelectedServiceId(serviceId);
      setCurrentPage('admin-editar-servico');
    } else if (page.startsWith('admin-editar-comunidade:')) {
      const communityId = page.split(':')[1];
      setSelectedServiceId(communityId); // Reutilizando selectedServiceId temporariamente
      setCurrentPage('admin-editar-comunidade');
    } else if (page.startsWith('community-details:')) {
      const communityId = page.split(':')[1];
      setSelectedCommunityId(communityId);
      setCurrentPage('community-details');
    } else {
      setSelectedCategory(undefined); // Limpar categoria ao navegar para outras páginas
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    console.log('🎨 renderPage chamado:', { currentPage, authLoading, accessLoading, isAuthenticated });
    
    // Permitir páginas públicas mesmo durante loading (para login/cadastro funcionarem)
    const isPublicPage = publicPages.has(currentPage);
    
    // Todas as páginas são públicas - renderizar normalmente
    // (código de verificação de autenticação está comentado)
    if (isPublicPage) {
      // Renderizar a página normalmente
    } else {
      // TEMPORARIAMENTE: permitir acesso a todas as páginas sem autenticação
      // TODO: Reativar verificação quando necessário
      /* CÓDIGO ORIGINAL COMENTADO - REATIVAR QUANDO NECESSÁRIO
      // Para páginas privadas: se temos indicação otimista de autenticação,
      // manter a página atual durante o loading para evitar "piscar"
      if (authLoading || accessLoading) {
        // Se temos indicação otimista de autenticação, não redirecionar
        // A página será renderizada normalmente abaixo
        if (!isAuthenticated) {
          console.log('⏳ Ainda carregando auth, mostrando Welcome');
          return <Welcome onNavigate={handleNavigate} />;
        } else {
          console.log('⏳ Carregando sessão, mas mantendo página atual (otimista)');
          // Continuar para renderizar a página normalmente
        }
      }

      // Se não autenticada e tentando acessar página privada, volta para welcome
      // Mas só depois que o loading terminou
      if (!authLoading && !accessLoading && !isAuthenticated) {
        return <Welcome onNavigate={handleNavigate} />;
      }
      */
    }

    // Usuária bloqueada/inativa: impedir uso do app
    if (isAuthenticated && accessStatus && accessStatus !== 'active') {
      return (
        <div className="min-h-screen bg-muted">
          <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-xl font-semibold text-primary mb-2">Acesso indisponível</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Sua conta está {accessStatus === 'blocked' ? 'bloqueada' : 'inativa'}. Entre em contato com o suporte.
            </p>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setCurrentPage('welcome');
              }}
              className="w-full bg-primary text-white py-4 px-6 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg"
            >
              Sair
            </button>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'welcome':
        return <Welcome onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'cadastro':
        return <Cadastro onNavigate={handleNavigate} />;
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'places':
        return <Locais onNavigate={handleNavigate} />;
      case 'place-details':
        return <PlaceDetails 
          placeId={selectedPlaceId}
          onNavigate={handleNavigate} 
          onBack={() => {
            setCurrentPage(previousPage === 'places' ? 'places' : 'home');
            setSelectedPlaceId(undefined);
          }} 
        />;
      case 'create-review':
        // Determinar qual tipo de item baseado nos IDs disponíveis
        if (selectedPlaceId) {
          return <CreateReview 
            onNavigate={handleNavigate} 
            placeId={selectedPlaceId}
            itemType="place"
            onBack={() => {
              setCurrentPage('place-details');
            }}
          />;
        } else if (selectedServiceId) {
          return <CreateReview 
            onNavigate={handleNavigate} 
            serviceId={selectedServiceId}
            itemType="service"
            onBack={() => {
              setCurrentPage('service-details');
            }}
          />;
        } else if (selectedEventId) {
          return <CreateReview 
            onNavigate={handleNavigate} 
            eventId={selectedEventId}
            itemType="event"
            onBack={() => {
              setCurrentPage('event-details');
            }}
          />;
        } else if (selectedCommunityId) {
          return <CreateReview 
            onNavigate={handleNavigate} 
            communityId={selectedCommunityId}
            itemType="community"
            itemName="esta comunidade"
            onBack={() => {
              setCurrentPage('community-details');
              setSelectedCommunityId(undefined);
            }}
          />;
        }
        return <CreateReview onNavigate={handleNavigate} />;
      case 'services':
        return <Servicos onNavigate={handleNavigate} initialCategory={selectedCategory} />;
      case 'service-details':
        return <ServiceDetails 
          serviceId={selectedServiceId}
          onNavigate={handleNavigate} 
          onBack={() => {
            setCurrentPage('services');
            setSelectedServiceId(undefined);
          }} 
        />;
      case 'service-category-terapia':
        return <ServiceCategoryList category="terapia" onNavigate={handleNavigate} onBack={() => setCurrentPage('home')} />;
      case 'service-category-advocacia':
        return <ServiceCategoryList category="advocacia" onNavigate={handleNavigate} onBack={() => setCurrentPage('home')} />;
      case 'service-category-saude':
        return <ServiceCategoryList category="saude" onNavigate={handleNavigate} onBack={() => setCurrentPage('home')} />;
      case 'service-category-carreira':
        return <ServiceCategoryList category="carreira" onNavigate={handleNavigate} onBack={() => setCurrentPage('home')} />;
      case 'events':
        return <Eventos onNavigate={handleNavigate} />;
      case 'event-details':
        return (
          <EventDetails 
            eventId={selectedEventId}
            onNavigate={handleNavigate} 
            onBack={() => {
              setCurrentPage(previousPage === 'events' ? 'events' : 'home');
              setSelectedEventId(undefined);
            }} 
          />
        );
      case 'event-participants':
        return (
          <EventParticipants
            eventId={selectedParticipantEventId}
            onNavigate={handleNavigate}
            onBack={() => {
              setCurrentPage('event-details');
              setSelectedParticipantEventId(undefined);
            }}
          />
        );
      case 'view-profile':
        return (
          <ViewProfile
            userId={selectedViewProfileUserId}
            onNavigate={handleNavigate}
            onBack={() => {
              setCurrentPage(previousPage);
              setSelectedViewProfileUserId(undefined);
            }}
          />
        );
      case 'community':
        return <Comunidade onNavigate={handleNavigate} />;
      case 'todas-comunidades':
        return <TodasComunidades onNavigate={handleNavigate} />;
      case 'community-details':
        return (
          <CommunityDetails
            communityId={selectedCommunityId || ''}
            onNavigate={handleNavigate}
            onBack={() => {
              setCurrentPage('todas-comunidades');
              setSelectedCommunityId(undefined);
            }}
          />
        );
      case 'minhas-comunidades':
        return (
          <MinhasComunidades 
            onNavigate={handleNavigate}
            onBack={() => setCurrentPage('todas-comunidades')}
          />
        );
      case 'post-details':
        return (
          <PostDetails 
            postId={selectedPostId || ''}
            onNavigate={handleNavigate}
            onBack={() => {
              setCurrentPage('todas-comunidades');
              setSelectedPostId(undefined);
            }}
          />
        );
      case 'profile':
        return <Perfil onNavigate={handleNavigate} />;
      case 'edit-profile':
        return <EditarPerfil onNavigate={handleNavigate} />;
      case 'settings':
        return <Configuracoes onBack={() => setCurrentPage('profile')} />;
      case 'notifications':
        return <Notificacoes onNavigate={handleNavigate} />;
      case 'favoritos':
        return <MeusFavoritos onNavigate={handleNavigate} />;
      case 'minhas-publicacoes':
        return <MinhasPublicacoes onNavigate={handleNavigate} />;
      case 'friends':
        return (
          <Amigos
            onNavigate={handleNavigate}
            onBack={() => setCurrentPage('profile')}
          />
        );
      case 'friends-requests':
        return (
          <Amigos
            onNavigate={handleNavigate}
            onBack={() => setCurrentPage('profile')}
            initialTab="solicitacoes"
          />
        );
      case 'friends-search':
        return (
          <AmigosSearch
            onNavigate={handleNavigate}
            onBack={() => setCurrentPage('friends')}
          />
        );
      case 'busca':
        return (
          <Busca
            onNavigate={handleNavigate}
            onBack={() => setCurrentPage('profile')}
          />
        );
      case 'admin':
        return isAdmin ? <Admin onNavigate={handleNavigate} /> : <Home onNavigate={handleNavigate} />;
      case 'admin-cadastrar-usuario':
        return isAdminGeral ? <AdminCadastro onNavigate={handleNavigate} /> : <Home onNavigate={handleNavigate} />;
      case 'admin-gerenciar-usuarios':
        return isAdminGeral ? <AdminGerenciarUsuarios onNavigate={handleNavigate} /> : <Home onNavigate={handleNavigate} />;
      case 'admin-cadastrar-local':
        return <AdminCadastrarLocal onNavigate={handleNavigate} />;
      case 'admin-cadastrar-servico':
        return <AdminCadastrarServico onNavigate={handleNavigate} />;
      case 'admin-cadastrar-evento':
        return <AdminCadastrarEvento onNavigate={handleNavigate} />;
      case 'admin-cadastrar-comunidade':
        return <AdminCadastrarComunidade onNavigate={handleNavigate} />;
      case 'admin-editar-conteudos':
        return isAdmin ? <AdminEditarConteudos onNavigate={handleNavigate} /> : <Home onNavigate={handleNavigate} />;
      case 'admin-editar-local':
        return isAdmin ? <AdminEditarLocal placeId={selectedPlaceId} onNavigate={handleNavigate} /> : <Home onNavigate={handleNavigate} />;
      case 'admin-editar-evento':
        return isAdmin ? <AdminEditarEvento eventId={selectedEventId} onNavigate={handleNavigate} /> : <Home onNavigate={handleNavigate} />;
      case 'admin-editar-servico':
        return isAdmin ? <AdminEditarServico serviceId={selectedServiceId} onNavigate={handleNavigate} /> : <Home onNavigate={handleNavigate} />;
      case 'admin-editar-comunidade':
        return isAdmin ? <AdminEditarComunidade communityId={selectedServiceId} onNavigate={handleNavigate} /> : <Home onNavigate={handleNavigate} />;
      case 'admin-conteudos-desativados':
        return isAdmin ? <AdminConteudosDesativados onNavigate={handleNavigate} /> : <Home onNavigate={handleNavigate} />;
      case 'fale-conosco':
        return (
          <FaleConosco 
            onNavigate={handleNavigate}
            onBack={() => setCurrentPage('home')}
          />
        );
      case 'sobre-amooora':
        return (
          <SobreAmooora 
            onNavigate={handleNavigate}
            onBack={() => setCurrentPage('home')}
          />
        );
      case 'mapa':
        try {
          return (
            <Mapa 
              onNavigate={handleNavigate}
              onBack={() => setCurrentPage('home')}
            />
          );
        } catch (error) {
          return <div>Erro ao carregar mapa: {error instanceof Error ? error.message : String(error)}</div>;
        }
      default:
        return <Welcome onNavigate={handleNavigate} />;
    }
  };

  return renderPage();
}