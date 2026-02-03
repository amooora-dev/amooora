import { ArrowLeft, Calendar, MapPin, Heart, Star, Users, CheckCircle2, MessageCircle, ChevronRight, Briefcase, ChevronLeft } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Header, BottomNav, ImageWithFallback } from '../shared/components';
import { supabase } from '../infra/supabase';
import { 
  getProfileStats, 
  getSavedPlaces, 
  getFavoriteEvents,
  getFavoriteServices,
  getVisitedPlaces,
  getUpcomingEvents,
  getInterestedEvents,
  getAttendedEvents,
  getUserReviews,
  getFollowedCommunities,
  type SavedPlace,
  type VisitedPlace,
  type UpcomingEvent,
  type AttendedEvent,
  type UserReview,
  type FollowedCommunity,
} from '../services/profile';

interface ViewProfileProps {
  userId?: string;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  pronouns?: string;
  city?: string;
}

export function ViewProfile({ userId, onNavigate, onBack }: ViewProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ eventsCount: 0, placesCount: 0, friendsCount: 0 });
  const [favoritePlaces, setFavoritePlaces] = useState<SavedPlace[]>([]);
  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlace[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<UpcomingEvent[]>([]);
  const [favoriteServices, setFavoriteServices] = useState<Array<{
    id: string;
    service_id: string;
    name: string;
    category: string;
    provider: string;
    imageUrl: string;
  }>>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [interestedEvents, setInterestedEvents] = useState<UpcomingEvent[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([]);
  const [myReviews, setMyReviews] = useState<UserReview[]>([]);
  const [followedCommunities, setFollowedCommunities] = useState<FollowedCommunity[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Buscar perfil do usuário
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Erro ao buscar perfil:', error);
          setLoading(false);
          return;
        }

        if (!data) {
          setLoading(false);
          return;
        }

        const username = data.email?.split('@')[0] || undefined;

        setProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          username: username,
          avatar: data.avatar || undefined,
          phone: data.phone || undefined,
          bio: data.bio || undefined,
          pronouns: data.pronouns || undefined,
          city: data.city || undefined,
        });

        // Carregar dados do perfil
        const [statsData, placesData, visitedPlacesData, favoriteEventsData, favoriteServicesData, upcomingData, interestedData, attendedData, reviewsData, communitiesData] = await Promise.all([
          getProfileStats(userId),
          getSavedPlaces(userId),
          getVisitedPlaces(userId),
          getFavoriteEvents(userId),
          getFavoriteServices(userId),
          getUpcomingEvents(userId),
          getInterestedEvents(userId),
          getAttendedEvents(userId),
          getUserReviews(userId),
          getFollowedCommunities(userId),
        ]);

        setStats(statsData);
        setFavoritePlaces(placesData);
        setVisitedPlaces(visitedPlacesData);
        setFavoriteEvents(favoriteEventsData);
        setFavoriteServices(favoriteServicesData);
        setUpcomingEvents(upcomingData);
        setInterestedEvents(interestedData);
        setAttendedEvents(attendedData);
        setMyReviews(reviewsData);
        setFollowedCommunities(communitiesData);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  // Separar reviews por tipo
  const placeReviews = useMemo(() => myReviews.filter(r => r.place_id), [myReviews]);
  const serviceReviews = useMemo(() => myReviews.filter(r => r.service_id), [myReviews]);
  const eventReviews = useMemo(() => myReviews.filter(r => r.event_id), [myReviews]);

  // Calcular dias do calendário
  const calendarDays = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // Adicionar células vazias para alinhar o primeiro dia
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Adicionar os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  }, [selectedMonth]);

  // Combinar eventos futuros e de interesse para o calendário
  const allUpcomingEvents = useMemo(() => {
    return [...upcomingEvents, ...interestedEvents];
  }, [upcomingEvents, interestedEvents]);

  // Filtrar eventos do mês selecionado e criar mapa por dia
  const eventsByDay = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    
    const upcomingByDay: Record<number, boolean> = {};
    const attendedByDay: Record<number, boolean> = {};

    // Processar eventos futuros e de interesse
    allUpcomingEvents.forEach(event => {
      if (!event.date) return;
      const parts = event.date.split(' ');
      if (parts.length < 2) return;
      
      const day = parseInt(parts[0], 10);
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const eventMonthIndex = monthNames.indexOf(parts[1]);
      
      if (eventMonthIndex === month && !isNaN(day)) {
        upcomingByDay[day] = true;
      }
    });

    // Processar eventos participados
    attendedEvents.forEach(event => {
      if (!event.date) return;
      const parts = event.date.split(' ');
      if (parts.length < 2) return;
      
      const day = parseInt(parts[0], 10);
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const eventMonthIndex = monthNames.indexOf(parts[1]);
      
      // Se não tiver mês, assumir que é do mês atual ou anterior
      let eventYear = year;
      if (eventMonthIndex === -1) {
        // Tentar parsear como data completa
        try {
          const dateObj = new Date(event.date);
          if (!isNaN(dateObj.getTime())) {
            eventYear = dateObj.getFullYear();
            const eventMonth = dateObj.getMonth();
            if (eventMonth === month && eventYear === year) {
              attendedByDay[dateObj.getDate()] = true;
            }
          }
        } catch {
          // Ignorar se não conseguir parsear
        }
      } else if (eventMonthIndex === month && !isNaN(day)) {
        attendedByDay[day] = true;
      }
    });

    return { upcomingByDay, attendedByDay };
  }, [selectedMonth, allUpcomingEvents, attendedEvents]);

  // Função para renderizar estrelas
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-[#932d6f] text-[#932d6f]'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Perfil não encontrado</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-primary text-white rounded-full"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <Header onNavigate={onNavigate} showBackButton onBack={onBack} />

        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Perfil Header */}
          <div className="px-5 pt-6 pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <ImageWithFallback
                  src={profile.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080'}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground text-center mb-2">
              {profile.name}
            </h1>

            {profile.bio && (
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs mx-auto">
                {profile.bio}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{stats.eventsCount}</div>
                <div className="text-xs text-muted-foreground">Eventos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{stats.placesCount}</div>
                <div className="text-xs text-muted-foreground">Locais</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{stats.friendsCount}</div>
                <div className="text-xs text-muted-foreground">Amigas</div>
              </div>
            </div>
          </div>

          {/* Locais que Já Frequentei - apenas se houver dados */}
          {visitedPlaces.length > 0 && (
            <div className="px-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Locais que Já Frequentei</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {visitedPlaces.slice(0, 5).map((place) => (
                  <div 
                    key={place.id} 
                    onClick={() => onNavigate?.(`place-details:${place.place_id}`)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-24">
                      <ImageWithFallback
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-[#932d6f] rounded-full p-1">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">{place.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{place.category}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#932d6f] text-[#932d6f]" />
                        <span className="text-xs font-medium text-gray-700">{place.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locais Favoritos - apenas se houver dados */}
          {favoritePlaces.length > 0 && (
            <div className="px-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Locais Favoritos</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {favoritePlaces.slice(0, 5).map((place) => (
                  <div 
                    key={place.id}
                    onClick={() => onNavigate?.(`place-details:${place.place_id}`)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-24">
                      <ImageWithFallback
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">{place.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{place.category}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#932d6f] text-[#932d6f]" />
                        <span className="text-xs font-medium text-gray-700">{place.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eventos Favoritos - apenas se houver dados */}
          {favoriteEvents.length > 0 && (
            <div className="px-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Eventos Favoritos</h2>
              </div>
              <div className="space-y-3">
                {favoriteEvents.slice(0, 5).map((event) => (
                  <div 
                    key={event.id} 
                    onClick={() => onNavigate?.(`event-details:${event.event_id}`)}
                    className="bg-[#fffbfa] rounded-2xl p-4 border border-[#932d6f]/10 cursor-pointer hover:bg-[#fff5f0] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Badge de data - estilo igual ao EventCardExpanded */}
                      <div className="flex-shrink-0">
                        <span className="bg-[#F8F0ED] text-[#B05E3D] px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap">
                          {event.date}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{event.name}</h3>
                        <p className="text-sm text-gray-600">{event.time} • {event.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Serviços Favoritos - apenas se houver dados */}
          {favoriteServices.length > 0 && (
            <div className="px-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Serviços Favoritos</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {favoriteServices.slice(0, 4).map((service) => (
                  <div 
                    key={service.id} 
                    onClick={() => onNavigate?.(`service-details:${service.service_id}`)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-24">
                      <ImageWithFallback
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">{service.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">{service.category}</p>
                      <p className="text-xs text-gray-400 truncate">{service.provider}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comunidades que Sigo - apenas se houver dados */}
          {followedCommunities.length > 0 && (
            <div className="px-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Comunidades que Sigo</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {followedCommunities.slice(0, 4).map((community) => (
                  <div 
                    key={community.id} 
                    onClick={() => onNavigate?.(`community-details:${community.community_id}`)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-24">
                      <ImageWithFallback
                        src={community.imageUrl}
                        alt={community.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">{community.name}</h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">{community.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>{community.membersCount >= 1000 ? `${(community.membersCount / 1000).toFixed(1)}k` : community.membersCount}</span>
                        <MessageCircle className="w-3 h-3 ml-1" />
                        <span>{community.postsCount || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eventos que Tenho Interesse - apenas se houver dados */}
          {interestedEvents.length > 0 && (
            <div className="px-5 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Eventos que Tenho Interesse</h2>
              <div className="space-y-3">
                {interestedEvents.map((event) => (
                  <div 
                    key={event.id} 
                    onClick={() => onNavigate?.(`event-details:${event.event_id}`)}
                    className="bg-[#fffbfa] rounded-2xl p-4 border border-[#932d6f]/10 cursor-pointer hover:bg-[#fff5f0] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Badge de data - estilo roxo/rosa */}
                      <div className="flex-shrink-0">
                        <span className="bg-[#E5D5F0] text-[#932d6f] px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap">
                          {event.date}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{event.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{event.time} • {event.location}</p>
                        <span className="inline-block px-2 py-0.5 bg-[#F5EBFF] text-primary text-xs font-medium rounded-full">
                          Tenho Interesse
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Próximos Eventos - apenas se houver dados */}
          {upcomingEvents.length > 0 && (
            <div className="px-5 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Próximos Eventos</h2>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div 
                    key={event.id} 
                    onClick={() => onNavigate?.(`event-details:${event.event_id}`)}
                    className="bg-[#fffbfa] rounded-2xl p-4 border border-[#932d6f]/10 cursor-pointer hover:bg-[#fff5f0] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-[#932d6f] rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                        <span className="text-xs font-medium">{event.date.split(' ')[1]}</span>
                        <span className="text-lg font-bold">{event.date.split(' ')[0]}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{event.time} • {event.location}</p>
                        <span className="inline-block px-2 py-0.5 bg-[#932d6f]/10 text-[#932d6f] text-xs font-medium rounded-full">
                          Confirmado
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eventos que Participei - apenas se houver dados */}
          {attendedEvents.length > 0 && (
            <div className="px-5 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Eventos que Participei</h2>
              <div className="space-y-2">
                {attendedEvents.map((event) => (
                  <div 
                    key={event.id} 
                    onClick={() => onNavigate?.(`event-details:${event.event_id}`)}
                    className="bg-white rounded-xl p-3 border border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#932d6f] flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-gray-900">{event.name}</h3>
                      <p className="text-xs text-gray-500">{event.date} • {event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendário - apenas se houver eventos */}
          {(upcomingEvents.length > 0 || interestedEvents.length > 0 || attendedEvents.length > 0) && (
            <div className="px-5 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Meu Calendário</h2>
              <div className="bg-[#fffbfa] rounded-2xl p-4 border border-[#932d6f]/10">
                {/* Controles de navegação do mês */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Mês:</span>
                    <span className="text-sm font-bold text-primary capitalize">
                      {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const prevMonth = new Date(selectedMonth);
                        prevMonth.setMonth(prevMonth.getMonth() - 1);
                        setSelectedMonth(prevMonth);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Mês anterior"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setSelectedMonth(new Date())}
                      className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-full transition-colors"
                    >
                      Hoje
                    </button>
                    <button
                      onClick={() => {
                        const nextMonth = new Date(selectedMonth);
                        nextMonth.setMonth(nextMonth.getMonth() + 1);
                        setSelectedMonth(nextMonth);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Próximo mês"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Mini calendário visual */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="aspect-square"></div>;
                    }

                    // Verificar se há eventos neste dia usando o mapa pré-calculado
                    const hasUpcomingEvent = eventsByDay.upcomingByDay[day] || false;
                    const hasAttendedEvent = eventsByDay.attendedByDay[day] || false;
                    
                    return (
                      <div
                        key={day}
                        className={`aspect-square flex items-center justify-center text-sm rounded-lg ${
                          hasUpcomingEvent
                            ? 'bg-[#932d6f] text-white font-bold'
                            : hasAttendedEvent
                            ? 'bg-[#E5D5F0] text-[#932d6f] font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#932d6f] rounded"></div>
                    <span className="text-gray-600">Próximos eventos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#E5D5F0] rounded"></div>
                    <span className="text-gray-600">Participei</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Minhas Reviews - Separadas por tipo */}
          {(placeReviews.length > 0 || serviceReviews.length > 0 || eventReviews.length > 0) && (
            <div className="px-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Minhas Reviews</h2>
              </div>

              {/* Reviews de Locais */}
              {placeReviews.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-[#932d6f]" />
                    <h3 className="text-base font-semibold text-gray-900">Locais</h3>
                  </div>
                  <div className="space-y-3">
                    {placeReviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-sm text-gray-900 mb-1">
                              {review.placeName || 'Local avaliado'}
                            </h3>
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews de Serviços */}
              {serviceReviews.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-5 h-5 text-[#932d6f]" />
                    <h3 className="text-base font-semibold text-gray-900">Serviços</h3>
                  </div>
                  <div className="space-y-3">
                    {serviceReviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-sm text-gray-900 mb-1">
                              {review.serviceName || 'Serviço avaliado'}
                            </h3>
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews de Eventos */}
              {eventReviews.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-[#932d6f]" />
                    <h3 className="text-base font-semibold text-gray-900">Eventos</h3>
                  </div>
                  <div className="space-y-3">
                    {eventReviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-sm text-gray-900 mb-1">
                              {review.eventName || 'Evento avaliado'}
                            </h3>
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <BottomNav activeItem="profile" onItemClick={onNavigate!} />
      </div>
    </div>
  );
}
