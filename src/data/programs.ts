import type { L } from '@/i18n/localized';
import type { Goal } from '@/domain/types';

export interface ProgramDay {
  name: L;
  exercises: string[];
}

export interface Program {
  id: string;
  name: L;
  summary: L;
  /** Hangi hedefe uygun (öneri sıralaması için). */
  goals: Goal[];
  level: 'beginner' | 'intermediate' | 'advanced';
  weeks: number;
  daysPerWeek: number;
  /** Yaklaşık süre, dakika. */
  minutes: number;
  /** Günler sırayla döner: A, B, A, B... */
  days: ProgramDay[];
}

export const PROGRAMS: Program[] = [
  {
    id: 'starter-fullbody',
    name: { tr: 'Başlangıç: Tüm Vücut', en: 'Starter: Full Body' },
    summary: {
      tr: 'Dambıla yeni başlayanlar için haftada 3 gün, 2 dönüşümlü tüm vücut antrenmanı.',
      en: 'Three full-body days a week with two alternating workouts, built for dumbbell beginners.',
    },
    goals: ['general', 'hypertrophy', 'fatloss'],
    level: 'beginner',
    weeks: 4,
    daysPerWeek: 3,
    minutes: 35,
    days: [
      {
        name: { tr: 'Tüm Vücut A', en: 'Full Body A' },
        exercises: ['goblet-squat', 'db-floor-press', 'one-arm-row', 'shoulder-press', 'weighted-crunch'],
      },
      {
        name: { tr: 'Tüm Vücut B', en: 'Full Body B' },
        exercises: ['rdl', 'db-bench-press', 'bent-over-row', 'lateral-raise', 'biceps-curl', 'overhead-triceps-ext'],
      },
    ],
  },
  {
    id: 'muscle-upper-lower',
    name: { tr: 'Kas Gelişimi: Alt / Üst', en: 'Muscle Builder: Upper / Lower' },
    summary: {
      tr: 'Haftada 4 gün; üst ve alt vücudu ayrı günlerde, yüksek hacimle çalıştırır.',
      en: 'Four days a week splitting upper and lower body for higher training volume.',
    },
    goals: ['hypertrophy', 'strength'],
    level: 'intermediate',
    weeks: 6,
    daysPerWeek: 4,
    minutes: 45,
    days: [
      {
        name: { tr: 'Üst Vücut A', en: 'Upper A' },
        exercises: ['db-bench-press', 'one-arm-row', 'shoulder-press', 'db-fly', 'biceps-curl', 'triceps-kickback'],
      },
      {
        name: { tr: 'Alt Vücut A', en: 'Lower A' },
        exercises: ['goblet-squat', 'rdl', 'db-lunge', 'calf-raise', 'russian-twist'],
      },
      {
        name: { tr: 'Üst Vücut B', en: 'Upper B' },
        exercises: ['db-floor-press', 'bent-over-row', 'lateral-raise', 'db-pullover', 'hammer-curl', 'overhead-triceps-ext'],
      },
      {
        name: { tr: 'Alt Vücut B', en: 'Lower B' },
        exercises: ['db-deadlift', 'db-lunge', 'goblet-squat', 'calf-raise', 'weighted-crunch'],
      },
    ],
  },
  {
    id: 'fatloss-circuit',
    name: { tr: 'Yağ Yakımı: Devre', en: 'Fat Burn: Circuit' },
    summary: {
      tr: 'Kısa dinlenmeli, tüm vücudu çalıştıran bileşik hareketlerle haftada 3 gün.',
      en: 'Three days a week of compound full-body moves with short rest periods.',
    },
    goals: ['fatloss', 'endurance', 'general'],
    level: 'beginner',
    weeks: 4,
    daysPerWeek: 3,
    minutes: 30,
    days: [
      {
        name: { tr: 'Devre A', en: 'Circuit A' },
        exercises: ['db-thruster', 'renegade-row', 'goblet-squat', 'db-floor-press', 'russian-twist'],
      },
      {
        name: { tr: 'Devre B', en: 'Circuit B' },
        exercises: ['db-deadlift', 'db-lunge', 'bent-over-row', 'shoulder-press', 'side-bend'],
      },
    ],
  },
  {
    id: 'strength-ppl',
    name: { tr: 'Güç: İt / Çek / Bacak', en: 'Strength: Push / Pull / Legs' },
    summary: {
      tr: 'Ağır ve az tekrarlı çalışma; itiş, çekiş ve bacak günleriyle haftada 3 gün.',
      en: 'Heavy, low-rep training across push, pull and leg days, three days a week.',
    },
    goals: ['strength', 'hypertrophy'],
    level: 'advanced',
    weeks: 6,
    daysPerWeek: 3,
    minutes: 50,
    days: [
      {
        name: { tr: 'İtiş', en: 'Push' },
        exercises: ['db-bench-press', 'shoulder-press', 'db-floor-press', 'overhead-triceps-ext', 'lateral-raise'],
      },
      {
        name: { tr: 'Çekiş', en: 'Pull' },
        exercises: ['bent-over-row', 'one-arm-row', 'db-pullover', 'hammer-curl', 'concentration-curl'],
      },
      {
        name: { tr: 'Bacak', en: 'Legs' },
        exercises: ['goblet-squat', 'rdl', 'db-lunge', 'calf-raise', 'weighted-crunch'],
      },
    ],
  },
  {
    id: 'express-arms-core',
    name: { tr: '20 Dakika: Kol & Karın', en: '20 Minutes: Arms & Core' },
    summary: {
      tr: 'Vakti az olanlar için haftada 2 gün, kol ve karın odaklı hızlı antrenman.',
      en: 'A quick arms and core session, twice a week, for busy days.',
    },
    goals: ['general', 'hypertrophy', 'endurance'],
    level: 'beginner',
    weeks: 4,
    daysPerWeek: 2,
    minutes: 20,
    days: [
      {
        name: { tr: 'Kol & Karın', en: 'Arms & Core' },
        exercises: ['biceps-curl', 'overhead-triceps-ext', 'hammer-curl', 'triceps-kickback', 'russian-twist', 'weighted-crunch'],
      },
    ],
  },
];

