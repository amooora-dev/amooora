import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignUp: () => void;
}

export function AuthModal({ isOpen, onClose, onLogin, onSignUp }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
        {/* Header do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-foreground">Acesso</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="px-6 py-6 space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-6">
            Faça login para acessar seu perfil ou cadastre-se para criar uma nova conta
          </p>

          {/* Botão Entrar */}
          <button
            onClick={() => {
              onLogin();
              onClose();
            }}
            className="w-full bg-primary text-white py-4 px-6 rounded-full font-semibold text-base hover:bg-primary/90 transition-colors shadow-md"
          >
            Entrar
          </button>

          {/* Botão Cadastrar */}
          <button
            onClick={() => {
              onSignUp();
              onClose();
            }}
            className="w-full bg-white border-2 border-[#932d6f] text-[#932d6f] py-4 px-6 rounded-full font-semibold text-base hover:bg-[#932d6f]/5 transition-colors"
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}
