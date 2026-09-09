import { useState, useEffect } from 'react';
import { getSheetGuidelines, type GuidelineItem } from '../data/sheets';
import { content } from '../data/content';

export default function GuidelinesSection() {
  const [allowed, setAllowed] = useState<GuidelineItem[]>([]);
  const [restricted, setRestricted] = useState<GuidelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSheetGuidelines().then((data) => {
      setAllowed(data.allowed);
      setRestricted(data.restricted);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-64 border-2 rounded-2xl"
        style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}
      >
        <p className="text-brand-red font-mono text-xs uppercase tracking-widest animate-pulse">// Cargando...</p>
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    borderColor: 'var(--card-border)',
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      {/* COLUMNA IZQUIERDA: SÍ ACEPTO */}
      <div className="border-2 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm" style={cardStyle}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10">
          <h4 className="text-brand-red font-black text-2xl md:text-3xl uppercase italic tracking-tighter mb-6 flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-red text-beige text-xl font-black">
              ✓
            </span>
            {content.sections.scope.iAccept}
          </h4>
          <ul className="space-y-4">
            {allowed.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="text-brand-red font-black text-lg mt-0.5 shrink-0">+</span>
                <span className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {item.content}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* COLUMNA DERECHA: NO ACEPTO */}
      <div
        className="border-2 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-sm"
        style={{ ...cardStyle, borderColor: 'var(--text-muted)' }}
      >
        <div
          className="absolute bottom-0 left-0 w-32 h-32 blur-3xl rounded-full pointer-events-none"
          style={{ backgroundColor: 'var(--text-muted)', opacity: 0.05 }}
        />
        <div className="relative z-10">
          <h4
            className="font-black text-2xl md:text-3xl uppercase italic tracking-tighter mb-6 flex items-center gap-3"
            style={{ color: 'var(--text-color)' }}
          >
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-xl font-black"
              style={{ backgroundColor: 'var(--text-muted)', color: 'var(--bg-color)' }}
            >
              ✕
            </span>
            {content.sections.scope.iDontAccept}
          </h4>
          <ul className="space-y-4">
            {restricted.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span
                  className="font-black text-lg mt-0.5 shrink-0"
                  style={{ color: 'var(--text-muted)', opacity: 0.4 }}
                >
                  −
                </span>
                <span
                  className="text-sm md:text-base leading-relaxed line-through"
                  style={{ color: 'var(--text-muted)', opacity: 0.6 }}
                >
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
