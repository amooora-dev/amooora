import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface Favorites {
  places: string[];
  events: string[];
  services: string[];
}

const STORAGE_KEY = 'amooora_favorites';

const getFavoritesFromStorage = (): Favorites => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Erro ao ler favoritos do localStorage:', error);
  }
  return { places: [], events: [], services: [] };
};

const saveFavoritesToStorage = (favorites: Favorites) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Erro ao salvar favoritos no localStorage:', error);
  }
};

interface FavoritesContextValue {
  favorites: Favorites;
  toggleFavorite: (type: 'places' | 'events' | 'services', id: string) => void;
  isFavorite: (type: 'places' | 'events' | 'services', id: string) => boolean;
  getFavoritesByType: (type: 'places' | 'events' | 'services') => string[];
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Favorites>(getFavoritesFromStorage);

  const toggleFavorite = useCallback((type: 'places' | 'events' | 'services', id: string) => {
    setFavorites((prev) => {
      const newFavorites = { ...prev };
      const index = newFavorites[type].indexOf(id);
      if (index > -1) {
        newFavorites[type] = newFavorites[type].filter((itemId) => itemId !== id);
      } else {
        newFavorites[type] = [...newFavorites[type], id];
      }
      saveFavoritesToStorage(newFavorites);
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((type: 'places' | 'events' | 'services', id: string) => {
    return favorites[type].includes(id);
  }, [favorites]);

  const getFavoritesByType = useCallback((type: 'places' | 'events' | 'services') => {
    return favorites[type] || [];
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    const empty: Favorites = { places: [], events: [], services: [] };
    setFavorites(empty);
    saveFavoritesToStorage(empty);
  }, []);

  const value = useMemo<FavoritesContextValue>(() => ({
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    clearFavorites,
  }), [favorites, toggleFavorite, isFavorite, getFavoritesByType, clearFavorites]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
  }
  return ctx;
}
