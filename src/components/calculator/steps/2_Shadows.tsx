import React from 'react';
import { CategoryGrid } from '../SharedRenderers';

export default function Step2Shadows({ groupedOptions, selections, setSelections }: any) {
  return (
    <CategoryGrid
      options={groupedOptions['SHADOW']}
      selection={selections['SHADOW']}
      onSelect={(v: string) => setSelections((p: any) => ({ ...p, SHADOW: v }))}
      category="SHADOW"
    />
  );
}
