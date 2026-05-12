import { GOOGLE_FORM_URL } from '../data/sheets';

export default function PriceCalculator() {
  return (
    <div className="flex flex-col items-center py-12 border-t border-brand-red/20 mt-16 px-4">
      {/* TEXTO INTRODUCTORIO */}
      <div className="text-center mb-8">
        <h3 className="text-white font-black text-3xl md:text-4xl uppercase italic tracking-tighter mb-2">
          Start your <span className="text-brand-red">Commission</span>
        </h3>
        <p className="text-brand-light/40 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] max-w-xl mx-auto">
          Configure your order step by step to get an exact quote, or go directly to the form if you already have your
          idea clear.
        </p>
      </div>

      {/* CONTENEDOR DE BOTONES */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 md:gap-6 w-full max-w-4xl">
        {/* BOTÓN CALCULADORA*/}
        <a
          href="/calculator"
          className="group flex-1 bg-gradient-to-br from-[#9c1111] to-[#5a0505] hover:from-brand-red hover:to-[#9c1111] text-white px-6 py-6 md:py-8 rounded-2xl border border-brand-red/50 transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.25)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] active:scale-95 flex flex-col items-center justify-center gap-2 text-center"
        >
          <span className="font-black text-2xl md:text-3xl uppercase italic tracking-tighter leading-none group-hover:scale-105 transition-transform">
            Price Calculator
          </span>
        </a>
      </div>
    </div>
  );
}
