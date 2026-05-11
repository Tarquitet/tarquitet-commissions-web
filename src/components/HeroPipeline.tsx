import { useState, useEffect, useRef, memo } from 'react';
import { getSheetArtworks } from '../data/sheets';
import SecurityWatermark from './SecurityWatermark';
import { getImagePath } from '../utils/formatters';
import FadeImage from './FadeImage';
import React from 'react';

const MAX_CARDS = 4;

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
  const [isVisible, setIsVisible] = useState(true);

  const deckIndexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSheetArtworks().then((data) => {
      if (data.length === 0) return;
      const allImages = data.map((art) => getImagePath(art.filename));
      const shuffled = [...allImages];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setDeck(shuffled);
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.05 });
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

  useEffect(() => {
    if (deck.length === 0 || pool.length > 0) return;

    const initialPool: PoolSlot[] = [];
    for (let i = 0; i < MAX_CARDS; i++) {
      const t = generateTransform();
      initialPool.push({
        slotId: i,
        src: deck[i % deck.length],
        finalX: t.finalX,
        finalY: t.finalY,
        rot: t.rot,
        startX: t.start.x,
        startY: t.start.y,
        depth: i, // Inicializamos en orden: 0, 1, 2, y 3 (el 3 estará oculto esperando)
      });
    }
    deckIndexRef.current = MAX_CARDS % deck.length;
    setPool(initialPool);
  }, [deck]);

  // EL MOTOR CORREGIDO
  useEffect(() => {
    if (deck.length === 0 || pool.length === 0) return;

    const interval = setInterval(() => {
      if (!isVisible) return;

      setPool((prevPool) => {
        return prevPool.map((slot) => {
          // 1. La carta visible más vieja (2) se jubila y se va a la zona oscura (3)
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
              depth: 3, // Se oculta instantáneamente (z-index mínimo)
            };
          }
          // 2. La carta que estaba oculta (3) sale a brillar al frente de todas (0)
          else if (slot.depth === 3) {
            return { ...slot, depth: 0 };
          }
          // 3. Las que estaban en 0 y 1, dan un paso atrás
          else {
            return { ...slot, depth: slot.depth + 1 };
          }
        });
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [deck, pool.length, isVisible]);

  if (deck.length === 0 || pool.length === 0)
    return <div className="w-full aspect-4/5 bg-[#050000] border border-brand-red/10 rounded-2xl animate-pulse"></div>;

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto aspect-4/5 perspective-1000">
      {pool.map((slot) => {
        const stackOpacity = slot.depth === 0 ? 1 : slot.depth === 1 ? 0.4 : slot.depth === 2 ? 0.1 : 0;
        const zIndex = MAX_CARDS - slot.depth; // El frente (0) tiene z-index 4. El fondo (3) tiene z-index 1.

        return <HeroCard key={slot.slotId} slot={slot} zIndex={zIndex} stackOpacity={stackOpacity} />;
      })}
    </div>
  );
}

// SUBCOMPONENTE DE LA CARTA
const HeroCard = memo(({ slot, zIndex, stackOpacity }: { slot: PoolSlot; zIndex: number; stackOpacity: number }) => {
  const isRecycled = slot.depth === 3; // Si está en la zona oscura, cortamos las animaciones

  return (
    <div
      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-brand-red/30 bg-[#050000]"
      style={{
        zIndex,
        opacity: stackOpacity,
        boxShadow: `0 15px 45px rgba(0,0,0, ${stackOpacity * 0.7})`,
        transform: isRecycled
          ? `translate(${slot.startX}px, ${slot.startY}px) rotate(${slot.rot * 1.3}deg)`
          : `translate(${slot.finalX}px, ${slot.finalY}px) rotate(${slot.rot}deg)`,
        transition: isRecycled
          ? 'none' // Teletransporte instantáneo mientras está invisible
          : 'transform 1.2s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.25s ease-out, box-shadow 1.2s ease-out',
        willChange: 'transform, opacity',
      }}
    >
      <FadeImage
        src={slot.src}
        alt="Tarquitet Hero Art"
        className="w-full h-full object-cover"
        containerClass="w-full h-full"
        priority={true}
      />
      <SecurityWatermark />
      <div className="absolute inset-0 bg-transparent z-40 cursor-default"></div>
    </div>
  );
});
