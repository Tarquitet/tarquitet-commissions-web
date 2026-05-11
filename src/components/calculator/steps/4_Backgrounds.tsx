import React from 'react';
import { CategoryGrid } from '../SharedRenderers';

export default function Step4Backgrounds({ groupedOptions, selections, setSelections }: any) {
  return (
    <CategoryGrid
      options={groupedOptions['BG']}
      selection={selections['BG']}
      onSelect={(v: string) => setSelections((p: any) => ({ ...p, BG: v }))}
      category="BG"
    />
  );
}
