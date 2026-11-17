import type { Units } from '@/domain/types';

/** Uygulama içinde ağırlık her zaman kg tutulur; yalnızca gösterim birime çevrilir. */
export const KG_PER_LB = 0.45359237;

export const COMMON_DUMBBELLS: Record<Units, number[]> = {
  metric: [2, 2.5, 4, 5, 6, 7.5, 8, 10, 12, 12.5, 14, 15, 16, 17.5, 20, 22.5, 24, 25, 30],
  imperial: [3, 5, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
};

export function unitLabel(units: Units): string {
  return units === 'imperial' ? 'lb' : 'kg';
}

/** kg → gösterim değeri (kg: 0.1 hassasiyet, lb: 0.5 hassasiyet). */
export function toDisplay(kg: number, units: Units): number {
  if (units === 'imperial') return Math.round((kg / KG_PER_LB) * 2) / 2;
  return Math.round(kg * 10) / 10;
}

/** Gösterim değeri → kg (lb ise tam karşılığı; geri çevrildiğinde aynı lb'ye döner). */
export function fromDisplay(value: number, units: Units): number {
  return units === 'imperial' ? value * KG_PER_LB : value;
}

export function formatWeight(kg: number, units: Units): string {
  return `${toDisplay(kg, units)} ${unitLabel(units)}`;
}

/** Ağırlık artırma adımı (gösterim biriminde). */
export function weightStep(units: Units): number {
  return units === 'imperial' ? 5 : 2.5;
}

/**
 * Hesaplanan ham ağırlığı, piyasada bulunan dambıl kademelerine yuvarlar.
 * kg: 10 altı 0.5 kg, üstü 1 kg. lb: 25 altı 2.5 lb, üstü 5 lb.
 */
export function roundToMarketStep(kg: number, units: Units): number {
  if (kg <= 0) return 0;
  if (units === 'imperial') {
    const lb = kg / KG_PER_LB;
    const step = lb < 25 ? 2.5 : 5;
    return (Math.round(lb / step) * step) * KG_PER_LB;
  }
  if (kg < 10) return Math.round(kg * 2) / 2;
  return Math.round(kg);
}
