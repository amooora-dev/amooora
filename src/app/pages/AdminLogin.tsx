import { useState } from 'react';
import { ArrowLeft, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signIn } from '../../lib/auth';
import { getCurrentAuthUser } from '../../lib/auth';
import { supabase } from '../infra/supabase';

interface AdminLoginProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: () => void;
}

export function AdminLogin({ onNavigate, onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Fazer login no Supabase
      const signInResult = await signIn({ email, password });

      if (signInResult.error || !signInResult.user) {
        setError(signInResult.error || 'Email ou senha incorretos');
        setIsLoading(false);
        return;
      }

      // 2. Verificar se o usuário tem role de admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', signInResult.user.id)
        .single();

      if (profileError || !profile) {
        setError('Erro ao verificar permissões de administrador');
        setIsLoading(false);
        return;
      }

      // 3. Verificar se é admin (qualquer admin_* ou admin_geral) e se está ativo
      const isActive = (profile.status ?? 'active') === 'active';
      const isAdmin =
        isActive &&
        ['admin_geral', 'admin_locais', 'admin_eventos', 'admin_servicos'].includes(
          String(profile.role)
        );

      if (!isAdmin) {
        setError('Acesso negado. Você não possui permissões de administrador.');
        // Fazer logout do usuário
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      // 4. Login bem-sucedido - redirecionar para admin
      // Aguardar um pouco para garantir que o estado foi atualizado
      setTimeout(() => {
        onLoginSuccess();
      }, 100);
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao fazer login');
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
          <h1 className="font-semibold text-lg text-primary">
            Login Administrativo
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="px-5 py-8">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Área Administrativa
            </h2>
            <p className="text-sm text-muted-foreground">
              Faça login para acessar o painel administrativo
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors"
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors pr-12"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 px-6 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>Atenção:</strong> Este acesso é restrito apenas para administradores.
              Entre em contato com o suporte se você não possui uma conta de administrador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
