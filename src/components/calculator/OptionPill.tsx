export const OptionPill = ({ label, value, isSelected, onClick }: any) => {
  const isFree = !value || value === '$0' || value === '0%' || value === '0';

  return (
    <button
      onClick={onClick}
      className={`relative group flex items-center justify-between px-6 py-5 rounded-2xl border transition-all duration-300 w-full overflow-hidden ${
        isSelected
          ? 'bg-brand-red border-brand-red text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] scale-[1.02]'
          : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-brand-red/30'
      }`}
    >
      {/* Solo dejamos el nombre de la opción en grande */}
      <span className="font-black uppercase text-xs md:text-sm tracking-widest italic leading-none">{label}</span>

      {/* El precio a la derecha */}
      <div
        className={`px-4 py-2 rounded-xl font-mono text-[10px] font-black border transition-colors ${
          isSelected ? 'bg-black/20 border-white/20 text-white' : 'bg-black/40 border-brand-red/20 text-brand-red'
        }`}
      >
        {isFree ? 'INCLUIDO' : value.toString().includes('%') ? `+${value}` : `+${value} USD`}
      </div>
    </button>
  );
};
