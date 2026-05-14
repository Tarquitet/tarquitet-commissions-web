// src/components/PricingExtrasMarquee.tsx
import React from 'react';

export default function PricingExtrasMarquee({ extras }: any) {
  if (!extras || extras.length === 0) return null;

  return (
    <div className="mt-8 pt-10 pb-10 bg-[#050000] border border-brand-red/20 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 rounded-full blur-[100px] pointer-events-none"></div>

      <h5 className="text-brand-red font-black text-xs uppercase tracking-[0.5em] mb-10 flex items-center gap-6 px-10">
        <span className="h-px bg-brand-red/20 flex-grow"></span>
        Additional Charges
        <span className="h-px bg-brand-red/20 flex-grow"></span>
      </h5>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite; 
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex overflow-hidden relative w-full group cursor-default">
        <div className="flex w-max animate-marquee gap-16 px-8">
          {[...extras, ...extras, ...extras, ...extras].map((extra: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col border-l-2 border-brand-red/20 pl-5 py-1 min-w-max transition-all duration-300 hover:border-brand-red hover:scale-105"
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
