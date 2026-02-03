import { useState, useRef } from 'react';
import { ArrowLeft, Calendar, Image, FileText, Tag, DollarSign, MapPin, Clock, AlertCircle, CheckCircle, Upload, X } from 'lucide-react';
import { createEvent } from '../services/events';
import { uploadImage } from '../infra/storage';

interface AdminCadastrarEventoProps {
  onNavigate: (page: string) => void;
}

export function AdminCadastrarEvento({ onNavigate }: AdminCadastrarEventoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    date: '',
    time: '',
    endTime: '', // Horário de término
    location: '',
    address: '',
    category: '',
    price: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Cultura',
    'Música',
    'Bem-estar',
    'Festa',
    'Workshop',
    'Esporte',
    'Artesanato',
    'Cinema',
    'Literatura',
    'Outros',
  ];

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
      newErrors.name = 'Nome do evento é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (!formData.time) {
      newErrors.time = 'Horário é obrigatório';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Local é obrigatório';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      let imageUrl = formData.image || undefined;

      // Se houver arquivo selecionado, fazer upload primeiro
      if (selectedFile) {
        const uploadResult = await uploadImage(selectedFile, 'events');
        
        if (uploadResult.error) {
          setSubmitError(uploadResult.error);
          setIsLoading(false);
          return;
        }

        imageUrl = uploadResult.url;
      }

      // Combina data e hora em uma string ISO
      const dateTime = `${formData.date}T${formData.time}:00`;
      const isoDate = new Date(dateTime).toISOString();

      // Preparar end_time se fornecido
      let endTimeValue: string | undefined = undefined;
      if (formData.endTime) {
        const endDateTime = `${formData.date}T${formData.endTime}:00`;
        endTimeValue = new Date(endDateTime).toISOString();
      }

      await createEvent({
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        date: isoDate,
        endTime: endTimeValue,
        location: formData.address ? `${formData.location} - ${formData.address}` : formData.location,
        category: formData.category,
        price: formData.price ? Number(formData.price) : undefined,
      });

      setSuccessMessage('Evento cadastrado com sucesso no Supabase!');
      
      // Limpa o formulário após 2 segundos
      setTimeout(() => {
        setFormData({
          name: '',
          description: '',
          image: '',
          date: '',
          time: '',
          endTime: '',
          location: '',
          address: '',
          category: '',
          price: '',
        });
        setSelectedFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setSuccessMessage(null);
      }, 2000);
    } catch (error) {
      console.error('Erro ao cadastrar evento:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'Erro ao criar evento. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <button
            onClick={() => onNavigate('admin')}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-semibold text-lg text-primary">
            Cadastrar Evento
          </h1>
          <div className="w-10" />
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-5 py-6 space-y-5">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              Novo Evento 💜
            </h2>
            <p className="text-sm text-muted-foreground">
              Crie um novo evento na plataforma
            </p>
          </div>

          {/* Nome do Evento */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              Nome do Evento *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                errors.name ? 'border-red-500' : 'border-transparent'
              } focus:border-secondary focus:outline-none transition-colors`}
              placeholder="Ex: Sarau Lésbico"
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
              placeholder="Descreva o evento..."
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Upload de Imagem */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Image className="w-4 h-4 text-primary" />
              Imagem do Evento
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
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedFile?.name} ({((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                </p>
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

          {/* Data */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              Data *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                errors.date ? 'border-red-500' : 'border-transparent'
              } focus:border-secondary focus:outline-none transition-colors`}
            />
            {errors.date && (
              <p className="text-xs text-red-500 mt-1">{errors.date}</p>
            )}
          </div>

          {/* Horários: Início e Término */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Clock className="w-4 h-4 text-primary" />
                Horário Início *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                  errors.time ? 'border-red-500' : 'border-transparent'
                } focus:border-secondary focus:outline-none transition-colors`}
              />
              {errors.time && (
                <p className="text-xs text-red-500 mt-1">{errors.time}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Clock className="w-4 h-4 text-primary" />
                Horário Término
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Local e Endereço */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              Local/Nome do Local *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                errors.location ? 'border-red-500' : 'border-transparent'
              } focus:border-secondary focus:outline-none transition-colors mb-3`}
              placeholder="Ex: Centro Cultural da Diversidade"
            />
            {errors.location && (
              <p className="text-xs text-red-500 mt-1">{errors.location}</p>
            )}
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors"
              placeholder="Endereço completo (opcional)"
            />
          </div>

          {/* Categoria e Preço */}
          <div className="grid grid-cols-2 gap-3">
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
                <option value="">Selecione</option>
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
                placeholder="0 = Gratuito"
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price}</p>
              )}
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
                  Erro ao cadastrar evento
                </p>
                <p className="text-xs text-red-600">{submitError}</p>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              disabled={isLoading}
              className="flex-1 bg-white border-2 border-secondary text-secondary py-4 px-6 rounded-full font-semibold hover:bg-secondary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-white py-4 px-6 rounded-full font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
