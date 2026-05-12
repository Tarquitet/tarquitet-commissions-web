import { useState, useEffect, useMemo } from 'react';
import { getSheetGuidelines, type GuidelineItem } from '../data/sheets';

export default function GuidelinesSection() {
  const [items, setItems] = useState<GuidelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSheetGuidelines()
      .then((data) => {
        console.log('=== DEBUG GUIDELINES ===');
        console.table(data); // Esto te mostrará en la consola si los datos llegan o no

        if (data.length === 0) {
          setError("No data found. Check the GID and the 'type' and 'content' headers.");
        }

        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Connection error with Google Sheets.');
        setLoading(false);
      });
  }, []);

  const allowed = useMemo(() => items.filter((i) => i.type?.toUpperCase().trim() === 'DO'), [items]);
  const restricted = useMemo(() => items.filter((i) => i.type?.toUpperCase().trim() === 'DONT'), [items]);

  if (loading) return <div className="h-40 animate-pulse bg-white/5 rounded-2xl mb-12"></div>;

  return (
    <div className="bg-[#050000] border border-brand-red/20 rounded-2xl p-8 relative overflow-hidden mb-12">
      <h4 className="text-white font-black text-xl uppercase italic mb-6 flex items-center gap-3">
        <span className="w-2 h-2 bg-brand-red"></span>
        Content Parameters
      </h4>

      {/* MESAJE DE ERROR (Solo aparece si falla) */}
      {error && (
        <p className="text-brand-red font-mono text-[10px] mb-4 p-2 border border-brand-red/20 bg-brand-red/5">
          [SISTEMA]: {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="text-green-500">+</span> Allowed
          </h5>
          <ul className="space-y-3">
            {allowed.map((item, i) => (
              <li key={i} className="text-brand-light/80 text-sm flex gap-2">
                <span className="text-brand-red/50">/</span> {item.content}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="text-brand-red">-</span> Restricted
          </h5>
          <ul className="space-y-3">
            {restricted.map((item, i) => (
              <li key={i} className="text-brand-light/40 text-sm flex gap-2 line-through decoration-brand-red/30">
                <span className="text-brand-red/30">/</span> {item.content}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
