import { Heart, Star, Share2, Flag, Phone, MessageCircle, Clock, Check, MapPin } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../shared/components';
import { Header } from '../shared/components';
import { BottomNav } from '../shared/components';
import { useService } from '../features/services';
import { useServiceReviews } from '../shared/hooks';
import { calculateAverageRating } from '../shared/services';
import { Review } from '../shared/types';
import { shareContent, getShareUrl, getShareText } from '../shared/utils';


interface ServiceDetailsProps {
  serviceId?: string;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function ServiceDetails({ serviceId, onNavigate, onBack }: ServiceDetailsProps) {
  const { service, loading, error } = useService(serviceId);
  const { reviews: realReviews, loading: reviewsLoading, refetch: refetchReviews } = useServiceReviews(serviceId);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShare = async () => {
    if (!service || !serviceId) return;
    
    const shared = await shareContent({
      title: service.name,
      text: getShareText('service', service.name),
      url: getShareUrl('service', serviceId),
    });

    if (shared) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <p className="text-muted-foreground mb-2">Carregando serviço...</p>
          </div>
        </div>
      </div>
    );
  }

  // Se não houver serviço do Supabase, exibir erro
  if (!service) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <p className="text-red-500 mb-2">Erro ao carregar serviço</p>
              <p className="text-sm text-muted-foreground">
                {error?.message || 'Serviço não encontrado'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Função para gerar especialidades mockadas baseadas na categoria
  const getMockSpecialties = (category: string): string[] => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('terapia') || categoryLower.includes('psicologia')) {
      return ['Terapia LGBTQIA+', 'Ansiedade', 'Depressão', 'Relacionamentos', 'Identidade de Gênero'];
    } else if (categoryLower.includes('advocacia') || categoryLower.includes('jurídico')) {
      return ['Direitos LGBTQIA+', 'Casamento Igualitário', 'Adoção', 'Mudança de Nome', 'Discriminação'];
    } else if (categoryLower.includes('saúde') || categoryLower.includes('médico')) {
      return ['Saúde LGBTQIA+', 'Prevenção', 'Tratamento', 'Acompanhamento', 'Consultas'];
    } else if (categoryLower.includes('carreira') || categoryLower.includes('profissional')) {
      return ['Orientação Profissional', 'Desenvolvimento de Carreira', 'Networking', 'Mentoria', 'Recrutamento'];
    } else {
      return ['Atendimento Personalizado', 'Consultoria', 'Acompanhamento', 'Suporte', 'Orientação'];
    }
  };

  // Dados formatados para exibição (sempre do Supabase)
  const displayService = {
    name: service.name,
    category: service.category || 'Serviço',
    description: service.description || 'Sem descrição disponível.',
    price: service.price && service.price > 0 ? `R$ ${service.price.toFixed(2)}` : 'A consultar',
    priceValue: service.price && service.price > 0 ? `R$ ${service.price.toFixed(2)}` : 'Valor a consultar',
    provider: service.provider || 'Prestador não informado',
    rating: service.rating || 0,
    reviewCount: 89, // Mock: número de avaliações
    images: service.image || service.imageUrl 
      ? [service.image || service.imageUrl || 'https://via.placeholder.com/400x300?text=Sem+Imagem']
      : ['https://via.placeholder.com/400x300?text=Sem+Imagem'],
    // Dados mockados para sempre exibir os blocos
    phone: '(11) 98765-4321', // Mock: telefone
    whatsapp: '5511987654321', // Mock: WhatsApp (formato sem caracteres especiais)
    address: 'Av. Paulista, 1000 - São Paulo/SP', // Mock: endereço
    specialties: getMockSpecialties(service.category || 'Serviço'), // Mock: especialidades baseadas na categoria
    hours: [ // Mock: horários de funcionamento
      { day: 'Segunda a Sexta', time: '09:00 - 18:00' },
      { day: 'Sábado', time: '09:00 - 13:00' },
    ],
    verified: true, // Mock: verificado
  };

  // Converter reviews reais para o formato esperado
  const reviews: Review[] = realReviews.map(review => ({
    ...review,
    avatar: review.avatar || review.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTcwMTY1NzYwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    author: review.author || review.userName || 'Usuário',
    date: review.date || (review.createdAt ? new Date(review.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'),
  }));

  // Calcular rating médio e contagem
  const averageRating = reviews.length > 0 ? calculateAverageRating(reviews) : displayService.rating;
  const reviewCount = reviews.length || displayService.reviewCount;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-[#932d6f] text-[#932d6f]' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleWhatsApp = () => {
    if (displayService.whatsapp) {
      window.open(`https://wa.me/${displayService.whatsapp}`, '_blank');
    }
  };

  const handleCall = () => {
    if (displayService.phone) {
      window.open(`tel:${displayService.phone}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Galeria de Fotos */}
          <div className="relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {displayService.images.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0 snap-start">
                  <ImageWithFallback
                    src={image}
                    alt={`${displayService.name} - ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Indicador de Fotos */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {displayService.images.map((_, index) => (
                <div
                  key={index}
                  className="w-1.5 h-1.5 rounded-full bg-white/80"
                />
              ))}
            </div>
            {/* Botão Favoritar */}
            <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
              <Heart className="w-5 h-5 text-[#932d6f]" />
            </button>
          </div>

          {/* Informações Principais */}
          <div className="bg-white px-4 py-5 border-b border-gray-100">
            {/* Categoria e Verificação */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#932d6f]/10 text-[#932d6f] rounded-full text-xs font-medium">
                {displayService.category}
              </span>
              {displayService.verified && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Verificado
                </span>
              )}
            </div>

            {/* Nome do Serviço */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {displayService.name}
            </h1>

            {/* Descrição */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {displayService.description}
            </p>

            {/* Rating e Preço */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-[#932d6f] text-[#932d6f]" />
                <span className="font-bold text-black text-lg">
                  {averageRating.toFixed(1)} ({reviewCount})
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-[#932d6f] font-bold text-lg">{displayService.price}</div>
                <div className="text-xs text-gray-500">{displayService.provider}</div>
              </div>
            </div>
          </div>

          {/* Especialidades - Sempre exibido com conteúdo mockado */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3">Especialidades</h3>
            <div className="flex flex-wrap gap-2">
              {displayService.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-white border border-[#932d6f]/20 text-gray-700 rounded-full text-xs font-medium hover:bg-[#932d6f]/5 transition-colors cursor-pointer"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Informações de Contato - Sempre exibido com conteúdo mockado */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3">Informações de Contato</h3>
            <div className="space-y-3">
              {/* Endereço */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#932d6f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">{displayService.address}</p>
                </div>
              </div>

              {/* Telefone */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#932d6f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">{displayService.phone}</p>
                </div>
              </div>

              {/* Horário */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#932d6f] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {displayService.hours.map((hour, index) => (
                    <p key={index} className="text-sm text-gray-700">
                      <span className="font-medium">{hour.day}:</span> {hour.time}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação Principal */}
          <div className="bg-[#fffbfa] px-4 py-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleWhatsApp}
                disabled={!displayService.whatsapp}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  displayService.whatsapp
                    ? 'bg-[#25D366] text-white hover:bg-[#22c55e] shadow-sm'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title={displayService.whatsapp ? 'Abrir WhatsApp' : 'WhatsApp não disponível'}
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              <button
                onClick={handleCall}
                disabled={!displayService.phone}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                  displayService.phone
                    ? 'bg-[#932d6f] text-white hover:bg-[#7d2660] shadow-sm'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title={displayService.phone ? 'Ligar' : 'Telefone não disponível'}
              >
                <Phone className="w-5 h-5" />
                Ligar
              </button>
            </div>
          </div>

          {/* Botões de Ação Secundários */}
          <div className="bg-white px-4 py-3 border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto">
                    <button 
                      onClick={() => serviceId && onNavigate?.(`create-review:service:${serviceId}`)}
                      className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap hover:bg-[rgba(147,45,111,0.2)] transition-colors"
                    >
                      <Star className="w-4 h-4" />
                      Avaliar
                    </button>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap hover:bg-[rgba(147,45,111,0.2)] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {shareSuccess ? 'Link copiado!' : 'Compartilhar'}
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap">
                <Flag className="w-4 h-4" />
                Denunciar
              </button>
            </div>
          </div>

          {/* Seção de Reviews */}
          <div className="mt-6 pb-6">
            <div className="px-4 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Avaliações</h3>
            </div>

                  {/* Lista de Reviews */}
                  {reviewsLoading ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-muted-foreground text-sm">Carregando avaliações...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                <div key={review.id} className="px-4 py-4 border-b border-gray-100">
                  {/* Header do Review */}
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={review.avatar} 
                      alt={review.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">{review.author}</h4>
                      <p className="text-xs text-gray-500">Avaliação postada {review.date}</p>
                    </div>
                  </div>

                  {/* Avaliação com Estrelas */}
                  <div className="mb-2">
                    {renderStars(review.rating)}
                  </div>

                  {/* Comentário */}
                  <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">Nenhuma avaliação disponível ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="services" onItemClick={onNavigate!} />
      </div>
    </div>
  );
}
