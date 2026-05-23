import { useState, useEffect, useMemo } from 'react';
import { getSheetGuidelines, type GuidelineItem } from '../data/sheets';

export default function GuidelinesSection() {
  const [items, setItems] = useState<GuidelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSheetGuidelines()
      .then((data) => {
        if (data.length === 0) {
          setError('No data found.');
        }
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Connection error with database.');
        setLoading(false);
      });
  }, []);

  const allowed = useMemo(() => items.filter((i) => i.type?.toUpperCase().trim() === 'DO'), [items]);
  const restricted = useMemo(() => items.filter((i) => i.type?.toUpperCase().trim() === 'DONT'), [items]);

  if (loading) return <div className="h-40 animate-pulse bg-white/5 rounded-2xl mb-12"></div>;

  return (
    // Quitamos la caja cerrada (bg-[#050000] border-...) para que se integre libre en la página
    <div className="relative mb-12">
      {error && (
        <p className="text-brand-red font-mono text-[10px] mb-8 p-2 border border-brand-red/20 bg-brand-red/5 w-fit uppercase tracking-widest">
          [DATA_ERROR]: {error}
        </p>
      )}

      {/* Grid abierto, sin fondos cerrados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        {/* COLUMNA: I DRAW */}
        <div>
          <h5 className="text-white font-black text-2xl uppercase italic tracking-tighter mb-6 flex items-center gap-4">
            I Draw
            <div className="flex-1 h-[1px] bg-white/10"></div>
          </h5>
          <ul className="space-y-4">
            {allowed.map((item, i) => (
              <li key={i} className="text-brand-light/80 text-sm md:text-base flex gap-4 items-start group">
                <span className="text-green-500/50 font-bold group-hover:text-green-400 transition-colors">✚</span>
                <span>{item.content}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMNA: I DON'T DRAW */}
        <div>
          <h5 className="text-white font-black text-2xl uppercase italic tracking-tighter mb-6 flex items-center gap-4">
            I Don't Draw
            <div className="flex-1 h-[1px] bg-brand-red/20"></div>
          </h5>
          <ul className="space-y-4">
            {restricted.map((item, i) => (
              <li key={i} className="text-brand-light/50 text-sm md:text-base flex gap-4 items-start group">
                <span className="text-brand-red/75 font-bold group-hover:text-brand-red transition-colors">X</span>
                <span className="line-through decoration-brand-red/30 group-hover:decoration-brand-red transition-colors">
                  {item.content}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
