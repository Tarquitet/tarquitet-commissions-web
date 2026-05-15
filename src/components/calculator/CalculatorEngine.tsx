// src/components/calculator/CalculatorEngine.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  getSheetPrices,
  getCalculatorConfig,
  getSheetYCH,
  type PricingTier,
  type CalcOption,
  type YCHPiece,
} from '../../data/sheets';
import { useCommissionLogic } from '../../hooks/useCommissionLogic';
import { generateTicketSummary } from '../../utils/ticketBuilder';
import GlobalModal from '../GlobalModal';
import { useDiscount } from '../../utils/useDiscount';

// Pasos de la calculadora
import Step1Base from './steps/1_Base';
import StepExtraChars from './steps/8_ExtraChars';
import Step2Shadows from './steps/2_Shadows';
import Step3Lights from './steps/3_Lights';
import Step4Backgrounds from './steps/4_Backgrounds';
import Step5YCH from './steps/5_YCH';
import Step6PSD from './steps/6_PSD';
import Step7Licenses from './steps/7_Licenses';

// Componentes modulares extraídos
import TicketSummary from './TicketSummary';
import MobileFloatingButton from './MobileFloatingButton';
import RequestClosure from './RequestClosure';

const FORM_SECTIONS = [
  { id: 'ych', title: 'Poses and Structure' }, // 1. YCH Primero
  { id: 'base', title: 'Commission Base' }, // 2. Tabla de Precios
  { id: 'chars', title: 'Characters' },
  { id: 'shadows', title: 'Shadow Phase' },
  { id: 'lights', title: 'Lighting' },
  { id: 'bg', title: 'Environment / Background' },
  { id: 'psd', title: 'PSD Deliverables' },
  { id: 'license', title: 'Licenses' },
];

