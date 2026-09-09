import { useState, useEffect } from 'react';
import { getSheetTOS, type TOSItem } from '../data/sheets';
import { content } from '../data/content';

export default function TOSSection() {
  const [termsData, setTermsData] = useState<{
    startBlock: TOSItem | null;
    finalBlock: TOSItem | null;
    listItems: TOSItem[];
  }>({
    startBlock: null,
    finalBlock: null,
    listItems: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSheetTOS().then((data) => {
      setTermsData(data);
      setLoading(false);
    });
  }, []);

  const formatContent = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-red font-black">$1</strong>')
      .split('\n')
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('-')) {
          return `<div class="flex gap-4 mb-3 items-start">
                    <span class="text-brand-red font-black mt-0.5 opacity-50">/</span>
                    <p class="leading-snug" style="color: var(--text-muted);">${trimmed.replace('-', '').trim()}</p>
                  </div>`;
        }
        if (trimmed.startsWith('>')) {
          return `<div class="font-mono text-brand-red bg-brand-red/10 p-3 border-l-4 border-brand-red my-2 text-xs md:text-sm rounded-r-lg">${trimmed.replace('>', '').trim()}</div>`;
        }
        return `<p class="mb-4 leading-relaxed" style="color: var(--text-muted);">${trimmed}</p>`;
      })
      .join('');
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center py-40 border-2 rounded-2xl"
        style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}
      >
        <p className="text-brand-red font-mono text-xs uppercase tracking-widest animate-pulse">
          {content.sections.tos.loadingText}
        </p>
      </div>
    );
  }

  const { startBlock, finalBlock, listItems } = termsData;

  return (
    <div className="max-w-4xl mx-auto flex flex-col">
      {/* BLOQUE INICIAL (Intro) */}
      {startBlock && (
        <header className="mb-12">
          <div className="border-l-8 border-brand-red pl-6 md:pl-8 mb-8">
            <h2 className="text-brand-red font-black tracking-tighter text-4xl md:text-6xl uppercase italic leading-[0.8]">
              {startBlock.title}
            </h2>
          </div>
          <div
            className="border-2 p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-sm"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-3xl rounded-full pointer-events-none"></div>
            <div
              className="relative z-10 text-base md:text-lg"
              style={{ color: 'var(--text-muted)' }}
              dangerouslySetInnerHTML={{ __html: formatContent(startBlock.content) }}
            />
          </div>
        </header>
      )}

      {/* LISTA CLÁSICA NUMERADA */}
      <div className="space-y-10">
        {listItems.map((item, idx) => (
          <div key={idx} className="border-b border-brand-red/10 pb-8 last:border-0 last:pb-0">
            <h3 className="text-xl md:text-2xl font-black text-brand-red uppercase italic tracking-tighter mb-4 flex items-center gap-3">
              <span className="text-brand-red/40 font-mono text-lg font-bold italic">
                [{item.order ? item.order.padStart(2, '0') : String(idx + 1).padStart(2, '0')}]
              </span>
              {item.title}
            </h3>
            <div
              className="text-sm md:text-base leading-relaxed space-y-3"
              style={{ color: 'var(--text-muted)' }}
              dangerouslySetInnerHTML={{ __html: formatContent(item.content) }}
            />
          </div>
        ))}
      </div>

      {/* BLOQUE FINAL: SOLO LA FECHA (DATA-DRIVEN) */}
      {finalBlock && finalBlock.update_date && (
        <div className="mt-16 md:mt-24 text-center">
          <div className="inline-block bg-brand-red text-beige px-6 py-3 font-black text-sm tracking-[0.2em] uppercase shadow-lg">
            {/* AQUÍ ESTÁ LA CORRECCIÓN: Usa la variable de content en lugar de texto fijo */}
            {content.sections.tos.latestUpdate}: {finalBlock.update_date}
          </div>
        </div>
      )}
    </div>
  );
}
