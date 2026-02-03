import { useState, useEffect } from 'react';
import { FilterOptions } from '../components/FilterModal';

const STORAGE_KEY = 'amooora_filter_preferences';

const defaultFilters: FilterOptions = {
  distance: 'any',
  rating: 'any',
  tags: [],
};

export const useFilterPreferences = () => {
  const [filters, setFilters] = useState<FilterOptions>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erro ao ler preferências de filtros do localStorage:', error);
    }
    return defaultFilters;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Erro ao salvar preferências de filtros no localStorage:', error);
    }
  }, [filters]);

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    filters,
    updateFilters,
    clearFilters,
  };
};
