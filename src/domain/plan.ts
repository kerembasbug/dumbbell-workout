import { getExercise } from '@/data/exercises';
import type { Program } from '@/data/programs';
import { setsFromSuggestion, suggestNext } from '@/domain/overload';
import { lastPerformance } from '@/domain/progress';
import type { ExerciseLog, SetLog, UserProfile, WorkoutSession } from '@/domain/types';
import { pick, type Lang } from '@/i18n/localized';

/** Tek bir hareket için, geçmişe göre ayarlanmış başlangıç setleri. */
export function plannedSets(profile: UserProfile, exerciseId: string, history: WorkoutSession[]): SetLog[] {
  const ex = getExercise(exerciseId);
  if (!ex) return [];
  return setsFromSuggestion(suggestNext(profile, ex, lastPerformance(history, exerciseId)));
}

/** Program gününü, ağırlık ve tekrarları doldurulmuş bir antrenmana çevirir. */
export function buildProgramDay(
  profile: UserProfile,
  program: Program,
  dayIndex: number,
  history: WorkoutSession[],
  lang: Lang,
): { title: string; exercises: ExerciseLog[] } {
  const day = program.days[dayIndex % program.days.length];
  return {
    title: pick(lang, day.name),
    exercises: day.exercises
      .filter((id) => getExercise(id))
      .map((exerciseId) => ({ exerciseId, sets: plannedSets(profile, exerciseId, history) })),
  };
}
