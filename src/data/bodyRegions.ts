import type { BodyRegion } from '@/domain/types';

export interface BodyRegionInfo {
  id: BodyRegion;
  name: string; // Türkçe ad
  nameEn: string;
  description: string;
}

export const BODY_REGIONS: BodyRegionInfo[] = [
  { id: 'chest', name: 'Göğüs', nameEn: 'Chest', description: 'Göğüs kasları (pektoral)' },
  { id: 'back', name: 'Sırt', nameEn: 'Back', description: 'Sırt ve kanat kasları' },
  { id: 'shoulders', name: 'Omuz', nameEn: 'Shoulders', description: 'Deltoid kasları' },
  { id: 'biceps', name: 'Biceps', nameEn: 'Biceps', description: 'Ön kol — pazı' },
  { id: 'triceps', name: 'Triceps', nameEn: 'Triceps', description: 'Arka kol' },
  { id: 'legs', name: 'Bacak', nameEn: 'Legs', description: 'Quadriceps, hamstring, kalça' },
  { id: 'core', name: 'Karın', nameEn: 'Core', description: 'Karın ve gövde merkezi' },
  { id: 'fullbody', name: 'Tüm Vücut', nameEn: 'Full Body', description: 'Kombine hareketler' },
];

export const REGION_BY_ID: Record<BodyRegion, BodyRegionInfo> = BODY_REGIONS.reduce(
  (acc, r) => {
    acc[r.id] = r;
    return acc;
  },
  {} as Record<BodyRegion, BodyRegionInfo>,
);

export function regionName(id: BodyRegion): string {
  return REGION_BY_ID[id]?.name ?? id;
}
