import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    console.error('❌ [ImageWithFallback] Erro ao carregar imagem:', {
      src: props.src,
      attemptedSrc: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
    });
    setDidError(true);
  }

  const { src, alt, style, className, ...rest } = props

  // Se não houver src, mostrar placeholder
  if (!src || src === 'null' || src === 'undefined') {
    console.log('⚠️ [ImageWithFallback] src inválido:', { src, type: typeof src });
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600 text-xs">
            Sem foto
          </div>
        </div>
      </div>
    )
  }
  
  // Log quando a imagem for renderizada
  console.log('🖼️ [ImageWithFallback] Renderizando imagem:', {
    src,
    alt,
    isUrl: src.startsWith('http'),
  });

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img 
          src={ERROR_IMG_SRC} 
          alt="Error loading image" 
          loading="lazy"
          decoding="async"
          {...rest} 
          data-original-url={src} 
        />
      </div>
    </div>
  ) : (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={style} 
      loading="lazy"
      decoding="async"
      {...rest} 
      onError={handleError} 
    />
  )
}
