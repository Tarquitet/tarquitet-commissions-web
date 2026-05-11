import { GOOGLE_FORM_URL } from '../data/sheets';

export default function PriceCalculator() {
  return (
    <div className="flex flex-col items-center py-12 border-t border-brand-red/20 mt-16 px-4">
      {/* TEXTO INTRODUCTORIO */}
      <div className="text-center mb-8">
        <h3 className="text-white font-black text-3xl md:text-4xl uppercase italic tracking-tighter mb-2">
          Inicia tu <span className="text-brand-red">Comisión</span>
        </h3>
        <p className="text-brand-light/40 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] max-w-xl mx-auto">
          Configura tu pedido paso a paso para obtener un presupuesto exacto, o ve directo al formulario si ya tienes tu
          idea clara.
        </p>
      </div>

      {/* CONTENEDOR DE BOTONES */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 md:gap-6 w-full max-w-4xl">
        {/* BOTÓN 1: CALCULADORA (Ahora es un enlace web normal) */}
        <a
          href="/calculator"
          className="group flex-1 bg-gradient-to-br from-[#9c1111] to-[#5a0505] hover:from-brand-red hover:to-[#9c1111] text-white px-6 py-6 md:py-8 rounded-2xl border border-brand-red/50 transition-all duration-300 shadow-[0_0_30px_rgba(220,38,38,0.25)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] active:scale-95 flex flex-col items-center justify-center gap-2 text-center"
        >
          <span className="font-black text-2xl md:text-3xl uppercase italic tracking-tighter leading-none group-hover:scale-105 transition-transform">
            Calculadora de Precios
          </span>
          <span className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase opacity-60">
            Presupuesto Interactivo
          </span>
        </a>

        {/* BOTÓN 2: GOOGLE FORMS DIRECTO (Se queda igual) */}
        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex-1 bg-[#050000] hover:bg-[#0a0000] text-white border-2 border-brand-red/30 hover:border-brand-red px-6 py-6 md:py-8 rounded-2xl transition-all duration-300 shadow-lg active:scale-95 flex flex-col items-center justify-center gap-2 text-center"
        >
          <span className="font-black text-xl md:text-2xl uppercase italic tracking-tighter leading-none text-brand-light/80 group-hover:text-white transition-colors flex items-center justify-center gap-2">
            Ir al Formulario Directo
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="group-hover:translate-x-1 transition-transform text-brand-red"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
          <span className="text-[9px] md:text-[10px] font-mono tracking-[0.2em] uppercase text-brand-red/50">
            Formulario de Google
          </span>
        </a>
      </div>
    </div>
  );
}
