import React, { useRef, useState, useEffect } from 'react';
import { getImagePath, formatHumanTitle } from '../../../utils/formatters';

export default function Step5YCH({ ychData, ychSelection, setYchSelection }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Calculamos el total de elementos (Custom Pose + todos los YCH)
  const totalItems = (ychData?.length || 0) + 1;

  // Rastreador de Scroll para mover el puntito activo
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    // Calculamos qué elemento está más cerca del centro
    const itemWidth = scrollRef.current.children[0].clientWidth + 16; // Ancho + gap
    const newIndex = Math.round(scrollPosition / itemWidth);
    setActiveIndex(newIndex);
  };

  // Función para mover el scroll al hacer clic en un puntito
  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const itemWidth = scrollRef.current.children[0].clientWidth + 16;
    scrollRef.current.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex flex-col gap-4 relative">
      {/* Contenedor del Carrusel */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory"
      >
        {/* Elemento 0: Custom Pose */}
        <button
          onClick={() => setYchSelection(null)}
          className={`w-[240px] sm:min-w-[200px] shrink-0 h-48 rounded-2xl border flex flex-col items-center justify-center snap-center snap-always transition-all ${
            !ychSelection
              ? 'bg-brand-red border-brand-red text-black shadow-[0_0_20px_rgba(220,38,38,0.4)]'
              : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
          }`}
        >
          <span className="font-black uppercase italic tracking-tighter text-xl">Custom Pose</span>
          <span className="text-[10px] uppercase font-bold opacity-60">I use my reference</span>
        </button>

        {/* Elementos 1 al X: Las tarjetas YCH */}
        {ychData?.map((ych: any) => (
          <button
            key={ych.title}
            onClick={() => setYchSelection(ych)}
            className={`w-[240px] sm:min-w-[200px] shrink-0 h-48 rounded-2xl border snap-center snap-always overflow-hidden relative transition-all ${
              ychSelection?.title === ych.title
                ? 'border-brand-red shadow-[0_0_15px_red] scale-[1.02]'
                : 'border-white/10 hover:border-white/30'
            }`}
          >
            <img
              src={getImagePath(ych.filename)}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              alt={ych.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent p-4 flex flex-col justify-end">
              <span className="text-white font-black uppercase italic text-sm text-left">
                {formatHumanTitle(ych.title)}
              </span>
              <span className="text-brand-red font-mono text-[10px] bg-black/50 w-fit px-2 py-0.5 rounded mt-1 backdrop-blur-sm">
                {ych.price} USD
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Paginación de Puntitos */}
      {totalItems > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2">
          {Array.from({ length: totalItems }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`transition-all duration-300 rounded-full ${
                activeIndex === i
                  ? 'w-6 h-2 bg-brand-red shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Ir a la diapositiva ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
