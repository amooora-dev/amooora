import { useState, useEffect, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, Star } from 'lucide-react';
import { Header, BottomNav } from '../shared/components';
import { useProfile } from '../hooks/useProfile';
import { useAdmin, useFavorites } from '../shared/hooks';
import { useEvents } from '../features/events';
import {
  getUpcomingEvents,
  getInterestedEvents,
  getAttendedEvents,
  getUserReviews,
  type UpcomingEvent,
  type AttendedEvent,
  type UserReview,
} from '../services/profile';

interface PerfilMeusEventosProps {
  onNavigate: (page: string) => void;
}

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function formatEventDate(dateString: string): { formattedDate: string; time: string } {
  let formattedDate = 'Data não informada';
  let time = '';
  if (dateString) {
    const date = new Date(dateString);
    if (!Number.isNaN(date.getTime())) {
      const day = date.getDate();
      const month = months[date.getMonth()];
      formattedDate = `${day.toString().padStart(2, '0')} ${month}`;
      time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
  }
  return { formattedDate, time };
}

export function PerfilMeusEventos({ onNavigate }: PerfilMeusEventosProps) {
  const { profile } = useProfile();
  const { isAdmin } = useAdmin();
  const { getFavoritesByType } = useFavorites();
  const { events: allEvents, loading: eventsLoading } = useEvents();
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [interestedEvents, setInterestedEvents] = useState<UpcomingEvent[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([]);
  const [eventReviews, setEventReviews] = useState<UserReview[]>([]);
  const [profileDataLoading, setProfileDataLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const favoriteEventIds = getFavoritesByType('events');
  const favoriteEvents: UpcomingEvent[] = useMemo(() => {
    if (!Array.isArray(favoriteEventIds) || favoriteEventIds.length === 0) return [];
    if (!Array.isArray(allEvents)) return [];
    return allEvents
      .filter((e) => e && e.id && favoriteEventIds.includes(e.id))
      .map((e) => {
        const { formattedDate, time } = formatEventDate(e.date || '');
        return {
          id: e.id,
          event_id: e.id,
          name: e.name || 'Evento desconhecido',
          date: formattedDate,
          time: time || e?.time || 'Horário não informado',
          location: e.location || 'Local não informado',
        };
      });
  }, [allEvents, favoriteEventIds]);

  useEffect(() => {
    if (!profile?.id) {
      setProfileDataLoading(false);
      return;
    }
    Promise.all([
      getUpcomingEvents(profile.id),
      getInterestedEvents(profile.id),
      getAttendedEvents(profile.id),
      getUserReviews(profile.id),
    ])
      .then(([up, int, att, reviews]) => {
        setUpcomingEvents(up);
        setInterestedEvents(int);
        setAttendedEvents(att);
        setEventReviews((reviews || []).filter((r) => r.event_id));
      })
      .catch(() => {})
      .finally(() => setProfileDataLoading(false));
  }, [profile?.id]);

  const loading = eventsLoading || profileDataLoading;

  function renderStars(rating: number) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${star <= rating ? 'fill-[#932d6f] text-[#932d6f]' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  }

  const calendarDays = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay();
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
    return days;
  }, [selectedMonth]);

  const eventsByDay = useMemo(() => {
    const selectedMonthIndex = selectedMonth.getMonth();
    const allUpcoming = [...upcomingEvents, ...interestedEvents];
    const upcomingByDay: Record<number, boolean> = {};
    const attendedByDay: Record<number, boolean> = {};
    allUpcoming.forEach((event) => {
      if (!event.date) return;
      const parts = event.date.split(' ');
      if (parts.length < 2) return;
      const dayStr = parts[0];
      const monthStr = parts[1];
      const eventMonthIndex = months.indexOf(monthStr);
      if (eventMonthIndex === selectedMonthIndex) {
        const eventDay = parseInt(dayStr, 10);
        if (!isNaN(eventDay) && eventDay >= 1 && eventDay <= 31) upcomingByDay[eventDay] = true;
      }
    });
    attendedEvents.forEach((event) => {
      if (!event.date) return;
      const parts = event.date.split(' ');
      if (parts.length < 2) return;
      const dayStr = parts[0];
      const monthStr = parts[1];
      const eventMonthIndex = months.indexOf(monthStr);
      if (eventMonthIndex === selectedMonthIndex) {
        const eventDay = parseInt(dayStr, 10);
        if (!isNaN(eventDay) && eventDay >= 1 && eventDay <= 31) attendedByDay[eventDay] = true;
      }
    });
    return { upcomingByDay, attendedByDay };
  }, [selectedMonth, upcomingEvents, interestedEvents, attendedEvents]);

  const hasAnyEvents =
    favoriteEvents.length > 0 ||
    upcomingEvents.length > 0 ||
    interestedEvents.length > 0 ||
    attendedEvents.length > 0 ||
    eventReviews.length > 0;

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={() => onNavigate('profile')} />
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Meus Eventos</h1>
            <p className="text-sm text-muted-foreground">Eventos favoritos, próximos e que você participou</p>
          </div>
          <div className="px-5 pb-6">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Carregando...</div>
            ) : !hasAnyEvents ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">Você ainda não tem eventos.</p>
                <button
                  type="button"
                  onClick={() => onNavigate('events')}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium"
                >
                  Explorar eventos
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {favoriteEvents.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Eventos Favoritos</h2>
                    <div className="space-y-3">
                      {favoriteEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => onNavigate(`event-details:${event.event_id}`)}
                          className="bg-[#fffbfa] rounded-2xl p-4 border border-[#932d6f]/10 cursor-pointer hover:bg-[#fff5f0] transition-colors"
                        >
                          <div className="flex items-start gap-3">
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

                {interestedEvents.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Eventos que Tenho Interesse</h2>
                    <div className="space-y-3">
                      {interestedEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => onNavigate(`event-details:${event.event_id}`)}
                          className="bg-[#fffbfa] rounded-2xl p-4 border border-[#932d6f]/10 cursor-pointer hover:bg-[#fff5f0] transition-colors"
                        >
                          <div className="flex items-start gap-3">
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

                {upcomingEvents.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Próximos Eventos</h2>
                    <div className="space-y-3">
                      {upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => onNavigate(`event-details:${event.event_id}`)}
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

                {attendedEvents.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Eventos que Participei</h2>
                    <div className="space-y-2">
                      {attendedEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => onNavigate(`event-details:${event.event_id}`)}
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

                {/* Minhas avaliações - Eventos */}
                {eventReviews.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-[#932d6f]" />
                      <h2 className="text-lg font-bold text-gray-900">Minhas avaliações - Eventos</h2>
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

                {/* Calendário */}
                <div className="bg-[#fffbfa] rounded-2xl p-4 border border-[#932d6f]/10">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Meu Calendário</h2>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-bold text-primary capitalize">
                        {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1))}
                        className="p-1.5 hover:bg-gray-100 rounded-full"
                        aria-label="Mês anterior"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedMonth(new Date())}
                        className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-full"
                      >
                        Hoje
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1))}
                        className="p-1.5 hover:bg-gray-100 rounded-full"
                        aria-label="Próximo mês"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 mb-3">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, index) =>
                      day === null ? (
                        <div key={`e-${index}`} className="aspect-square" />
                      ) : (
                        <div
                          key={day}
                          className={`aspect-square flex items-center justify-center text-sm rounded-lg ${
                            eventsByDay.upcomingByDay[day]
                              ? 'bg-[#932d6f] text-white font-bold'
                              : eventsByDay.attendedByDay[day]
                                ? 'bg-pink-100 text-pink-700 font-medium'
                                : 'text-gray-700'
                          }`}
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#932d6f] rounded" />
                      <span className="text-gray-600">Próximos eventos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-pink-100 rounded" />
                      <span className="text-gray-600">Participei</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <BottomNav activeItem="profile" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
