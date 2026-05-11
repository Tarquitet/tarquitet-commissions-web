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

    // MAGIA: Si NO es del Hero (Portafolio, YCH), esperamos a que el usuario haga scroll hacia ella
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadImage(); // Descarga cuando aparece en pantalla
          observer.disconnect(); // Dejamos de observar una vez que inicia
        }
      },
      { rootMargin: '200px' },
    ); // Empieza a descargar 200px antes de que se vea

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [src, priority]);

  return (
    <div ref={containerRef} className={`relative bg-[#050000] overflow-hidden ${containerClass}`}>
      {/* SKELETON: Mientras se descarga, muestra el fondo pulsante */}
      {!localSrc && (
        <div className="absolute inset-0 bg-brand-red/5 animate-pulse flex items-center justify-center">
          <span className="text-brand-red/20 font-mono text-[8px] uppercase tracking-widest">CARGANDO_</span>
        </div>
      )}

      {/* LA IMAGEN: Se renderiza con el archivo físico */}
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
          className={`transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        />
      )}
    </div>
  );
}
