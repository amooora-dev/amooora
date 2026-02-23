import { useState, useEffect, useMemo } from 'react';
import { Briefcase, Star } from 'lucide-react';
import { ImageWithFallback } from '../shared/components';
import { Header, BottomNav } from '../shared/components';
import { useProfile } from '../hooks/useProfile';
import { useAdmin, useFavorites } from '../shared/hooks';
import { useServices } from '../features/services';
import { getUserReviews, type UserReview } from '../services/profile';

interface PerfilServicosFavoritosProps {
  onNavigate: (page: string) => void;
}

function renderStars(rating: number) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? 'fill-[#932d6f] text-[#932d6f]' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

type ServiceCard = {
  id: string;
  service_id: string;
  name: string;
  category: string;
  provider: string;
  imageUrl: string;
};

export function PerfilServicosFavoritos({ onNavigate }: PerfilServicosFavoritosProps) {
  const { profile } = useProfile();
  const { isAdmin } = useAdmin();
  const { getFavoritesByType } = useFavorites();
  const { services: allServices, loading: servicesLoading } = useServices();
  const [serviceReviews, setServiceReviews] = useState<UserReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const favoriteServiceIds = getFavoritesByType('services');
  const services: ServiceCard[] = useMemo(() => {
    if (!Array.isArray(favoriteServiceIds) || favoriteServiceIds.length === 0) return [];
    if (!Array.isArray(allServices)) return [];
    return allServices
      .filter((s) => s && s.id && favoriteServiceIds.includes(s.id))
      .map((s) => ({
        id: s.id,
        service_id: s.id,
        name: s.name || 'Serviço',
        category: s.category || 'Outros',
        provider: s.provider || 'Fornecedor não informado',
        imageUrl: s.imageUrl || s.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
      }));
  }, [allServices, favoriteServiceIds]);

  useEffect(() => {
    if (!profile?.id) {
      setReviewsLoading(false);
      return;
    }
    getUserReviews(profile.id)
      .then((reviews) => setServiceReviews((reviews || []).filter((r) => r.service_id)))
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [profile?.id]);

  const loading = servicesLoading || reviewsLoading;
  const hasContent = services.length > 0 || serviceReviews.length > 0;

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <Header
          onNavigate={onNavigate}
          isAdmin={isAdmin}
          showBackButton
          onBack={() => onNavigate('profile')}
        />
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Serviços favoritados</h1>
            <p className="text-sm text-muted-foreground">Serviços que você salvou e suas avaliações</p>
          </div>
          <div className="px-5 pb-6">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Carregando...</div>
            ) : !hasContent ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">Você ainda não tem serviços favoritos.</p>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium"
                >
                  Explorar serviços
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Serviços Favoritos */}
                {services.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Serviços Favoritos</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => onNavigate(`service-details:${service.service_id}`)}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <div className="relative h-24">
                            <ImageWithFallback
                              src={service.imageUrl}
                              alt={service.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">{service.name}</h3>
                            <p className="text-xs text-gray-500 mb-1">{service.category}</p>
                            <p className="text-xs text-gray-400 truncate">{service.provider}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Minhas avaliações - Serviços */}
                {serviceReviews.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="w-5 h-5 text-[#932d6f]" />
                      <h2 className="text-lg font-bold text-gray-900">Minhas avaliações - Serviços</h2>
                    </div>
                    <div className="space-y-3">
                      {serviceReviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-sm text-gray-900 mb-1">
                                {review.serviceName || 'Serviço avaliado'}
                              </h3>
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <BottomNav activeItem="profile" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
