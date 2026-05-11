import { memo } from 'react';
import { OptionPill } from '../OptionPill';

export default memo(function StepLights({ options, selections, setSelections }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt: any) => (
          <OptionPill
            key={opt.label}
            label={opt.label}
            value={opt.value}
            isSelected={selections['LIGHT'] === opt.label}
            onClick={() => setSelections((prev: any) => ({ ...prev, LIGHT: opt.label }))}
          />
        ))}
      </div>
    </div>
  );
});
