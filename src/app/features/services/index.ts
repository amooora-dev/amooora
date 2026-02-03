// Barrel exports for services feature

// Pages
export { Servicos } from './pages/Servicos';
export { ServiceCategoryList } from './pages/ServiceCategoryList';
export { AdminCadastrarServico } from './pages/AdminCadastrarServico';
export { AdminEditarServico } from './pages/AdminEditarServico';

// Components
export { ServiceCard } from './components/ServiceCard';
export { ServiceCardExpanded } from './components/ServiceCardExpanded';
export { ServiceCardGrid } from './components/ServiceCardGrid';
export { ServiceDetails } from './components/ServiceDetails';

// Hooks
export { useServices, useService, useServicesByCategory } from './hooks/useServices';

// Services
export * from './services/services';

// Types
export type { Service } from './types';
