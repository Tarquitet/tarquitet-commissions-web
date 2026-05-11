import React from 'react';
import { CategoryGrid } from '../SharedRenderers';

export default function Step7Licenses({ groupedOptions, multiSelections, setMultiSelections }: any) {
  return (
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
  );
}
