import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Users, Image, FileText, Tag, AlertCircle, CheckCircle, Upload, X } from 'lucide-react';
import { updateCommunity, getCommunityById } from '../services/communities';
import { uploadImage } from '../../../infra/storage';

interface AdminEditarComunidadeProps {
  communityId?: string;
  onNavigate: (page: string) => void;
}

export function AdminEditarComunidade({ communityId, onNavigate }: AdminEditarComunidadeProps) {
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
    icon: '',
    category: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Apoio',
    'Dicas',
    'Eventos',
    'Geral',
  ];

  // Carregar dados da comunidade
  useEffect(() => {
    const loadCommunity = async () => {
      if (!communityId) {
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      try {
        const community = await getCommunityById(communityId);
        if (community) {
          setFormData({
            name: community.name || '',
            description: community.description || '',
            image: community.image || community.imageUrl || '',
            icon: community.icon || '',
            category: community.category || '',
          });
          
          // Mostrar imagem atual se existir
          if (community.image || community.imageUrl) {
            setImagePreview(community.image || community.imageUrl || null);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar comunidade:', error);
        setSubmitError('Erro ao carregar dados da comunidade');
      } finally {
        setLoadingData(false);
      }
    };

    loadCommunity();
  }, [communityId]);

  const handleChange = (field: string, value: string) => {
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
      newErrors.name = 'Nome da comunidade é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !communityId) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      let imageUrl = formData.image || undefined;

      // Se houver arquivo selecionado, fazer upload primeiro
      if (selectedFile) {
        const uploadResult = await uploadImage(selectedFile, 'communities');
        
        if (uploadResult.error) {
          setSubmitError(uploadResult.error);
          setIsLoading(false);
          return;
        }

        imageUrl = uploadResult.url;
      }

      await updateCommunity(communityId, {
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        icon: formData.icon || undefined,
        category: formData.category,
      });

      setSuccessMessage('Comunidade atualizada com sucesso!');
      
      // Voltar para a lista após 1.5 segundos
      setTimeout(() => {
        onNavigate('admin-editar-conteudos');
      }, 1500);
    } catch (error) {
      console.error('Erro ao atualizar comunidade:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'Erro ao atualizar comunidade. Tente novamente.'
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
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando comunidade...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <button
            onClick={() => onNavigate('admin-editar-conteudos')}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-semibold text-lg text-primary">
            Editar Comunidade
          </h1>
          <div className="w-10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-6 space-y-6">
          {/* Nome */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Users className="w-4 h-4 text-primary" />
              Nome da Comunidade *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: Apoio, Saúde Mental, Relacionamentos..."
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.name ? 'border-red-500' : 'border-border'
              } bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <FileText className="w-4 h-4 text-primary" />
              Descrição *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descreva a comunidade..."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.description ? 'border-red-500' : 'border-border'
              } bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Tag className="w-4 h-4 text-primary" />
              Categoria *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.category ? 'border-red-500' : 'border-border'
              } bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Ícone (opcional) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Users className="w-4 h-4 text-primary" />
              Ícone (opcional)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => handleChange('icon', e.target.value)}
              placeholder="Nome do ícone (ex: Heart, Users, Calendar)"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Nome do ícone do Lucide React (opcional)
            </p>
          </div>

          {/* Imagem */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Image className="w-4 h-4 text-primary" />
              Imagem da Comunidade
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border border-border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary transition-colors"
              >
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center px-4">
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
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {errors.image && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.image}
              </p>
            )}
          </div>

          {/* Mensagens de sucesso/erro */}
          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          )}

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{submitError}</p>
            </div>
          )}

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Atualizando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Atualizar Comunidade
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
