import { useState, useEffect, useRef, memo } from 'react';
import { getSheetYCH, type YCHPiece } from '../data/sheets';
import SecurityWatermark from './SecurityWatermark';
import { formatHumanTitle, preventActions, getImagePath } from '../utils/formatters';
import FadeImage from './FadeImage';

export default function YCHSlider() {
  const [items, setItems] = useState<YCHPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSheetYCH().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (sliderRef.current) {
      const amt = window.innerWidth > 768 ? 400 : 300;
      sliderRef.current.scrollBy({ left: dir === 'left' ? -amt : amt, behavior: 'smooth' });
    }
  };

  if (loading)
    return (
      <section className="py-20 flex justify-center animate-pulse text-brand-red/60 font-mono text-xs uppercase tracking-[0.5em]">
        // Sincronizando Bases YCH_
      </section>
    );

  return (
    <section className="relative">
      <div className="relative group/slider">
        {/* BOTÓN IZQUIERDA */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-4 top-[40%] -translate-y-1/2 z-40 bg-black/80 border border-brand-red/50 text-brand-red w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hidden md:flex hover:bg-brand-red hover:text-black hover:scale-110"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* TRACK DEL SLIDER */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-8 pb-12 px-4 md:px-8 snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {items.map((ych) => (
            <YCHCard
              key={ych.filename} // CLAVE: Usar el filename fuerza a FadeImage a reiniciarse correctamente
              ych={ych}
            />
          ))}
        </div>

        {/* BOTÓN DERECHA */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-4 top-[40%] -translate-y-1/2 z-40 bg-black/80 border border-brand-red/50 text-brand-red w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hidden md:flex hover:bg-brand-red hover:text-black hover:scale-110"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

const YCHCard = memo(({ ych }: { ych: YCHPiece }) => {
  return (
    <div className="flex-none w-75 md:w-95 snap-start border border-brand-red/10 rounded-2xl overflow-hidden group/card relative bg-[#050000]">
      <div className="aspect-4/5 relative">
        <FadeImage
          src={getImagePath(ych.filename)}
          alt={ych.title}
          className="w-full h-full object-cover opacity-70 group-hover/card:opacity-100 transition-all duration-700"
          containerClass="w-full h-full"
        />
        <SecurityWatermark />

        {/* El precio es visible de inmediato sobre el fondo negro */}
        <div className="absolute top-5 right-5 z-30 bg-brand-red text-black font-black px-4 py-1.5 text-[11px] uppercase italic rounded-sm shadow-lg">
          {ych.price} USD
        </div>
      </div>

      <div className="p-6 bg-linear-to-b from-[#080000] to-transparent">
        <h4 className="text-white font-black text-2xl uppercase italic mb-3 tracking-tight">
          {formatHumanTitle(ych.title)}
        </h4>
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-light/40 border-t border-brand-red/10 pt-4 flex items-center gap-2">
          <span className="w-1 h-1 bg-brand-red"></span>
          Encuadre: {formatHumanTitle(ych.body_type)}
        </div>
      </div>
    </div>
  );
});
