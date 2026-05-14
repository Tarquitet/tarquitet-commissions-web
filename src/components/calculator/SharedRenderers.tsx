import React from 'react';
import { OptionPill } from './OptionPill';

export const CategoryGrid = ({ title, options, selection, onSelect, isMulti = false }: any) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-4">
      {title && <h4 className="text-brand-red font-black text-[10px] uppercase tracking-[0.3em]">{title}</h4>}

      {/* AQUÍ ESTÁ LA SOLUCIÓN: Cambiamos el Grid por una Lista Vertical */}
      <div className="flex flex-col gap-3">
        {options.map((opt: any) => {
          const isSelected = isMulti ? selection?.includes(opt.label) : selection === opt.label;
          return (
            <OptionPill
              key={opt.label}
              {...opt}
              isSelected={isSelected}
              onClick={() => {
                if (isMulti) {
                  const current = selection || [];
                  onSelect(
                    current.includes(opt.label) ? current.filter((l: any) => l !== opt.label) : [...current, opt.label],
                  );
                } else {
                  onSelect(opt.label);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