export default function CalculatorEngine() {
  const [prices, setPrices] = useState<PricingTier[]>([]);
  const [config, setConfig] = useState<CalcOption[]>([]);
  const [ychData, setYchData] = useState<YCHPiece[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  // Carga de datos inicial
  useEffect(() => {
    Promise.all([getSheetPrices(), getCalculatorConfig(), getSheetYCH()]).then(([p, c, y]) => {
      setPrices(p);
      setConfig(c);
      setYchData(y);
      setIsLoading(false);
    });
  }, []);

  // Hook principal de lógica
  const logic = useCommissionLogic(prices, config);

  // Hook de descuento (agregado)
  const { isPromoActive, percentage, calculate } = useDiscount();

  // Generación del resumen usando tu ticketBuilder correctamente
  const generatedText = useMemo(() => {
    const discountedTotal = calculate(parseFloat(logic.total.gross));

    return generateTicketSummary(logic, {
      isPromoActive,
      percentage,
      discountedTotal,
    });
  }, [logic, isPromoActive, percentage, calculate]);

  const handleCopy = () => {
    if (!logic.baseSelection) return;
    navigator.clipboard.writeText(generatedText);
    setIsCopyModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-brand-red font-mono animate-pulse">
        <div className="text-2xl font-black uppercase tracking-[0.5em] mb-4 text-white">STARTING_SYSTEM</div>
        <div className="text-xs text-brand-red/50 text-center uppercase tracking-widest font-bold">
          Synchronizing database...
        </div>
      </div>
    );
  }

  const activeSections = FORM_SECTIONS.filter((s) => s.id !== 'ych' || ychData.length > 0);

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start relative pb-32">
      {/* COLUMNA IZQUIERDA: ACORDEONES DEL FORMULARIO */}
      <div className="w-full lg:w-[70%] flex flex-col gap-6">
        {activeSections.map((section, idx) => {
          const stepNum = idx + 1;
          const isDefaultOpen = idx === 0;

          return (
            <details
              key={section.id}
              id={section.id}
              className="group scroll-mt-32 bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
              open={isDefaultOpen}
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="bg-brand-red text-black font-black italic px-3 py-1 rounded-sm text-sm shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                    {stepNum.toString().padStart(2, '0')}
                  </span>
                  <h2 className="text-white font-black text-xl sm:text-3xl uppercase italic tracking-tighter group-hover:text-brand-red transition-colors">
                    {section.title}
                  </h2>
                </div>
                <svg
                  className="w-6 h-6 text-white/40 transform transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>

              <div className="p-6 pt-0 border-t border-white/5 mt-4">
                {section.id === 'ych' && (
                  <Step5YCH
                    ychData={ychData}
                    ychSelection={logic.ychSelection}
                    setYchSelection={logic.setYchSelection}
                  />
                )}

                {section.id === 'base' && (
                  <Step1Base
                    prices={prices}
                    baseSelection={logic.baseSelection}
                    setBaseSelection={logic.setBaseSelection}
                    ychSelection={logic.ychSelection}
                  />
                )}

                {section.id === 'chars' && (
                  <StepExtraChars
                    extraChars={logic.extraChars}
                    setExtraChars={logic.setExtraChars}
                    charsConfig={logic.groupedOptions['CHARACTERS']?.[0]}
                  />
                )}

                {section.id === 'shadows' && (
                  <div
                    className={`transition-all duration-700 ${logic.isFullcolor ? 'opacity-20 grayscale pointer-events-none' : ''}`}
                  >
                    <Step2Shadows
                      groupedOptions={logic.groupedOptions}
                      selections={logic.selections}
                      setSelections={logic.setSelections}
                    />
                  </div>
                )}

                {section.id === 'lights' && (
                  <div
                    className={`transition-all duration-700 ${logic.isFullcolor ? 'opacity-20 grayscale pointer-events-none' : ''}`}
                  >
                    <Step3Lights
                      options={logic.groupedOptions['LIGHT'] || []}
                      selections={logic.selections}
                      setSelections={logic.setSelections}
                    />
                  </div>
                )}

                {section.id === 'bg' && (
                  <Step4Backgrounds
                    groupedOptions={logic.groupedOptions}
                    selections={logic.selections}
                    setSelections={logic.setSelections}
                  />
                )}

                {section.id === 'psd' && (
                  <Step6PSD
                    groupedOptions={logic.groupedOptions}
                    multiSelections={logic.multiSelections}
                    setMultiSelections={logic.setMultiSelections}
                  />
                )}

                {section.id === 'license' && (
                  <Step7Licenses
                    groupedOptions={logic.groupedOptions}
                    multiSelections={logic.multiSelections}
                    setMultiSelections={logic.setMultiSelections}
                  />
                )}
              </div>
            </details>
          );
        })}

        {/* Sección de Cierre de Pedido */}
        <RequestClosure logic={logic} generatedText={generatedText} handleCopy={handleCopy} />
      </div>

      {/* COLUMNA DERECHA: TICKET SUMMARY (STICKY) */}
      <TicketSummary
        logic={logic}
        isTicketOpen={isTicketOpen}
        setIsTicketOpen={setIsTicketOpen}
        handleCopy={handleCopy}
      />

      {/* MODAL GLOBAL */}
      <GlobalModal isOpen={isCopyModalOpen} onClose={() => setIsCopyModalOpen(false)} title="Copy Protocol">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-brand-red/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-red/40">
            <span className="text-brand-red text-2xl">✓</span>
          </div>
          <p className="text-white font-black text-xl mb-2 italic uppercase">Data Copied!</p>
          <p className="text-white/40 text-sm font-mono italic">
            The summary is in your clipboard. You can paste it wherever you prefer.
          </p>
        </div>
      </GlobalModal>

      {/* COMPONENTE FLOTANTE PARA MÓVIL */}
      <MobileFloatingButton
        isTicketOpen={isTicketOpen}
        setIsTicketOpen={setIsTicketOpen}
        grossTotal={logic.total.gross}
      />
    </div>
  );
}
