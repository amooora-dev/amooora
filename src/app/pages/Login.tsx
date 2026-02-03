import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import logoAmooora from "../../assets/5a07ef013ecd4a0869fe2fae41fafe9f484c2b89.png";
import { signIn } from '../../lib/auth';
import { supabase } from '../infra/supabase';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Limpa erro do campo ao digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    setSubmitError(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Por favor, insira seu e-mail';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Por favor, insira sua senha';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      console.log('🔐 Iniciando processo de login...');
      
      const result = await signIn({
        email: formData.email.trim().toLowerCase(),
        password: formData.senha,
      });

      console.log('📋 Resultado do login:', { 
        hasUser: !!result.user, 
        hasSession: !!result.session, 
      });

      if (result.error) {
        console.error('❌ Erro no login:', result.error);
        setSubmitError(result.error);
        setIsLoading(false);
        return;
      }

      if (!result.user || !result.session) {
        console.error('❌ Login sem usuário ou sessão');
        setSubmitError('Erro ao fazer login: sessão não criada. Tente novamente.');
        setIsLoading(false);
        return;
      }

      // Login realizado com sucesso!
      console.log('✅ Login realizado com sucesso!', {
        userId: result.user.id,
        email: result.user.email,
        hasSession: !!result.session
      });
      
      // Aguardar um pouco para garantir que a sessão foi persistida
      // Isso permite que os hooks (useAdmin, etc) detectem a sessão
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verificar se a sessão foi persistida
      const { data: { session: verifySession } } = await supabase.auth.getSession();
      console.log('🔍 Verificando sessão após login:', { 
        hasSession: !!verifySession, 
        email: verifySession?.user?.email 
      });
      
      // Resetar loading antes de navegar
      setIsLoading(false);
      
      // Navegar diretamente
      onNavigate('home');
      
    } catch (error) {
      console.error('❌ Erro fatal ao fazer login:', error);
      setSubmitError(error instanceof Error ? error.message : 'Erro ao fazer login. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <button
            onClick={() => onNavigate('welcome')}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-semibold text-lg text-primary">Entrar</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Logo Small */}
        <div className="px-5 pt-8 pb-6 flex justify-center">
          <img
            src={logoAmooora}
            alt="Amooora"
            className="w-32"
          />
        </div>

        {/* Form */}
        <div className="px-5 pb-6 space-y-5">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              Bem-vinda de volta! 💜
            </h2>
            <p className="text-sm text-muted-foreground">
              Entre na sua conta para continuar
            </p>
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleLogin();
                }
              }}
              className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                errors.email ? 'border-red-500' : 'border-transparent'
              } focus:border-secondary focus:outline-none transition-colors`}
              placeholder="seu@email.com"
              disabled={isLoading}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleLogin();
                  }
                }}
                className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                  errors.senha ? 'border-red-500' : 'border-transparent'
                } focus:border-secondary focus:outline-none transition-colors pr-12`}
                placeholder="Sua senha"
                disabled={isLoading}
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

          {/* Esqueceu a senha */}
          <div className="text-right">
            <button className="text-sm text-secondary font-medium hover:text-secondary/80 transition-colors">
              Esqueceu sua senha?
            </button>
          </div>

          {/* Mensagem de erro */}
          {submitError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-1">
                  Erro ao fazer login
                </p>
                <p className="text-xs text-red-600">{submitError}</p>
              </div>
            </div>
          )}

          {/* Botão Entrar */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-primary text-white py-4 px-6 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

        {/* Cadastro link */}
        <div className="px-5 pb-8 text-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-secondary font-medium hover:text-secondary/80 transition-colors"
            >
              Cadastrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
