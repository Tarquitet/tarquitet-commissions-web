import React from 'react';

interface StepLayoutProps {
  stepNumber: number | string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function StepLayout({ stepNumber, title, subtitle, children }: StepLayoutProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-white font-black text-3xl uppercase italic tracking-tighter mb-1">
          {stepNumber ? `Paso ${stepNumber}: ` : ''}
          {title}
        </h2>
        <p className="text-white/40 font-bold text-xs uppercase tracking-widest">{subtitle}</p>
      </div>

      {/* Aquí es donde se "inyecta" el contenido único de cada paso */}
      <div className="pt-2">{children}</div>
    </div>
  );
}
