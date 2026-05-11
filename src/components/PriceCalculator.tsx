import { useState } from 'react';
// Importa el modal (si lo tienes en otro archivo) o defínelo aquí mismo abajo
import CommissionModal from './CommissionModal';

export default function PriceCalculator() {
  // Este componente NO recibe props, por eso el error en index.astro desaparecerá
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center py-10">
        <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] mb-4">
          ¿Tienes una idea? Calcula el costo aproximado aquí:
        </p>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#8a0e0e] hover:bg-brand-red text-white px-12 py-4 rounded-xl font-black text-xl uppercase italic transition-all duration-300 shadow-[0_0_20px_rgba(138,14,14,0.3)] border border-white/10 active:scale-95"
        >
          Configurar Pedido
        </button>
      </div>

      {/* Aquí es donde se pasan las props que TypeScript reclamaba */}
      <CommissionModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
