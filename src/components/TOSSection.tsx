import { useState, useEffect } from 'react';
import { getSheetTOS, type TOSItem } from '../data/sheets';

export default function TOSSection() {
  const [terms, setTerms] = useState<TOSItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSheetTOS().then((data) => {
      setTerms(data);
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
          return `<div class="flex gap-4 mb-3 items-start group/line">
                    <span class="text-brand-red font-black mt-0.5 opacity-50">/</span>
                    <p class="text-brand-light/80 leading-snug italic">${trimmed.replace('-', '').trim()}</p>
                  </div>`;
        }
        if (trimmed.startsWith('>')) {
          return `<div class="font-mono text-brand-red/70 bg-black/40 p-2 border-l border-brand-red/20 my-1 text-[11px]">${trimmed.replace('>', '').trim()}</div>`;
        }
        return `<p class="mb-4 text-brand-light/70 italic leading-relaxed">${trimmed}</p>`;
      })
      .join('');
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-40 border border-brand-red/10 bg-[#050000] rounded-2xl">
        <p className="text-brand-red/60 font-mono text-xs uppercase tracking-[0.5em] animate-pulse">
          // Accessing Legal Protocols...
        </p>
      </div>
    );

  // Separamos los bloques según la letra en el Sheets
  const startBlock = terms.find((t) => t.type.toUpperCase() === 'S');
  const finalBlock = terms.find((t) => t.type.toUpperCase() === 'F');
  const listItems = terms.filter((t) => t.type.toUpperCase() === 'I');

  return (
    <div className="max-w-5xl mx-auto flex flex-col">
      {/* BLOQUE START (S) */}
      {startBlock && (
        <header className="mb-20">
          <div className="border-l-8 border-brand-red pl-8 mb-10">
            <h2 className="text-brand-red font-black tracking-tighter text-5xl md:text-7xl uppercase italic leading-[0.8] drop-shadow-[0_0_15px_rgba(220,38,38,0.2)]">
              {startBlock.title}
            </h2>
          </div>

          <div className="bg-brand-red/5 border border-brand-red/20 p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-3xl rounded-full pointer-events-none"></div>
            <div
              className="relative z-10 text-brand-light/90 italic text-lg"
              dangerouslySetInnerHTML={{ __html: formatContent(startBlock.content) }}
            />
          </div>
        </header>
      )}

      {/* BLOQUE ITEMS (I) - MODO ACORDEÓN */}
      <div className="grid gap-4">
        {listItems.map((item, idx) => (
          <details
            key={idx}
            className="group bg-[#050000] border border-brand-red/10 rounded-xl overflow-hidden transition-all duration-500 open:border-brand-red/40 open:bg-[#080000] open:shadow-[0_0_50px_rgba(220,38,38,0.05)]"
          >
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none select-none hover:bg-brand-red/5 transition-all [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-6">
                <span className="text-brand-red/30 font-mono text-xl font-bold italic">
                  [{item.order ? item.order.padStart(2, '0') : String(idx + 1).padStart(2, '0')}]
                </span>
                <span className="text-white font-black text-xl md:text-2xl uppercase italic tracking-tighter group-open:text-brand-red transition-colors duration-500">
                  {item.title}
                </span>
              </div>
              <div className="text-brand-red/40 group-open:text-brand-red group-open:rotate-180 transition-all duration-500 flex-shrink-0 ml-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </summary>

            <div className="px-6 md:px-12 pb-10 border-t border-brand-red/5 pt-8 shadow-inner">
              <div
                className="text-brand-light/70 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatContent(item.content) }}
              />
            </div>
          </details>
        ))}
      </div>

      {/* BLOQUE FINAL (F) */}
      {finalBlock && (
        <div className="mt-32 relative">
          <div className="absolute inset-0 flex items-center justify-center -top-10 overflow-hidden pointer-events-none">
            <span className="text-brand-red font-black text-7xl md:text-9xl uppercase italic tracking-tighter opacity-5 select-none whitespace-nowrap">
              Términos de Servicio
            </span>
          </div>
          <div className="relative z-10 flex flex-col items-center border-t-4 border-brand-red pt-12 pb-0">
            <div className="bg-brand-red text-black px-8 py-3 font-black text-sm tracking-[0.4em] uppercase shadow-[0_0_30px_rgba(220,38,38,0.3)]">
              ULTIMA ACTUALIZACIÓN: {finalBlock.update_date || 'SIN FECHA'}
            </div>
            <div
              className="text-brand-red/40 text-[10px] font-bold tracking-[0.5em] uppercase italic mt-6"
              dangerouslySetInnerHTML={{ __html: formatContent(finalBlock.content) }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
