// src/components/PricingCarousel.tsx
import React, { useRef, useState } from 'react';
import { getImagePath } from '../utils/formatters';
import FadeImage from './FadeImage';

export default function PricingCarousel({ tiers, tierExamples }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    const itemElement = scrollRef.current.children[0] as HTMLElement;
    if (!itemElement) return;

    const itemWidth = itemElement.offsetWidth + 24;
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

  return (
    <div className="flex flex-col relative">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory custom-scrollbar md:px-4"
      >
        {tiers.map(([tierName, tierItems]: any, index: number) => {
          const rawFeatures = tierItems[0]?.features || '';
          const features = rawFeatures
            .split('\n')
            .map((f: string) => f.replace(/^-/, '').trim())
            .filter(Boolean);

          return (
            <div
              key={index}
              className="shrink-0 w-[85vw] sm:w-[350px] lg:w-[380px] snap-center snap-always group bg-[#080000] border border-brand-red/10 rounded-2xl overflow-hidden flex flex-col transition-[border-color,box-shadow] duration-700 ease-in-out hover:border-brand-red/40 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)]"
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

              {/* CONTENIDO DE PRECIOS CON TU DISEÑO RESTAURADO */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="space-y-4 mb-8 flex-grow">
                  {tierItems.map((item: any, i: number) => {
                    // RETORNAMOS LOS VALORES DE LA TABLA DIRECTAMENTE
                    const originalPrice = item.original_price || '';
                    const discountPrice = item.discount_price || '';

                    // Si el precio de descuento es menor al original (limpiando texto para comparar)
                    const numOriginal = parseFloat(String(originalPrice).replace(/[^0-9.]/g, '')) || 0;
                    const numDiscount = parseFloat(String(discountPrice).replace(/[^0-9.]/g, '')) || 0;
                    const showPromo = numDiscount > 0 && numDiscount < numOriginal;

                    return (
                      <div
                        key={i}
                        className="flex justify-between items-center border-b border-brand-red/5 pb-3 group/row transition-colors duration-500 hover:border-brand-red/30"
                      >
                        <span className="text-brand-light/60 uppercase tracking-widest text-[10px] font-bold group-hover/row:text-white transition-colors duration-500">
                          {item.description}
                        </span>

                        <div className="flex items-center gap-3">
                          {/* TACHADO: Muestra original_price si la tabla tiene un descuento activo */}
                          {showPromo && (
                            <div className="relative">
                              <span className="text-brand-red/40 text-xl font-black italic">{originalPrice}</span>
                              <div className="absolute top-1/2 left-[-10%] w-[120%] h-[2px] bg-brand-red -rotate-12 transform -translate-y-1/2 shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
                            </div>
                          )}

                          <span className="text-white font-black text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-transform duration-500 group-hover/row:scale-110">
                            {showPromo ? discountPrice : originalPrice}
                          </span>
                          <span className="text-brand-red font-mono text-[10px]">USD</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ESPECIFICACIONES BASE */}
                <div className="bg-brand-red/5 p-5 rounded-xl border border-brand-red/10 backdrop-blur-sm">
                  <p className="text-brand-red font-black text-[10px] uppercase tracking-[0.3em] mb-4">
                    Base Specifications
                  </p>
                  <ul className="grid grid-cols-1 gap-3">
                    {features.map((feature: string, i: number) => (
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

      {tiers.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 mb-4">
          {tiers.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`transition-all duration-500 rounded-full ${
                activeIndex === i
                  ? 'w-10 h-1.5 bg-brand-red shadow-[0_0_15px_rgba(220,38,38,0.6)]'
                  : 'w-2 h-1.5 bg-white/10 hover:bg-white/30'
              }`}
              aria-label={`Ver estilo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
