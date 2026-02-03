import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MapPin, Image, FileText, Tag, AlertCircle, CheckCircle, Upload, X } from 'lucide-react';
import { updatePlace, getPlaceById } from '../services/places';
import { uploadImage } from '../../../infra/storage';

interface AdminEditarLocalProps {
  placeId?: string;
  onNavigate: (page: string) => void;
}

export function AdminEditarLocal({ placeId, onNavigate }: AdminEditarLocalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    address: '',
    category: '',
    latitude: '',
    longitude: '',
    isSafe: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Café',
    'Bar',
    'Restaurante',
    'Livraria',
    'Parque',
    'Praia',
    'Cultura',
    'Bem-estar',
    'Outros',
  ];

  useEffect(() => {
    const loadPlace = async () => {
      if (!placeId) {
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      try {
        const place = await getPlaceById(placeId);
        if (place) {
          setFormData({
            name: place.name || '',
            description: place.description || '',
            image: place.image || place.imageUrl || '',
            address: place.address || '',
            category: place.category || '',
            latitude: place.latitude?.toString() || '',
            longitude: place.longitude?.toString() || '',
            isSafe: place.isSafe ?? true,
          });
          if (place.image || place.imageUrl) {
            setImagePreview(place.image || place.imageUrl || null);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar local:', error);
        setSubmitError('Erro ao carregar dados do local');
      } finally {
        setLoadingData(false);
      }
    };

    loadPlace();
  }, [placeId]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    if (submitError) setSubmitError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, image: 'Tipo de arquivo inválido. Use JPG, PNG, WEBP ou GIF.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: 'Arquivo muito grande. Tamanho máximo: 5MB.' });
      return;
    }

    setSelectedFile(file);
    setErrors({ ...errors, image: '' });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (formData.latitude && isNaN(Number(formData.latitude))) {
      newErrors.latitude = 'Latitude deve ser um número válido';
    }

    if (formData.longitude && isNaN(Number(formData.longitude))) {
      newErrors.longitude = 'Longitude deve ser um número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !placeId) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      let imageUrl = formData.image;

      if (selectedFile) {
        const uploadResult = await uploadImage(selectedFile, 'places');
        
        if (uploadResult.error) {
          setSubmitError(uploadResult.error);
          setIsLoading(false);
          return;
        }

        imageUrl = uploadResult.url;
      }

      await updatePlace(placeId, {
        name: formData.name,
        description: formData.description || undefined,
        image: imageUrl || undefined,
        address: formData.address || undefined,
        category: formData.category,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        isSafe: formData.isSafe,
      });

      setSuccessMessage('Local atualizado com sucesso!');
      
      setTimeout(() => {
        onNavigate('admin-editar-conteudos');
      }, 1500);
    } catch (error) {
      console.error('Erro ao atualizar local:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'Erro ao atualizar local. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Carregando dados do local...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <button
            onClick={() => onNavigate('admin-editar-conteudos')}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-semibold text-lg text-primary">
            Editar Local
          </h1>
          <div className="w-10" />
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-6 space-y-5">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              Editar Local Seguro 💜
            </h2>
            <p className="text-sm text-muted-foreground">
              Atualize as informações do local
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              Nome do Local *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                errors.name ? 'border-red-500' : 'border-transparent'
              } focus:border-secondary focus:outline-none transition-colors`}
              placeholder="Ex: Café da Vila"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <FileText className="w-4 h-4 text-primary" />
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors resize-none"
              rows={4}
              placeholder="Descreva o local..."
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Image className="w-4 h-4 text-primary" />
              Imagem do Local
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <div className="w-full h-48 rounded-xl overflow-hidden border-2 border-border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                {selectedFile && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedFile.name} ({((selectedFile.size || 0) / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-full px-4 py-8 bg-muted rounded-xl border-2 border-dashed ${
                  errors.image ? 'border-red-500' : 'border-border'
                } cursor-pointer hover:border-secondary transition-colors flex flex-col items-center justify-center gap-2`}
              >
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-foreground font-medium">
                  Clique para fazer upload da imagem
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WEBP ou GIF (máx. 5MB)
                </p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {errors.image && (
              <p className="text-xs text-red-500 mt-1">{errors.image}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              Endereço
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors"
              placeholder="Ex: Rua das Flores, 123 - São Paulo/SP"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Tag className="w-4 h-4 text-primary" />
              Categoria *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                errors.category ? 'border-red-500' : 'border-transparent'
              } focus:border-secondary focus:outline-none transition-colors appearance-none`}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Latitude
              </label>
              <input
                type="text"
                value={formData.latitude}
                onChange={(e) => handleChange('latitude', e.target.value)}
                className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                  errors.latitude ? 'border-red-500' : 'border-transparent'
                } focus:border-secondary focus:outline-none transition-colors`}
                placeholder="-23.5505"
              />
              {errors.latitude && (
                <p className="text-xs text-red-500 mt-1">{errors.latitude}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Longitude
              </label>
              <input
                type="text"
                value={formData.longitude}
                onChange={(e) => handleChange('longitude', e.target.value)}
                className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                  errors.longitude ? 'border-red-500' : 'border-transparent'
                } focus:border-secondary focus:outline-none transition-colors`}
                placeholder="-46.6333"
              />
              {errors.longitude && (
                <p className="text-xs text-red-500 mt-1">{errors.longitude}</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-start gap-3 p-4 bg-muted rounded-xl cursor-pointer hover:bg-muted/80 transition-colors">
              <input
                type="checkbox"
                checked={formData.isSafe}
                onChange={(e) => handleChange('isSafe', e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-secondary text-secondary focus:ring-secondary"
              />
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">
                  Marcar como local seguro
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Este local é seguro e acolhedor para a comunidade
                </p>
              </div>
            </label>
          </div>

          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  {successMessage}
                </p>
              </div>
            </div>
          )}

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">
                  Erro ao atualizar local
                </p>
                <p className="text-xs text-red-600">{submitError}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('admin-editar-conteudos')}
              disabled={isLoading}
              className="flex-1 bg-white border-2 border-secondary text-secondary py-4 px-6 rounded-full font-semibold hover:bg-secondary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !placeId}
              className="flex-1 bg-primary text-white py-4 px-6 rounded-full font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

