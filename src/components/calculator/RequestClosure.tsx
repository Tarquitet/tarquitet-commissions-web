// src/components/calculator/RequestClosure.tsx
import React from 'react';
import { paymentMethods } from '../../data/payments';

export default function RequestClosure({ logic, generatedText, handleCopy }: any) {
  // Buscamos la info completa del método seleccionado
  const selectedPayment = paymentMethods.find((p) => p.name === logic.paymentMethod);

  return (
    <section className="bg-white/5 border border-brand-red/20 rounded-4xl p-8 md:p-12 mt-4">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-brand-red text-2xl font-black italic">!</span>
        <h2 className="text-white font-black text-3xl uppercase italic tracking-tighter leading-none">
          Request Closure
        </h2>
      </div>

      <div className="mb-10">
        <h4 className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-4 text-white/60">
          Preferred payment method:
        </h4>

        {/* BOTONES CON IMÁGENES */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.name}
              onClick={() => logic.setPaymentMethod(method.name)}
              title={method.name}
              className={`p-3 h-16 rounded-xl border-2 transition-all duration-300 flex items-center justify-center bg-white/5 ${
                logic.paymentMethod === method.name
                  ? 'border-brand-red shadow-[0_0_15px_rgba(220,38,38,0.4)] opacity-100 scale-105'
                  : 'border-white/10 hover:border-white/30 opacity-50 hover:opacity-100 grayscale hover:grayscale-0'
              }`}
            >
              <img src={method.icon} alt={method.name} className="h-full w-full object-contain" />
            </button>
          ))}
        </div>

        {/* CAJA DE ADVERTENCIAS Y MENSAJES DINÁMICOS */}
        {selectedPayment?.message && (
          <div
            className={`mt-4 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 ${
              selectedPayment.isWarning ? 'bg-brand-red/10 border-brand-red/20' : 'bg-white/5 border-white/10'
            }`}
          >
            <p
              className={`font-mono text-[10px] sm:text-xs leading-relaxed ${
                selectedPayment.isWarning ? 'text-brand-red uppercase' : 'text-white/70'
              }`}
            >
              {selectedPayment.isWarning ? '⚠️ ' : '💬 '}
              <span className="font-black">{selectedPayment.name}:</span> {selectedPayment.message}
            </p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h4 className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-4 text-white/60">
          Summary to copy:
        </h4>
        <textarea
          readOnly
          value={generatedText}
          className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-[11px] text-brand-light/40 resize-none focus:outline-none scrollbar-thin scrollbar-thumb-brand-red/20"
        />
      </div>

      <div className="p-6 bg-black/40 border border-white/10 rounded-2xl mb-8">
        <label className="flex items-center gap-4 cursor-pointer group">
          <input
            type="checkbox"
            checked={logic.isConfirmed}
            onChange={(e) => logic.setIsConfirmed(e.target.checked)}
            className="w-6 h-6 accent-brand-red bg-black border-white/20 rounded cursor-pointer shrink-0"
          />
          <span className="text-white/60 text-xs md:text-sm group-hover:text-white transition-colors font-mono leading-snug">
            I have reviewed the summary and accept the{' '}
            <a
              href="/#tos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-red font-bold underline hover:text-white transition-colors"
            >
              T.O.S
            </a>
            .
          </span>
        </label>
      </div>

      <button
        onClick={handleCopy}
        disabled={!logic.baseSelection}
        className="w-full bg-white/10 hover:bg-white/20 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 border border-white/10 group disabled:opacity-20"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          className="group-hover:rotate-12 transition-transform"
        >
          <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        Copy Data for Direct Contact
      </button>
    </section>
  );
}
