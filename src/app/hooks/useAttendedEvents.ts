import { useState, useEffect } from 'react';

const STORAGE_KEY = 'amooora_attended_events';

const getAttendedEventsFromStorage = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Erro ao ler eventos participados do localStorage:', error);
  }
  return [];
};

const saveAttendedEventsToStorage = (eventIds: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventIds));
  } catch (error) {
    console.error('Erro ao salvar eventos participados no localStorage:', error);
  }
};

export const useAttendedEvents = () => {
  const [attendedEvents, setAttendedEvents] = useState<string[]>(getAttendedEventsFromStorage);

  // Carregar eventos participados do localStorage ao montar
  useEffect(() => {
    setAttendedEvents(getAttendedEventsFromStorage());
  }, []);

  const toggleAttendedEvent = (eventId: string) => {
    setAttendedEvents((prev) => {
      const index = prev.indexOf(eventId);
      let newAttendedEvents: string[];
      
      if (index > -1) {
        // Remover dos eventos participados
        newAttendedEvents = prev.filter((id) => id !== eventId);
      } else {
        // Adicionar aos eventos participados
        newAttendedEvents = [...prev, eventId];
      }
      
      saveAttendedEventsToStorage(newAttendedEvents);
      return newAttendedEvents;
    });
  };

  const hasAttended = (eventId: string): boolean => {
    return attendedEvents.includes(eventId);
  };

  const getAttendedEvents = (): string[] => {
    return attendedEvents;
  };

  const clearAttendedEvents = () => {
    setAttendedEvents([]);
    saveAttendedEventsToStorage([]);
  };

  return {
    attendedEvents,
    toggleAttendedEvent,
    hasAttended,
    getAttendedEvents,
    clearAttendedEvents,
  };
};
