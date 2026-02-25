import { useFavoritesContext } from '../contexts/FavoritesContext';

export type { Favorites } from '../contexts/FavoritesContext';

export const useFavorites = () => useFavoritesContext();
