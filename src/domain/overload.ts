import type { LastPerformance } from '@/domain/progress';
import { GOAL_SCHEME, recommendWeight } from '@/domain/recommend';
import type { Exercise, SetLog, UserProfile } from '@/domain/types';
import { KG_PER_LB } from '@/domain/units';

/**
 * Kademeli yüklenme (progressive overload): kasın gelişmesi için yükün zamanla
 * artması gerekir. Bu modül geçen seferki performansa bakıp bir sonraki hedefi önerir.
 *
 *  - first:    hareket ilk kez yapılıyor → profil önerisi kullanılır.
 *  - increase: tüm setlerde aralığın üst sınırına ulaşıldı → bir sonraki ağırlığa geç.
 *  - reps:     daha ağır dambıl yok → aynı ağırlıkla tekrar sayısını artır.
 *  - repeat:   hedefe henüz ulaşılmadı → aynı ağırlıkla bir tekrar fazlasını dene.
 *  - lighten:  geçen sefer alt sınırın belirgin altında kalındı → bir kademe hafiflet.
 */
export type OverloadReason = 'first' | 'increase' | 'reps' | 'repeat' | 'lighten';

export interface OverloadSuggestion {
  weightKg: number;
  reps: number;
  sets: number;
  reason: OverloadReason;
  /** Geçen seferki çalışma ağırlığı (varsa). */
  previousWeightKg?: number;
}

/** Sahip olunan listeden bir sonraki daha ağır / hafif dambıl. */
function neighbour(current: number, owned: number[], dir: 1 | -1): number | null {
  const sorted = [...owned].filter((w) => w > 0).sort((a, b) => a - b);
  if (dir === 1) return sorted.find((w) => w > current + 0.01) ?? null;
  return [...sorted].reverse().find((w) => w < current - 0.01) ?? null;
}

/** Dambıl listesi yoksa piyasa kademesiyle bir adım artır/azalt. */
function marketStep(current: number, units: UserProfile['units'], dir: 1 | -1): number {
  if (units === 'imperial') {
    const lb = current / KG_PER_LB;
    const step = lb < 25 ? 2.5 : 5;
    return Math.max(step, lb + dir * step) * KG_PER_LB;
  }
  const step = current < 10 ? 1 : 2.5;
  return Math.max(1, current + dir * step);
}

export function suggestNext(
  profile: UserProfile,
  exercise: Exercise,
  last: LastPerformance | null,
): OverloadSuggestion {
  const scheme = GOAL_SCHEME[profile.goal];
  const [minRep, maxRep] = scheme.repRange;
  const mid = Math.round((minRep + maxRep) / 2);

  if (!last || last.sets.length === 0) {
    const rec = recommendWeight(profile, exercise);
    return { weightKg: rec.weightKg, reps: mid, sets: scheme.sets, reason: 'first' };
  }

  // Çalışma ağırlığı: o gün kullanılan en ağır dambıl.
  const working = Math.max(...last.sets.map((s) => s.weightKg));
  const workingSets = last.sets.filter((s) => Math.abs(s.weightKg - working) < 0.01);
  const minDone = Math.min(...workingSets.map((s) => s.reps));
  const bestReps = Math.max(...workingSets.map((s) => s.reps));
  const owned = profile.ownedDumbbellsKg ?? [];
  const units = profile.units ?? 'metric';

  const allTop = workingSets.length >= scheme.sets && minDone >= maxRep;
  if (allTop) {
    const heavier = owned.length > 0 ? neighbour(working, owned, 1) : marketStep(working, units, 1);
    if (heavier == null) {
      return {
        weightKg: working,
        reps: Math.min(maxRep + 4, bestReps + 1),
        sets: scheme.sets,
        reason: 'reps',
        previousWeightKg: working,
      };
    }
    return { weightKg: heavier, reps: minRep, sets: scheme.sets, reason: 'increase', previousWeightKg: working };
  }

  if (minDone <= minRep - 3) {
    const lighter = owned.length > 0 ? neighbour(working, owned, -1) : marketStep(working, units, -1);
    if (lighter != null) {
      return { weightKg: lighter, reps: mid, sets: scheme.sets, reason: 'lighten', previousWeightKg: working };
    }
  }

  return {
    weightKg: working,
    reps: Math.min(maxRep, Math.max(minRep, bestReps + 1)),
    sets: scheme.sets,
    reason: 'repeat',
    previousWeightKg: working,
  };
}

export function setsFromSuggestion(s: OverloadSuggestion): SetLog[] {
  return Array.from({ length: s.sets }, () => ({ reps: s.reps, weightKg: s.weightKg, done: false }));
}
