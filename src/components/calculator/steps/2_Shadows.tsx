import React from 'react';
import StepLayout from '../../calculator/StepLayout';
import { CategoryGrid } from '../SharedRenderers';

export default function Step2Shadows({ groupedOptions, selections, setSelections }: any) {
  return (
    <StepLayout stepNumber={2} title="Fase de Sombras" subtitle="Define la profundidad de tu pieza">
      <CategoryGrid
        options={groupedOptions['SHADOW']}
        selection={selections['SHADOW']}
        onSelect={(v: string) => setSelections((p: any) => ({ ...p, SHADOW: v }))}
        category="SHADOW"
      />
    </StepLayout>
  );
}
