import { useState, useMemo } from 'react';
import type { CalcOption, PricingTier } from '../data/sheets';

export const useCommissionLogic = (prices: PricingTier[], config: CalcOption[]) => {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [multiSelections, setMultiSelections] = useState<Record<string, string[]>>({});
  const [extraChars, setExtraChars] = useState(1);

  // Agrupador dinámico
  const groupedOptions = useMemo(() => {
    return config.reduce(
      (acc, item) => {
        const cat = item.category.toUpperCase();
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
      },
      {} as Record<string, CalcOption[]>,
    );
  }, [config]);

  // EL MOTOR DE CÁLCULO
  const total = useMemo(() => {
    // 1. Base (Finish + Body)
    const finish = selections['FINISH'] || 'FullColor';
    const body = selections['BODY'] || 'Fullbody';
    const baseMatch = prices.find((p) => p.tier === body && p.description === finish);
    let subtotal = parseFloat(baseMatch?.discount_price.replace('$', '') || '0');

    let multiplier = 1;

    // 2. Procesar selecciones únicas ($ y %)
    Object.entries(selections).forEach(([cat, label]) => {
      if (cat === 'FINISH' || cat === 'BODY') return;
      const opt = groupedOptions[cat]?.find((o) => o.label === label);
      if (!opt) return;

      const val = parseFloat(opt.value);
      if (opt.type === '%') multiplier += val / 100;
      else subtotal += val;
    });

    // 3. Procesar selecciones múltiples (PSD, Licencias)
    Object.entries(multiSelections).forEach(([cat, labels]) => {
      labels.forEach((label) => {
        const opt = groupedOptions[cat]?.find((o) => o.label === label);
        if (!opt) return;
        const val = parseFloat(opt.value);
        if (opt.type === '%') multiplier += val / 100;
        else subtotal += val;
      });
    });

    const net = subtotal * multiplier * (extraChars > 1 ? 1 + 0.75 * (extraChars - 1) : 1);
    const gross = (net + 0.3) / 0.946; // PayPal Fee

    return {
      net: net.toFixed(2),
      gross: gross.toFixed(2),
      fees: (gross - net).toFixed(2),
    };
  }, [selections, multiSelections, extraChars, prices, groupedOptions]);

  return {
    step,
    setStep,
    selections,
    setSelections,
    multiSelections,
    setMultiSelections,
    extraChars,
    setExtraChars,
    total,
    groupedOptions,
  };
};
