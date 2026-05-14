import { useState, useMemo, useEffect } from 'react';
import type { PricingTier, CalcOption, YCHPiece } from '../data/sheets';
import { paymentMethods } from '../data/payments';

export const useCommissionLogic = (prices: PricingTier[], config: CalcOption[]) => {
  // 1. ESTADOS
  const [step, setStep] = useState(1);
  const [baseSelection, setBaseSelection] = useState<PricingTier | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [multiSelections, setMultiSelections] = useState<Record<string, string[]>>({});
  const [extraChars, setExtraChars] = useState(1);
  const [ychSelection, setYchSelection] = useState<YCHPiece | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [isConfirmed, setIsConfirmed] = useState(false);

  // MAGIA YCH: Ajuste automático de base y personajes
  useEffect(() => {
    if (ychSelection) {
      // 1. AUTO-SELECCIÓN DE ENCUADRE
      if (ychSelection.body_type && prices.length > 0) {
        // ✨ NORMALIZADOR: Borra espacios y pone minúsculas a todo.
        const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '');

        const currentStyle = baseSelection ? baseSelection.tier : prices[0]?.tier;

        // Ahora comparamos usando el normalizador
        const matchingBase = prices.find(
          (p) => normalize(p.description) === normalize(ychSelection.body_type) && p.tier === currentStyle,
        );

        if (matchingBase && (!baseSelection || baseSelection.description !== matchingBase.description)) {
          setBaseSelection(matchingBase);
        }
      }

      // 2. AUTO-AJUSTE DE PERSONAJES
      const chars = parseInt(ychSelection.num_chars || '1', 10);
      if (!isNaN(chars) && chars > 0) {
        setExtraChars(chars);
      } else {
        setExtraChars(1);
      }
    } else {
      setExtraChars(1);
    }
  }, [ychSelection, prices, baseSelection]);

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
    let gross = net;
    let fees = 0;

    if (net > 0) {
      // Buscamos el método seleccionado dentro de TU lista única
      const methodData = paymentMethods.find((m) => m.name === paymentMethod) || paymentMethods[0];

      if (methodData.name === 'Artistree') {
        gross = net * (1 + methodData.percentage);
      } else {
        // Fórmula universal usando los datos de TU lista
        gross = (net + methodData.fixed) / (1 - methodData.percentage);
      }
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
    isConfirmed,
    setIsConfirmed,
    total,
    groupedOptions,
    isFullcolor,
  };
};
