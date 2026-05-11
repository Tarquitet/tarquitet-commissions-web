import { memo } from 'react';
import type { PricingTier } from '../../../data/sheets';

interface Step1Props {
  prices: PricingTier[];
  baseSelection: PricingTier | null;
  setBaseSelection: (p: PricingTier) => void;
}

export default memo(function Step1Base({ prices, baseSelection, setBaseSelection }: Step1Props) {
  const tiers = Array.from(new Set(prices.map((p) => p.tier))).filter(Boolean);
  const bodies = Array.from(new Set(prices.map((p) => p.description))).filter(Boolean);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-1 sm:p-4 overflow-x-auto shadow-inner">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr>
              <th className="p-4 border-b border-white/10 text-white/40 font-black uppercase text-[10px] tracking-[0.2em]">
                Corte \ Estilo
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
            {bodies.map((body, idx, arr) => (
              <tr key={body} className="group">
                <td
                  className={`p-4 text-white font-black uppercase text-xs italic tracking-wide ${idx !== arr.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  {body}
                </td>
                {tiers.map((finish) => {
                  const priceItem = prices.find((p) => p.description === body && p.tier === finish);
                  const isSelected =
                    baseSelection?.original_price === priceItem?.original_price &&
                    baseSelection?.tier === priceItem?.tier;
                  return (
                    <td key={finish} className={`p-2 ${idx !== arr.length - 1 ? 'border-b border-white/5' : ''}`}>
                      {priceItem ? (
                        <button
                          onClick={() => setBaseSelection(priceItem)}
                          className={`w-full py-4 px-2 rounded-2xl border transition-all duration-300 flex flex-col justify-center items-center gap-1 ${isSelected ? 'bg-brand-red border-brand-red text-black scale-105 z-10' : 'bg-black/40 border-white/5 hover:border-brand-red/50 text-white'}`}
                        >
                          <span
                            className={`font-mono text-sm sm:text-base font-black ${isSelected ? 'text-black' : 'text-brand-red'}`}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
