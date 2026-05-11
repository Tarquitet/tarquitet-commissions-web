import { useState, useEffect, useRef } from 'react';
import { preventActions } from '../utils/formatters';

interface FadeImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClass?: string;
  priority?: boolean;
}

export default function FadeImage({ src, alt, className = '', containerClass = '', priority = false }: FadeImageProps) {
  const [shouldShow, setShouldShow] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Resetear cada vez que cambia la URL
  useEffect(() => {
    setIsLoaded(false);
    setShouldShow(false);

    // Forzamos un pequeño delay para que el navegador "pinte" el fondo negro primero
    const timer = setTimeout(() => {
      setShouldShow(true);
      if (imgRef.current?.complete) {
        setIsLoaded(true);
      }
    }, 100); // 100ms es suficiente para asegurar que el cuadro negro sea visible

    return () => clearTimeout(timer);
  }, [src]);

  return (
    <div className={`relative bg-[#050000] overflow-hidden ${containerClass}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        referrerPolicy="no-referrer"
        onContextMenu={preventActions}
        onDragStart={preventActions}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-1000 ease-out ${
          shouldShow && isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />

      {/* Capa de seguridad para evitar que se vea la imagen antes de tiempo */}
      {(!shouldShow || !isLoaded) && <div className="absolute inset-0 bg-[#050000] z-0" />}
    </div>
  );
}
