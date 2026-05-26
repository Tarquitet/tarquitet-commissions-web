import { useState, useEffect, memo, useRef } from 'react';
import { getSheetYCH, getSheetPrices, type YCHPiece, type PricingTier } from '../data/sheets';
import SecurityWatermark from './SecurityWatermark';
import { formatHumanTitle, preventActions, getImagePath } from '../utils/formatters';
import FadeImage from './FadeImage';

// 1. Limpiador de precios
const parseSafePrice = (priceStr: string | undefined) => {
  if (!priceStr) return 0;
  const cleanStr = String(priceStr)
    .replace(',', '.')
    .replace(/[^0-9.]/g, '');
  const val = parseFloat(cleanStr);
  return isNaN(val) ? 0 : Math.round(val);
};

// 2. EXTRACTOR LITERAL ACTUALIZADO: Ahora también busca el precio del SKETCH
const getDynamicUpgradeCosts = (bodyType: string, prices: PricingTier[]) => {
  if (!bodyType || prices.length === 0) return { sketchUpgrade: 0, flatUpgrade: 0, fullUpgrade: 0 };

  let targetBody = String(bodyType).trim().toUpperCase();

  const getRealPrice = (row?: PricingTier) => {
    if (!row) return 0;
    const orig = parseSafePrice(row.original_price);
    const disc = parseSafePrice(row.discount_price);
    return disc > 0 && disc < orig ? disc : orig;
  };

  // Buscamos los precios oficiales en tu tabla para ese encuadre
  let sketchRow = prices.find((p) => p.tier.toUpperCase() === 'SKETCH' && p.description.toUpperCase() === targetBody);
  let flatRow = prices.find((p) => p.tier.toUpperCase() === 'FLATCOLOR' && p.description.toUpperCase() === targetBody);
  let fullRow = prices.find((p) => p.tier.toUpperCase() === 'FULLCOLOR' && p.description.toUpperCase() === targetBody);

  // Si no encuentra el encuadre (ej: landscape), usa HALFBODY para no devolver $0
  if (!sketchRow || !flatRow || !fullRow) {
    sketchRow = prices.find((p) => p.tier.toUpperCase() === 'SKETCH' && p.description.toUpperCase() === 'HALFBODY');
    flatRow = prices.find((p) => p.tier.toUpperCase() === 'FLATCOLOR' && p.description.toUpperCase() === 'HALFBODY');
    fullRow = prices.find((p) => p.tier.toUpperCase() === 'FULLCOLOR' && p.description.toUpperCase() === 'HALFBODY');
  }

  // Devolvemos la suma exacta
  return {
    sketchUpgrade: getRealPrice(sketchRow),
    flatUpgrade: getRealPrice(flatRow),
    fullUpgrade: getRealPrice(fullRow),
  };
};

