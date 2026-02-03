import { Calendar, Clock, MapPin, Users, Heart, Share2, Star, User, MessageCircle, CheckCircle2, Send, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { ImageWithFallback, AuthTooltip } from '../../../shared/components';
import { Header } from '../../../shared/components';
import { BottomNav } from '../../../shared/components';
import { InteractiveMap } from '../../../components/InteractiveMap';
import { useEvent } from '../hooks/useEvents';
import { useEventReviews, useAuth } from '../../../shared/hooks';
import { useEventInteractions } from '../hooks/useEventInteractions';
import { useEventParticipants } from '../hooks/useEventParticipants';
import { Review } from '../../../shared/types';
import { calculateAverageRating } from '../../../shared/services';
import { shareContent, getShareUrl, getShareText } from '../../../shared/utils';
import { geocodeAddress } from '../../../shared/services';

interface ReviewWithReplies extends Review {
  likes?: number;
  replies?: ReviewWithReplies[];
}

interface EventDetailsProps {
  eventId?: string;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

// Componente wrapper para tratar erros do mapa
function MapWrapper({ 
  mapLocation, 
  eventCoordinates, 
  onError 
}: { 
  mapLocation: any; 
  eventCoordinates: { lat: number; lng: number } | null;
  onError: () => void;
}) {
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Erro no mapa:', error);
      onError();
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [onError]);

  try {
    return (
      <InteractiveMap
        locations={[mapLocation]}
        center={eventCoordinates || undefined}
        height="256px"
        zoom={15}
      />
    );
  } catch (err) {
    console.error('Erro ao renderizar mapa:', err);
    onError();
    return (
      <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-sm text-gray-500">Não foi possível carregar o mapa</p>
      </div>
    );
  }
}

export function EventDetails({ eventId, onNavigate, onBack }: EventDetailsProps) {
  const { event, loading, error } = useEvent(eventId);
  const { reviews: realReviews, loading: reviewsLoading, refetch: refetchReviews } = useEventReviews(eventId);
  const { participants, count: participantsCount, loading: participantsLoading, refetch: refetchParticipants } = useEventParticipants(eventId);
  const { isAuthenticated } = useAuth();
  const { isInterested, isAttended, toggleInterest, toggleAttendance } = useEventInteractions(eventId, {
    onInterestChange: () => {
      // Recarregar lista de participantes após mudança de interesse
      setTimeout(() => {
        refetchParticipants();
      }, 500);
    },
    onAttendanceChange: () => {
      // Recarregar lista de participantes após mudança de participação
      setTimeout(() => {
        refetchParticipants();
      }, 500);
    },
  });
  const [shareSuccess, setShareSuccess] = useState(false);
  const [eventCoordinates, setEventCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showAuthTooltip, setShowAuthTooltip] = useState(false);
  const [mapError, setMapError] = useState(false);

  const handleInterestClick = () => {
    if (!isAuthenticated) {
      setShowAuthTooltip(true);
      return;
    }
    toggleInterest();
  };

  const handleAttendanceClick = () => {
    if (!isAuthenticated) {
      setShowAuthTooltip(true);
      return;
    }
    toggleAttendance();
  };

  const handleReviewClick = () => {
    if (!isAuthenticated) {
      setShowAuthTooltip(true);
      return;
    }
    if (eventId) {
      onNavigate?.(`create-review:event:${eventId}`);
    }
  };

  const handleShare = async () => {
    if (!event || !eventId) return;
    
    const shared = await shareContent({
      title: event.name,
      text: getShareText('event', event.name),
      url: getShareUrl('event', eventId),
    });

    if (shared) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  // Converter reviews reais para o formato esperado
  const reviews: ReviewWithReplies[] = realReviews.map(review => ({
    ...review,
    avatar: review.avatar || review.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTcwMTY1NzYwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    author: review.author || review.userName || 'Usuário',
    date: review.date || (review.createdAt ? new Date(review.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'),
  }));

  // Calcular rating médio e contagem
  const averageRating = reviews.length > 0 ? calculateAverageRating(reviews) : 0;
  const reviewCount = reviews.length;

  // Escutar evento customizado de atualização de reviews (apenas quando necessário)
  useEffect(() => {
    if (!eventId) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const handleReviewCreated = (e: Event) => {
      const customEvent = e as CustomEvent;
      // Verificar se o evento é para este eventId específico
      if (customEvent.detail?.eventId && customEvent.detail.eventId !== eventId) {
        console.log('[EventDetails] Review criado para outro evento, ignorando');
        return;
      }

      console.log('[EventDetails] Review criado, aguardando antes de refetch...');
      // Limpar timeout anterior se existir
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Pequeno delay para garantir que o banco foi atualizado
      timeoutId = setTimeout(() => {
        console.log('[EventDetails] Fazendo refetch após criação de review');
        refetchReviews();
      }, 800);
    };

    const handleFocus = () => {
      console.log('[EventDetails] Window focus, fazendo refetch');
      if (eventId) {
        refetchReviews();
      }
    };

    window.addEventListener('review-created', handleReviewCreated);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('review-created', handleReviewCreated);
      window.removeEventListener('focus', handleFocus);
    };
  }, [eventId, refetchReviews]);

  // Geocodificar endereço do evento quando disponível
  useEffect(() => {
    if (!event?.location || event.location === 'Local não informado') {
      setEventCoordinates(null);
      return;
    }

    const loadEventCoordinates = async () => {
      setGeocodingLoading(true);
      try {
        const result = await geocodeAddress(event.location);
        if (result) {
          setEventCoordinates({ lat: result.lat, lng: result.lng });
        } else {
          setEventCoordinates(null);
        }
      } catch (error) {
        console.error('Erro ao fazer geocoding do evento:', error);
        setEventCoordinates(null);
      } finally {
        setGeocodingLoading(false);
      }
    };

    loadEventCoordinates();
  }, [event?.location]);

  // Preparar location para o InteractiveMap
  const mapLocation = useMemo(() => {
    if (!eventCoordinates || !event) return null;

    return {
      id: event.id,
      name: event.name,
      address: event.location,
      lat: eventCoordinates.lat,
      lng: eventCoordinates.lng,
      category: event.category,
      imageUrl: event.image || event.imageUrl,
      type: 'event' as const,
    };
  }, [eventCoordinates, event]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star 
            key={index}
            className={`w-3.5 h-3.5 ${index < rating ? 'fill-primary text-primary' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <p className="text-muted-foreground mb-2">Carregando evento...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <p className="text-red-500 mb-2">Erro ao carregar evento</p>
              <p className="text-sm text-muted-foreground">
                {error?.message || 'Evento não encontrado'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formatar data do evento
  const eventDate = new Date(event.date);
  const dayOfWeek = eventDate.toLocaleDateString('pt-BR', { weekday: 'long' });
  const formattedDate = eventDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  const startTime = event.time || eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  
  // Imagens do evento
  const eventImages = event.image || event.imageUrl 
    ? [event.image || event.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80']
    : ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'];

  // Dados formatados para exibição
  const displayEvent = {
    name: event.name,
    description: event.description || 'Sem descrição disponível.',
    date: formattedDate,
    dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
    startTime: startTime,
    endTime: '', // Não temos esse campo no banco ainda
    location: event.location || 'Local não informado',
    address: '', // Não temos esse campo no banco ainda
    price: event.price && event.price > 0 ? `R$ ${event.price.toFixed(2)}` : 'Gratuito',
    priceDetails: event.price && event.price > 0 ? 'Ingresso pago' : 'Entrada gratuita',
    goingCount: event.participants || 0,
    interestedCount: 0, // Não temos esse campo no banco ainda
    category: event.category || 'Evento',
    images: eventImages,
    tags: [event.category || 'Evento'], // Usar categoria como tag por enquanto
    rules: [
      'Espaço seguro e livre de LGBTfobia',
      'Respeito aos participantes',
    ],
    attendees: [], // Lista vazia por enquanto - será implementado depois
  };


  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col relative">
        {/* Header fixo */}
        <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />

        {/* Conteúdo scrollável - padding-top para compensar header fixo */}
        <div className="flex-1 overflow-y-auto pb-32 pt-24">
          {/* Galeria de Fotos */}
          <div className="relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {displayEvent.images.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0 snap-start">
                  <ImageWithFallback
                    src={image}
                    alt={`${displayEvent.name} - ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Indicador de Fotos */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {displayEvent.images.map((_, index) => (
                <div
                  key={index}
                  className="w-1.5 h-1.5 rounded-full bg-white/80"
                />
              ))}
            </div>
            {/* Botão Favoritar */}
            <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
              <Heart className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Informações Principais */}
          <div className="bg-white px-4 py-5">
            {/* Nome do Evento */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {displayEvent.name}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {displayEvent.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Descrição */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {displayEvent.description}
            </p>
          </div>

          {/* Informações de Data e Hora */}
          <div className="bg-[#fffbfa] px-4 py-4 border-y border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3">Quando</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{displayEvent.date}</p>
                  <p className="text-sm text-gray-600">{displayEvent.dayOfWeek}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {displayEvent.startTime}
                  </p>
                  <p className="text-sm text-gray-600">Horário de Brasília</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações de Local */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3">Onde</h3>
            
            {/* Endereço acima do mapa */}
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 leading-tight">
                  {displayEvent.name} - {displayEvent.location}
                </p>
                {displayEvent.address && (
                  <p className="text-sm text-gray-600 mt-1">{displayEvent.address}</p>
                )}
              </div>
            </div>

            {/* Mapa com endereço do evento */}
            {displayEvent.location && displayEvent.location !== 'Local não informado' && (
              <>
                {geocodingLoading ? (
                  <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                    <p className="text-sm text-gray-500">Carregando mapa...</p>
                  </div>
                ) : mapLocation && !mapError ? (
                  <div className="w-full h-64 rounded-xl overflow-hidden mb-3">
                    <MapWrapper
                      mapLocation={mapLocation}
                      eventCoordinates={eventCoordinates}
                      onError={() => setMapError(true)}
                    />
                  </div>
                ) : mapError ? (
                  <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                    <p className="text-sm text-gray-500">Não foi possível carregar o mapa</p>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                    <p className="text-sm text-gray-500">Não foi possível carregar o mapa</p>
                  </div>
                )}

                {/* Botão "Ver no Google Maps" */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayEvent.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-3 py-3 px-4 text-sm text-primary font-semibold border border-primary rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                  Ver no Google Maps
                  <MapPin className="w-4 h-4" />
                </a>
              </>
            )}
            
            {/* Mensagem se não houver localização */}
            {(!displayEvent.location || displayEvent.location === 'Local não informado') && (
              <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-sm text-gray-500">Localização não informada</p>
              </div>
            )}
          </div>

          {/* Preço/Ingresso */}
          <div className="bg-[#fffbfa] px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-2">Ingresso</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg text-primary">{displayEvent.price}</p>
                <p className="text-sm text-gray-600">{displayEvent.priceDetails}</p>
              </div>
            </div>
          </div>

          {/* Participantes */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900">Participantes</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{participantsCount} {participantsCount === 1 ? 'confirmada' : 'confirmadas'}</span>
              </div>
            </div>

            {/* Thumbs dos 5 primeiros participantes */}
            {participantsLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : participants.length > 0 ? (
              <>
                <div 
                  onClick={() => onNavigate?.(`event-participants:${eventId}`)}
                  className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                >
                  <div className="flex -space-x-2 flex-1">
                    {participants.slice(0, 5).map((participant) => (
                      <div
                        key={participant.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate?.(`view-profile:${participant.user_id}`);
                        }}
                        className="relative"
                      >
                        <ImageWithFallback
                          src={participant.profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTcwMTY1NzYwMHww&ixlib=rb-4.1.0&q=80&w=1080'}
                          alt={participant.profile.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                        />
                      </div>
                    ))}
                  </div>
                  {participantsCount > 5 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate?.(`event-participants:${eventId}`);
                      }}
                      className="flex items-center gap-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                    >
                      Ver todos
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Nenhum participante confirmado ainda</p>
            )}

            {/* Contador de Interessadas */}
            {displayEvent.interestedCount > 0 && (
              <div className="text-sm text-gray-600">
                <Heart className="w-4 h-4 inline mr-1" />
                {displayEvent.interestedCount} pessoas interessadas
              </div>
            )}
          </div>

          {/* Regras do Evento */}
          <div className="bg-[#fffbfa] px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3">Regras e Orientações</h3>
            <ul className="space-y-2">
              {displayEvent.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-primary mt-1">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Botões de Ação Secundários */}
          <div className="bg-white px-4 py-3 border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-1.5 bg-[#F5EBFF] text-primary rounded-full text-sm font-medium whitespace-nowrap hover:bg-[#E5D5F0] transition-colors border border-primary/10"
              >
                <Share2 className="w-4 h-4" />
                {shareSuccess ? 'Link copiado!' : 'Compartilhar'}
              </button>
              <button 
                onClick={handleInterestClick}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                  isInterested
                    ? 'bg-[#E5D5F0] text-[#932d6f] border-[#932d6f]/30'
                    : 'bg-[#F5EBFF] text-primary border-primary/10 hover:bg-[#E5D5F0]'
                }`}
              >
                <Star className={`w-4 h-4 ${isInterested ? 'fill-primary text-primary' : ''}`} />
                {isInterested ? 'Confirmado' : 'Tenho interesse'}
              </button>
              <button 
                onClick={handleAttendanceClick}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                  isAttended
                    ? 'bg-[#E5D5F0] text-[#932d6f] border-[#932d6f]/30'
                    : 'bg-[#F5EBFF] text-primary border-primary/10 hover:bg-[#E5D5F0]'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isAttended ? 'text-[#932d6f]' : ''}`} />
                {isAttended ? 'Fui!' : 'Fui!!'}
              </button>
            </div>
          </div>

          {/* Seção de Comentários */}
          <div className="mt-6 pb-32">
            <div className="px-4 pb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Comentários ({reviews.length})
              </h3>
            </div>

            {/* Lista de Reviews */}
            {reviewsLoading ? (
              <div className="px-4 py-8 text-center">
                <p className="text-muted-foreground text-sm">Carregando avaliações...</p>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewItem 
                  key={review.id} 
                  review={review}
                  onReply={(id) => {
                    if (!isAuthenticated) {
                      setShowAuthTooltip(true);
                      return;
                    }
                    setReplyingTo(replyingTo === id ? null : id);
                  }}
                  replyingTo={replyingTo}
                  replyText={replyText}
                  onReplyTextChange={setReplyText}
                  onSendReply={(id) => {
                    if (!isAuthenticated) {
                      setShowAuthTooltip(true);
                      return;
                    }
                    // Respostas serão implementadas depois quando tiver sistema de comentários completo
                    console.log('Resposta:', { reviewId: id, text: replyText });
                    setReplyText('');
                    setReplyingTo(null);
                  }}
                />
              ))
            ) : (
              <div className="px-4 py-12 text-center">
                <p className="text-muted-foreground">Nenhum comentário ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* Campo de Comentário Fixo - Posicionado acima do BottomNav */}
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-border px-4 py-3 z-40">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Seu avatar"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <button
              onClick={handleReviewClick}
              className="flex-1 px-4 py-2 bg-muted rounded-full border-0 text-left text-sm text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer"
            >
              Escreva uma avaliação...
            </button>
            <button
              onClick={handleReviewClick}
              className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
              title="Criar avaliação completa"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* Navegação inferior fixa */}
        <BottomNav activeItem="events" onItemClick={onNavigate!} />
      </div>
      
      {showAuthTooltip && (
        <AuthTooltip
          onClose={() => setShowAuthTooltip(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

// Componente para renderizar um review com suporte a respostas
function ReviewItem({ 
  review, 
  onReply, 
  replyingTo, 
  replyText, 
  onReplyTextChange, 
  onSendReply,
  isReply = false 
}: { 
  review: ReviewWithReplies; 
  onReply: (id: string) => void;
  replyingTo: string | null;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onSendReply: (id: string) => void;
  isReply?: boolean;
}) {
  return (
    <div className={isReply ? 'ml-12 mt-3' : ''}>
      <div className="px-4 py-4 border-b border-gray-100">
        {/* Header do Review */}
        <div className="flex items-center gap-3 mb-2">
          <ImageWithFallback
            src={review.avatar || review.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTcwMTY1NzYwMHww&ixlib=rb-4.1.0&q=80&w=1080'}
            alt={review.author || review.userName || 'Usuário'}
            className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-cover flex-shrink-0`}
          />
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-sm">{review.author || review.userName || 'Usuário'}</h4>
            <p className="text-xs text-gray-500">{review.date || (review.createdAt ? new Date(review.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível')}</p>
          </div>
        </div>

        {/* Avaliação com Estrelas (apenas para comentários principais) */}
        {!isReply && review.rating > 0 && (
          <div className="mb-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, index) => (
                <Star 
                  key={index}
                  className={`w-3.5 h-3.5 ${index < review.rating ? 'fill-[#932d6f] text-[#932d6f]' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Comentário */}
        <p className="text-sm text-gray-700 leading-relaxed mb-2">{review.comment}</p>

        {/* Ações: Curtir e Responder */}
        <div className="flex items-center gap-4 mt-2">
          {review.likes !== undefined && (
            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{review.likes}</span>
            </button>
          )}
          {!isReply && (
            <button
              onClick={() => onReply(review.id)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              Responder
            </button>
          )}
        </div>

        {/* Campo de resposta */}
        {replyingTo === review.id && !isReply && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              placeholder="Escreva uma resposta..."
              className="flex-1 px-3 py-2 text-sm bg-muted rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary/20"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSendReply(review.id);
                }
              }}
            />
            <button
              onClick={() => onSendReply(review.id)}
              className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Enviar
            </button>
          </div>
        )}

        {/* Respostas aninhadas */}
        {review.replies && review.replies.length > 0 && (
          <div className="mt-3">
            {review.replies.map((reply) => (
              <ReviewItem
                key={reply.id}
                review={reply}
                onReply={onReply}
                replyingTo={replyingTo}
                replyText={replyText}
                onReplyTextChange={onReplyTextChange}
                onSendReply={onSendReply}
                isReply={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}