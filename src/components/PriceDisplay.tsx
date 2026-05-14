import React from 'react';
import { useDiscount } from '../utils/useDiscount';

interface PriceDisplayProps {
  originalPrice: number | string;
  className?: string; // Para que puedas cambiarle el tamaño donde lo uses
}

export default function PriceDisplay({ originalPrice, className = 'text-2xl' }: PriceDisplayProps) {
  const { isPromoActive, calculate } = useDiscount();

  // Limpiamos el precio por si viene con el símbolo "$" del Sheets
  const numericPrice =
    typeof originalPrice === 'string' ? parseFloat(originalPrice.replace(/[^0-9.]/g, '')) : originalPrice;

  const finalPrice = calculate(numericPrice).toFixed(2);

  // Si no hay promo, solo mostramos el precio normal
  if (!isPromoActive) {
    return (
      <span className={`text-white font-black drop-shadow-md ${className}`}>
        {numericPrice} <span className="text-brand-red font-mono text-[0.4em] align-top uppercase">USD</span>
      </span>
    );
  }

  // Si HAY promo, mostramos el tachado Frutiger Aero
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <span className="text-brand-red/40 font-black italic text-[0.8em]">{numericPrice}</span>
        <div className="absolute top-1/2 left-[-10%] w-[120%] h-[2px] bg-brand-red -rotate-12 transform -translate-y-1/2 shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
      </div>

      <span className={`text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] ${className}`}>
        {finalPrice} <span className="text-brand-red font-mono text-[0.4em] align-top uppercase">USD</span>
      </span>
    </div>
  );
}
