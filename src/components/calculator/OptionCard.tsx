import React from 'react';

export default function OptionCard({ label, value, isSelected, onClick, category }: any) {
  const isFree = !value || value === '$0' || value === '0%' || value === '0';

  // Mapeo simple de "iconos/imágenes" por categoría (puedes cambiarlos por rutas de imagen reales)
  const categoryImages: Record<string, string> = {
    SHADOW: 'https://placehold.co/400x200/9c1111/white?text=SHADOWS',
    BG: 'https://placehold.co/400x200/222/white?text=BACKGROUND',
    PSD: 'https://placehold.co/400x200/444/white?text=LAYERS',
    LICENSE: 'https://placehold.co/400x200/9c1111/white?text=RIGHTS',
  };

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col w-full rounded-2xl border transition-all duration-300 group overflow-hidden ${
        isSelected
          ? 'bg-[#0f0f0f] border-brand-red shadow-[0_0_25px_rgba(156,17,17,0.3)] scale-[1.02] z-10'
          : 'bg-[#0a0a0a] border-white/5 hover:border-white/20 hover:-translate-y-1'
      }`}
    >
      {/* Espacio para la imagen de categoría */}
      <div className="w-full h-24 overflow-hidden opacity-40 group-hover:opacity-60 transition-opacity grayscale hover:grayscale-0">
        <img
          src={categoryImages[category] || 'https://placehold.co/400x200/111/333?text=EXTRA'}
          alt={label}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col items-start gap-2 w-full bg-gradient-to-t from-black to-transparent">
        <span
          className={`font-black uppercase text-xs italic tracking-widest text-left ${
            isSelected ? 'text-white' : 'text-white/40 group-hover:text-white'
          }`}
        >
          {label}
        </span>

        <span
          className={`font-mono text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm ${
            isSelected ? 'bg-brand-red text-black' : 'bg-white/5 text-brand-red'
          }`}
        >
          {isFree ? 'INCLUDED' : value.toString().includes('%') ? `+${value}` : `+${value}`}
        </span>
      </div>
    </button>
  );
}
