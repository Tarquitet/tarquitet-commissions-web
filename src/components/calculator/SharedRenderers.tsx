import React from 'react';
import OptionPill from './OptionPill';

export const CategoryGrid = ({ title, options, selection, onSelect, isMulti = false }: any) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-brand-red font-black text-[10px] uppercase tracking-[0.3em]">{title}</h4>
      {/* Usamos grid-cols-2 o 3 para que las tarjetas verticales quepan bien */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
