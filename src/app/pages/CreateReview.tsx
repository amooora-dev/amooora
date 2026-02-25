import { useState } from 'react';
import { Star, AlertCircle } from 'lucide-react';
import { Header } from '../shared/components';
import { BottomNav } from '../shared/components';
import { createReview } from '../shared/services';

interface CreateReviewProps {
  onNavigate: (page: string) => void;
  placeId?: string;
  serviceId?: string;
  eventId?: string;
  communityId?: string;
  itemName?: string;
  itemType?: 'place' | 'service' | 'event' | 'community';
  onBack?: () => void;
}

export function CreateReview({ 
  onNavigate, 
  placeId, 
  serviceId, 
  eventId,
  communityId,
  itemName = 'este local',
  itemType = 'place',
  onBack 
}: CreateReviewProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await createReview({
        placeId,
        serviceId,
        eventId,
        communityId,
        rating,
        comment: reviewText,
      });

      setSuccess(true);
      
      // Disparar evento customizado para atualizar reviews com detalhes do tipo
      const reviewType = placeId ? 'place' : serviceId ? 'service' : 'event';
      const reviewId = placeId || serviceId || eventId;
      
      console.log('[CreateReview] Disparando evento review-created:', { reviewType, reviewId });
      window.dispatchEvent(new CustomEvent('review-created', {
        detail: {
          placeId,
          serviceId,
          eventId,
          reviewType,
          reviewId
        }
      }));
      
      // Aguardar um pouco antes de voltar para mostrar feedback
      setTimeout(() => {
        if (onBack) {
          onBack();
        } else if (placeId) {
          onNavigate(`place-details:${placeId}`);
        } else if (serviceId) {
          onNavigate(`service-details:${serviceId}`);
        } else if (eventId) {
          onNavigate(`event-details:${eventId}`);
        } else {
          onNavigate('home');
        }
      }, 1500);
    } catch (err) {
      console.error('Erro ao criar avaliação:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = rating > 0 && reviewText.trim().length > 0;

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header 
          onNavigate={onNavigate} 
          showBackButton 
          onBack={onBack || (() => {
            if (placeId) onNavigate(`place-details:${placeId}`);
            else if (serviceId) onNavigate(`service-details:${serviceId}`);
            else if (eventId) onNavigate(`event-details:${eventId}`);
            else onNavigate('home');
          })} 
        />

        {/* Conteúdo scrollável - padding-top para compensar header fixo */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          <div className="px-5 py-6 space-y-6">
            {/* Título */}
            <div>
              <h1 className="text-2xl font-bold text-primary mb-2">
                Conte sua experiência
              </h1>
              <p className="text-gray-600 text-sm">
                Compartilhe sua experiência em <span className="font-semibold text-primary">{itemName}</span>
              </p>
            </div>

            {/* Rating com Estrelas */}
            <div className="bg-[#fffbfa] rounded-2xl p-6 border border-[#932d6f]/10">
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Como você avalia {itemType === 'place' ? 'este local' : itemType === 'service' ? 'este serviço' : 'este evento'}?
              </label>
              <div className="flex gap-2 justify-center py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-12 h-12 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-[#932d6f] text-[#932d6f]'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-[#932d6f] font-medium mt-2">
                  {rating === 1 && 'Ruim'}
                  {rating === 2 && 'Regular'}
                  {rating === 3 && 'Bom'}
                  {rating === 4 && 'Muito Bom'}
                  {rating === 5 && 'Excelente'}
                </p>
              )}
            </div>

            {/* Campo de Texto */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Descreva sua experiência
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="O que você achou do local? Conte sobre o ambiente, atendimento, comida..."
                className="w-full h-40 px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#932d6f] focus:ring-2 focus:ring-[#932d6f]/20 outline-none resize-none text-sm leading-relaxed"
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-xs text-gray-500">
                  {reviewText.length}/500 caracteres
                </span>
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 mb-1">
                    Erro ao publicar avaliação
                  </p>
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Mensagem de sucesso */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-sm font-medium text-green-800">
                  Avaliação publicada com sucesso!
                </p>
              </div>
            )}

            {/* Botão Publicar */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${
                isFormValid && !isSubmitting
                  ? 'bg-[#932d6f] text-white hover:bg-[#7d2660] shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Publicando...' : 'Publicar Review'}
            </button>

            {!isFormValid && !isSubmitting && (
              <p className="text-center text-xs text-gray-500">
                Preencha a avaliação e o texto para publicar
              </p>
            )}
          </div>
        </div>

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
