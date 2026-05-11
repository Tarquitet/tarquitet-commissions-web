// src/components/GlobalModal.tsx
import { useEffect } from 'react';

interface GlobalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function GlobalModal({ isOpen, onClose, title, children }: GlobalModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-[#050000] border border-brand-red/30 rounded-xl max-w-md w-full p-8 relative shadow-[0_0_40px_rgba(220,38,38,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-red/50 hover:text-brand-red transition-colors"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter mb-4 border-b border-brand-red/20 pb-4">
          {title}
        </h3>

        <div className="text-brand-light/80 font-mono text-sm leading-relaxed">{children}</div>

        <button
          onClick={onClose}
          className="mt-8 w-full bg-brand-red/10 border border-brand-red text-brand-red font-mono text-xs uppercase tracking-widest py-3 hover:bg-brand-red hover:text-black transition-all"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
