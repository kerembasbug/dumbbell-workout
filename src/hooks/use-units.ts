import { useCallback } from 'react';

import type { Units } from '@/domain/types';
import { COMMON_DUMBBELLS, formatWeight, fromDisplay, toDisplay, unitLabel, weightStep } from '@/domain/units';
import { useProfileStore } from '@/store/profile';

/** Profildeki birime (kg/lb) göre ağırlık gösterim yardımcıları. */
export function useUnits() {
  const units: Units = useProfileStore((s) => s.profile?.units) ?? 'metric';
  const fmt = useCallback((kg: number) => formatWeight(kg, units), [units]);
  const fmtVolume = useCallback(
    (kg: number) => `${Math.round(toDisplay(kg, units)).toLocaleString()} ${unitLabel(units)}`,
    [units],
  );
  return {
    units,
    label: unitLabel(units),
    fmt,
    fmtVolume,
    toDisplay: (kg: number) => toDisplay(kg, units),
    fromDisplay: (v: number) => fromDisplay(v, units),
    step: weightStep(units),
    common: COMMON_DUMBBELLS[units],
  };
}
