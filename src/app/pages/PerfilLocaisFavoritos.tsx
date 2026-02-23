import { useState, useEffect, useMemo } from 'react';
import { Star, MapPin, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../shared/components';
import { Header, BottomNav } from '../shared/components';
import { useProfile } from '../hooks/useProfile';
import { useAdmin, useFavorites } from '../shared/hooks';
import { usePlaces } from '../features/places';
import {
  getVisitedPlaces,
  getUserReviews,
  type SavedPlace,
  type VisitedPlace,
  type UserReview,
} from '../services/profile';

interface PerfilLocaisFavoritosProps {
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

export function PerfilLocaisFavoritos({ onNavigate }: PerfilLocaisFavoritosProps) {
  const { profile } = useProfile();
  const { isAdmin } = useAdmin();
  const { getFavoritesByType } = useFavorites();
  const { places: allPlaces, loading: placesLoading } = usePlaces();
  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlace[]>([]);
  const [placeReviews, setPlaceReviews] = useState<UserReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const favoritePlaceIds = getFavoritesByType('places');
  const places: SavedPlace[] = useMemo(() => {
    if (!Array.isArray(favoritePlaceIds) || favoritePlaceIds.length === 0) return [];
    if (!Array.isArray(allPlaces)) return [];
    return allPlaces
      .filter((p) => p && p.id && favoritePlaceIds.includes(p.id))
      .map((p) => ({
        id: p.id,
        place_id: p.id,
        name: p.name || 'Local',
        category: p.category || 'Outros',
        rating: Number(p.rating) || 0,
        imageUrl: p.imageUrl || p.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
      }));
  }, [allPlaces, favoritePlaceIds]);

  useEffect(() => {
    if (!profile?.id) {
      setReviewsLoading(false);
      return;
    }
    Promise.all([getVisitedPlaces(profile.id), getUserReviews(profile.id)])
      .then(([visited, reviews]) => {
        setVisitedPlaces(visited);
        setPlaceReviews((reviews || []).filter((r) => r.place_id));
      })
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [profile?.id]);

  const loading = placesLoading || reviewsLoading;
  const hasContent = places.length > 0 || visitedPlaces.length > 0 || placeReviews.length > 0;

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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Locais</h1>
            <p className="text-sm text-muted-foreground">Favoritos, que você frequentou e suas avaliações</p>
          </div>
          <div className="px-5 pb-6">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Carregando...</div>
            ) : !hasContent ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">Você ainda não tem locais favoritos nem avaliações.</p>
                <button
                  type="button"
                  onClick={() => onNavigate('places')}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium"
                >
                  Explorar locais
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Locais Favoritos */}
                {places.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Locais Favoritos</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {places.map((place) => (
                        <div
                          key={place.id}
                          onClick={() => onNavigate(`place-details:${place.place_id}`)}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <div className="relative h-24">
                            <ImageWithFallback
                              src={place.imageUrl}
                              alt={place.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">{place.name}</h3>
                            <p className="text-xs text-gray-500 mb-2">{place.category}</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-[#932d6f] text-[#932d6f]" />
                              <span className="text-xs font-medium text-gray-700">{(Number(place.rating) || 0).toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Locais que Já Frequentei */}
                {visitedPlaces.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Locais que Já Frequentei</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {visitedPlaces.map((place) => (
                        <div
                          key={place.id}
                          onClick={() => onNavigate(`place-details:${place.place_id}`)}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <div className="relative h-24">
                            <ImageWithFallback
                              src={place.imageUrl}
                              alt={place.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-[#932d6f] rounded-full p-1">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">{place.name}</h3>
                            <p className="text-xs text-gray-500 mb-2">{place.category}</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-[#932d6f] text-[#932d6f]" />
                              <span className="text-xs font-medium text-gray-700">{(Number(place.rating) || 0).toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Minhas avaliações - Locais */}
                {placeReviews.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-[#932d6f]" />
                      <h2 className="text-lg font-bold text-gray-900">Minhas avaliações - Locais</h2>
                    </div>
                    <div className="space-y-3">
                      {placeReviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-sm text-gray-900 mb-1">
                                {review.placeName || 'Local avaliado'}
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
