import { memo } from 'react';
import type { CalcOption } from '../../../data/sheets';

interface StepExtraCharsProps {
  extraChars: number;
  setExtraChars: React.Dispatch<React.SetStateAction<number>>;
  charsConfig?: CalcOption;
}

export default memo(function StepExtraChars({ extraChars, setExtraChars, charsConfig }: StepExtraCharsProps) {
  // Leemos el valor del Sheets, si no existe mostramos +75% por defecto
  const displayValue = charsConfig ? charsConfig.value : '75%';

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-inner">
      <div className="text-center sm:text-left">
        <h4 className="text-white font-black text-xl uppercase italic tracking-tight">Personajes Extra</h4>
        <p className="text-brand-red font-mono text-[10px] uppercase tracking-widest mt-1">
          +{displayValue} del valor base por personaje adicional
        </p>
      </div>

      <div className="flex items-center gap-6 bg-[#050000] rounded-full p-2 border border-white/10 shadow-lg">
        <button
          onClick={() => setExtraChars(Math.max(1, extraChars - 1))}
          className="text-white w-12 h-12 rounded-full hover:bg-brand-red hover:text-black font-black text-xl transition-all active:scale-95 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
          disabled={extraChars <= 1}
        >
          −
        </button>

        <div className="flex flex-col items-center justify-center w-8">
          <span className="font-black text-2xl text-white">{extraChars}</span>
          <span className="text-[8px] font-mono uppercase text-white/40 tracking-widest leading-none">Total</span>
        </div>

        <button
          onClick={() => setExtraChars(extraChars + 1)}
          className="text-black bg-brand-red w-12 h-12 rounded-full hover:bg-white font-black text-xl transition-all active:scale-95 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)]"
        >
          +
        </button>
      </div>
    </div>
  );
});
