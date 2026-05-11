import React from 'react';

export default function OptionPill({ label, value, isSelected, onClick }: any) {
  const isFree = !value || value === '$0' || value === '0%' || value === '0';

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl aspect-[3/4] border transition-all duration-300 group overflow-hidden ${
        isSelected
          ? 'bg-gradient-to-b from-brand-red/20 to-[#0a0a0a] border-brand-red shadow-[0_0_30px_rgba(156,17,17,0.3)] scale-105 z-10'
          : 'bg-gradient-to-b from-white/5 to-black/60 border-white/10 hover:border-brand-red/50 hover:-translate-y-2'
      }`}
    >
      {/* Etiqueta Principal (Como los años 2026, 2025 del portafolio) */}
      <span
        className={`font-black uppercase text-2xl sm:text-3xl italic tracking-tighter text-center leading-none mb-6 transition-colors ${
          isSelected ? 'text-white' : 'text-white/40 group-hover:text-white'
        }`}
      >
        {label}
      </span>

      {/* Tag de Precio (Como el cuadro de "1 ENTRADAS") */}
      <span
        className={`font-mono text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 transition-colors ${
          isSelected
            ? 'bg-brand-red text-black'
            : 'bg-black/50 border border-brand-red/30 text-brand-red group-hover:border-brand-red'
        }`}
      >
        {isFree ? 'INCLUIDO' : value.toString().includes('%') ? `+${value}` : `+${value}`}
      </span>
    </button>
  );
}
