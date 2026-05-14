import { useState, useEffect, useRef, memo } from 'react';
import { getSheetArtworks } from '../data/sheets';
import SecurityWatermark from './SecurityWatermark';
import { getImagePath } from '../utils/formatters';
import FadeImage from './FadeImage';
import React from 'react';

const MAX_CARDS = 4;

// INTERFAZ RESTAURADA
interface PoolSlot {
  slotId: number;
  src: string;
  finalX: number;
  finalY: number;
  rot: number;
  startX: number;
  startY: number;
  depth: number;
}

export default function HeroPipeline() {
  const [deck, setDeck] = useState<string[]>([]);
  const [pool, setPool] = useState<PoolSlot[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const deckIndexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Carga del mazo
  useEffect(() => {
    getSheetArtworks().then((data) => {
      if (data.length === 0) return;
      const allImages = data.map((art) => getImagePath(art.filename));
      const shuffled = [...allImages].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
    });
  }, []);

  // 2. Observer de Visibilidad (Kill Switch)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        // Si sale de vista, vaciamos el pool para matar procesos y liberar RAM
        if (!entry.isIntersecting) {
          setPool([]);
        }
      },
      { threshold: 0.01 },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const generateTransform = () => {
    const dirs = [
      { x: 0, y: -120 },
      { x: 0, y: 120 },
      { x: -120, y: 0 },
      { x: 120, y: 0 },
    ];
    return {
      rot: Math.floor(Math.random() * 20) - 10,
      finalX: Math.floor(Math.random() * 30) - 15,
      finalY: Math.floor(Math.random() * 30) - 15,
      start: dirs[Math.floor(Math.random() * dirs.length)],
    };
  };

  // 3. Inicializador de Pool (Solo al entrar en vista)
  useEffect(() => {
    if (!isVisible || deck.length === 0 || pool.length > 0) return;

    const initialPool: PoolSlot[] = [];
    for (let i = 0; i < MAX_CARDS; i++) {
      const t = generateTransform();
      initialPool.push({
        slotId: i,
        src: deck[(deckIndexRef.current + i) % deck.length],
        finalX: t.finalX,
        finalY: t.finalY,
        rot: t.rot,
        startX: t.start.x,
        startY: t.start.y,
        depth: i,
      });
    }
    deckIndexRef.current = (deckIndexRef.current + MAX_CARDS) % deck.length;
    setPool(initialPool);
  }, [isVisible, deck]);

  // 4. Motor de animación con pausa por visibilidad
  useEffect(() => {
    if (!isVisible || deck.length === 0 || pool.length === 0) return;

    const interval = setInterval(() => {
      setPool((prevPool) =>
        prevPool.map((slot) => {
          if (slot.depth === 2) {
            const t = generateTransform();
            const nextSrc = deck[deckIndexRef.current];
            deckIndexRef.current = (deckIndexRef.current + 1) % deck.length;
            return {
              ...slot,
              src: nextSrc,
              finalX: t.finalX,
              finalY: t.finalY,
              rot: t.rot,
              startX: t.start.x,
              startY: t.start.y,
              depth: 3,
            };
          } else if (slot.depth === 3) return { ...slot, depth: 0 };
          else return { ...slot, depth: slot.depth + 1 };
        }),
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [isVisible, deck, pool.length]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto aspect-4/5 perspective-1000 min-h-75">
      {isVisible && pool.length > 0 ? (
        pool.map((slot) => {
          const stackOpacity = slot.depth === 0 ? 1 : slot.depth === 1 ? 0.4 : slot.depth === 2 ? 0.1 : 0;
          const zIndex = MAX_CARDS - slot.depth;
          return <HeroCard key={slot.slotId} slot={slot} zIndex={zIndex} stackOpacity={stackOpacity} />;
        })
      ) : (
        <div className="w-full h-full bg-brand-red/5 rounded-2xl border border-white/5 flex items-center justify-center">
          <span className="text-white/10 font-mono text-[10px] uppercase tracking-widest italic animate-pulse">
            Pipeline Standby
          </span>
        </div>
      )}
    </div>
  );
}

const HeroCard = memo(({ slot, zIndex, stackOpacity }: { slot: PoolSlot; zIndex: number; stackOpacity: number }) => {
  const isRecycled = slot.depth === 3;

  return (
    <div
      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-brand-red/30 bg-[#050000]"
      style={{
        zIndex,
        opacity: stackOpacity,
        transform: isRecycled
          ? `translate(${slot.startX}px, ${slot.startY}px) rotate(${slot.rot * 1.3}deg)`
          : `translate(${slot.finalX}px, ${slot.finalY}px) rotate(${slot.rot}deg)`,
        transition: isRecycled ? 'none' : 'transform 1.2s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.5s ease-out',
        willChange: 'transform, opacity',
      }}
    >
      <FadeImage
        src={slot.src}
        alt="Hero Art"
        className="w-full h-full object-cover"
        containerClass="w-full h-full"
        priority={slot.depth === 0}
      />
      <SecurityWatermark />
      <div className="absolute inset-0 bg-transparent z-40"></div>
    </div>
  );
});
