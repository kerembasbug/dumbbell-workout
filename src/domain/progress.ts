import { addWeeks, differenceInCalendarWeeks, format, startOfWeek } from 'date-fns';

import type { SetLog, WorkoutSession } from '@/domain/types';

/** Hafta pazartesi başlar (Türkiye ve ISO standardı). */
const WEEK = { weekStartsOn: 1 as const };

export function setVolume(s: SetLog): number {
  return s.done ? s.reps * s.weightKg : 0;
}

export function sessionVolume(session: WorkoutSession): number {
  return session.exercises.reduce((sum, e) => sum + e.sets.reduce((a, s) => a + setVolume(s), 0), 0);
}

export function sessionDoneSets(session: WorkoutSession): number {
  return session.exercises.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0);
}

/**
 * Tahmini tek tekrar maksimumu (Epley formülü). Farklı ağırlık/tekrar
 * kombinasyonlarını tek bir "güç" sayısıyla kıyaslamayı sağlar.
 */
export function estimate1RM(weightKg: number, reps: number): number {
  if (weightKg <= 0 || reps <= 0) return 0;
  if (reps === 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

export interface LastPerformance {
  date: string;
  sessionId: string;
  sets: SetLog[];
}

/** Bir egzersizin en son yapıldığı antrenmandaki tamamlanmış setleri. */
export function lastPerformance(
  sessions: WorkoutSession[],
  exerciseId: string,
  excludeSessionId?: string,
): LastPerformance | null {
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
  for (const s of sorted) {
    if (s.id === excludeSessionId) continue;
    const log = s.exercises.find((e) => e.exerciseId === exerciseId);
    const done = log?.sets.filter((x) => x.done) ?? [];
    if (done.length > 0) return { date: s.date, sessionId: s.id, sets: done };
  }
  return null;
}

export interface BestSet {
  weightKg: number;
  reps: number;
  e1rm: number;
  date: string;
}

/** Egzersiz başına en iyi set (tahmini 1RM'e göre). */
export function bestSets(sessions: WorkoutSession[], excludeSessionId?: string): Record<string, BestSet> {
  const best: Record<string, BestSet> = {};
  for (const s of sessions) {
    if (s.id === excludeSessionId) continue;
    for (const e of s.exercises) {
      for (const set of e.sets) {
        if (!set.done) continue;
        const e1rm = estimate1RM(set.weightKg, set.reps);
        if (!best[e.exerciseId] || e1rm > best[e.exerciseId].e1rm) {
          best[e.exerciseId] = { weightKg: set.weightKg, reps: set.reps, e1rm, date: s.date };
        }
      }
    }
  }
  return best;
}

export interface NewRecord {
  exerciseId: string;
  previous: BestSet;
  current: BestSet;
}

/**
 * Bu antrenmanda kırılan kişisel rekorlar. İlk kez yapılan hareket rekor sayılmaz,
 * çünkü kıyaslanacak bir önceki değer yok.
 */
export function newRecords(session: WorkoutSession, previousSessions: WorkoutSession[]): NewRecord[] {
  const before = bestSets(previousSessions, session.id);
  const now = bestSets([session]);
  const out: NewRecord[] = [];
  for (const [exerciseId, cur] of Object.entries(now)) {
    const prev = before[exerciseId];
    if (prev && cur.e1rm > prev.e1rm + 0.01) out.push({ exerciseId, previous: prev, current: cur });
  }
  return out;
}

function weekKey(d: Date): string {
  return format(startOfWeek(d, WEEK), 'yyyy-MM-dd');
}

/**
 * Haftalık seri: art arda kaç haftada en az bir antrenman yapıldı.
 * Bu hafta henüz antrenman yoksa seri bozulmuş sayılmaz, geçen haftadan sayılır.
 */
export function weekStreak(sessions: WorkoutSession[], now: Date = new Date()): number {
  const weeks = new Set(sessions.map((s) => weekKey(new Date(s.date))));
  let cursor = startOfWeek(now, WEEK);
  if (!weeks.has(weekKey(cursor))) cursor = addWeeks(cursor, -1);
  let streak = 0;
  while (weeks.has(weekKey(cursor))) {
    streak += 1;
    cursor = addWeeks(cursor, -1);
  }
  return streak;
}

export function workoutsThisWeek(sessions: WorkoutSession[], now: Date = new Date()): number {
  const key = weekKey(now);
  return sessions.filter((s) => weekKey(new Date(s.date)) === key).length;
}

export interface WeekBucket {
  weekStart: string;
  volume: number;
  count: number;
}

/** Son `weeks` haftanın toplam hacmi ve antrenman sayısı (eskiden yeniye). */
export function weeklySeries(sessions: WorkoutSession[], weeks = 8, now: Date = new Date()): WeekBucket[] {
  const current = startOfWeek(now, WEEK);
  const buckets: WeekBucket[] = Array.from({ length: weeks }, (_, i) => ({
    weekStart: format(addWeeks(current, i - (weeks - 1)), 'yyyy-MM-dd'),
    volume: 0,
    count: 0,
  }));
  for (const s of sessions) {
    const d = new Date(s.date);
    const idx = weeks - 1 - differenceInCalendarWeeks(current, d, WEEK);
    if (idx >= 0 && idx < weeks) {
      buckets[idx].volume += sessionVolume(s);
      buckets[idx].count += 1;
    }
  }
  return buckets;
}

/** Antrenman yapılan günler (yyyy-MM-dd), takvim ısı haritası için. */
export function activeDays(sessions: WorkoutSession[]): Set<string> {
  return new Set(sessions.map((s) => format(new Date(s.date), 'yyyy-MM-dd')));
}

export function totalVolume(sessions: WorkoutSession[]): number {
  return sessions.reduce((sum, s) => sum + sessionVolume(s), 0);
}
