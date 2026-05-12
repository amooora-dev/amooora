/**
 * Apenas em desenvolvimento: permite abrir uma tela via query string para testes e exportação de screenshots.
 * Ex.: http://localhost:5173/?screen=login
 * IDs opcionais: placeId, eventId, serviceId, postId, communityId, participantEventId, viewProfileUserId, friendChatUserId, perfilProfissionalUserId, category
 *
 * Em produção (build) sempre retorna null — parâmetros são ignorados.
 */

const ALLOWED_SCREENS = new Set([
  'welcome',
  'login',
  'cadastro',
  'home',
  'places',
  'place-details',
  'create-review',
  'services',
  'service-details',
  'service-category-terapia',
  'service-category-advocacia',
  'service-category-saude',
  'service-category-carreira',
  'events',
  'event-details',
  'event-participants',
  'view-profile',
  'community',
  'todas-comunidades',
  'community-details',
  'minhas-comunidades',
  'post-details',
  'profile',
  'edit-profile',
  'settings',
  'notifications',
  'favoritos',
  'minhas-publicacoes',
  'friends',
  'friend-chat',
  'friends-requests',
  'friends-search',
  'busca',
  'perfil-locais-favoritos',
  'perfil-meus-eventos',
  'perfil-servicos-favoritos',
  'edit-perfil-profissional',
  'perfil-profissional',
  'admin',
  'admin-cadastrar-usuario',
  'admin-gerenciar-usuarios',
  'admin-cadastrar-local',
  'admin-cadastrar-servico',
  'admin-cadastrar-evento',
  'admin-cadastrar-comunidade',
  'admin-editar-conteudos',
  'admin-editar-local',
  'admin-editar-evento',
  'admin-editar-servico',
  'admin-editar-comunidade',
  'admin-conteudos-desativados',
  'curadoria',
  'fale-conosco',
  'sobre-amooora',
  'mapa',
]);

export type DevScreenSnapshot = {
  currentPage: string;
  previousPage: string;
  selectedPlaceId?: string;
  selectedEventId?: string;
  selectedServiceId?: string;
  selectedPostId?: string;
  selectedCommunityId?: string;
  selectedParticipantEventId?: string;
  selectedViewProfileUserId?: string;
  selectedFriendChatUserId?: string;
  selectedPerfilProfissionalUserId?: string;
  selectedCategory?: string;
};

export function parseDevScreenParams(): DevScreenSnapshot | null {
  if (import.meta.env.PROD) return null;

  const url = new URL(window.location.href);
  const screen = url.searchParams.get('screen');
  if (!screen || !ALLOWED_SCREENS.has(screen)) return null;

  const placeId = url.searchParams.get('placeId') ?? undefined;
  const eventId = url.searchParams.get('eventId') ?? undefined;
  const serviceId = url.searchParams.get('serviceId') ?? undefined;
  const postId = url.searchParams.get('postId') ?? undefined;
  const communityId = url.searchParams.get('communityId') ?? undefined;
  const participantEventId = url.searchParams.get('participantEventId') ?? undefined;
  const viewProfileUserId = url.searchParams.get('viewProfileUserId') ?? undefined;
  const friendChatUserId = url.searchParams.get('friendChatUserId') ?? undefined;
  const perfilProfissionalUserId = url.searchParams.get('perfilProfissionalUserId') ?? undefined;
  const category = url.searchParams.get('category') ?? undefined;

  let selectedServiceId = serviceId;
  if (screen === 'admin-editar-comunidade' && communityId) {
    selectedServiceId = communityId;
  }

  return {
    currentPage: screen,
    previousPage: 'home',
    selectedPlaceId: placeId,
    selectedEventId: eventId,
    selectedServiceId,
    selectedPostId: postId,
    selectedCommunityId: communityId,
    selectedParticipantEventId: participantEventId,
    selectedViewProfileUserId: viewProfileUserId,
    selectedFriendChatUserId: friendChatUserId,
    selectedPerfilProfissionalUserId: perfilProfissionalUserId,
    selectedCategory: category,
  };
}

export function getInitialAppSnapshot(): DevScreenSnapshot {
  const parsed = parseDevScreenParams();
  return {
    currentPage: parsed?.currentPage ?? 'home',
    previousPage: parsed?.previousPage ?? 'home',
    selectedPlaceId: parsed?.selectedPlaceId,
    selectedEventId: parsed?.selectedEventId,
    selectedServiceId: parsed?.selectedServiceId,
    selectedPostId: parsed?.selectedPostId,
    selectedCommunityId: parsed?.selectedCommunityId,
    selectedParticipantEventId: parsed?.selectedParticipantEventId,
    selectedViewProfileUserId: parsed?.selectedViewProfileUserId,
    selectedFriendChatUserId: parsed?.selectedFriendChatUserId,
    selectedPerfilProfissionalUserId: parsed?.selectedPerfilProfissionalUserId,
    selectedCategory: parsed?.selectedCategory,
  };
}
