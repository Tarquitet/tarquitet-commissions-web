import { useState, useEffect, useRef, memo } from 'react';
import { getSheetArtworks } from '../data/sheets';
import SecurityWatermark from './SecurityWatermark';
import { getImagePath } from '../utils/formatters';
import FadeImage from './FadeImage';
import React from 'react';

// CACHÉ DE VUELO: Evita que cambien de ruta a mitad de camino
const transformCache = new Map();
const getCardTransform = (index: number) => {
  if (!transformCache.has(index)) {
    const dirs = [
      { x: 0, y: -400 },
      { x: 0, y: 400 },
      { x: -400, y: 0 },
      { x: 400, y: 0 },
    ];
    transformCache.set(index, {
      rot: Math.floor(Math.random() * 20) - 10,
      startX: dirs[Math.floor(Math.random() * dirs.length)].x,
      startY: dirs[Math.floor(Math.random() * dirs.length)].y,
      finalX: Math.floor(Math.random() * 30) - 15,
      finalY: Math.floor(Math.random() * 30) - 15,
    });
  }
  return transformCache.get(index);
};

export default function HeroPipeline() {
  const [deck, setDeck] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSheetArtworks().then((data) => {
      if (data.length === 0) return;
      const allImages = data.map((art) => getImagePath(art.filename));
      const shuffled = [...allImages].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.01 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || deck.length === 0) return;
    const interval = setInterval(() => {
      setStep((s) => s + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, [isVisible, deck]);

  // Cargamos 4 cartas visibles + 1 en espera (Standby) para que no haya vacíos
  const visibleIndices = [step - 1, step, step + 1, step + 2, step + 3];

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto aspect-4/5 perspective-1000 min-h-75">
      {isVisible && deck.length > 0 ? (
        visibleIndices.map((absoluteIndex) => {
          if (absoluteIndex < 0) return null;
          return (
            <HeroCard
              key={absoluteIndex}
              index={absoluteIndex}
              currentStep={step}
              src={deck[absoluteIndex % deck.length]}
            />
          );
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

const HeroCard = memo(({ index, currentStep, src }: { index: number; currentStep: number; src: string }) => {
  const [isMounted, setIsMounted] = useState(false);
  const t = getCardTransform(index);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const rel = index - currentStep;
  let x = 0,
    y = 0,
    scale = 1,
    opacity = 1,
    darkness = 0;
  const zIndex = 20 - index;

  if (!isMounted) {
    if (currentStep === 0 && index < 3) {
      // Las 3 primeras cartas al cargar la web
      x = t.finalX;
      y = t.finalY - rel * 15;
      opacity = 0;
      darkness = rel === 0 ? 0 : rel === 1 ? 0.5 : 0.85;
      scale = rel === 0 ? 1 : rel === 1 ? 0.95 : 0.9;
    } else {
      // Cartas nuevas que vienen de afuera
      x = t.startX;
      y = t.startY;
      opacity = 0;
      darkness = 1;
      scale = 0.8;
    }
  } else if (rel < 0) {
    // Carta que ya cumplió su turno y sale volando a la pantalla del usuario
    x = t.startX * -0.5;
    y = t.startY * -0.5;
    opacity = 0;
    darkness = 0;
    scale = 1.1;
  } else if (rel === 0) {
    // CARTA AL FRENTE (Brillante)
    x = t.finalX;
    y = t.finalY;
    scale = 1;
    darkness = 0;
  } else if (rel === 1) {
    // CARTA EN MEDIO (Media sombra)
    x = t.finalX;
    y = t.finalY - 15;
    scale = 0.95;
    darkness = 0.5;
  } else if (rel >= 2) {
    // CARTA AL FONDO (Entrando envuelta en negro)
    x = t.finalX;
    y = t.finalY - 30;
    scale = 0.9;
    darkness = 0.85;
  }

  return (
    <div
      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-brand-red/30 bg-[#050000] shadow-2xl"
      style={{
        zIndex,
        opacity,
        transform: `translate(${x}px, ${y}px) rotate(${t.rot}deg) scale(${scale})`,
        transition: 'all 1.2s cubic-bezier(0.215, 0.61, 0.355, 1)',
        willChange: 'transform, opacity',
      }}
    >
      {/* EL FIX MÁGICO: priority={true} fijo evita que la imagen colapse a negro al llegar al frente */}
      <FadeImage
        src={src}
        alt="Hero Art"
        className="w-full h-full object-cover"
        containerClass="w-full h-full"
        priority={true}
      />
      <SecurityWatermark />

      {/* Sombra de carga suave */}
      <div
        className="absolute inset-0 bg-[#050000] pointer-events-none z-40"
        style={{
          opacity: darkness,
          transition: 'opacity 1.2s cubic-bezier(0.215, 0.61, 0.355, 1)',
        }}
      />
    </div>
  );
});
