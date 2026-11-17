import { describe, expect, it } from '@jest/globals';

import { PROGRAMS, programPosition, rankPrograms, totalWorkouts } from '@/data/programs';
import { getExercise } from '@/data/exercises';
import { suggestNext } from '@/domain/overload';
import {
  estimate1RM,
  lastPerformance,
  newRecords,
  sessionVolume,
  weekStreak,
  weeklySeries,
  workoutsThisWeek,
} from '@/domain/progress';
import type { SetLog, UserProfile, WorkoutSession } from '@/domain/types';
import { fromDisplay, roundToMarketStep, toDisplay } from '@/domain/units';

const profile: UserProfile = {
  goal: 'hypertrophy',
  experience: 'intermediate',
  sex: 'male',
  weightKg: 80,
  heightCm: 180,
  ownedDumbbellsKg: [],
  units: 'metric',
};

const sets = (n: number, reps: number, kg: number, done = true): SetLog[] =>
  Array.from({ length: n }, () => ({ reps, weightKg: kg, done }));

const session = (id: string, date: string, exId: string, s: SetLog[]): WorkoutSession => ({
  id,
  date,
  region: 'chest',
  completed: true,
  exercises: [{ exerciseId: exId, sets: s }],
});

describe('progress', () => {
  it('Epley 1RM', () => {
    expect(estimate1RM(20, 1)).toBe(20);
    expect(estimate1RM(20, 10)).toBeCloseTo(26.67, 1);
    expect(estimate1RM(0, 10)).toBe(0);
  });

  it('hacim yalnız tamamlanan setleri sayar', () => {
    const s = session('a', '2026-11-10T10:00:00Z', 'db-bench-press', [
      ...sets(2, 10, 20),
      { reps: 10, weightKg: 20, done: false },
    ]);
    expect(sessionVolume(s)).toBe(400);
  });

  it('son performans en yeni antrenmandan gelir', () => {
    const old = session('a', '2026-11-01T10:00:00Z', 'db-bench-press', sets(3, 8, 15));
    const recent = session('b', '2026-11-08T10:00:00Z', 'db-bench-press', sets(3, 10, 17.5));
    const last = lastPerformance([old, recent], 'db-bench-press');
    expect(last?.sessionId).toBe('b');
    expect(last?.sets[0].weightKg).toBe(17.5);
    expect(lastPerformance([old], 'db-fly')).toBeNull();
  });

  it('rekor: yalnız önceki değer aşılınca, ilk seferde değil', () => {
    const prev = session('a', '2026-11-01T10:00:00Z', 'db-bench-press', sets(3, 10, 15));
    const better = session('b', '2026-11-08T10:00:00Z', 'db-bench-press', sets(3, 10, 17.5));
    expect(newRecords(better, [prev])).toHaveLength(1);
    expect(newRecords(prev, [])).toHaveLength(0);
  });

  it('haftalık seri: bu hafta boşsa geçen haftadan sayar', () => {
    const now = new Date('2026-11-18T12:00:00'); // Çarşamba
    const s = [
      session('a', '2026-11-11T10:00:00', 'x', sets(1, 1, 1)), // geçen hafta
      session('b', '2026-11-04T10:00:00', 'x', sets(1, 1, 1)), // 2 hafta önce
    ];
    expect(weekStreak(s, now)).toBe(2);
    expect(workoutsThisWeek(s, now)).toBe(0);
    s.push(session('c', '2026-11-17T10:00:00', 'x', sets(1, 1, 1)));
    expect(weekStreak(s, now)).toBe(3);
    expect(weekStreak([session('d', '2026-10-01T10:00:00', 'x', sets(1, 1, 1))], now)).toBe(0);
  });

  it('haftalık seri grafiği doğru kovaya düşer', () => {
    const now = new Date('2026-11-18T12:00:00');
    const series = weeklySeries([session('a', '2026-11-17T10:00:00', 'x', sets(2, 10, 10))], 4, now);
    expect(series).toHaveLength(4);
    expect(series[3].volume).toBe(200);
    expect(series[3].count).toBe(1);
  });
});

describe('overload', () => {
  const ex = getExercise('db-bench-press')!;
  const last = (s: SetLog[]) => ({ date: '2026-11-10', sessionId: 'a', sets: s });

  it('ilk seferde profil önerisini kullanır', () => {
    expect(suggestNext(profile, ex, null).reason).toBe('first');
  });

  it('tüm setlerde üst sınıra ulaşınca ağırlığı artırır', () => {
    const s = suggestNext(profile, ex, last(sets(4, 12, 20)));
    expect(s.reason).toBe('increase');
    expect(s.weightKg).toBe(22.5);
    expect(s.reps).toBe(8);
  });

  it('sahip olunan dambıllara göre bir sonrakini seçer, yoksa tekrar artırır', () => {
    const owned = { ...profile, ownedDumbbellsKg: [10, 15, 20] };
    expect(suggestNext(owned, ex, last(sets(4, 12, 15))).weightKg).toBe(20);
    const top = suggestNext(owned, ex, last(sets(4, 12, 20)));
    expect(top.reason).toBe('reps');
    expect(top.weightKg).toBe(20);
  });

  it('hedefe ulaşılmadıysa aynı ağırlıkla bir tekrar fazlası', () => {
    const s = suggestNext(profile, ex, last(sets(4, 9, 20)));
    expect(s.reason).toBe('repeat');
    expect(s.weightKg).toBe(20);
    expect(s.reps).toBe(10);
  });

  it('çok zorlanıldıysa hafifletir', () => {
    const s = suggestNext(profile, ex, last(sets(4, 4, 20)));
    expect(s.reason).toBe('lighten');
    expect(s.weightKg).toBe(17.5);
  });
});

describe('programs', () => {
  it('sıradaki günü ve haftayı hesaplar', () => {
    const p = PROGRAMS[0];
    expect(programPosition(p, 0)).toMatchObject({ dayIndex: 0, week: 1, dayOfWeek: 1, finished: false });
    expect(programPosition(p, 4)).toMatchObject({ dayIndex: 0, week: 2, dayOfWeek: 2 });
    expect(programPosition(p, totalWorkouts(p)).finished).toBe(true);
  });

  it('hedefe uygun programı öne alır', () => {
    expect(rankPrograms('strength', 'advanced')[0].id).toBe('strength-ppl');
    expect(rankPrograms('fatloss', 'beginner')[0].id).toBe('fatloss-circuit');
  });
});

describe('units', () => {
  it('lb gösterimi geri çevrilince aynı kalır', () => {
    expect(toDisplay(fromDisplay(25, 'imperial'), 'imperial')).toBe(25);
    expect(toDisplay(roundToMarketStep(7.3, 'imperial'), 'imperial')).toBe(15);
    expect(roundToMarketStep(7.3, 'metric')).toBe(7.5);
  });
});
