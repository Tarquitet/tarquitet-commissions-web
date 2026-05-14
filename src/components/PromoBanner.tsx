import React, { useState, useEffect } from 'react';
import { getDiscountConfig, type DiscountConfig } from '../data/sheets';

export default function PromoBanner() {
  const [config, setConfig] = useState<DiscountConfig | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    getDiscountConfig().then(setConfig);
  }, []);

  useEffect(() => {
    if (!config?.isActive || !config.endDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(config.endDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setIsExpired(true);
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const fH = hours.toString().padStart(2, '0');
      const fM = mins.toString().padStart(2, '0');
      const fS = secs.toString().padStart(2, '0');

      setTimeLeft(`${days}D : ${fH}H : ${fM}M : ${fS}S`);
    }, 1000);

    return () => clearInterval(timer);
  }, [config]);

  // Si E2 es "NO", o M2 está vacío, NO se muestra nada
  if (!config?.isActive || isExpired || !timeLeft) return null;

  return (
    // CAMBIO CLAVE AQUÍ: relative en lugar de absolute
    <div className="w-full px-4 pt-8 pb-2 relative z-40 flex justify-center">
      <div className="relative overflow-hidden rounded-3xl w-full max-w-5xl border border-white/40 bg-white/10 backdrop-blur-2xl shadow-[0_10px_40px_rgba(220,38,38,0.3),inset_0_2px_10px_rgba(255,255,255,0.4)]">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between p-4 md:px-10 relative z-10 gap-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-red to-red-900 border-2 border-white/50 flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.7)] animate-pulse">
              <span className="text-white font-black text-3xl italic drop-shadow-lg">%</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-white font-black uppercase italic tracking-tighter text-2xl leading-none drop-shadow-md">
                Limited Time Promo
              </h2>
              <p className="text-brand-red font-mono text-xs uppercase tracking-[0.2em] font-bold">
                System Offer: {config.percentage * 100}% Discount Applied
              </p>
            </div>
          </div>

          <div className="bg-black/40 border-2 border-white/20 px-8 py-3 rounded-2xl backdrop-blur-xl shadow-[inset_0_0_15px_rgba(0,0,0,0.4)]">
            <span className="text-white/50 font-mono text-[10px] uppercase tracking-[0.3em] block text-center mb-1">
              Expiration In
            </span>
            <span className="text-brand-red font-black font-mono text-2xl tracking-[0.15em] drop-shadow-[0_0_10px_rgba(220,38,38,1)]">
              {timeLeft}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
