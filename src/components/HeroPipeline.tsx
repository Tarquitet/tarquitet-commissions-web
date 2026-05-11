import { useState, useEffect, useRef, memo } from 'react';
import { getSheetArtworks } from '../data/sheets';
import SecurityWatermark from './SecurityWatermark';
import { getImagePath } from '../utils/formatters';
import FadeImage from './FadeImage';
import React from 'react';

interface DeckCard {
  src: string;
  title: string;
}

interface CardData {
  id: number;
  src: string;
  finalX: number;
  finalY: number;
  rot: number;
  startX: number;
  startY: number;
}

export default function HeroPipeline() {
  const [deck, setDeck] = useState<DeckCard[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  const deckIndexRef = useRef(0);
  const lastTitleRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSheetArtworks().then((data) => {
      if (data.length === 0) return;
      const allImages = data.map((art) => ({
        src: getImagePath(art.filename),
        title: art.title,
      }));
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

  useEffect(() => {
    if (deck.length === 0) return;

    const spawnCard = () => {
      if (!isVisible) return;
      let nextIndex = deckIndexRef.current;
      let nextCard = deck[nextIndex];

      if (nextCard.title === lastTitleRef.current) {
        nextIndex = (nextIndex + 1) % deck.length;
        nextCard = deck[nextIndex];
      }

      lastTitleRef.current = nextCard.title;
      deckIndexRef.current = (nextIndex + 1) % deck.length;

      setCards((prev) => {
        const rot = Math.floor(Math.random() * 20) - 10;
        const finalX = Math.floor(Math.random() * 30) - 15;
        const finalY = Math.floor(Math.random() * 30) - 15;
        const dirs = [
          { x: 0, y: -120 },
          { x: 0, y: 120 },
          { x: -120, y: 0 },
          { x: 120, y: 0 },
        ];
        const start = dirs[Math.floor(Math.random() * dirs.length)];

        const newCard = {
          id: performance.now(),
          src: nextCard.src,
          finalX,
          finalY,
          rot,
          startX: start.x,
          startY: start.y,
        };

        const updated = [...prev, newCard];
        return updated.slice(-4);
      });
    };

    if (cards.length === 0 && isVisible) spawnCard();
    const interval = setInterval(spawnCard, 3500);
    return () => clearInterval(interval);
  }, [deck, isVisible]);

  if (deck.length === 0)
    return <div className="w-full aspect-4/5 bg-[#050000] border border-brand-red/10 rounded-2xl animate-pulse"></div>;

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto aspect-4/5 perspective-1000">
      {cards.map((card, idx) => {
        const depth = cards.length - 1 - idx;
        const stackOpacity = depth === 0 ? 1 : depth === 1 ? 0.4 : depth === 2 ? 0.1 : 0;

        return <HeroCard key={card.id} card={card} zIndex={idx} stackOpacity={stackOpacity} />;
      })}
    </div>
  );
}

// SUBCOMPONENTE REFACTORIZADO
const HeroCard = memo(({ card, zIndex, stackOpacity }: { card: CardData; zIndex: number; stackOpacity: number }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setActive(true), 60);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-brand-red/30 bg-[#050000]"
      style={{
        zIndex,
        opacity: active ? stackOpacity : 0,
        boxShadow: `0 15px 45px rgba(0,0,0, ${active ? stackOpacity * 0.7 : 0})`,
        transform: active
          ? `translate(${card.finalX}px, ${card.finalY}px) rotate(${card.rot}deg)`
          : `translate(${card.startX}px, ${card.startY}px) rotate(${card.rot * 1.3}deg)`,
        transition:
          'transform 1.2s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.25s ease-out, box-shadow 1.2s ease-out',
        willChange: 'transform, opacity',
      }}
    >
      {/* USANDO EL COMPONENTE REUTILIZABLE */}
      <FadeImage
        src={card.src}
        alt="Tarquitet Hero Art"
        className="w-full h-full object-cover"
        containerClass="w-full h-full"
        priority={zIndex >= 2} // Priorizar carga de las cartas superiores
      />

      <SecurityWatermark />
      <div className="absolute inset-0 bg-transparent z-40 cursor-default"></div>
    </div>
  );
});
