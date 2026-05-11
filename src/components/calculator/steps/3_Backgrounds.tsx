import React from 'react';
import StepLayout from '../../calculator/StepLayout';
import { CategoryGrid } from '../SharedRenderers';

export default function Step3Backgrounds({ groupedOptions, selections, setSelections }: any) {
  return (
    <StepLayout stepNumber={3} title="Fase de Fondos" subtitle="Entorno y ambientación">
      <CategoryGrid
        options={groupedOptions['BG']}
        selection={selections['BG']}
        onSelect={(v: string) => setSelections((p: any) => ({ ...p, BG: v }))}
        category="BG"
      />
    </StepLayout>
  );
}
