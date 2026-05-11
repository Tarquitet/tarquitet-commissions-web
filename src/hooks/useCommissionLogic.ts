import { useState, useMemo } from 'react';
import type { PricingTier, CalcOption, YCHPiece } from '../data/sheets';

export const useCommissionLogic = (prices: PricingTier[], config: CalcOption[]) => {
  const [step, setStep] = useState(1);
  const [baseSelection, setBaseSelection] = useState<PricingTier | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [multiSelections, setMultiSelections] = useState<Record<string, string[]>>({});
  const [extraChars, setExtraChars] = useState(1);

  // AQUÍ ESTABA EL ERROR: Faltaban los estados del YCH
  const [ychSelection, setYchSelection] = useState<YCHPiece | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const groupedOptions = useMemo(() => {
    return config.reduce(
      (acc, item) => {
        let cat = item.category?.toUpperCase().trim() || 'EXTRA';
        if (cat === 'LICENCIA' || cat === 'LICENSES' || cat === 'LICENCE') cat = 'LICENSE';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
      },
      {} as Record<string, CalcOption[]>,
    );
  }, [config]);

  const parseValue = (val: string) => {
    const isPercent = val.includes('%');
    const num = parseFloat(val.replace('$', '').replace('%', '').trim()) || 0;
    return { num, isPercent };
  };

  const total = useMemo(() => {
    let subtotal = baseSelection ? parseFloat(baseSelection.discount_price.replace('$', '') || '0') : 0;

    // Sumamos el precio del YCH si elige uno
    if (ychSelection && ychSelection.price) {
      subtotal += parseFloat(ychSelection.price.replace('$', '') || '0');
    }

    let multiplier = 1;

    Object.entries(selections).forEach(([cat, label]) => {
      const opt = groupedOptions[cat]?.find((o) => o.label === label);
      if (opt) {
        const { num, isPercent } = parseValue(opt.value);
        if (isPercent) multiplier += num / 100;
        else subtotal += num;
      }
    });

    Object.entries(multiSelections).forEach(([cat, labels]) => {
      labels.forEach((label) => {
        const opt = groupedOptions[cat]?.find((o) => o.label === label);
        if (opt) {
          const { num, isPercent } = parseValue(opt.value);
          if (isPercent) multiplier += num / 100;
          else subtotal += num;
        }
      });
    });

    const charMultiplier = extraChars > 1 ? 1 + 0.75 * (extraChars - 1) : 1;
    const net = subtotal * multiplier * charMultiplier;

    let gross = net;
    let fees = 0;
    if (net > 0 && paymentMethod === 'PayPal') {
      gross = (net + 0.3) / 0.946;
      fees = gross - net;
    }

    return {
      net: net.toFixed(2),
      gross: gross.toFixed(2),
      fees: fees.toFixed(2),
      base: subtotal.toFixed(2),
    };
  }, [baseSelection, ychSelection, selections, multiSelections, extraChars, paymentMethod, groupedOptions]);

  // Asegurándonos de exportar TODO lo que el modal necesita
  return {
    step,
    setStep,
    baseSelection,
    setBaseSelection,
    selections,
    setSelections,
    multiSelections,
    setMultiSelections,
    extraChars,
    setExtraChars,
    ychSelection,
    setYchSelection,
    paymentMethod,
    setPaymentMethod,
    total,
    groupedOptions,
  };
};
