export const OptionPill = ({ label, value, isSelected, onClick, index }: any) => {
  const isFree = !value || value === '$0' || value === '0%' || value === '0';

  return (
    <button
      onClick={onClick}
      className={`relative group flex items-center justify-between px-6 py-4 rounded-2xl border transition-all duration-300 w-full overflow-hidden ${
        isSelected
          ? 'bg-brand-red border-brand-red text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] scale-[1.02]'
          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-brand-red/30'
      }`}
    >
      {/* Indicador visual de selección lateral */}
      {isSelected && <div className="absolute left-0 top-0 h-full w-1 bg-white/40 shadow-[2px_0_10px_white]" />}

      <div className="flex flex-col items-start">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 mb-1">
          Opción {index ? index + 1 : ''}
        </span>
        <span className="font-black uppercase text-xs md:text-sm tracking-widest italic leading-none">{label}</span>
      </div>

      <div
        className={`px-4 py-2 rounded-xl font-mono text-[10px] font-black border transition-colors ${
          isSelected
            ? 'bg-black/20 border-white/20 text-white'
            : 'bg-black/40 border-brand-red/20 text-brand-red group-hover:border-brand-red/50'
        }`}
      >
        {isFree ? 'INCLUIDO' : value.toString().includes('%') ? `+${value}` : `+${value} USD`}
      </div>
    </button>
  );
};
