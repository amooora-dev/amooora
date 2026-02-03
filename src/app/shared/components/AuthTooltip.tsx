import { useState, useEffect, useRef } from 'react';
import { X, UserPlus } from 'lucide-react';

interface AuthTooltipProps {
  isOpen?: boolean;
  onClose?: () => void;
  onLogin?: () => void;
  onSignUp?: () => void;
  onNavigate?: (page: string) => void;
}

export function AuthTooltip({ isOpen = false, onClose, onLogin, onSignUp, onNavigate }: AuthTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Sincronizar isVisible com isOpen
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Só adicionar listeners se estiver aberto
    if (!isVisible) return;

    // Fechar ao clicar fora
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    // Fechar após 5 segundos automaticamente
    const timeout = setTimeout(() => {
      handleClose();
    }, 5000);

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Aguardar animação
  };

  const handleCadastro = () => {
    if (onSignUp) {
      onSignUp();
    } else if (onNavigate) {
      onNavigate('cadastro');
    }
    handleClose();
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else if (onNavigate) {
      onNavigate('login');
    }
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div
      ref={tooltipRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#932d6f]/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#932d6f]" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900">
              Faça seu cadastro
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-600 mb-6">
          Para fazer comentários, avaliações, favoritar e salvar conteúdos, você precisa estar cadastrado.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
          {onLogin && (
            <button
              onClick={handleLogin}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[#932d6f] text-[#932d6f] font-medium hover:bg-[#932d6f]/5 transition-colors"
            >
              Entrar
            </button>
          )}
          <button
            onClick={handleCadastro}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#932d6f] text-white font-medium hover:bg-[#7a2560] transition-colors"
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}
