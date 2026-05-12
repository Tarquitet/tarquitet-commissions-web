import React from 'react';

export default function Step5YCH({ ychData, ychSelection, setYchSelection }: any) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar snap-x">
      <button
        onClick={() => setYchSelection(null)}
        className={`min-w-[200px] h-48 rounded-2xl border flex flex-col items-center justify-center snap-start transition-all ${!ychSelection ? 'bg-brand-red border-brand-red text-black shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'}`}
      >
        <span className="font-black uppercase italic tracking-tighter text-lg">Custom Pose</span>
        <span className="text-[10px] uppercase font-bold opacity-60">Your own reference</span>
      </button>

      {ychData?.map((ych: any) => (
        <button
          key={ych.title}
          onClick={() => setYchSelection(ych)}
          className={`min-w-[200px] h-48 rounded-2xl border snap-start overflow-hidden relative transition-all ${ychSelection?.title === ych.title ? 'border-brand-red shadow-[0_0_15px_red] scale-[1.02]' : 'border-white/10 hover:border-white/30'}`}
        >
          <img src={ych.filename} className="absolute inset-0 w-full h-full object-cover opacity-60" alt={ych.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent p-4 flex flex-col justify-end">
            <span className="text-white font-black uppercase italic text-sm">{ych.title}</span>
            <span className="text-brand-red font-mono text-[10px] bg-black/50 w-fit px-2 py-0.5 rounded mt-1">
              {ych.price} USD
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
