import React from 'react';
import StepLayout from '../../calculator/StepLayout';

export default function Step1Base({ prices, baseSelection, setBaseSelection }: any) {
  return (
    <StepLayout stepNumber={1} title="Base de la Comisión" subtitle="Selecciona el corte y estilo principal">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-1 sm:p-4 overflow-x-auto shadow-inner">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr>
              <th className="p-4 border-b border-white/10 text-white/40 font-black uppercase text-[10px] tracking-[0.2em]">
                Corte \ Estilo
              </th>
              {Array.from(new Set(prices.map((p: any) => p.tier)))
                .filter(Boolean)
                .map((finish: any) => (
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
            {Array.from(new Set(prices.map((p: any) => p.description)))
              .filter(Boolean)
              .map((body: any, idx, arr) => (
                <tr key={body} className="group">
                  <td
                    className={`p-4 text-white font-black uppercase text-xs italic tracking-wide ${idx !== arr.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    {body}
                  </td>
                  {Array.from(new Set(prices.map((p: any) => p.tier)))
                    .filter(Boolean)
                    .map((finish: any) => {
                      const priceItem = prices.find((p: any) => p.description === body && p.tier === finish);
                      const isSelected = baseSelection === priceItem;
                      return (
                        <td key={finish} className={`p-2 ${idx !== arr.length - 1 ? 'border-b border-white/5' : ''}`}>
                          {priceItem ? (
                            <button
                              onClick={() => setBaseSelection(priceItem)}
                              className={`w-full py-4 px-2 rounded-2xl border transition-all flex justify-center items-center ${isSelected ? 'bg-brand-red border-brand-red shadow-[0_0_20px_rgba(220,38,38,0.5)] text-black scale-105 relative z-10' : 'bg-black/40 border-white/5 hover:border-brand-red/50 text-white'}`}
                            >
                              <span
                                className={`font-mono text-sm sm:text-base font-bold ${isSelected ? 'text-black' : 'text-brand-red'}`}
                              >
                                {priceItem.discount_price}
                              </span>
                            </button>
                          ) : (
                            <div className="text-white/10 text-center font-mono text-xs">-</div>
                          )}
                        </td>
                      );
                    })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </StepLayout>
  );
}
