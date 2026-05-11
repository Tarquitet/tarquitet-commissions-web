import React from 'react';
import { CategoryGrid } from '../SharedRenderers';

export default function Step6PSD({ groupedOptions, multiSelections, setMultiSelections }: any) {
  return (
    <CategoryGrid
      options={groupedOptions['PSD']}
      selection={multiSelections['PSD']}
      isMulti={true}
      onSelect={(v: any) => setMultiSelections((p: any) => ({ ...p, PSD: v }))}
      category="PSD"
    />
  );
}
