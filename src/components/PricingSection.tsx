import { useState, useEffect, useMemo } from 'react';
import { paymentMethods } from '../data/payments';
import {
  getSheetArtworks,
  getSheetPrices,
  getSheetExtras,
  type ArtPiece,
  type PricingTier,
  type ExtraItem,
} from '../data/sheets';

export default function PricingSection() {
  const [artworks, setArtworks] = useState<ArtPiece[]>([]);
  const [prices, setPrices] = useState<PricingTier[]>([]);
  const [extras, setExtras] = useState<ExtraItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [artData, priceData, extrasData] = await Promise.all([
        getSheetArtworks(),
        getSheetPrices(),
        getSheetExtras(),
      ]);
      setArtworks(artData);
      setPrices(priceData);
      setExtras(extrasData);
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

  const getImagePath = (filename: string) => {
    if (!filename) return '';
    return filename.startsWith('http') ? filename : `/profile/${filename}`;
  };

  const preventActions = (e: React.SyntheticEvent) => {
    e.preventDefault();
    return false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 border border-brand-red/10 bg-[#050000] rounded-2xl">
        <p className="text-brand-red/60 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">
          // Procesando Base de Datos Financiera...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* TABLA DE PRECIOS AGRUPADA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {Object.entries(groupedPrices).map(([tierName, tierItems], index) => {
          const features = tierItems[0]?.features.split(';') || [];

          return (
            <div
              key={index}
              className="group bg-[#080000] border border-brand-red/10 rounded-2xl overflow-hidden hover:border-brand-red/40 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all duration-500 flex flex-col"
            >
              {/* CABECERA VISUAL */}
              <div className="aspect-[16/10] bg-[#050000] relative overflow-hidden">
                {tierExamples[tierName] ? (
                  <>
                    <img
                      src={getImagePath(tierExamples[tierName])}
                      alt={`Ejemplo de ${tierName}`}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none select-none"
                      referrerPolicy="no-referrer"
                      onContextMenu={preventActions}
                      onDragStart={preventActions}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-transparent z-10"></div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-brand-light/20 font-mono text-xs z-0">
                    [EJEMPLO NO ENCONTRADO]
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#080000] via-transparent to-transparent z-0"></div>

                <h4 className="absolute bottom-4 left-6 text-white font-black text-3xl md:text-4xl uppercase italic tracking-tighter drop-shadow-lg z-20">
                  {tierName}
                </h4>
              </div>

              <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-[#080000] to-transparent">
                {/* LISTA DE PRECIOS INTERNA HORIZONTAL */}
                <div className="flex flex-col gap-4 mb-8 flex-grow">
                  {tierItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-end border-b border-brand-red/10 pb-3 group/row hover:border-brand-red/30 transition-colors"
                    >
                      <span className="text-brand-light/80 uppercase tracking-widest text-xs font-bold group-hover/row:text-white transition-colors">
                        {item.description}
                      </span>

                      {/* CONTENEDOR DE PRECIOS EN HORIZONTAL */}
                      <div className="flex items-center gap-4 leading-none">
                        {item.original_price && (
                          <div className="relative group-hover/row:scale-105 transition-transform origin-right">
                            {/* Texto más grande (text-3xl) y con mayor opacidad (text-brand-red/80) */}
                            <span className="text-brand-red/80 text-3xl font-black italic">{item.original_price}</span>
                            {/* Línea diagonal más gruesa y sólida para que destaque sobre el texto grande */}
                            <div className="absolute top-1/2 left-[-10%] w-[120%] h-[4px] bg-brand-red -rotate-12 origin-center transform -translate-y-1/2 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
                          </div>
                        )}

                        <span className="text-white font-black text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover/row:scale-105 transition-transform origin-right">
                          {item.discount_price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CARACTERÍSTICAS TÉCNICAS */}
                <div className="bg-brand-red/5 p-4 rounded-xl border border-brand-red/10">
                  <p className="text-brand-red/60 font-mono text-[9px] uppercase tracking-widest mb-3">
                    Detalles Técnicos
                  </p>
                  <ul className="space-y-2">
                    {features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-[10px] font-bold text-brand-light/70 uppercase tracking-widest"
                      >
                        <span className="w-1 h-1 bg-brand-red shadow-[0_0_5px_rgba(220,38,38,1)]"></span>
                        {feature.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECCIÓN DE EXTRAS ADAPTABLE */}
      <div className="p-8 bg-[#050000] border border-brand-red/20 rounded-2xl shadow-inner relative overflow-hidden mt-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 rounded-full blur-[80px] pointer-events-none"></div>

        <h5 className="text-brand-red font-black text-sm uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
          <span className="h-px bg-brand-red/30 flex-grow"></span>
          Cargos Adicionales
          <span className="h-px bg-brand-red/30 flex-grow"></span>
        </h5>

        {/* FLEXBOX PARA ACOMODAR ÍTEMS IMPARES */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 relative z-10">
          {extras.map((extra, idx) => (
            <div
              key={idx}
              className="flex-1 min-w-[160px] max-w-[250px] flex flex-col border-l-2 border-brand-red/20 pl-4 hover:border-brand-red transition-colors"
            >
              <span className="text-brand-light/50 text-[10px] uppercase font-bold tracking-widest mb-1">
                {extra.name}
              </span>
              <span className="text-brand-red font-black text-2xl italic drop-shadow-sm">{extra.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN DE MÉTODOS DE PAGO (UNIFICADA Y EXTERNA) */}
      <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-brand-red font-mono text-[20px] font-black uppercase tracking-[0.3em]">
            Métodos de Pago
          </span>
          <div className="h-px bg-brand-red/10 flex-grow"></div>
        </div>

        <div className="flex flex-wrap justify-center lg:justify-between gap-6">
          {paymentMethods.map((method) => (
            <a
              key={method.name}
              href={method.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div className="w-16 h-16 bg-[#050000] border border-brand-red/20 rounded-xl flex items-center justify-center p-3 group-hover:border-brand-red group-hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all duration-500">
                {/* Aquí reemplazamos el span por la imagen real */}
                <img
                  src={method.icon}
                  alt={`Logo de ${method.name}`}
                  className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <span className="text-brand-light/75 font-mono text-[13px] uppercase tracking-widest group-hover:text-brand-red transition-colors whitespace-nowrap">
                {method.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
