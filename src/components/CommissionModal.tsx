import React, { useState, useEffect } from 'react';
import {
  getSheetPrices,
  getCalculatorConfig,
  getSheetYCH,
  type PricingTier,
  type CalcOption,
  type YCHPiece,
} from '../data/sheets';
import { useCommissionLogic } from '../hooks/useCommissionLogic';

// Importamos todos los pasos limpios
import Step1Base from './calculator/steps/1_Base';
import Step2Shadows from './calculator/steps/2_Shadows';
import Step3Lights from './calculator/steps/3_Lights';
import Step4Backgrounds from './calculator/steps/4_Backgrounds';
import Step5YCH from './calculator/steps/5_YCH';
import Step6PSD from './calculator/steps/6_PSD';
import Step7Licenses from './calculator/steps/7_Licenses';
import Step8Summary from './calculator/steps/9_Summary';

export default function CommissionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [prices, setPrices] = useState<PricingTier[]>([]);
  const [config, setConfig] = useState<CalcOption[]>([]);
  const [ychData, setYchData] = useState<YCHPiece[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      Promise.all([getSheetPrices(), getCalculatorConfig(), getSheetYCH()]).then(([p, c, y]) => {
        setPrices(p);
        setConfig(c);
        setYchData(y);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  const logic = useCommissionLogic(prices, config);

  const wizardSteps = [
    <Step1Base
      key="step-1"
      prices={prices}
      baseSelection={logic.baseSelection}
      setBaseSelection={logic.setBaseSelection}
    />,
    <Step2Shadows
      key="step-2"
      groupedOptions={logic.groupedOptions}
      selections={logic.selections}
      setSelections={logic.setSelections}
    />,
    <Step3Lights
      key="step-3"
      options={logic.groupedOptions['LIGHT'] || []}
      selections={logic.selections}
      setSelections={logic.setSelections}
    />,
    <Step4Backgrounds
      key="step-4"
      groupedOptions={logic.groupedOptions}
      selections={logic.selections}
      setSelections={logic.setSelections}
    />,
    <Step5YCH
      key="step-5"
      ychData={ychData}
      ychSelection={logic.ychSelection}
      setYchSelection={logic.setYchSelection}
    />,
    <Step6PSD
      key="step-6"
      groupedOptions={logic.groupedOptions}
      multiSelections={logic.multiSelections}
      setMultiSelections={logic.setMultiSelections}
    />,
    <Step7Licenses
      key="step-7"
      groupedOptions={logic.groupedOptions}
      multiSelections={logic.multiSelections}
      setMultiSelections={logic.setMultiSelections}
    />,
    <Step8Summary
      key="step-8"
      total={logic.total}
      paymentMethod={logic.paymentMethod}
      setPaymentMethod={logic.setPaymentMethod}
    />,
  ];

  const totalSteps = wizardSteps.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#0a0000]/90 border border-brand-red/40 w-full max-w-4xl rounded-4xl overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(220,38,38,0.15)]">
        {/* PROGRESS BAR HEADER */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-linear-to-r from-brand-red/20 to-transparent shrink-0">
          <div className="flex gap-1.5 flex-1 mr-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 max-w-10 rounded-full transition-all duration-300 ${
                  logic.step >= i + 1 ? 'bg-brand-red shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-3xl transition-colors leading-none">
            ✕
          </button>
        </div>

        {/* CONTENT RENDERER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-brand-red font-mono animate-pulse">
              [ CARGANDO DATOS... ]
            </div>
          ) : (
            wizardSteps[logic.step - 1]
          )}
        </div>

        {/* FOOTER NAV */}
        <div className="p-6 bg-white border-t-4 border-brand-red flex justify-between items-end shrink-0">
          <div>
            <p className="text-black/40 font-black text-[10px] uppercase tracking-widest">Inversión Final</p>
            <div className="flex items-baseline gap-1">
              <span className="text-brand-red font-black text-4xl sm:text-5xl italic tracking-tighter leading-none">
                ${logic.total.gross}
              </span>
              <span className="text-black font-black text-sm uppercase italic">USD</span>
            </div>
          </div>

          <div className="flex gap-2">
            {logic.step > 1 && (
              <button
                onClick={() => logic.setStep((s) => s - 1)}
                className="px-4 py-3 sm:px-6 text-black font-black uppercase italic border-2 border-black/10 rounded-full hover:bg-black/5 transition-colors"
              >
                Atrás
              </button>
            )}
            {logic.step < totalSteps && (
              <button
                onClick={() => logic.setStep((s) => s + 1)}
                disabled={logic.step === 1 && !logic.baseSelection}
                className={`text-white px-6 py-3 sm:px-8 rounded-full font-black uppercase italic transition-all shadow-lg ${
                  logic.step === 1 && !logic.baseSelection
                    ? 'bg-black/20 text-white/30 cursor-not-allowed'
                    : 'bg-[#9c1111] hover:bg-brand-red active:scale-95'
                }`}
              >
                Siguiente
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
