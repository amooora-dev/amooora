// Barrel exports for places feature

// Pages
export { Locais } from './pages/Locais';
export { AdminCadastrarLocal } from './pages/AdminCadastrarLocal';
export { AdminEditarLocal } from './pages/AdminEditarLocal';

// Components
export { PlaceCard } from './components/PlaceCard';
export { PlaceCardExpanded } from './components/PlaceCardExpanded';
export { PlaceDetails } from './components/PlaceDetails';
export { SavedPlaceCard } from './components/SavedPlaceCard';

// Hooks
export { usePlaces, usePlace } from './hooks/usePlaces';

// Services
export * from './services/places';

// Types
export type { Place } from './types';

