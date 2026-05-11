import React from 'react';
import StepLayout from '../../calculator/StepLayout';
import { CategoryGrid } from '../SharedRenderers';

export default function Step6Licenses({ groupedOptions, multiSelections, setMultiSelections }: any) {
  return (
    <StepLayout stepNumber={6} title="Licencias y Derechos" subtitle="Define el uso comercial de la pieza">
      <CategoryGrid
        options={[{ label: 'Uso Personal', value: '$0' }, ...(groupedOptions['LICENSE'] || [])]}
        selection={multiSelections['LICENSE']}
        isMulti={true}
        onSelect={(val: string[]) => {
          if (val.includes('Uso Personal') || val.length === 0) setMultiSelections((p: any) => ({ ...p, LICENSE: [] }));
          else setMultiSelections((p: any) => ({ ...p, LICENSE: val.filter((v) => v !== 'Uso Personal') }));
        }}
        category="LICENSE"
      />
    </StepLayout>
  );
}
