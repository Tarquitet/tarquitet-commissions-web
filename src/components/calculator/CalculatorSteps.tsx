import React from 'react';
import StepLights from './steps/3_Lights';

// EL NUEVO BOTÓN (Estilo píldora de portafolio)
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

// VISTA 1: LA TABLA BASE
export const Step1Base = ({ prices, baseSelection, setBaseSelection }: any) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
    <div>
      <h2 className="text-white font-black text-3xl uppercase italic tracking-tighter mb-1">Paso 1</h2>
      <p className="text-white/40 font-bold text-xs uppercase tracking-widest">Base de la Comisión</p>
    </div>
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
                            className={`w-full py-4 px-2 rounded-2xl border transition-all flex justify-center items-center ${
                              isSelected
                                ? 'bg-brand-red border-brand-red shadow-[0_0_20px_rgba(220,38,38,0.5)] text-black scale-105 relative z-10'
                                : 'bg-black/40 border-white/5 hover:border-brand-red/50 text-white'
                            }`}
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
  </div>
);

// VISTA 2: SOMBRAS Y LUCES
export const Step2Details = ({ groupedOptions, selections, setSelections }: any) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
    <div>
      <h2 className="text-white font-black text-3xl uppercase italic tracking-tighter mb-1">Paso 2</h2>
      <p className="text-white/40 font-bold text-xs uppercase tracking-widest">Detalles y Ambiente</p>
    </div>
    {['SHADOW', 'LIGHT'].map(
      (cat) =>
        groupedOptions[cat] && (
          <div key={cat} className="space-y-4">
            <h4 className="text-brand-red font-black text-[10px] uppercase tracking-[0.3em]">
              {cat === 'SHADOW' ? 'Nivel de Sombreado' : 'Iluminación'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groupedOptions[cat].map((opt: any) => (
                <OptionPill
                  key={opt.label}
                  {...opt}
                  isSelected={selections[cat] === opt.label}
                  onClick={() => setSelections((p: any) => ({ ...p, [cat]: opt.label }))}
                />
              ))}
            </div>
          </div>
        ),
    )}
  </div>
);

