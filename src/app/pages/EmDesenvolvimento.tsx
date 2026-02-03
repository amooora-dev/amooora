import { ChevronLeft, Wrench } from 'lucide-react';

interface EmDesenvolvimentoProps {
  onBack: () => void;
}

export function EmDesenvolvimento({ onBack }: EmDesenvolvimentoProps) {
  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        {/* Header */}
        <div className="bg-white px-5 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-semibold text-primary">Cadastro</h1>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center px-6 py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D4B5F0] to-[#932d6f] rounded-full flex items-center justify-center mb-6">
            <Wrench className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4 text-center">
            Em Desenvolvimento
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-sm">
            Estamos trabalhando para trazer essa funcionalidade em breve. 
            Fique de olho nas novidades!
          </p>
          <button
            onClick={onBack}
            className="bg-primary text-white py-3 px-8 rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}