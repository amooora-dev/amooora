import { ImageWithFallback } from '../shared/components';

interface ServiceCardGridProps {
  id: string;
  name: string;
  category: string;
  provider?: string;
  imageUrl?: string;
  onClick?: () => void;
}

export function ServiceCardGrid({ 
  id,
  name, 
  category,
  provider,
  imageUrl,
  onClick 
}: ServiceCardGridProps) {
  // Gerar inicial do provedor ou categoria
  const getInitials = (text?: string) => {
    if (!text) return category.charAt(0).toUpperCase();
    return text.charAt(0).toUpperCase();
  };

  // Gerar nome de usuário (handle) a partir do provedor
  const getHandle = (providerName?: string) => {
    if (!providerName) return '';
    const handle = providerName.toLowerCase().replace(/\s+/g, '');
    return `@${handle.substring(0, 10)}`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden border border-border/50 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Imagem do serviço */}
      <div className="relative w-full h-48 overflow-hidden">
        <ImageWithFallback
          src={imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Informações do serviço */}
      <div className="p-3">
        {/* Título/Nome do serviço */}
        <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        {/* Avatar, nome do provedor e handle */}
        <div className="flex items-center gap-2">
          {/* Avatar circular */}
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-primary">
              {getInitials(provider || category)}
            </span>
          </div>
          
          {/* Nome e handle */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground line-clamp-1">
              {provider || category}
            </p>
            {provider && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {getHandle(provider)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
