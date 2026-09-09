import { useState } from 'react';
import { sections } from '../data/sections';
import { content } from '../data/content';

export default function ContentViewer() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const CurrentComponent = sections[currentIndex].component;

  // Obtener los 3 títulos visibles: anterior, actual, siguiente
  const getVisibleSections = () => {
    const prev = currentIndex > 0 ? sections[currentIndex - 1] : null;
    const current = sections[currentIndex];
    const next = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

    return { prev, current, next };
  };

  const { prev, current, next } = getVisibleSections();

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
      {/* CARRUSEL DE 3 TÍTULOS */}
      <div className="flex items-center justify-center gap-8 md:gap-16 mb-12 w-full">
        {/* TÍTULO ANTERIOR (Izquierda) */}
        {prev ? (
          <button
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className="text-xl md:text-2xl font-black uppercase tracking-tighter text-text/20 hover:text-text/40 transition-all duration-300 border-b-4 border-text/20"
          >
            {content.sections[prev.id].title}
          </button>
        ) : (
          <div className="w-32 md:w-48" /> // Espacio vacío si no hay anterior
        )}

        {/* TÍTULO ACTUAL (Centro) */}
        <button
          onClick={() => setCurrentIndex(currentIndex)}
          className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-brand-red border-b-4 border-brand-red transition-all duration-300"
        >
          {content.sections[current.id].title}
        </button>

        {/* TÍTULO SIGUIENTE (Derecha) */}
        {next ? (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="text-xl md:text-2xl font-black uppercase tracking-tighter text-text/20 hover:text-text/40 transition-all duration-300 border-b-4 border-text/20"
          >
            {content.sections[next.id].title}
          </button>
        ) : (
          <div className="w-32 md:w-48" /> // Espacio vacío si no hay siguiente
        )}
      </div>

      {/* Contenido Central */}
      <div className="flex-1 w-full">
        <div
          key={currentIndex}
          className="rounded-2xl p-6 md:p-10 shadow-lg border-2 animate-fade-in"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <CurrentComponent />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
