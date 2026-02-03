import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, User, AtSign, MapPin, Heart, AlignLeft, Lock, X, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../shared/components';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../infra/supabase';
import { uploadImage, updateProfileAvatar } from '../services/storage';

interface EditarPerfilProps {
  onNavigate: (page: string) => void;
}

export function EditarPerfil({ onNavigate }: EditarPerfilProps) {
  const { profile, loading: profileLoading, refetch: refetchProfile } = useProfile();
  const [formData, setFormData] = useState({
    nome: '',
    pronomes: '',
    cidade: '',
    bio: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar dados do perfil
  useEffect(() => {
    if (profile) {
      setFormData({
        nome: profile.name || '',
        pronomes: profile.pronouns || '',
        cidade: profile.city || '',
        bio: profile.bio || '',
      });
      if (profile.avatar) {
        setAvatarPreview(profile.avatar);
      }
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setSaveError(null);
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setAvatarError('Formato não suportado. Use JPG, PNG ou WEBP.');
      return;
    }

    // Validar tamanho (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setAvatarError('Imagem muito grande. Tamanho máximo: 2MB.');
      return;
    }

    setAvatarError(null);
    setAvatarFile(file);

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(profile?.avatar || null);
    setAvatarError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSalvar = async () => {
    if (!profile?.id) {
      setSaveError('Erro: perfil não encontrado');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Upload da foto se houver nova foto
      let avatarUrl = profile.avatar || null;
      if (avatarFile) {
        const uploadResult = await uploadImage(avatarFile, 'avatars');
        if (uploadResult.error) {
          setSaveError(`Erro ao fazer upload da foto: ${uploadResult.error}`);
          setIsSaving(false);
          return;
        }
        avatarUrl = uploadResult.url;
      }

      // Atualizar perfil no banco
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: formData.nome,
          pronouns: formData.pronomes || null,
          city: formData.cidade || null,
          bio: formData.bio || null,
          avatar: avatarUrl,
        })
        .eq('id', profile.id);

      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError);
        setSaveError(`Erro ao salvar: ${updateError.message}`);
        setIsSaving(false);
        return;
      }

      // Recarregar perfil
      await refetchProfile();

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onNavigate('profile');
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setSaveError('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Erro ao carregar perfil</p>
          <button
            onClick={() => onNavigate('profile')}
            className="px-4 py-2 bg-primary text-white rounded-full"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl pb-6">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-border">
          <div className="px-5 py-4 flex items-center justify-between">
            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-semibold text-lg text-primary">Editar Perfil</h1>
            <button
              onClick={handleSalvar}
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="px-5 py-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-gray-200">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:bg-secondary/90 transition-colors"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleAvatarSelect}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground mb-1">Foto de perfil</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-secondary font-medium hover:text-secondary/80 transition-colors"
              >
                {avatarPreview ? 'Alterar foto' : 'Adicionar foto'}
              </button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG ou WEBP • Máx. 2MB
              </p>
            </div>
          </div>
          {avatarError && (
            <p className="text-xs text-red-500 mt-2">{avatarError}</p>
          )}
        </div>

        {/* Form Fields */}
        <div className="px-5 py-6 space-y-6">
          {/* Nome */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <User className="w-4 h-4 text-primary" />
              Nome
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors"
              placeholder="Seu nome"
            />
          </div>

          {/* Pronomes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Heart className="w-4 h-4 text-primary" />
              Pronomes
            </label>
            <select
              value={formData.pronomes}
              onChange={(e) => handleChange('pronomes', e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors appearance-none"
            >
              <option value="">Selecione seus pronomes</option>
              <option value="ela/dela">Ela/Dela</option>
              <option value="ele/dele">Ele/Dele</option>
              <option value="elu/delu">Elu/Delu</option>
              <option value="qualquer">Qualquer pronome</option>
              <option value="preferir-nao-informar">Prefiro não informar</option>
            </select>
          </div>

          {/* Cidade */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              Cidade
            </label>
            <input
              type="text"
              value={formData.cidade}
              onChange={(e) => handleChange('cidade', e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors"
              placeholder="Sua cidade"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <AlignLeft className="w-4 h-4 text-primary" />
              Sobre você
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors resize-none"
              rows={4}
              placeholder="Conte um pouco sobre você..."
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {formData.bio.length}/200
            </p>
          </div>
        </div>

        {/* Error Message */}
        {saveError && (
          <div className="px-5 pb-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-800">{saveError}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-secondary text-white px-6 py-3 rounded-full shadow-lg animate-in slide-in-from-top z-50">
            ✓ Perfil atualizado com sucesso!
          </div>
        )}
      </div>
    </div>
  );
}
