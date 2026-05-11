import React from 'react';
import StepLayout from '../../calculator/StepLayout';
import { CategoryGrid } from '../SharedRenderers';

export default function Step5PSD({ groupedOptions, multiSelections, setMultiSelections }: any) {
  return (
    <StepLayout stepNumber={5} title="Archivos Fuente (.PSD)" subtitle="Archivos editables por capas">
      <CategoryGrid
        options={groupedOptions['PSD']}
        selection={multiSelections['PSD']}
        isMulti={true}
        onSelect={(v: any) => setMultiSelections((p: any) => ({ ...p, PSD: v }))}
        category="PSD"
      />
    </StepLayout>
  );
}
