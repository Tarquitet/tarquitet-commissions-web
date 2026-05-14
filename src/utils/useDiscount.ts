import { useState, useEffect } from 'react';
import { getDiscountConfig, type DiscountConfig } from '../data/sheets';

export function useDiscount() {
  const [config, setConfig] = useState<DiscountConfig | null>(null);
  const [isPromoActive, setIsPromoActive] = useState(false);

  useEffect(() => {
    getDiscountConfig().then((data) => {
      setConfig(data);

      // Comprobamos si está activo y si la fecha NO ha expirado
      if (data?.isActive && data.endDate) {
        const now = new Date().getTime();
        const end = new Date(data.endDate).getTime();
        setIsPromoActive(end - now > 0);
      } else {
        setIsPromoActive(false);
      }
    });
  }, []);

  const percentage = isPromoActive && config ? config.percentage : 0;

  // ESTA ES LA FUNCIÓN MÁGICA REUTILIZABLE
  const calculate = (originalPrice: number) => {
    if (!isPromoActive) return originalPrice;
    return originalPrice * (1 - percentage);
  };

  return {
    isPromoActive,
    percentage,
    calculate,
    config,
  };
}
