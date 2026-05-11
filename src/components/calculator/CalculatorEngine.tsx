import React, { useState, useEffect } from 'react';
import {
  getSheetPrices,
  getCalculatorConfig,
  getSheetYCH,
  type PricingTier,
  type CalcOption,
  type YCHPiece,
} from '../../data/sheets';
import { useCommissionLogic } from '../../hooks/useCommissionLogic';

// Import de Componentes de Pasos
import Step1Base from './steps/1_Base';
import StepExtraChars from './steps/8_ExtraChars';
import Step2Shadows from './steps/2_Shadows';
import Step3Lights from './steps/3_Lights';
import Step4Backgrounds from './steps/4_Backgrounds';
import Step5YCH from './steps/5_YCH';
import Step6PSD from './steps/6_PSD';
import Step7Licenses from './steps/7_Licenses';

// 1. CONFIGURACIÓN DE FASES (Aquí puedes mover el orden y todo se re-numera)
const FORM_SECTIONS = [
  { id: 'base', title: 'Base de la Comisión', subtitle: 'Corte y Estilo del dibujo' },
  { id: 'chars', title: 'Personajes', subtitle: 'Cantidad de sujetos en la obra' },
  { id: 'ych', title: 'Poses y Estructura', subtitle: 'Personalizado o Catálogo YCH' },
  { id: 'shadows', title: 'Fase de Sombras', subtitle: 'Nivel de profundidad y volumen' },
  { id: 'lights', title: 'Iluminación', subtitle: 'Efectos de atmósfera y brillo' },
  { id: 'bg', title: 'Entorno / Fondo', subtitle: 'Escenario de la ilustración' },
  { id: 'psd', title: 'Entregables PSD', subtitle: 'Archivos fuente y capas' },
  { id: 'license', title: 'Licencias', subtitle: 'Derechos de uso y autor' },
];

