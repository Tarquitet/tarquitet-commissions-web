import { memo } from 'react';
import type { CalcOption } from '../../../data/sheets';

// ESTA ES LA PÍLDORA QUE SÍ FUNCIONA (La rescatamos de tu código original)
export const OptionPill = ({ label, value, isSelected, onClick }: any) => {
  const isFree = !value || value === '$0' || value === '0%' || value === '0';
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-full border transition-all flex justify-between items-center gap-4 w-full ${
        isSelected
          ? 'bg-brand-red border-brand-red text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
          : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white hover:border-white/30'
      }`}
    >
      <span className="font-black uppercase text-[11px] tracking-widest truncate">{label}</span>
      <span
        className={`font-mono text-[10px] font-bold px-3 py-1 rounded-full shrink-0 ${
          isSelected ? 'bg-black/20 text-white' : 'bg-black/40 text-brand-red'
        }`}
      >
        {isFree ? 'INCLUIDO' : value.toString().includes('%') ? `+${value}` : `+${value}`}
      </span>
    </button>
  );
};

interface StepLightsProps {
  options: CalcOption[];
  selections: Record<string, string>;
  setSelections: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default memo(function StepLights({ options, selections, setSelections }: StepLightsProps) {
  return (
    <div className="space-y-6">
      {/* TÍTULO DE LA FASE */}
      <div>
        <h2 className="text-white font-black text-3xl uppercase italic tracking-tighter mb-1">
          3. Iluminación y Efectos
        </h2>
        <p className="text-white/40 font-bold text-xs uppercase tracking-widest">
          Define el nivel de luces, brillos y atmósfera
        </p>
      </div>

      {/* GRILLA DE PÍLDORAS (BOTONES) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => (
          <OptionPill
            key={opt.label}
            label={opt.label}
            value={opt.value}
            isSelected={selections['LIGHT'] === opt.label}
            onClick={() => setSelections((prev) => ({ ...prev, LIGHT: opt.label }))}
          />
        ))}
      </div>

      {/* CAJA DE INFORMACIÓN */}
      <div className="mt-4 p-4 bg-brand-red/5 border border-brand-red/10 rounded-lg">
        <p className="text-brand-light/60 font-mono text-[10px] uppercase tracking-widest text-center">
          <span className="text-brand-red font-bold">INFO:</span> La iluminación compleja incluye rebotes de luz,
          fuentes múltiples (ej. neones, fuego) y efectos de post-procesado.
        </p>
      </div>
    </div>
  );
});
