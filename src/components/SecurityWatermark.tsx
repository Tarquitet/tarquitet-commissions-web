// src/components/SecurityWatermark.tsx
export default function SecurityWatermark() {
  return (
    <div className="absolute inset-0 z-[15] flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-30 mix-blend-overlay">
      <div className="transform -rotate-[35deg] flex flex-col gap-8 md:gap-16 w-[150%]">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <span
            key={i}
            className="text-white font-black text-3xl md:text-5xl uppercase tracking-[0.4em] whitespace-nowrap drop-shadow-lg"
          >
            PREVIEW ONLY // DO NOT STEAL // PREVIEW ONLY // DO NOT STEAL // PREVIEW ONLY
          </span>
        ))}
      </div>
    </div>
  );
}
