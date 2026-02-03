import { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, Heart, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import logoAmooora from "../../assets/5a07ef013ecd4a0869fe2fae41fafe9f484c2b89.png";
import { signUp } from '../../lib/auth';

interface AdminCadastroProps {
  onNavigate: (page: string) => void;
}

export function AdminCadastro({ onNavigate }: AdminCadastroProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    pronomes: '',
    aceitaTermos: false,
    maiorIdade: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // Limpa erro do campo ao digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    // Limpa mensagens ao editar
    if (submitError) setSubmitError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Por favor, insira o nome';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Por favor, insira o e-mail';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Por favor, crie uma senha';
    } else if (formData.senha.length < 8) {
      newErrors.senha = 'A senha deve ter pelo menos 8 caracteres';
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Por favor, confirme a senha';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.pronomes) {
      newErrors.pronomes = 'Por favor, selecione os pronomes';
    }

    if (!formData.aceitaTermos) {
      newErrors.aceitaTermos = 'É necessário aceitar os termos de uso';
    }

    if (!formData.maiorIdade) {
      newErrors.maiorIdade = 'É necessário confirmar que é maior de 18 anos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinuar = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleCadastrar = async () => {
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      // Chama a função de signUp do Supabase
      const result = await signUp({
        email: formData.email,
        password: formData.senha,
        name: formData.nome,
        pronouns: formData.pronomes || undefined,
      });

      if (result.error) {
        setSubmitError(result.error);
        setIsLoading(false);
        return;
      }

      if (result.user) {
        // Cadastro realizado com sucesso!
        setSuccessMessage('Usuário criado com sucesso no Supabase!');
        console.log('Usuário criado com sucesso:', result.user);
        
        // Limpa o formulário após 2 segundos e volta para o passo 1
        setTimeout(() => {
          setFormData({
            nome: '',
            email: '',
            senha: '',
            confirmarSenha: '',
            pronomes: '',
            aceitaTermos: false,
            maiorIdade: false,
          });
          setStep(1);
          setSuccessMessage(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setSubmitError('Erro ao criar usuário. Tente novamente.');
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
            {step === 1 ? 'Cadastrar Usuário' : 'Informações Adicionais'}
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Progress Indicator */}
        <div className="px-5 py-6">
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-1 rounded-full transition-colors ${
              step >= 1 ? 'bg-secondary' : 'bg-muted'
            }`} />
            <div className={`flex-1 h-1 rounded-full transition-colors ${
              step >= 2 ? 'bg-secondary' : 'bg-muted'
            }`} />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Passo {step} de 2
          </p>
        </div>

        {/* Logo Small */}
        <div className="px-5 pb-6 flex justify-center">
          <img
            src={logoAmooora}
            alt="Amooora"
            className="w-32"
          />
        </div>

        {/* Step 1: Dados Básicos */}
        {step === 1 && (
          <div className="px-5 pb-6 space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-primary mb-2">
                Cadastrar Novo Usuário 💜
              </h2>
              <p className="text-sm text-muted-foreground">
                Preencha os dados básicos do usuário
              </p>
            </div>

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
                className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                  errors.nome ? 'border-red-500' : 'border-transparent'
                } focus:border-secondary focus:outline-none transition-colors`}
                placeholder="Nome completo"
              />
              {errors.nome && (
                <p className="text-xs text-red-500 mt-1">{errors.nome}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Mail className="w-4 h-4 text-primary" />
                E-mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-transparent'
                } focus:border-secondary focus:outline-none transition-colors`}
                placeholder="email@exemplo.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Lock className="w-4 h-4 text-primary" />
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.senha}
                  onChange={(e) => handleChange('senha', e.target.value)}
                  className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                    errors.senha ? 'border-red-500' : 'border-transparent'
                  } focus:border-secondary focus:outline-none transition-colors pr-12`}
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="text-xs text-red-500 mt-1">{errors.senha}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Lock className="w-4 h-4 text-primary" />
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmarSenha}
                  onChange={(e) => handleChange('confirmarSenha', e.target.value)}
                  className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                    errors.confirmarSenha ? 'border-red-500' : 'border-transparent'
                  } focus:border-secondary focus:outline-none transition-colors pr-12`}
                  placeholder="Digite a senha novamente"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmarSenha && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmarSenha}</p>
              )}
            </div>

            {/* Botão Continuar */}
            <button
              onClick={handleContinuar}
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 px-6 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Informações Adicionais */}
        {step === 2 && (
          <div className="px-5 pb-6 space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-primary mb-2">
                Informações Adicionais 🌈
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete os dados do usuário
              </p>
            </div>

            {/* Pronomes */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Heart className="w-4 h-4 text-primary" />
                Como o usuário se identifica?
              </label>
              <select
                value={formData.pronomes}
                onChange={(e) => handleChange('pronomes', e.target.value)}
                className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                  errors.pronomes ? 'border-red-500' : 'border-transparent'
                } focus:border-secondary focus:outline-none transition-colors appearance-none`}
              >
                <option value="">Selecione os pronomes</option>
                <option value="ela/dela">Ela/Dela</option>
                <option value="ele/dele">Ele/Dele</option>
                <option value="elu/delu">Elu/Delu</option>
                <option value="qualquer">Qualquer pronome</option>
                <option value="preferir-nao-informar">Prefiro não informar</option>
              </select>
              {errors.pronomes && (
                <p className="text-xs text-red-500 mt-1">{errors.pronomes}</p>
              )}
            </div>

            {/* Maior de idade */}
            <div>
              <label className={`flex items-start gap-3 p-4 bg-muted rounded-xl cursor-pointer hover:bg-muted/80 transition-colors ${
                errors.maiorIdade ? 'border border-red-500' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={formData.maiorIdade}
                  onChange={(e) => handleChange('maiorIdade', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-2 border-secondary text-secondary focus:ring-secondary"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">
                    Confirmo que o usuário é maior de 18 anos
                  </p>
                </div>
              </label>
              {errors.maiorIdade && (
                <p className="text-xs text-red-500 mt-1">{errors.maiorIdade}</p>
              )}
            </div>

            {/* Termos de uso */}
            <div>
              <label className={`flex items-start gap-3 p-4 bg-muted rounded-xl cursor-pointer hover:bg-muted/80 transition-colors ${
                errors.aceitaTermos ? 'border border-red-500' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={formData.aceitaTermos}
                  onChange={(e) => handleChange('aceitaTermos', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-2 border-secondary text-secondary focus:ring-secondary"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">
                    Confirmo aceitação dos <span className="text-secondary">Termos de Uso</span> e da{' '}
                    <span className="text-secondary">Política de Privacidade</span>
                  </p>
                </div>
              </label>
              {errors.aceitaTermos && (
                <p className="text-xs text-red-500 mt-1">{errors.aceitaTermos}</p>
              )}
            </div>

            {/* Mensagem de sucesso */}
            {successMessage && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
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
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 mb-1">
                    Erro ao criar usuário
                  </p>
                  <p className="text-xs text-red-600">{submitError}</p>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setStep(1);
                  setSubmitError(null);
                  setSuccessMessage(null);
                }}
                disabled={isLoading}
                className="flex-1 bg-white border-2 border-secondary text-secondary py-4 px-6 rounded-full font-semibold hover:bg-secondary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Voltar
              </button>
              <button
                onClick={handleCadastrar}
                disabled={isLoading}
                className="flex-1 bg-primary text-white py-4 px-6 rounded-full font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Criando usuário...' : 'Criar Usuário'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
