import React from 'react';
import logoHome from "@/assets/logo-home.png";

interface WelcomeProps {
  onNavigate: (page: string) => void;
}

export function Welcome({ onNavigate }: WelcomeProps) {
  const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔵 Botão Entrar clicado');
    try {
      onNavigate('login');
    } catch (error) {
      console.error('❌ Erro ao navegar para login:', error);
    }
  };

  const handleCadastroClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🟢 Botão Criar conta clicado');
    try {
      onNavigate('cadastro');
    } catch (error) {
      console.error('❌ Erro ao navegar para cadastro:', error);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex items-center justify-center px-6">
        <div className="w-full">
          {/* Logo Amooora */}
          <div className="flex justify-center mb-16">
            <img
              src={logoHome}
              alt="Amooora - Um mundo inteiro de acolhimento e liberdade"
              className="h-52 w-auto max-w-[416px]"
            />
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleLoginClick}
              type="button"
              className="w-full bg-primary text-white py-4 px-6 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg cursor-pointer"
            >
              Entrar
            </button>
            <button
              onClick={handleCadastroClick}
              type="button"
              className="w-full bg-white border-2 border-primary text-primary py-4 px-6 rounded-full font-semibold text-lg hover:bg-primary/5 transition-colors cursor-pointer"
            >
              Criar conta
            </button>
          </div>

          {/* Tagline */}
          <p className="text-center text-muted-foreground text-sm mt-8">
            Um mundo inteiro de acolhimento e liberdade
          </p>
        </div>
      </div>
    </div>
  );
}
