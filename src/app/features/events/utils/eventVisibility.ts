/**
 * Evento ainda exibível em listagens públicas (não encerrado no fim do dia local do evento).
 */
export function isEventStillUpcomingForCatalog(event: { date?: string | null }): boolean {
  if (!event.date) return false;
  const start = new Date(event.date);
  if (Number.isNaN(start.getTime())) return true;

  const endOfEventDay = new Date(start);
  endOfEventDay.setHours(23, 59, 59, 999);
  return endOfEventDay.getTime() >= Date.now();
}

export function filterUpcomingCatalogEvents<T extends { date?: string | null }>(events: T[]): T[] {
  return events.filter(isEventStillUpcomingForCatalog);
}
