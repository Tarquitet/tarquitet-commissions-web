import { memo } from 'react';
import type { PricingTier, YCHPiece } from '../../../data/sheets';

interface Step1Props {
  prices: PricingTier[];
  baseSelection: PricingTier | null;
  setBaseSelection: (p: PricingTier) => void;
  ychSelection?: YCHPiece | null;
}

export default memo(function Step1Base({ prices, baseSelection, setBaseSelection, ychSelection }: Step1Props) {
  const tiers = Array.from(new Set(prices.map((p) => p.tier))).filter(Boolean);
  const bodies = Array.from(new Set(prices.map((p) => p.description))).filter(Boolean);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Añadimos un pequeño aviso para móvil */}
      <div className="md:hidden text-brand-red/60 text-[10px] uppercase tracking-widest font-mono text-right mb-2 flex items-center justify-end gap-2">
        <span>Slide for options</span>
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>

      <div className="bg-[#0a0505] border border-white/10 rounded-3xl p-1 sm:p-4 overflow-x-auto shadow-inner custom-scrollbar relative">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr>
              {/* MAGIA: sticky left-0 z-20 congela esta celda */}
              <th className="sticky left-0 z-20 bg-[#0a0505] p-4 border-b border-white/10 text-white/40 font-black uppercase text-[10px] tracking-[0.2em] shadow-[4px_0_15px_rgba(0,0,0,0.5)]">
                Cut \ Style
              </th>
              {tiers.map((finish) => (
                <th
                  key={finish}
                  className="p-4 border-b border-white/10 text-brand-red font-black uppercase text-sm italic text-center"
                >
                  {finish}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodies.map((body, idx, arr) => {
              const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '');
              const isRowLocked = ychSelection && normalize(ychSelection.body_type) !== normalize(body);

              return (
                <tr key={body} className={`group ${isRowLocked ? 'opacity-30' : ''}`}>
                  {/* MAGIA: sticky left-0 congela también los nombres de las filas */}
                  <td
                    className={`sticky left-0 z-20 bg-[#0a0505] p-4 text-white font-black uppercase text-xs italic tracking-wide shadow-[4px_0_15px_rgba(0,0,0,0.5)] ${
                      idx !== arr.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    {body}
                  </td>
                  {tiers.map((finish) => {
                    const priceItem = prices.find((p) => p.description === body && p.tier === finish);
                    const isSelected =
                      baseSelection?.original_price === priceItem?.original_price &&
                      baseSelection?.tier === priceItem?.tier &&
                      baseSelection?.description === priceItem?.description;

                    return (
                      <td key={finish} className={`p-2 ${idx !== arr.length - 1 ? 'border-b border-white/5' : ''}`}>
                        {priceItem ? (
                          <button
                            onClick={() => setBaseSelection(priceItem)}
                            disabled={!!isRowLocked}
                            className={`w-full py-4 px-2 rounded-2xl border transition-all duration-300 flex flex-col justify-center items-center gap-1 ${
                              isSelected
                                ? 'bg-brand-red border-brand-red text-black scale-105 z-10'
                                : isRowLocked
                                  ? 'bg-black/20 border-white/5 cursor-not-allowed'
                                  : 'bg-black/40 border-white/5 hover:border-brand-red/50 text-white'
                            }`}
                          >
                            <span
                              className={`font-mono text-sm sm:text-base font-black ${
                                isSelected ? 'text-black' : 'text-brand-red'
                              }`}
                            >
                              {priceItem.discount_price}
                            </span>
                          </button>
                        ) : (
                          <div className="text-white/5 text-center font-mono text-xs italic">N/A</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});
