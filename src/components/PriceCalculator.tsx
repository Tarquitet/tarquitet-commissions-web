// src/components/PriceCalculator.tsx (Versión Compacta / Frutiger Aero)
import React from 'react';

export default function PriceCalculator() {
  return (
    // CAMBIO: Contenedor compacto tipo "burbuja" de cristal
    <div className="w-full max-w-4xl mx-auto px-4 my-8" id="calculator-cta">
      <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-5 bg-white/5 border border-white/10 rounded-2xl md:rounded-full backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_10px_30px_rgba(0,0,0,0.5)] gap-4 transition-all duration-700 ease-in-out hover:border-brand-red/30 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)]">
        {/* CAMBIO: Titulo cortado/truncado al lado del boton */}
        <div className="flex-1 text-center md:text-left min-w-0 max-w-full md:max-w-[50%] md:pl-4">
          <h3 className="text-white font-black text-2xl md:text-3xl uppercase italic tracking-tighter truncate leading-none drop-shadow-md">
            Check <span className="text-brand-red animate-pulse">Budget</span> Now
          </h3>
          <p className="text-brand-light/30 font-mono text-[9px] uppercase tracking-[0.2em] truncate mt-1">
            Get an instant custom quote
          </p>
        </div>

        {/* CAMBIO: Botón más pequeño y refinado al lado del titulo */}
        <div className="w-full md:w-auto shrink-0 md:pr-1">
          <a
            href="/calculator"
            className="group flex items-center justify-center gap-3 bg-gradient-to-br from-[#9c1111] to-[#5a0505] hover:from-brand-red hover:to-[#9c1111] text-white px-6 py-3.5 rounded-xl md:rounded-full border border-brand-red/50 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] active:scale-95"
          >
            <span className="font-bold text-lg md:text-xl uppercase italic tracking-tighter leading-none">
              Open Calculator
            </span>
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white transition-transform duration-300 group-hover:translate-x-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
