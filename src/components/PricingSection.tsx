// src/components/PricingSection.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  getSheetArtworks,
  getSheetPrices,
  getSheetExtras,
  getSheetYCH,
  type ArtPiece,
  type PricingTier,
  type ExtraItem,
  type YCHPiece,
} from '../data/sheets';
import YCHSlider from './YCHSlider';
import PricingCarousel from './PricingCarousel';
import PricingExtrasMarquee from './PricingExtrasMarquee';

// IMPORTAMOS TUS DOS COMPONENTES
import PriceCalculator from './PriceCalculator';
import PaymentMethods from './PaymentMethods';

export default function PricingSection() {
  const [artworks, setArtworks] = useState<ArtPiece[]>([]);
  const [prices, setPrices] = useState<PricingTier[]>([]);
  const [extras, setExtras] = useState<ExtraItem[]>([]);
  const [ychData, setYchData] = useState<YCHPiece[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [artData, priceData, extrasData, ych] = await Promise.all([
        getSheetArtworks(),
        getSheetPrices(),
        getSheetExtras(),
        getSheetYCH(),
      ]);
      setArtworks(artData);
      setPrices(priceData);
      setExtras(extrasData);
      setYchData(ych);
      setLoading(false);
    }
    loadData();
  }, []);

  const groupedPrices = useMemo(() => {
    const groups: Record<string, PricingTier[]> = {};
    prices.forEach((p) => {
      const tierName = p.tier.toUpperCase();
      if (!groups[tierName]) groups[tierName] = [];
      groups[tierName].push(p);
    });
    return groups;
  }, [prices]);

  const tierExamples = useMemo(() => {
    const examples: Record<string, string> = {};
    Object.keys(groupedPrices).forEach((tierName) => {
      const matchingArt = artworks.filter((art) => art.category.toUpperCase() === tierName);
      if (matchingArt.length > 0) {
        const randomIndex = Math.floor(Math.random() * matchingArt.length);
        examples[tierName] = matchingArt[randomIndex].filename;
      }
    });
    return examples;
  }, [artworks, groupedPrices]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 border border-brand-red/10 bg-[#050000] rounded-2xl">
        <p className="text-brand-red/60 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">
          // Syncing Financial Base
        </p>
      </div>
    );
  }

  const tiers = Object.entries(groupedPrices);

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-16">
      {/* 1. PRECIOS BASE */}
      <PricingCarousel tiers={tiers} tierExamples={tierExamples} />

      {/* 2. EXTRAS (MARQUEE) */}
      <PricingExtrasMarquee extras={extras} />

      {/* 3. BOTÓN CALCULADORA (El tuyo, actualizado) */}
      <PriceCalculator />

      {/* 4. YCH SLIDER */}
      {ychData.length > 0 && (
        <div className="mt-8 mb-16">
          <div className="flex items-center gap-4 mb-6 px-4 md:px-8">
            <h3 className="text-white font-black text-3xl md:text-4xl uppercase italic tracking-tighter break-words">
              Poses / Y.C.H <span className="text-brand-red">Available</span>
            </h3>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-brand-red/50 to-transparent"></div>
          </div>
          <YCHSlider />
        </div>
      )}

      {/* ---> NUEVO: MEDIOS DE PAGO LIMPIOS <--- */}
      <div className="mt-24 pt-10 border-t border-brand-red/10 relative px-4 text-center">
        {/* CAMBIO: Etiqueta flotante más sutil y compacta */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050000] px-5">
          <span className="text-brand-red font-black text-xs md:text-lg italic uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">
            Accepted Methods
          </span>
        </div>

        {/* CAMBIO: Letrero rojo modificado a uno más claro, blanco, sin lo rojo de fondo, texto sutil */}
        <div className="mb-10 inline-block bg-black/40 border border-white/5 px-4 py-2 rounded-xl backdrop-blur-sm shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]">
          <p className="text-brand-light/60 font-mono text-[9px] md:text-xs uppercase tracking-[0.2em] font-normal flex items-center gap-2 justify-center">
            <span className="text-lg animate-pulse text-brand-red">⚠️</span>
            IMPORTANT: ONLY the following methods are valid for commission transactions
            <span className="text-lg animate-pulse text-brand-red">⚠️</span>
          </p>
        </div>

        {/* Renderiza tu componente de pagos */}
        <PaymentMethods />
      </div>
    </div>
  );
}
