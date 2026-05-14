// src/components/calculator/MobileFloatingButton.tsx
import React from 'react';

export default function MobileFloatingButton({ isTicketOpen, setIsTicketOpen, grossTotal }: any) {
  return (
    <div className="lg:hidden fixed bottom-6 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
      <button
        onClick={() => setIsTicketOpen(!isTicketOpen)}
        className="pointer-events-auto bg-brand-red text-black w-full max-w-sm py-4 rounded-full font-black uppercase italic shadow-[0_10px_30px_rgba(220,38,38,0.4)] flex items-center justify-between px-6 transition-transform active:scale-95 border-2 border-[#ff4d4d]"
      >
        <span className="text-xs tracking-widest opacity-80">{isTicketOpen ? 'CERRAR TICKET' : 'VER PRESUPUESTO'}</span>
        <span className="text-xl tracking-tighter">${grossTotal}</span>
      </button>
    </div>
  );
}
