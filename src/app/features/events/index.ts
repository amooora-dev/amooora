// Barrel exports for events feature

// Pages
export { Eventos } from './pages/Eventos';
export { AdminCadastrarEvento } from './pages/AdminCadastrarEvento';
export { AdminEditarEvento } from './pages/AdminEditarEvento';

// Components
export { EventCard } from './components/EventCard';
export { EventCardExpanded } from './components/EventCardExpanded';
export { EventDetails } from './components/EventDetails';
export { EventsMap } from './components/EventsMap';

// Hooks
export { useEvents, useEvent } from './hooks/useEvents';
export { useAttendedEvents } from './hooks/useAttendedEvents';
export { useEventInteractions } from './hooks/useEventInteractions';
export { useEventParticipants } from './hooks/useEventParticipants';

// Services
export * from './services/events';

// Types
export type { Event } from './types';
