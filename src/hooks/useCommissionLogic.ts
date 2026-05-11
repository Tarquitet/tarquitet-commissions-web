import { useState, useMemo } from 'react';
import type { PricingTier, CalcOption, YCHPiece } from '../data/sheets';

export const useCommissionLogic = (prices: PricingTier[], config: CalcOption[]) => {
  // 1. ESTADOS
  const [step, setStep] = useState(1);
  const [baseSelection, setBaseSelection] = useState<PricingTier | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [multiSelections, setMultiSelections] = useState<Record<string, string[]>>({});
  const [extraChars, setExtraChars] = useState(1);
  const [ychSelection, setYchSelection] = useState<YCHPiece | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  // 2. REGLA DEL FULLCOLOR (Detectamos si la base elegida es Fullcolor)
  const isFullcolor = useMemo(() => {
    if (!baseSelection) return false;
    const searchStr = `${baseSelection.tier} ${baseSelection.description}`.toLowerCase();
    return searchStr.includes('fullcolor') || searchStr.includes('full color');
  }, [baseSelection]);

  // 3. AGRUPAR OPCIONES (Con traductor de plurals)
  const groupedOptions = useMemo(() => {
    return config.reduce(
      (acc, item) => {
        let cat = item.category?.toUpperCase().trim() || 'EXTRA';

        // Estandarización de nombres
        if (cat === 'LICENCIA' || cat === 'LICENSES' || cat === 'LICENCE') cat = 'LICENSE';
        if (cat === 'LIGHTS' || cat === 'LUCES') cat = 'LIGHT';
        if (cat === 'SHADOWS' || cat === 'SOMBRAS') cat = 'SHADOW';

        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
      },
      {} as Record<string, CalcOption[]>,
    );
  }, [config]);

  // 4. PARSER DE VALORES ($ o %)
  const parseValue = (val: string) => {
    const isPercent = val.includes('%');
    const num = parseFloat(val.replace('$', '').replace('%', '').trim()) || 0;
    return { num, isPercent };
  };

  // 5. EL MOTOR MATEMÁTICO
  const total = useMemo(() => {
    let subtotal = baseSelection ? parseFloat(baseSelection.discount_price.replace('$', '') || '0') : 0;

    // Sumar YCH
    if (ychSelection && ychSelection.price) {
      subtotal += parseFloat(ychSelection.price.replace('$', '') || '0');
    }

    let multiplier = 1;

    // Sumar selecciones simples
    Object.entries(selections).forEach(([cat, label]) => {
      if (isFullcolor && (cat === 'SHADOW' || cat === 'LIGHT')) return;

      const opt = groupedOptions[cat]?.find((o) => o.label === label);
      if (opt) {
        const { num, isPercent } = parseValue(opt.value);
        if (isPercent) multiplier += num / 100;
        else subtotal += num;
      }
    });

    // Sumar selecciones múltiples (PSD, Licencias)
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

    // Multiplicador de Personajes dinámico (Lee desde Excel)
    const charsConfig = groupedOptions['CHARACTERS']?.[0];
    const charPercentage = charsConfig ? parseFloat(charsConfig.value.replace('%', '')) / 100 : 0.75;
    const charMultiplier = extraChars > 1 ? 1 + charPercentage * (extraChars - 1) : 1;

    // Neto antes de fees
    const net = subtotal * multiplier * charMultiplier;

    // Cálculo real de PayPal
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
  }, [
    baseSelection,
    ychSelection,
    selections,
    multiSelections,
    extraChars,
    paymentMethod,
    groupedOptions,
    isFullcolor,
  ]);

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
    isFullcolor,
  };
};