// VISTA 3: FONDOS, PSD Y PERSONAJES
export const Step3Extras = ({
  groupedOptions,
  selections,
  setSelections,
  multiSelections,
  setMultiSelections,
  extraChars,
  setExtraChars,
}: any) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
    <div>
      <h2 className="text-white font-black text-3xl uppercase italic tracking-tighter mb-1">Paso 3</h2>
      <p className="text-white/40 font-bold text-xs uppercase tracking-widest">Extras y Entregables</p>
    </div>
    <div className="space-y-4 bg-white/5 p-4 rounded-3xl border border-white/10 flex justify-between items-center">
      <div>
        <h4 className="text-brand-red font-black text-[10px] uppercase tracking-[0.3em]">Personajes extra</h4>
        <p className="text-white/40 text-[10px] uppercase mt-1">+75% por personaje adicional</p>
      </div>
      <div className="flex items-center gap-4 bg-black/40 rounded-full p-1 border border-white/10">
        <button
          onClick={() => setExtraChars(Math.max(1, extraChars - 1))}
          className="text-white w-8 h-8 rounded-full hover:bg-brand-red font-bold transition-colors"
        >
          -
        </button>
        <span className="font-mono font-bold w-4 text-center">{extraChars}</span>
        <button
          onClick={() => setExtraChars(extraChars + 1)}
          className="text-white w-8 h-8 rounded-full hover:bg-brand-red font-bold transition-colors"
        >
          +
        </button>
      </div>
    </div>
    {groupedOptions['BG'] && (
      <div className="space-y-4">
        <h4 className="text-brand-red font-black text-[10px] uppercase tracking-[0.3em]">Fondo</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {groupedOptions['BG'].map((opt: any) => (
            <OptionPill
              key={opt.label}
              {...opt}
              isSelected={selections['BG'] === opt.label}
              onClick={() => setSelections((p: any) => ({ ...p, BG: opt.label }))}
            />
          ))}
        </div>
      </div>
    )}
    {groupedOptions['PSD'] && (
      <div className="space-y-4">
        <h4 className="text-brand-red font-black text-[10px] uppercase tracking-[0.3em]">Capas PSD (.PSD)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {groupedOptions['PSD'].map((opt: any) => (
            <OptionPill
              key={opt.label}
              {...opt}
              isSelected={multiSelections['PSD']?.includes(opt.label)}
              onClick={() => {
                const c = multiSelections['PSD'] || [];
                setMultiSelections((p: any) => ({
                  ...p,
                  PSD: c.includes(opt.label) ? c.filter((l: any) => l !== opt.label) : [...c, opt.label],
                }));
              }}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);

// VISTA 4: LICENCIAS Y RESUMEN
export const Step4Summary = ({
  groupedOptions,
  multiSelections,
  setMultiSelections,
  baseSelection,
  selections,
  total,
  extraChars,
}: any) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
    <div className="flex justify-between items-end border-b border-white/10 pb-4">
      <div>
        <h2 className="text-white font-black text-3xl uppercase italic tracking-tighter mb-1">Paso 4</h2>
        <p className="text-white/40 font-bold text-xs uppercase tracking-widest">Resumen de Inversión</p>
      </div>
    </div>
    {groupedOptions['LICENSE'] && (
      <div className="space-y-4">
        <h4 className="text-brand-red font-black text-[10px] uppercase tracking-[0.3em]">Derechos Comerciales</h4>
        <div className="grid grid-cols-1 gap-2">
          <OptionPill
            label="Uso Personal (Por defecto)"
            value=""
            isSelected={!multiSelections['LICENSE'] || multiSelections['LICENSE'].length === 0}
            onClick={() => setMultiSelections((p: any) => ({ ...p, LICENSE: [] }))}
          />
          {groupedOptions['LICENSE'].map((opt: any) => (
            <OptionPill
              key={opt.label}
              {...opt}
              isSelected={multiSelections['LICENSE']?.includes(opt.label)}
              onClick={() => setMultiSelections((p: any) => ({ ...p, LICENSE: [opt.label] }))}
            />
          ))}
        </div>
      </div>
    )}
    <div className="bg-white rounded-3xl p-6 text-black space-y-3 shadow-xl">
      <div className="flex justify-between font-black text-[10px] uppercase text-black/40 border-b border-black/5 pb-2">
        <span>Concepto</span>
        <span>Precio</span>
      </div>
      <div className="flex justify-between items-center py-1">
        <span className="font-bold text-xs uppercase italic">
          {baseSelection?.tier} ({baseSelection?.description})
        </span>
        <span className="font-mono font-bold text-xs">${total.base}</span>
      </div>
      {Object.entries(selections).map(([cat, label]: any) => {
        const opt = groupedOptions[cat]?.find((o: any) => o.label === label);
        if (!opt || opt.value === '$0' || opt.value === '0%') return null;
        return (
          <div key={cat} className="flex justify-between items-center py-1 border-t border-black/5">
            <span className="text-[11px] font-bold uppercase text-black/60">
              {cat}: {label}
            </span>
            <span className="font-mono font-bold text-xs">+{opt.value}</span>
          </div>
        );
      })}
      {Object.entries(multiSelections).map(([cat, labels]: any) =>
        labels.map((label: string) => {
          const opt = groupedOptions[cat]?.find((o: any) => o.label === label);
          if (!opt || opt.value === '$0' || opt.value === '0%') return null;
          return (
            <div key={label} className="flex justify-between items-center py-1 border-t border-black/5">
              <span className="text-[11px] font-bold uppercase text-black/60">
                {cat}: {label}
              </span>
              <span className="font-mono font-bold text-xs">+{opt.value}</span>
            </div>
          );
        }),
      )}
      {extraChars > 1 && (
        <div className="flex justify-between items-center py-1 border-t border-black/5">
          <span className="text-[11px] font-bold uppercase text-black/60">Mult. Personajes ({extraChars})</span>
          <span className="font-mono font-bold text-xs">x1.75</span>
        </div>
      )}
      <div className="flex justify-between items-center py-1 border-t-2 border-dashed border-black/10 text-black/40">
        <span className="text-[10px] font-bold uppercase tracking-widest">PayPal Fees</span>
        <span className="font-mono font-bold text-xs">${total.fees}</span>
      </div>
      <div className="flex justify-between items-center pt-4 border-t-2 border-black">
        <span className="font-black uppercase italic text-lg">Total a Pagar</span>
        <span className="text-brand-red font-black text-3xl italic tracking-tighter">${total.gross}</span>
      </div>
    </div>
  </div>
);
