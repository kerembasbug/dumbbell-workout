import type { Exercise, Goal, Experience, Sex, UserProfile } from '@/domain/types';

/**
 * Öneri motoru — iki yönlü çalışır:
 *  A) Profil → önerilen ağırlık (kg) + set/tekrar şeması.
 *  B) Eldeki belirli bir dumbbell ağırlığı → uygun set/tekrar + uyarı.
 *
 * Tüm öneriler rehber niteliğindedir, tıbbi tavsiye değildir.
 */

export interface RepScheme {
  sets: number;
  /** Önerilen tekrar aralığı [min, max]. */
  repRange: [number, number];
  restSec: number;
  label: string;
}

export const GOAL_SCHEME: Record<Goal, RepScheme> = {
  strength: { sets: 4, repRange: [4, 6], restSec: 150, label: 'Güç' },
  hypertrophy: { sets: 4, repRange: [8, 12], restSec: 90, label: 'Kas Gelişimi' },
  endurance: { sets: 3, repRange: [15, 20], restSec: 45, label: 'Dayanıklılık' },
  fatloss: { sets: 3, repRange: [12, 18], restSec: 45, label: 'Yağ Yakımı' },
  general: { sets: 3, repRange: [10, 12], restSec: 75, label: 'Genel Fitness' },
};

const EXPERIENCE_FACTOR: Record<Experience, number> = {
  beginner: 0.65,
  intermediate: 1.0,
  advanced: 1.3,
};

const SEX_FACTOR: Record<Sex, number> = {
  male: 1.0,
  female: 0.65,
  unspecified: 0.82,
};

const GOAL_LOAD_FACTOR: Record<Goal, number> = {
  strength: 1.15,
  hypertrophy: 1.0,
  general: 0.9,
  endurance: 0.75,
  fatloss: 0.75,
};

/** Bir değeri verilen ağırlık listesindeki en yakına yuvarlar. */
export function nearestOwned(target: number, owned: number[]): number | null {
  const valid = owned.filter((w) => w > 0).sort((a, b) => a - b);
  if (valid.length === 0) return null;
  return valid.reduce((best, w) =>
    Math.abs(w - target) < Math.abs(best - target) ? w : best,
  );
}

/** Sahip olunan dumbbell yoksa makul bir kademeye yuvarlar (0.5 kg adım, küçükse). */
function roundToStep(value: number): number {
  if (value <= 0) return 0;
  if (value < 10) return Math.round(value * 2) / 2; // 0.5 kg
  return Math.round(value); // 1 kg
}

export interface WeightRecommendation {
  /** Ham (yuvarlanmamış) hesaplanan ağırlık, kg. */
  rawKg: number;
  /** Kullanıcıya gösterilecek önerilen ağırlık, kg. */
  weightKg: number;
  /** Sahip olunan dumbbell'a yuvarlandı mı? */
  matchedOwned: boolean;
  scheme: RepScheme;
  mode: 'single' | 'pair';
}

/** A) Profil + egzersiz → önerilen ağırlık ve set/tekrar. */
export function recommendWeight(profile: UserProfile, exercise: Exercise): WeightRecommendation {
  const scheme = GOAL_SCHEME[profile.goal];
  const raw =
    profile.weightKg *
    exercise.baseLoadFactor *
    EXPERIENCE_FACTOR[profile.experience] *
    SEX_FACTOR[profile.sex] *
    GOAL_LOAD_FACTOR[profile.goal];

  const ownedMatch = nearestOwned(raw, profile.ownedDumbbellsKg);
  const weightKg = ownedMatch != null ? ownedMatch : roundToStep(raw);

  return {
    rawKg: Math.round(raw * 10) / 10,
    weightKg,
    matchedOwned: ownedMatch != null,
    scheme,
    mode: exercise.mode,
  };
}

export type LoadVerdict = 'tooLight' | 'good' | 'tooHeavy';

export interface RepRecommendation {
  sets: number;
  reps: number;
  repRange: [number, number];
  restSec: number;
  verdict: LoadVerdict;
  message: string;
}

/**
 * B) Eldeki belirli bir ağırlık → uygun set/tekrar.
 * Seçilen ağırlık, profil için hesaplanan ideal ağırlıkla karşılaştırılır:
 *  - Çok hafifse: tekrarları artır (uyarı: daha ağır gerekebilir).
 *  - Çok ağırsa: tekrarları azalt (uyarı: forma dikkat / daha hafif öner).
 *  - Uygunsa: hedef tekrar aralığını koru.
 */
export function recommendRepsForWeight(
  profile: UserProfile,
  exercise: Exercise,
  selectedKg: number,
): RepRecommendation {
  const scheme = GOAL_SCHEME[profile.goal];
  const [minRep, maxRep] = scheme.repRange;
  const midRep = Math.round((minRep + maxRep) / 2);

  const ideal = recommendWeight(profile, exercise).rawKg || 1;
  const ratio = selectedKg / ideal;

  let verdict: LoadVerdict = 'good';
  let reps = midRep;
  let message = `Bu ağırlık hedefin için uygun. ${scheme.sets} set × ${minRep}-${maxRep} tekrar yap.`;

  if (ratio < 0.7) {
    verdict = 'tooLight';
    reps = maxRep + Math.round((maxRep - minRep) * 0.5);
    message = `Bu ağırlık hedefin için hafif kalıyor. Tekrarları ${reps}'e çıkar ya da daha ağır bir dumbbell dene.`;
  } else if (ratio > 1.35) {
    verdict = 'tooHeavy';
    reps = Math.max(3, minRep - 2);
    message = `Bu ağırlık zorlayıcı. Forma dikkat ederek ${scheme.sets} set × ${reps} tekrar yap; gerekirse daha hafifini seç.`;
  }

  return {
    sets: scheme.sets,
    reps,
    repRange: scheme.repRange,
    restSec: scheme.restSec,
    verdict,
    message,
  };
}

/** Set/tekrar şemasından başlangıç set kayıtları üretir. */
export function buildInitialSets(
  weightKg: number,
  scheme: RepScheme,
): { reps: number; weightKg: number; done: boolean }[] {
  const reps = Math.round((scheme.repRange[0] + scheme.repRange[1]) / 2);
  return Array.from({ length: scheme.sets }, () => ({ reps, weightKg, done: false }));
}
