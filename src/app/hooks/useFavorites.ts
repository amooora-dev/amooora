import { useState, useEffect } from 'react';

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

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorites>(getFavoritesFromStorage);

  // Carregar favoritos do localStorage ao montar
  useEffect(() => {
    setFavorites(getFavoritesFromStorage());
  }, []);

  const toggleFavorite = (type: 'places' | 'events' | 'services', id: string) => {
    setFavorites((prev) => {
      const newFavorites = { ...prev };
      const index = newFavorites[type].indexOf(id);
      
      if (index > -1) {
        // Remover dos favoritos
        newFavorites[type] = newFavorites[type].filter((itemId) => itemId !== id);
      } else {
        // Adicionar aos favoritos
        newFavorites[type] = [...newFavorites[type], id];
      }
      
      saveFavoritesToStorage(newFavorites);
      return newFavorites;
    });
  };

  const isFavorite = (type: 'places' | 'events' | 'services', id: string): boolean => {
    return favorites[type].includes(id);
  };

  const getFavoritesByType = (type: 'places' | 'events' | 'services'): string[] => {
    return favorites[type] || [];
  };

  const clearFavorites = () => {
    const emptyFavorites: Favorites = { places: [], events: [], services: [] };
    setFavorites(emptyFavorites);
    saveFavoritesToStorage(emptyFavorites);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    clearFavorites,
  };
};
