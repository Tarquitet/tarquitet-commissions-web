import React from 'react';
import StepLayout from '../StepLayout';

export default function Step7Summary({ total, paymentMethod, setPaymentMethod }: any) {
  return (
    <StepLayout stepNumber={7} title="Resumen Final" subtitle="Revisa tu presupuesto estimado">
      <div className="bg-white rounded-[2rem] p-8 text-black shadow-2xl relative overflow-hidden mt-4">
        <div className="flex justify-between items-start mb-6 border-b border-black/5 pb-4">
          <div>
            <h3 className="font-black text-2xl sm:text-3xl uppercase italic leading-none">Presupuesto Estimado</h3>
            <p className="text-black/40 text-[10px] font-bold uppercase mt-1">Sujeto a cambios según complejidad</p>
          </div>
          <div className="text-right">
            <span className="text-brand-red font-black text-4xl sm:text-5xl italic tracking-tighter leading-none">
              ${total.gross}
            </span>
            <p className="text-black/40 text-[9px] font-black uppercase">Incluye Fees estimadas</p>
          </div>
        </div>

        <div className="space-y-4 mb-8 bg-black/5 p-4 rounded-2xl">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-black/60">
            Método de pago preferido (Aprox.)
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {['PayPal', 'Nequi', 'Kofi'].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-3 px-4 rounded-xl border-2 font-black text-xs uppercase transition-all ${
                  paymentMethod === method
                    ? 'bg-black text-white border-black shadow-lg'
                    : 'border-black/10 text-black/40 hover:border-black/30'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <a
          href="TU_ENLACE_DE_GOOGLE_FORMS_AQUI"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full bg-[#9c1111] hover:bg-brand-red text-white py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-xl active:scale-95 text-lg"
        >
          Llenar Formulario de Pedido
        </a>
      </div>
    </StepLayout>
  );
}
