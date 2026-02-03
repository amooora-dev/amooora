import { useEffect, useState, useRef } from 'react';

interface SplashProps {
  onComplete: () => void;
  gifDuration?: number; // Duração do GIF em segundos (opcional, padrão: 2.5s)
}

export function Splash({ onComplete, gifDuration = 2.5 }: SplashProps) {
  const [gifLoaded, setGifLoaded] = useState(false);
  const [gifEnded, setGifEnded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gifRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Quando o GIF carregar, inicia o timer baseado na duração
    if (gifLoaded && !timerRef.current) {
      // Tempo mínimo de exibição: duração do GIF + pequeno buffer
      const duration = gifDuration * 1000;
      
      timerRef.current = setTimeout(() => {
        setGifEnded(true);
        // Pequeno delay para transição suave
        setTimeout(() => {
          onComplete();
        }, 300);
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gifLoaded, gifDuration, onComplete]);

  const handleGifLoad = () => {
    setGifLoaded(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white overflow-hidden z-50">
      {/* Container do GIF com fundo branco */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* GIF da Splash */}
        <img 
          ref={gifRef}
          src="https://i.postimg.cc/jdQR89Wp/0108.gif"
          alt="Amooora" 
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            gifEnded ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleGifLoad}
          style={{ imageRendering: 'auto' }}
        />
        
        {/* Indicador de carregamento (enquanto o GIF não carregou) */}
        {!gifLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="animate-pulse">
              <div className="w-16 h-16 rounded-full bg-[#932d6f] opacity-20"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}