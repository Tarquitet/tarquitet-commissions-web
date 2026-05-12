import { useState, useEffect, useMemo } from 'react';
import {
  getSheetArtworks,
  getSheetPrices,
  getSheetExtras,
  getSheetYCH, // <-- Añadido
  type ArtPiece,
  type PricingTier,
  type ExtraItem,
  type YCHPiece, // <-- Añadido
} from '../data/sheets';
import { getImagePath } from '../utils/formatters';
import FadeImage from './FadeImage';
import YCHSlider from './YCHSlider';

export default function PricingSection() {
  const [artworks, setArtworks] = useState<ArtPiece[]>([]);
  const [prices, setPrices] = useState<PricingTier[]>([]);
  const [extras, setExtras] = useState<ExtraItem[]>([]);
  const [ychData, setYchData] = useState<YCHPiece[]>([]); // <-- Nuevo estado
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [artData, priceData, extrasData, ych] = await Promise.all([
        getSheetArtworks(),
        getSheetPrices(),
        getSheetExtras(),
        getSheetYCH(), // <-- Obtenemos los YCHs aquí también
      ]);
      setArtworks(artData);
      setPrices(priceData);
      setExtras(extrasData);
      setYchData(ych);
      setLoading(false);
    }
    loadData();
  }, []);

  const groupedPrices = useMemo(() => {
    const groups: Record<string, PricingTier[]> = {};
    prices.forEach((p) => {
      const tierName = p.tier.toUpperCase();
      if (!groups[tierName]) groups[tierName] = [];
      groups[tierName].push(p);
    });
    return groups;
  }, [prices]);

  const tierExamples = useMemo(() => {
    const examples: Record<string, string> = {};
    Object.keys(groupedPrices).forEach((tierName) => {
      const matchingArt = artworks.filter((art) => art.category.toUpperCase() === tierName);
      if (matchingArt.length > 0) {
        const randomIndex = Math.floor(Math.random() * matchingArt.length);
        examples[tierName] = matchingArt[randomIndex].filename;
      }
    });
    return examples;
  }, [artworks, groupedPrices]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 border border-brand-red/10 bg-[#050000] rounded-2xl">
        <p className="text-brand-red/60 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">
          // Syncing Financial Base
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      {/* GRILLA DE CATEGORÍAS (TIERS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {Object.entries(groupedPrices).map(([tierName, tierItems], index) => {
          // CORRECCIÓN: Ahora separa por guiones (-) o punto y coma (;) y borra espacios en blanco
          const rawFeatures = tierItems[0]?.features || '';
          const features = rawFeatures
            .split(/(?:;|-)/)
            .map((f) => f.trim())
            .filter(Boolean);

          return (
            <div
              key={index}
              className="group bg-[#080000] border border-brand-red/10 rounded-2xl overflow-hidden flex flex-col transition-[border-color,box-shadow] duration-700 ease-in-out hover:border-brand-red/40 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)]"
            >
              {/* CABECERA */}
              <div className="aspect-video bg-[#050000] relative overflow-hidden">
                {tierExamples[tierName] ? (
                  <FadeImage
                    src={getImagePath(tierExamples[tierName])}
                    alt={`Example ${tierName}`}
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-in-out"
                    containerClass="w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-brand-light/10 font-mono text-[10px] uppercase">
                    [No preview]
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[#080000] via-transparent to-transparent z-10"></div>
                <h4 className="absolute bottom-4 left-6 text-white font-black text-3xl uppercase italic tracking-tighter drop-shadow-2xl z-20">
                  {tierName}
                </h4>
              </div>

              {/* CONTENIDO DE PRECIOS */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="space-y-4 mb-8 flex-grow">
                  {tierItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-b border-brand-red/5 pb-3 group/row transition-colors duration-500 hover:border-brand-red/30"
                    >
                      <span className="text-brand-light/60 uppercase tracking-widest text-[10px] font-bold group-hover/row:text-white transition-colors duration-500">
                        {item.description}
                      </span>
                      <div className="flex items-center gap-3">
                        {item.original_price && (
                          <div className="relative">
                            <span className="text-brand-red/40 text-xl font-black italic">{item.original_price}</span>
                            <div className="absolute top-1/2 left-[-10%] w-[120%] h-[2px] bg-brand-red -rotate-12 transform -translate-y-1/2 shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
                          </div>
                        )}
                        <span className="text-white font-black text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-transform duration-500 group-hover/row:scale-110">
                          {item.discount_price}
                        </span>
                        <span className="text-brand-red font-mono text-[10px]">USD</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ESPECIFICACIONES BASE */}
                <div className="bg-brand-red/5 p-5 rounded-xl border border-brand-red/10 backdrop-blur-sm">
                  {/* CORRECCIÓN: Color más vivo y brillante en el título */}
                  <p className="text-brand-red font-black text-[10px] uppercase tracking-[0.3em] mb-4">
                    Base Specifications
                  </p>
                  <ul className="grid grid-cols-1 gap-3">
                    {features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-[10px] font-bold text-brand-light/70 uppercase tracking-widest leading-tight"
                      >
                        <span className="mt-1 w-1 h-1 bg-brand-red shrink-0 shadow-[0_0_5px_rgba(220,38,38,1)]"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CONDICIONAL: SOLO SE MUESTRA SI HAY YCHs DISPONIBLES */}
      {ychData.length > 0 && (
        <div className="mt-8 mb-8">
          <div className="flex items-center gap-4 mb-6 px-4 md:px-8">
            <h3 className="text-white font-black text-3xl md:text-4xl uppercase italic tracking-tighter">
              Poses / Y.C.H <span className="text-brand-red">Available</span>
            </h3>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-brand-red/50 to-transparent"></div>
          </div>
          <YCHSlider />
        </div>
      )}

      {/* SECCIÓN DE EXTRAS */}
      <div className="mt-12 p-10 bg-[#050000] border border-brand-red/20 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 rounded-full blur-[100px] pointer-events-none"></div>

        <h5 className="text-brand-red font-black text-xs uppercase tracking-[0.5em] mb-10 flex items-center gap-6">
          <span className="h-px bg-brand-red/20 flex-grow"></span>
          Additional Charges
          <span className="h-px bg-brand-red/20 flex-grow"></span>
        </h5>

        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 relative z-10">
          {extras.map((extra, idx) => (
            <div
              key={idx}
              className="flex flex-col border-l-2 border-brand-red/20 pl-5 py-1 transition-all duration-500 hover:border-brand-red hover:translate-x-1"
            >
              <span className="text-brand-light/40 text-[9px] uppercase font-bold tracking-[0.2em] mb-1">
                {extra.name}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-white font-black text-3xl italic tracking-tighter">
                  +{extra.price.replace('USD', '').trim()}
                </span>
                <span className="text-brand-red font-mono text-[10px]">USD</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
