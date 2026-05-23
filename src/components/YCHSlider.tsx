import { useState, useEffect, memo, useRef } from 'react';
import { getSheetYCH, type YCHPiece } from '../data/sheets';
import SecurityWatermark from './SecurityWatermark';
import { formatHumanTitle, preventActions, getImagePath } from '../utils/formatters';
import FadeImage from './FadeImage';

export default function YCHSlider() {
  const [items, setItems] = useState<YCHPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYCH, setSelectedYCH] = useState<YCHPiece | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  // Variables para el Carrusel
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    getSheetYCH().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  // Lógica para bloquear el scroll y usar la tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedYCH(null);
    };

    if (selectedYCH) {
      document.body.style.overflow = 'hidden';
      setShowInfo(true); // Siempre mostrar info al abrir
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedYCH]);

  // Lógica del Scroll y los Puntitos
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    const itemElement = scrollRef.current.children[0] as HTMLElement;
    if (!itemElement) return;

    const itemWidth = itemElement.offsetWidth + 24; // 24px es el gap-6
    const newIndex = Math.round(scrollPosition / itemWidth);
    setActiveIndex(newIndex);
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const itemElement = scrollRef.current.children[0] as HTMLElement;
    if (!itemElement) return;

    const itemWidth = itemElement.offsetWidth + 24;
    scrollRef.current.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth',
    });
  };

  if (loading)
    return (
      <section className="py-20 flex justify-center animate-pulse text-brand-red/60 font-bold text-sm uppercase tracking-widest">
        Loading YCH Bases...
      </section>
    );

  return (
    <section className="relative px-4 md:px-8">
      {/* CARRUSEL DE YCH */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory no-scrollbar"
      >
        {items.map((ych) => (
          <YCHCard key={ych.filename} ych={ych} onClick={() => setSelectedYCH(ych)} />
        ))}
      </div>

      {/* PUNTITOS DE PAGINACIÓN */}
      {items.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 mb-8">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`transition-all duration-300 rounded-full ${
                activeIndex === i
                  ? 'w-8 h-2 bg-brand-red shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to YCH base ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* MODAL: PANTALLA COMPLETA HUMANIZADA */}
      {selectedYCH && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-300"
          onClick={() => setSelectedYCH(null)}
        >
          {/* BARRA SUPERIOR DE CIERRE */}
          <div className="w-full flex justify-end p-4 md:p-6 sticky top-0 z-[110]">
            <button
              className="flex items-center gap-2 bg-brand-red text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              onClick={() => setSelectedYCH(null)}
            >
              CLOSE
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* CONTENEDOR PRINCIPAL */}
          <div
            className="w-full max-w-6xl mx-auto px-4 pb-12 flex flex-col items-center justify-center flex-grow"
            onClick={(e) => e.stopPropagation()}
          >
            {/* IMAGEN GIGANTE (Clickable para ocultar info) */}
            <div
              className="relative w-full max-h-[70vh] flex items-center justify-center mb-6 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(!showInfo);
              }}
              title="Click/Tap to hide information"
            >
              <FadeImage
                key={selectedYCH.filename}
                src={getImagePath(selectedYCH.filename)}
                alt={selectedYCH.title}
                className="max-w-full max-h-full object-contain rounded-lg drop-shadow-2xl"
                containerClass="w-full h-full flex items-center justify-center"
              />
              <SecurityWatermark />
            </div>

            {/* INFORMACIÓN EXTRA ABAJO (Con animación de desaparición) */}
            <div
              className={`w-full max-w-4xl bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-500 ease-in-out ${
                showInfo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
              }`}
            >
              <div className="flex-1">
                <h2 className="text-white font-black text-3xl md:text-4xl uppercase tracking-tighter mb-2">
                  {formatHumanTitle(selectedYCH.title)}
                </h2>

                <div className="flex flex-wrap gap-2 md:gap-3 mt-4">
                  <span className="px-4 py-2 bg-white/5 border border-white/10 text-brand-light rounded-lg text-xs font-bold uppercase tracking-widest">
                    {formatHumanTitle(selectedYCH.body_type)}
                  </span>
                </div>
              </div>

              {/* PANEL DE PRECIO */}
              <div className="flex flex-col items-start md:items-end w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                <p className="text-brand-light/50 font-bold uppercase tracking-widest text-xs mb-1">Base Price</p>
                <p className="text-brand-red font-black text-4xl uppercase tracking-tight italic flex items-baseline gap-2">
                  ${selectedYCH.price} <span className="text-lg text-white font-bold not-italic">USD</span>
                </p>
                <p className="text-brand-light/40 text-[10px] uppercase tracking-widest mt-2 max-w-[200px] text-left md:text-right leading-tight">
                  Price may vary based on character complexity or extra accessories.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// SUBCOMPONENTE DE LA TARJETA
const YCHCard = memo(({ ych, onClick }: { ych: YCHPiece; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="shrink-0 w-[280px] sm:w-[300px] snap-center snap-always flex flex-col border border-brand-red/10 rounded-2xl overflow-hidden group/card relative bg-[#050000] cursor-zoom-in hover:border-brand-red/50 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[4/5] relative">
        <FadeImage
          src={getImagePath(ych.filename)}
          alt={ych.title}
          className="w-full h-full object-cover opacity-70 group-hover/card:opacity-100 transition-all duration-700 group-hover/card:scale-105"
          containerClass="w-full h-full"
        />
        <SecurityWatermark />

        <div className="absolute top-4 right-4 z-30 bg-brand-red text-black font-black px-3 py-1 text-xs uppercase italic rounded-lg shadow-lg">
          ${ych.price} USD
        </div>
      </div>

      <div className="p-5 bg-gradient-to-b from-[#080000] to-transparent flex-1 flex flex-col justify-between z-20 border-t border-brand-red/10">
        <h4 className="text-white font-black text-xl uppercase italic tracking-tight leading-none group-hover/card:text-brand-red transition-colors mb-3">
          {formatHumanTitle(ych.title)}
        </h4>
        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
          {formatHumanTitle(ych.body_type)}
        </div>
      </div>
    </div>
  );
});
