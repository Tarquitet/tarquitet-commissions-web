import { useState, useEffect, useRef } from 'react';
import { preventActions } from '../utils/formatters';
import { getCachedImage } from '../utils/imageManager';

interface FadeImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClass?: string;
  priority?: boolean;
}

export default function FadeImage({ src, alt, className = '', containerClass = '', priority = false }: FadeImageProps) {
  const [localSrc, setLocalSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoaded(false);

    // Función para pedir la imagen al disco duro
    const loadImage = () => {
      getCachedImage(src).then((blobUrl) => {
        if (isMounted) setLocalSrc(blobUrl);
      });
    };

    // Si es del Hero (priority), la cargamos de INMEDIATO
    if (priority) {
      loadImage();
      return;
    }

    // MAGIA: Si NO es del Hero, esperamos a que el usuario haga scroll
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadImage();
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [src, priority]);

  return (
    <div ref={containerRef} className={`relative bg-[#050000] overflow-hidden ${containerClass}`}>
      {/* CAPA DE TRANSICIÓN: Siempre está arriba (z-10) hasta que la imagen carga al 100% */}
      <div
        className={`absolute inset-0 z-10 bg-[#050000] flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <span className="text-brand-red/20 font-mono text-[8px] uppercase tracking-widest animate-pulse">
          {!localSrc ? 'LOADING_' : 'RENDERING_'}
        </span>
      </div>

      {/* LA IMAGEN: Se pinta debajo del cuadro negro y cuando está lista avisa para desvanecerlo */}
      {localSrc && (
        <img
          ref={imgRef}
          src={localSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          referrerPolicy="no-referrer"
          onContextMenu={preventActions}
          onDragStart={preventActions}
          onLoad={() => setIsLoaded(true)}
          className={`${className}`}
        />
      )}
    </div>
  );
}
