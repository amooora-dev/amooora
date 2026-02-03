import { Map } from 'lucide-react';

export function MapPlaceholder() {
  return (
    <div className="bg-muted/50 border border-border rounded-2xl h-48 flex flex-col items-center justify-center">
      <Map className="w-12 h-12 text-muted-foreground/50 mb-2" />
      <p className="text-sm text-muted-foreground">Visualização do mapa</p>
    </div>
  );
}