export default function CalculatorEngine() {
  const [prices, setPrices] = useState<PricingTier[]>([]);
  const [config, setConfig] = useState<CalcOption[]>([]);
  const [ychData, setYchData] = useState<YCHPiece[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSheetPrices(), getCalculatorConfig(), getSheetYCH()]).then(([p, c, y]) => {
      setPrices(p);
      setConfig(c);
      setYchData(y);
      setIsLoading(false);
    });
  }, []);

  const logic = useCommissionLogic(prices, config);

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-brand-red font-mono animate-pulse">
        <div className="text-2xl font-black uppercase tracking-[0.5em] mb-4">Iniciando_Sistema</div>
        <div className="text-xs text-brand-red/50 text-center uppercase tracking-widest">
          Cargando módulos de cotización...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start relative pb-32">
      {/* =========================================================
          LADO IZQUIERDO: FORMULARIO LARGO (70%)
          ========================================================= */}
      <div className="w-full lg:w-[70%] flex flex-col gap-24">
        {FORM_SECTIONS.map((section, idx) => {
          const stepNum = idx + 1;

          return (
            <section key={section.id} id={section.id} className="scroll-mt-32">
              {/* CABECERA DE FASE AUTOMÁTICA */}
              <div className="mb-10 group">
                <div className="flex items-center gap-4 mb-2">
                  <span className="bg-brand-red text-black font-black italic px-3 py-1 rounded-sm text-sm shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                    {stepNum.toString().padStart(2, '0')}
                  </span>
                  <h2 className="text-white font-black text-4xl uppercase italic tracking-tighter group-hover:text-brand-red transition-colors">
                    {section.title}
                  </h2>
                </div>
                <p className="text-white/30 font-mono text-[10px] uppercase tracking-[0.4em] pl-0 md:pl-14">
                  {section.subtitle} // FASE_AUTO_RECORD_{stepNum}
                </p>
              </div>

              {/* RENDERIZADO DINÁMICO DE COMPONENTES */}
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

        {/* FASE FINAL: CHECKOUT */}
        <section className="bg-white/5 border border-brand-red/20 rounded-4xl p-8 md:p-12 mt-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-brand-red text-2xl">✓</span>
            <h2 className="text-white font-black text-3xl uppercase italic tracking-tighter leading-none">
              Confirmación Final
            </h2>
          </div>
          <p className="text-white/40 text-sm mb-8 font-mono leading-relaxed max-w-2xl">
            Al proceder, serás redirigido al formulario oficial de Google donde los datos seleccionados se adjuntarán
            automáticamente para iniciar el proceso de contrato.
          </p>
          <div className="p-5 bg-brand-red/5 border border-brand-red/10 rounded-2xl">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 accent-brand-red bg-black border-white/20 rounded cursor-pointer"
              />
              <span className="text-white/60 text-xs md:text-sm group-hover:text-white transition-colors font-mono leading-snug">
                Confirmo que he revisado el desglose de precios en el panel lateral y acepto los Términos de Servicio
                (T.O.S) de Tarquitet Art.
              </span>
            </label>
          </div>
        </section>
      </div>

      {/* =========================================================
          LADO DERECHO: TICKET PEGAJOSO (30%)
          ========================================================= */}
      <aside className="w-full lg:w-[30%] lg:sticky lg:top-24">
        <div className="bg-[#0a0000] border border-brand-red/40 rounded-4xl p-6 sm:p-8 shadow-[0_0_50px_rgba(220,38,38,0.15)] flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter">
              Ticket <span className="text-brand-red">Resumen</span>
            </h3>
            <span className="text-[10px] font-mono text-white/20">EST_#2026</span>
          </div>

          <div className="space-y-4 flex-1 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar pr-1">
            {/* ITEM: BASE */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col max-w-[70%]">
                <span className="text-white font-bold text-sm uppercase italic truncate">
                  {logic.baseSelection ? logic.baseSelection.tier : 'Seleccionar Estilo'}
                </span>
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-widest truncate">
                  Base del Proyecto
                </span>
              </div>
              <span className="font-mono font-bold text-brand-light text-sm">${logic.total.base}</span>
            </div>

            {/* ITEM: YCH */}
            {logic.ychSelection && (
              <div className="flex justify-between items-center py-2 border-t border-white/5">
                <span className="text-[10px] font-bold uppercase text-white/50 italic">Base YCH</span>
                <span className="font-mono font-bold text-xs text-white">+{logic.ychSelection.price}</span>
              </div>
            )}

            {/* ITEMS: SELECCIONES SIMPLES */}
            {Object.entries(logic.selections).map(([cat, label]) => {
              if (logic.isFullcolor && (cat === 'SHADOW' || cat === 'LIGHT')) return null;
              const opt = logic.groupedOptions[cat]?.find((o) => o.label === label);
              if (!opt || opt.value === '$0' || opt.value === '0%') return null;
              return (
                <div key={cat} className="flex justify-between items-center py-2 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase text-white/50 italic truncate mr-2">
                    {cat}: {label}
                  </span>
                  <span className="font-mono font-bold text-xs text-white shrink-0">+{opt.value}</span>
                </div>
              );
            })}

            {/* ITEMS: SELECCIONES MÚLTIPLES */}
            {Object.entries(logic.multiSelections).map(([cat, labels]) =>
              labels.map((label) => {
                const opt = logic.groupedOptions[cat]?.find((o) => o.label === label);
                if (!opt || opt.value === '$0' || opt.value === '0%') return null;
                return (
                  <div key={label} className="flex justify-between items-center py-2 border-t border-white/5">
                    <span className="text-[10px] font-bold uppercase text-white/50 italic truncate mr-2">
                      {cat}: {label}
                    </span>
                    <span className="font-mono font-bold text-xs text-white shrink-0">+{opt.value}</span>
                  </div>
                );
              }),
            )}

            {/* ITEM: PERSONAJES */}
            {logic.extraChars > 1 && (
              <div className="flex justify-between items-center py-2 border-t border-brand-red/20 bg-brand-red/5 px-2 rounded-lg">
                <span className="text-[10px] font-black uppercase text-brand-red italic">
                  Mult. Personajes ({logic.extraChars})
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

          {/* CÁLCULO FINAL */}
          <div className="border-t-4 border-brand-red pt-6 mb-8 bg-linear-to-b from-brand-red/5 to-transparent p-4 rounded-b-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-mono text-white/30 uppercase">PayPal Fees</span>
              <span className="text-xs font-mono text-white/30">${logic.total.fees}</span>
            </div>
            <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Total Final Estimado</p>
            <div className="flex items-baseline gap-2">
              <span className="text-brand-red font-black text-5xl md:text-6xl italic tracking-tighter leading-none">
                ${logic.total.gross}
              </span>
              <span className="text-white font-black text-sm uppercase italic">USD</span>
            </div>
          </div>

          <button
            disabled={!logic.baseSelection}
            className={`w-full py-5 rounded-2xl font-black uppercase italic text-lg transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 ${
              !logic.baseSelection
                ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
                : 'bg-[#9c1111] hover:bg-brand-red text-white border border-brand-red hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-95'
            }`}
          >
            Enviar Solicitud
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className={!logic.baseSelection ? 'opacity-10' : 'animate-bounce-x'}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </aside>
    </div>
  );
}
