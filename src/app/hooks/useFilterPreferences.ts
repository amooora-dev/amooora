import { useState, useEffect } from 'react';
import { FilterOptions } from '../components/FilterModal';
import { FILTER_PREFERENCES_STORAGE_KEY } from '../shared/constants/storageKeys';

const defaultFilters: FilterOptions = {
  distance: 'any',
  rating: 'any',
  tags: [],
};

function readStoredFilters(): FilterOptions {
  try {
    const fromSession = sessionStorage.getItem(FILTER_PREFERENCES_STORAGE_KEY);
    if (fromSession) {
      return JSON.parse(fromSession);
    }
    const legacy = localStorage.getItem(FILTER_PREFERENCES_STORAGE_KEY);
    if (legacy) {
      sessionStorage.setItem(FILTER_PREFERENCES_STORAGE_KEY, legacy);
      localStorage.removeItem(FILTER_PREFERENCES_STORAGE_KEY);
      return JSON.parse(legacy);
    }
  } catch (error) {
    console.error('Erro ao ler preferências de filtros:', error);
  }
  return defaultFilters;
}

export const useFilterPreferences = () => {
  const [filters, setFilters] = useState<FilterOptions>(() => readStoredFilters());

  useEffect(() => {
    try {
      sessionStorage.setItem(FILTER_PREFERENCES_STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Erro ao salvar preferências de filtros:', error);
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