export const PROGRAM_BY_ID: Record<string, Program> = Object.fromEntries(PROGRAMS.map((p) => [p.id, p]));

export function totalWorkouts(p: Program): number {
  return p.weeks * p.daysPerWeek;
}

export interface ProgramPosition {
  dayIndex: number;
  week: number;
  /** Bu haftadaki kaçıncı antrenman (1'den). */
  dayOfWeek: number;
  completed: number;
  total: number;
  finished: boolean;
}

/** Tamamlanan antrenman sayısından sıradaki günü hesaplar. */
export function programPosition(p: Program, completed: number): ProgramPosition {
  const total = totalWorkouts(p);
  const finished = completed >= total;
  const c = Math.min(completed, total - 1);
  return {
    dayIndex: completed % p.days.length,
    week: Math.floor(c / p.daysPerWeek) + 1,
    dayOfWeek: (c % p.daysPerWeek) + 1,
    completed,
    total,
    finished,
  };
}

/** Profile en uygun programları önce sıralar. */
export function rankPrograms(goal: Goal, experience: Program['level']): Program[] {
  const levelOrder = { beginner: 0, intermediate: 1, advanced: 2 };
  return [...PROGRAMS].sort((a, b) => {
    const ga = a.goals.indexOf(goal) === -1 ? 9 : a.goals.indexOf(goal);
    const gb = b.goals.indexOf(goal) === -1 ? 9 : b.goals.indexOf(goal);
    if (ga !== gb) return ga - gb;
    return Math.abs(levelOrder[a.level] - levelOrder[experience]) - Math.abs(levelOrder[b.level] - levelOrder[experience]);
  });
}
