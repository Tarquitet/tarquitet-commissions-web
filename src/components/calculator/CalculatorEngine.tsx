import React, { useState, useEffect, useMemo } from 'react';
import {
  getSheetPrices,
  getCalculatorConfig,
  getSheetYCH,
  GOOGLE_FORM_URL,
  type PricingTier,
  type CalcOption,
  type YCHPiece,
} from '../../data/sheets';
import { useCommissionLogic } from '../../hooks/useCommissionLogic';
import GlobalModal from '../GlobalModal';

// Pasos de la calculadora
import Step1Base from './steps/1_Base';
import StepExtraChars from './steps/8_ExtraChars';
import Step2Shadows from './steps/2_Shadows';
import Step3Lights from './steps/3_Lights';
import Step4Backgrounds from './steps/4_Backgrounds';
import Step5YCH from './steps/5_YCH';
import Step6PSD from './steps/6_PSD';
import Step7Licenses from './steps/7_Licenses';

const FORM_SECTIONS = [
  { id: 'base', title: 'Commission Base' },
  { id: 'chars', title: 'Characters' },
  { id: 'ych', title: 'Poses and Structure' },
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

  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([getSheetPrices(), getCalculatorConfig(), getSheetYCH()]).then(([p, c, y]) => {
      setPrices(p);
      setConfig(c);
      setYchData(y);
      setIsLoading(false);
    });
  }, []);

  const logic = useCommissionLogic(prices, config);

  const generatedText = useMemo(() => {
    const { baseSelection, extraChars, ychSelection, selections, multiSelections, total, paymentMethod } = logic;
    if (!baseSelection) return 'Select a Base Style to generate the summary...';

    let text = `🎨 COMMISSION REQUEST - TARQUINET\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `✨ STYLE: ${baseSelection.tier}\n`;
    if (extraChars > 1) text += `👥 CHARACTERS: ${extraChars}\n`;
    if (ychSelection) text += `🖼️ YCH BASE: ${ychSelection.title}\n`;

    Object.entries(selections).forEach(([cat, val]) => {
      if (logic.isFullcolor && (cat === 'SHADOW' || cat === 'LIGHT')) return;
      text += `🔹 ${cat}: ${val}\n`;
    });

    Object.entries(multiSelections).forEach(([cat, labels]) => {
      if (labels.length > 0) text += `📁 ${cat}: ${labels.join(', ')}\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 METHOD: ${paymentMethod}\n`;
    text += `💵 TOTAL: $${total.gross} USD\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🔗 References: [Attach your link here]`;
    return text;
  }, [logic]);

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

  // AQUÍ ESTÁ LA MAGIA: Filtramos las secciones. Si ychData está vacío, ocultamos la sección YCH.
  // De esta forma la numeración de los pasos (01, 02, 03...) no se rompe.
  const activeSections = FORM_SECTIONS.filter((section) => section.id !== 'ych' || ychData.length > 0);

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start relative pb-32">
      {/* SECCIÓN IZQUIERDA: FORMULARIO */}
      <div className="w-full lg:w-[70%] flex flex-col gap-24">
        {activeSections.map((section, idx) => {
          const stepNum = idx + 1;
          return (
            <section key={section.id} id={section.id} className="scroll-mt-32">
              <div className="mb-10 group">
                <div className="flex items-center gap-4">
                  <span className="bg-brand-red text-black font-black italic px-3 py-1 rounded-sm text-sm shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                    {stepNum.toString().padStart(2, '0')}
                  </span>
                  <h2 className="text-white font-black text-4xl uppercase italic tracking-tighter group-hover:text-brand-red transition-colors">
                    {section.title}
                  </h2>
                </div>
              </div>

              <div className="pl-0 md:pl-14">
                {section.id === 'base' && (
                  <Step1Base
                    prices={prices}
                    baseSelection={logic.baseSelection}
                    setBaseSelection={logic.setBaseSelection}
                  />
                )}
                {section.id === 'chars' && (
                  <StepExtraChars
                    extraChars={logic.extraChars}
                    setExtraChars={logic.setExtraChars}
                    charsConfig={logic.groupedOptions['CHARACTERS']?.[0]}
                  />
                )}
                {section.id === 'ych' && (
                  <Step5YCH
                    ychData={ychData}
                    ychSelection={logic.ychSelection}
                    setYchSelection={logic.setYchSelection}
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
            </section>
          );
        })}

        {/* CIERRE Y PREVIEW */}
        <section className="bg-white/5 border border-brand-red/20 rounded-4xl p-8 md:p-12 mt-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-brand-red text-2xl font-black italic">!</span>
            <h2 className="text-white font-black text-3xl uppercase italic tracking-tighter leading-none">
              Request Closure
            </h2>
          </div>

          <div className="mb-10">
            <h4 className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-4 text-white/60">
              Preferred payment method:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['PayPal', 'Nequi', 'Kofi', 'Global66'].map((method) => (
                <button
                  key={method}
                  onClick={() => logic.setPaymentMethod(method)}
                  className={`py-4 rounded-xl border-2 font-black text-[10px] uppercase transition-all duration-300 ${
                    logic.paymentMethod === method
                      ? 'bg-brand-red text-black border-brand-red shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                      : 'bg-white/5 border-white/10 text-white/30 hover:border-white/20'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-4 text-white/60">
              Summary to copy:
            </h4>
            <textarea
              readOnly
              value={generatedText}
              className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-[11px] text-brand-light/40 resize-none focus:outline-none scrollbar-thin scrollbar-thumb-brand-red/20"
            />
          </div>

          <div className="p-6 bg-black/40 border border-white/10 rounded-2xl mb-8">
            <label className="flex items-center gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={logic.isConfirmed}
                onChange={(e) => logic.setIsConfirmed(e.target.checked)}
                className="w-6 h-6 accent-brand-red bg-black border-white/20 rounded cursor-pointer"
              />
              <span className="text-white/60 text-xs md:text-sm group-hover:text-white transition-colors font-mono leading-snug">
                I have reviewed the summary and accept the{' '}
                <a
                  href="/#tos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-red font-bold underline hover:text-white transition-colors"
                >
                  T.O.S
                </a>
                .
              </span>
            </label>
          </div>

          <button
            onClick={handleCopy}
            disabled={!logic.baseSelection}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 border border-white/10 group disabled:opacity-20"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              className="group-hover:rotate-12 transition-transform"
            >
              <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copy Data for Direct Contact
          </button>
        </section>
      </div>

      {/* SECCIÓN DERECHA: TICKET */}
      <aside className="w-full lg:w-[30%] lg:sticky lg:top-24">
        <div className="bg-[#0a0000] border border-brand-red/40 rounded-4xl p-6 sm:p-8 shadow-[0_0_50px_rgba(220,38,38,0.15)] flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter">
              Ticket <span className="text-brand-red">Summary</span>
            </h3>
            <span className="text-[10px] font-mono text-white/20">#CALC_2026</span>
          </div>

          <div className="space-y-4 flex-1 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar pr-1">
            <div className="flex justify-between items-start">
              <div className="flex flex-col max-w-[70%] text-white italic font-bold uppercase">
                <span className="truncate">{logic.baseSelection ? logic.baseSelection.tier : 'No Selection'}</span>
                <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Project Base</span>
              </div>
              <span className="font-mono font-bold text-brand-light text-sm">${logic.total.base}</span>
            </div>

            {logic.ychSelection && (
              <div className="flex justify-between items-center py-2 border-t border-white/5">
                <span className="text-[10px] font-bold uppercase text-white/50 italic">Base YCH</span>
                <span className="font-mono font-bold text-xs text-white">+{logic.ychSelection.price}</span>
              </div>
            )}

            {Object.entries(logic.selections).map(([cat, val]) => {
              if (logic.isFullcolor && (cat === 'SHADOW' || cat === 'LIGHT')) return null;
              const opt = logic.groupedOptions[cat]?.find((o) => o.label === val);
              if (!opt || opt.value === '$0' || opt.value === '0%') return null;
              return (
                <div
                  key={cat}
                  className="flex justify-between text-white/50 font-mono uppercase text-[9px] border-t border-white/5 pt-2"
                >
                  <span>
                    {cat}: {val}
                  </span>
                  <span>+{opt.value}</span>
                </div>
              );
            })}

            {Object.entries(logic.multiSelections).map(([cat, labels]) =>
              labels.map((label) => {
                const opt = logic.groupedOptions[cat]?.find((o) => o.label === label);
                if (!opt || opt.value === '$0' || opt.value === '0%') return null;
                return (
                  <div
                    key={label}
                    className="flex justify-between text-white/50 font-mono uppercase text-[9px] border-t border-white/5 pt-2"
                  >
                    <span>
                      {cat}: {label}
                    </span>
                    <span>+{opt.value}</span>
                  </div>
                );
              }),
            )}

            {logic.extraChars > 1 && (
              <div className="flex justify-between items-center py-2 border-t border-brand-red/20 bg-brand-red/5 px-2 rounded-lg mt-2">
                <span className="text-[10px] font-black uppercase text-brand-red italic">
                  Character Multiplier ({logic.extraChars})
                </span>
                <span className="font-mono font-bold text-xs text-brand-red">
                  x{' '}
                  {1 +
                    (logic.groupedOptions['CHARACTERS']?.[0]
                      ? parseFloat(logic.groupedOptions['CHARACTERS'][0].value) / 100
                      : 0.75) *
                      (logic.extraChars - 1)}
                </span>
              </div>
            )}
          </div>

          <div className="border-t-4 border-brand-red pt-6 mb-8 bg-linear-to-b from-brand-red/5 to-transparent p-4 rounded-b-xl">
            <div className="flex justify-between items-center mb-4 opacity-30 font-mono text-[10px] uppercase text-white">
              <span>Fees (PayPal)</span>
              <span>${logic.total.fees}</span>
            </div>
            <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Estimated Total</p>
            <div className="flex items-baseline gap-2">
              <span className="text-brand-red font-black text-5xl md:text-6xl italic tracking-tighter leading-none">
                ${logic.total.gross}
              </span>
              <span className="text-white font-black text-sm uppercase italic">USD</span>
            </div>
          </div>

          <a
            href={logic.baseSelection && logic.isConfirmed ? GOOGLE_FORM_URL : '#'}
            target={logic.baseSelection && logic.isConfirmed ? '_blank' : '_self'}
            rel="noopener noreferrer"
            onClick={() => {
              if (logic.baseSelection && logic.isConfirmed) handleCopy();
            }}
            className={`w-full py-5 rounded-2xl font-black uppercase italic text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
              !logic.baseSelection || !logic.isConfirmed
                ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10 opacity-50'
                : 'bg-[#9c1111] hover:bg-brand-red text-white border border-brand-red hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-95'
            }`}
          >
            {!logic.isConfirmed && logic.baseSelection ? 'Missing Confirmation' : 'Send Request'}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className={!logic.baseSelection || !logic.isConfirmed ? 'opacity-10' : 'animate-bounce-x'}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </aside>

      {/* MODAL DE CONFIRMACIÓN DE COPIADO */}
      <GlobalModal isOpen={isCopyModalOpen} onClose={() => setIsCopyModalOpen(false)} title="Copy Protocol">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-brand-red/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-red/40">
            <span className="text-brand-red text-2xl">✓</span>
          </div>
          <p className="text-white font-black text-xl mb-2 italic uppercase">Data Copied!</p>
          <p className="text-white/40 text-sm font-mono italic">
            The summary is in your clipboard. You can paste it wherever you prefer.
          </p>
          <button
            onClick={() => setIsCopyModalOpen(false)}
            className="mt-8 px-8 py-3 bg-white text-black font-black uppercase text-xs rounded-full hover:bg-brand-red transition-colors"
          >
            Entendido
          </button>
        </div>
      </GlobalModal>
    </div>
  );
}
