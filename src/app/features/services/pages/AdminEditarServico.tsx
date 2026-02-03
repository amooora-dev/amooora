import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Scissors, Image, FileText, Tag, DollarSign, User, AlertCircle, CheckCircle, Upload, X, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { updateService, getServiceById } from '../services/services';
import { uploadImage } from '../../../infra/storage';

interface AdminEditarServicoProps {
  serviceId?: string;
  onNavigate: (page: string) => void;
}

export function AdminEditarServico({ serviceId, onNavigate }: AdminEditarServicoProps) {
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
    category: '',
    categorySlug: '',
    price: '',
    provider: '',
    phone: '',
    whatsapp: '',
    address: '',
    specialties: '',
    hoursMonday: '',
    hoursTuesday: '',
    hoursWednesday: '',
    hoursThursday: '',
    hoursFriday: '',
    hoursSaturday: '',
    hoursSunday: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { label: 'Costura', slug: 'costura' },
    { label: 'Marcenaria', slug: 'marcenaria' },
    { label: 'Pintura', slug: 'pintura' },
    { label: 'Reparos', slug: 'reparos' },
    { label: 'Bem-estar', slug: 'bem-estar' },
    { label: 'Beleza', slug: 'beleza' },
    { label: 'Terapia', slug: 'terapia' },
    { label: 'Advocacia', slug: 'advocacia' },
    { label: 'Saúde', slug: 'saude' },
    { label: 'Carreira', slug: 'carreira' },
    { label: 'Outros', slug: 'outros' },
  ];

  // Carregar dados do serviço
  useEffect(() => {
    const loadService = async () => {
      if (!serviceId) {
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      try {
        const service = await getServiceById(serviceId);
        if (service) {
          // Processar especialidades
          const specialtiesStr = service.specialties 
            ? (Array.isArray(service.specialties) 
                ? service.specialties.join(', ') 
                : service.specialties)
            : '';

          // Processar horários
          const hours = service.hours || {};
          
          setFormData({
            name: service.name || '',
            description: service.description || '',
            image: service.image || service.imageUrl || '',
            category: service.category || '',
            categorySlug: service.categorySlug || '',
            price: service.price?.toString() || '',
            provider: service.provider || '',
            phone: service.phone || '',
            whatsapp: service.whatsapp || '',
            address: service.address || '',
            specialties: specialtiesStr,
            hoursMonday: hours.monday || '',
            hoursTuesday: hours.tuesday || '',
            hoursWednesday: hours.wednesday || '',
            hoursThursday: hours.thursday || '',
            hoursFriday: hours.friday || '',
            hoursSaturday: hours.saturday || '',
            hoursSunday: hours.sunday || '',
          });
          
          // Mostrar imagem atual se existir
          if (service.image || service.imageUrl) {
            setImagePreview(service.image || service.imageUrl || null);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar serviço:', error);
        setSubmitError('Erro ao carregar dados do serviço');
      } finally {
        setLoadingData(false);
      }
    };

    loadService();
  }, [serviceId]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    if (submitError) setSubmitError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleCategoryChange = (value: string) => {
    const selected = categories.find((cat) => cat.label === value);
    setFormData({
      ...formData,
      category: value,
      categorySlug: selected?.slug || value.toLowerCase().replace(/\s+/g, '-'),
    });
    if (errors.category) {
      setErrors({ ...errors, category: '' });
    }
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
      newErrors.name = 'Nome do serviço é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Preço deve ser um número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !serviceId) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      let imageUrl = formData.image || undefined;

      if (selectedFile) {
        const uploadResult = await uploadImage(selectedFile, 'services');
        
        if (uploadResult.error) {
          setSubmitError(uploadResult.error);
          setIsLoading(false);
          return;
        }

        imageUrl = uploadResult.url;
      }

      // Processar especialidades (separadas por vírgula)
      const specialtiesArray = formData.specialties 
        ? formData.specialties.split(',').map(s => s.trim()).filter(s => s)
        : undefined;
      
      // Processar horários
      const hours: Record<string, string> = {};
      if (formData.hoursMonday) hours.monday = formData.hoursMonday;
      if (formData.hoursTuesday) hours.tuesday = formData.hoursTuesday;
      if (formData.hoursWednesday) hours.wednesday = formData.hoursWednesday;
      if (formData.hoursThursday) hours.thursday = formData.hoursThursday;
      if (formData.hoursFriday) hours.friday = formData.hoursFriday;
      if (formData.hoursSaturday) hours.saturday = formData.hoursSaturday;
      if (formData.hoursSunday) hours.sunday = formData.hoursSunday;

      await updateService(serviceId, {
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        category: formData.category,
        categorySlug: formData.categorySlug,
        price: formData.price ? Number(formData.price) : undefined,
        provider: formData.provider || undefined,
        phone: formData.phone || undefined,
        whatsapp: formData.whatsapp || undefined,
        address: formData.address || undefined,
        specialties: specialtiesArray,
        hours: Object.keys(hours).length > 0 ? hours : undefined,
      });

      setSuccessMessage('Serviço atualizado com sucesso!');
      
      setTimeout(() => {
        onNavigate('admin-editar-conteudos');
      }, 1500);
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'Erro ao atualizar serviço. Tente novamente.'
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
            <p className="text-sm text-gray-600">Carregando dados do serviço...</p>
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
            Editar Serviço
          </h1>
          <div className="w-10" />
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-5 py-6 space-y-5">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              Editar Serviço 💜
            </h2>
            <p className="text-sm text-muted-foreground">
              Atualize as informações do serviço
            </p>
          </div>

          {/* Nome do Serviço */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Scissors className="w-4 h-4 text-primary" />
              Nome do Serviço *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                errors.name ? 'border-red-500' : 'border-transparent'
              } focus:border-secondary focus:outline-none transition-colors`}
              placeholder="Ex: Costureira Profissional"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
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
              className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                errors.description ? 'border-red-500' : 'border-transparent'
              } focus:border-secondary focus:outline-none transition-colors resize-none`}
              rows={4}
              placeholder="Descreva o serviço oferecido..."
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Upload de Imagem */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Image className="w-4 h-4 text-primary" />
              Imagem do Serviço
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

          {/* Categoria */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Tag className="w-4 h-4 text-primary" />
              Categoria *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                errors.category ? 'border-red-500' : 'border-transparent'
              } focus:border-secondary focus:outline-none transition-colors appearance-none`}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          {/* Preço e Provedor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                Preço (R$)
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                  errors.price ? 'border-red-500' : 'border-transparent'
                } focus:border-secondary focus:outline-none transition-colors`}
                placeholder="120.00"
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <User className="w-4 h-4 text-primary" />
                Provedor
              </label>
              <input
                type="text"
                value={formData.provider}
                onChange={(e) => handleChange('provider', e.target.value)}
                className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors"
                placeholder="Nome do profissional"
              />
            </div>
          </div>

          {/* Contato: Telefone e WhatsApp */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Phone className="w-4 h-4 text-primary" />
                Telefone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors"
                placeholder="(11) 98765-4321"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                WhatsApp
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors"
                placeholder="5511987654321"
              />
            </div>
          </div>

          {/* Endereço */}
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
              placeholder="Av. Paulista, 1000 - São Paulo/SP"
            />
          </div>

          {/* Especialidades */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Tag className="w-4 h-4 text-primary" />
              Especialidades
            </label>
            <textarea
              value={formData.specialties}
              onChange={(e) => handleChange('specialties', e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors resize-none"
              rows={3}
              placeholder="Digite as especialidades separadas por vírgula (ex: Terapia LGBTQIA+, Ansiedade, Depressão)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separe cada especialidade com vírgula
            </p>
          </div>

          {/* Horários de Funcionamento */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
              <Clock className="w-4 h-4 text-primary" />
              Horários de Funcionamento
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-20 text-sm text-muted-foreground">Segunda:</span>
                <input
                  type="text"
                  value={formData.hoursMonday}
                  onChange={(e) => handleChange('hoursMonday', e.target.value)}
                  className="flex-1 px-4 py-2 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors text-sm"
                  placeholder="09:00 - 18:00"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-sm text-muted-foreground">Terça:</span>
                <input
                  type="text"
                  value={formData.hoursTuesday}
                  onChange={(e) => handleChange('hoursTuesday', e.target.value)}
                  className="flex-1 px-4 py-2 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors text-sm"
                  placeholder="09:00 - 18:00"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-sm text-muted-foreground">Quarta:</span>
                <input
                  type="text"
                  value={formData.hoursWednesday}
                  onChange={(e) => handleChange('hoursWednesday', e.target.value)}
                  className="flex-1 px-4 py-2 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors text-sm"
                  placeholder="09:00 - 18:00"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-sm text-muted-foreground">Quinta:</span>
                <input
                  type="text"
                  value={formData.hoursThursday}
                  onChange={(e) => handleChange('hoursThursday', e.target.value)}
                  className="flex-1 px-4 py-2 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors text-sm"
                  placeholder="09:00 - 18:00"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-sm text-muted-foreground">Sexta:</span>
                <input
                  type="text"
                  value={formData.hoursFriday}
                  onChange={(e) => handleChange('hoursFriday', e.target.value)}
                  className="flex-1 px-4 py-2 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors text-sm"
                  placeholder="09:00 - 18:00"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-sm text-muted-foreground">Sábado:</span>
                <input
                  type="text"
                  value={formData.hoursSaturday}
                  onChange={(e) => handleChange('hoursSaturday', e.target.value)}
                  className="flex-1 px-4 py-2 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors text-sm"
                  placeholder="09:00 - 13:00"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-20 text-sm text-muted-foreground">Domingo:</span>
                <input
                  type="text"
                  value={formData.hoursSunday}
                  onChange={(e) => handleChange('hoursSunday', e.target.value)}
                  className="flex-1 px-4 py-2 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors text-sm"
                  placeholder="Fechado"
                />
              </div>
            </div>
          </div>

          {/* Mensagem de sucesso */}
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

          {/* Mensagem de erro */}
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">
                  Erro ao atualizar serviço
                </p>
                <p className="text-xs text-red-600">{submitError}</p>
              </div>
            </div>
          )}

          {/* Botões */}
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
              disabled={isLoading || !serviceId}
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
