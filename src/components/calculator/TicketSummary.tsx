// src/components/calculator/TicketSummary.tsx
import React from 'react';
import { GOOGLE_FORM_URL } from '../../data/sheets';
import { paymentMethods } from '../../data/payments';
import { useDiscount } from '../../utils/useDiscount'; // <-- IMPORTAMOS EL CEREBRO

export default function TicketSummary({ logic, isTicketOpen, setIsTicketOpen, handleCopy }: any) {
  const selectedPayment = paymentMethods.find((p) => p.name === logic.paymentMethod);
  const finalActionUrl = selectedPayment?.name === 'Artistree' ? selectedPayment.url : GOOGLE_FORM_URL;
  const buttonText = selectedPayment?.name === 'Artistree' ? 'Continue on Artistree' : 'Send via Google Form';

  // --- LÓGICA DE DESCUENTO EN EL TICKET ---
  const { isPromoActive, percentage, calculate } = useDiscount();
  const originalGross = parseFloat(logic.total.gross);
  const discountedGross = calculate(originalGross);

  return (
    <aside
      className={`w-full lg:w-[30%] lg:sticky lg:top-24 transition-all duration-500 z-30 ${
        isTicketOpen
          ? 'fixed inset-x-0 bottom-0 bg-black/95 backdrop-blur-xl h-[85vh] overflow-y-auto p-4 rounded-t-3xl border-t border-brand-red/50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]'
          : 'hidden lg:block'
      }`}
    >
      <div className="bg-[#0a0000] border border-brand-red/40 rounded-4xl p-6 sm:p-8 shadow-[0_0_50px_rgba(220,38,38,0.15)] flex flex-col relative">
        {isTicketOpen && (
          <button
            onClick={() => setIsTicketOpen(false)}
            className="absolute top-4 right-4 text-white/50 hover:text-white lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter">
            Ticket <span className="text-brand-red">Summary</span>
          </h3>
          <span className="text-[10px] font-mono text-white/20">#CALC_2026</span>
        </div>

        <div className="space-y-4 flex-1 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar pr-1">
          {/* El contenido interno del ticket (Base, Lights, BG, etc.) queda igual */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col max-w-[70%] text-white italic font-bold uppercase">
              <span className="truncate">{logic.baseSelection ? logic.baseSelection.tier : 'No Selection'}</span>
              <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Project Base</span>
            </div>
            <span className="font-mono font-bold text-brand-light text-sm">${logic.total.base}</span>
          </div>

          {/* ... Todos tus map de selecciones siguen aquí ... */}
          {logic.ychSelection && (
            <div className="flex justify-between items-center py-2 border-t border-white/5">
              <span className="text-[10px] font-bold uppercase text-white/50 italic">Base YCH</span>
              <span className="font-mono font-bold text-xs text-white">+{logic.ychSelection.price}</span>
            </div>
          )}

          {Object.entries(logic.selections).map(([cat, val]: any) => {
            if (logic.isFullcolor && (cat === 'SHADOW' || cat === 'LIGHT')) return null;
            const opt = logic.groupedOptions[cat]?.find((o: any) => o.label === val);
            if (!opt || opt.value === '$0' || opt.value === '0%') return null;
            return (
              <div
                key={cat}
                className="flex justify-between text-white/50 font-mono uppercase text-[9px] border-t border-white/5 pt-2"
              >
                <span>
                  {cat}: {val}
                </span>
                <span>+{opt.value}</span>
              </div>
            );
          })}

          {Object.entries(logic.multiSelections).map(([cat, labels]: any) =>
            labels.map((label: any) => {
              const opt = logic.groupedOptions[cat]?.find((o: any) => o.label === label);
              if (!opt || opt.value === '$0' || opt.value === '0%') return null;
              return (
                <div
                  key={label}
                  className="flex justify-between text-white/50 font-mono uppercase text-[9px] border-t border-white/5 pt-2"
                >
                  <span>
                    {cat}: {label}
                  </span>
                  <span>+{opt.value}</span>
                </div>
              );
            }),
          )}
        </div>

        {/* ZONA DEL TOTAL CON EL DESCUENTO APLICADO */}
        <div className="border-t-4 border-brand-red pt-6 mb-8 bg-linear-to-b from-brand-red/5 to-transparent p-4 rounded-b-xl relative">
          <div className="flex justify-between items-center mb-4 opacity-80 font-mono text-[10px] uppercase text-white">
            <span className="flex items-center gap-2">
              Fees{' '}
              {selectedPayment && <img src={selectedPayment.icon} alt="icon" className="h-3 grayscale opacity-50" />}
            </span>
            <span>${logic.total.fees}</span>
          </div>

          <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Estimated Total</p>

          {/* SI HAY DESCUENTO, MOSTRAMOS EL PRECIO VIEJO TACHADO */}
          {isPromoActive && (
            <div className="absolute top-10 right-4 text-brand-red/40 line-through text-2xl font-black italic">
              ${originalGross.toFixed(2)}
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-brand-red font-black text-5xl md:text-6xl italic tracking-tighter leading-none">
              ${discountedGross.toFixed(2)}
            </span>
            <span className="text-white font-black text-sm uppercase italic">USD</span>
          </div>

          {isPromoActive && (
            <p className="text-brand-red text-[9px] font-mono mt-2 uppercase tracking-widest animate-pulse">
              Promo: {percentage * 100}% Discount Applied
            </p>
          )}
        </div>

        {/* BOTÓN FINAL */}
        <a
          href={logic.baseSelection && logic.isConfirmed ? finalActionUrl : '#'}
          target={logic.baseSelection && logic.isConfirmed ? '_blank' : '_self'}
          rel="noopener noreferrer"
          onClick={(e) => {
            if (logic.baseSelection && logic.isConfirmed) {
              handleCopy();
            } else {
              e.preventDefault();
            }
          }}
          className={`w-full py-5 rounded-2xl font-black uppercase italic text-sm sm:text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
            !logic.baseSelection || !logic.isConfirmed
              ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10 opacity-50'
              : 'bg-[#9c1111] hover:bg-brand-red text-white border border-brand-red hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-95'
          }`}
        >
          {!logic.isConfirmed && logic.baseSelection ? 'Missing Confirmation' : buttonText}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className={!logic.baseSelection || !logic.isConfirmed ? 'opacity-10' : 'animate-bounce-x'}
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </aside>
  );
}