export default function YCHSlider() {
  const [items, setItems] = useState<YCHPiece[]>([]);
  const [globalPrices, setGlobalPrices] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYCH, setSelectedYCH] = useState<YCHPiece | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    Promise.all([getSheetYCH(), getSheetPrices()]).then(([ychData, priceData]) => {
      setItems(ychData);
      setGlobalPrices(priceData);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedYCH(null);
    };
    if (selectedYCH) {
      document.body.style.overflow = 'hidden';
      setShowInfo(true);
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedYCH]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    const itemElement = scrollRef.current.children[0] as HTMLElement;
    if (!itemElement) return;
    const itemWidth = itemElement.offsetWidth + 24;
    setActiveIndex(Math.round(scrollPosition / itemWidth));
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const itemElement = scrollRef.current.children[0] as HTMLElement;
    if (!itemElement) return;
    scrollRef.current.scrollTo({ left: index * (itemElement.offsetWidth + 24), behavior: 'smooth' });
  };

  if (loading)
    return (
      <section className="py-20 flex justify-center animate-pulse text-brand-red/60 font-bold text-sm uppercase tracking-widest">
        Loading YCH Bases...
      </section>
    );

  return (
    <section className="relative px-4 md:px-8">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory no-scrollbar"
      >
        {items.map((ych) => (
          <YCHCard key={ych.filename} ych={ych} onClick={() => setSelectedYCH(ych)} />
        ))}
      </div>

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
            />
          ))}
        </div>
      )}

      {selectedYCH && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-300"
          onClick={() => setSelectedYCH(null)}
        >
          <div className="w-full flex justify-end p-4 md:p-6 sticky top-0 z-[110]">
            <button
              className="flex items-center gap-2 bg-brand-red text-white px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform"
              onClick={() => setSelectedYCH(null)}
            >
              CLOSE
            </button>
          </div>

          <div
            className="w-full max-w-6xl mx-auto px-4 pb-12 flex flex-col items-center justify-center flex-grow"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-h-[50vh] md:max-h-[60vh] flex items-center justify-center mb-6 cursor-pointer"
              onClick={() => setShowInfo(!showInfo)}
              title="Click to hide/show info"
            >
              <FadeImage
                src={getImagePath(selectedYCH.filename)}
                alt={selectedYCH.title}
                className="max-w-full max-h-full object-contain rounded-lg drop-shadow-2xl"
                containerClass="w-full h-full flex items-center justify-center"
              />
              <SecurityWatermark />
            </div>

            <div
              className={`w-full max-w-4xl bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col gap-6 transition-all duration-500 ${showInfo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 gap-4">
                <div>
                  <h2 className="text-white font-black text-3xl md:text-4xl uppercase tracking-tighter mb-2">
                    {formatHumanTitle(selectedYCH.title)}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      {selectedYCH.num_chars || '1'} Character{selectedYCH.num_chars !== '1' && 's'}
                    </span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-brand-light rounded-lg text-xs font-bold uppercase tracking-widest">
                      {formatHumanTitle(selectedYCH.body_type)}
                    </span>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-brand-light/50 font-bold uppercase tracking-widest text-xs">YCH Base</p>
                  <p className="text-brand-light/80 text-sm max-w-[250px] leading-tight mt-1">
                    This is a pre-defined composition. Choose your preferred render level below.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(() => {
                  const basePrice = parseSafePrice(selectedYCH.price);
                  const costs = getDynamicUpgradeCosts(selectedYCH.body_type, globalPrices);

                  return (
                    <>
                      {/* FIX AQUÍ: Pasamos el costo del sketchUpgrade a la tarjeta */}
                      <PricingTierCard
                        name="Sketch"
                        basePrice={basePrice}
                        upgradeCost={costs.sketchUpgrade}
                        features={['Clean Lineart', 'Base Pose', 'No Colors']}
                      />
                      <PricingTierCard
                        name="Flatcolor"
                        basePrice={basePrice}
                        upgradeCost={costs.flatUpgrade}
                        features={['Flat Base Colors', 'Clean Lineart', 'Simple Shading']}
                      />
                      <PricingTierCard
                        name="Full Render"
                        basePrice={basePrice}
                        upgradeCost={costs.fullUpgrade}
                        features={['Full Shading & Highlights', 'Detailed Materials', 'Premium Finish']}
                        isPremium
                      />
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

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

        {/* FIX AQUÍ: Cambiamos STARTING AT por BASE FEE + */}
        <div className="absolute top-4 right-4 z-30 bg-brand-red text-black font-black px-3 py-1 text-xs uppercase italic rounded-lg shadow-lg flex flex-col items-end">
          <span className="text-[8px] opacity-60 leading-none">BASE FEE +</span>${parseSafePrice(ych.price)} USD
        </div>
      </div>

      <div className="p-5 bg-gradient-to-b from-[#080000] to-transparent flex-1 flex flex-col justify-between z-20 border-t border-brand-red/10">
        <h4 className="text-white font-black text-xl uppercase italic tracking-tight leading-none group-hover/card:text-brand-red transition-colors mb-3">
          {formatHumanTitle(ych.title)}
        </h4>
        <div className="flex items-center gap-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-light/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
            {formatHumanTitle(ych.body_type)}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-light/40 flex items-center gap-1">
            • {ych.num_chars || '1'} Char{ych.num_chars !== '1' && 's'}
          </div>
        </div>
      </div>
    </div>
  );
});

const PricingTierCard = ({
  name,
  basePrice,
  upgradeCost,
  features,
  isPremium = false,
}: {
  name: string;
  basePrice: number;
  upgradeCost: number;
  features: string[];
  isPremium?: boolean;
}) => {
  // AQUI OCURRE LA SUMA LITERAL: YCH + VALOR DE LA TABLA
  const totalPrice = basePrice + upgradeCost;

  return (
    <div
      className={`p-4 rounded-xl border flex flex-col ${isPremium ? 'border-brand-red bg-brand-red/5' : 'border-white/10 bg-black/40'}`}
    >
      <h4
        className={`text-sm font-black uppercase tracking-widest ${isPremium ? 'text-brand-red' : 'text-white'} mb-1`}
      >
        {name}
      </h4>

      <div className="mb-4">
        <p className="text-3xl font-black text-white italic leading-none">
          {totalPrice === 0 ? '???' : `$${totalPrice}`}{' '}
          <span className="text-xs text-brand-light/50 not-italic">USD</span>
        </p>

        {basePrice > 0 && upgradeCost > 0 && (
          <p className="text-[10px] text-brand-red/80 font-bold uppercase tracking-widest mt-2">
            (Base ${basePrice} + ${upgradeCost} Upgrade)
          </p>
        )}
      </div>

      <ul className="space-y-2 mt-auto">
        {features.map((feat, i) => (
          <li key={i} className="text-xs text-brand-light/70 flex items-start gap-2">
            <span className={isPremium ? 'text-brand-red' : 'text-white/30'}>✓</span> {feat}
          </li>
        ))}
      </ul>

      {isPremium && (
        <span className="mt-4 text-[9px] uppercase tracking-widest text-brand-red/80 text-center block font-bold">
          Recommended
        </span>
      )}
    </div>
  );
};
