import { useState, useRef, useEffect } from 'react';
import { sections } from '../data/sections';
import { content } from '../data/content'; // <-- Importamos content

export default function ContentViewer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderStyle, setSliderStyle] = useState({ left: '0px', width: '0px' });
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const updateSlider = () => {
      const activeBtn = titleRefs.current[currentIndex];
      const container = containerRef.current;

      if (activeBtn && container) {
        const containerRect = container.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();

        setSliderStyle({
          left: `${btnRect.left - containerRect.left}px`,
          width: `${btnRect.width}px`,
        });
      }
    };

    updateSlider();
    const timeout = setTimeout(updateSlider, 100);

    window.addEventListener('resize', updateSlider);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateSlider);
    };
  }, [currentIndex]);

  const CurrentComponent = sections[currentIndex].component;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
      {/* Barra de títulos con slider */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center gap-6 md:gap-12 mb-12 w-full overflow-x-auto overflow-y-visible scrollbar-hide py-6"
      >
        {/* Barra deslizadora animada */}
        <div
          className="absolute bottom-0 h-1 bg-brand-red rounded-full transition-all duration-500 ease-out"
          style={{
            left: sliderStyle.left,
            width: sliderStyle.width,
          }}
        />

        {sections.map((section, idx) => {
          const isActive = idx === currentIndex;

          // OBTENER TÍTULO TRADUCIDO DINÁMICAMENTE
          const title = content.sections[section.id].title;

          return (
            <button
              key={section.id}
              ref={(el) => {
                titleRefs.current[idx] = el;
              }}
              onClick={() => setCurrentIndex(idx)}
              className={`whitespace-nowrap font-black uppercase tracking-tighter transition-all duration-300 ${
                isActive
                  ? 'text-4xl md:text-6xl text-brand-red scale-100'
                  : 'text-xl md:text-2xl text-text/30 hover:text-text/60 scale-90'
              }`}
            >
              {title}
            </button>
          );
        })}
      </div>

      {/* Contenido Central */}
      <div className="flex-1 w-full transition-all duration-500 ease-in-out">
        <div
          className="rounded-2xl p-6 md:p-10 shadow-lg border-2"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <CurrentComponent />
        </div>
      </div>
    </div>
  );
}
