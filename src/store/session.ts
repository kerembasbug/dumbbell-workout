import { create } from 'zustand';

import type { BodyRegion, ExerciseLog, SetLog, WorkoutSession } from '@/domain/types';

interface ActiveSession {
  region: BodyRegion;
  exercises: ExerciseLog[];
  startedAt: number;
}

interface SessionState {
  active: ActiveSession | null;
  startSession: (region: BodyRegion) => void;
  /** Egzersizi aktif antrenmana ekler; zaten varsa setlerini değiştirmez. */
  addExercise: (exerciseId: string, sets: SetLog[]) => void;
  removeExercise: (exIndex: number) => void;
  updateSet: (exIndex: number, setIndex: number, patch: Partial<SetLog>) => void;
  toggleSetDone: (exIndex: number, setIndex: number) => void;
  addSet: (exIndex: number) => void;
  removeSet: (exIndex: number, setIndex: number) => void;
  hasExercise: (exerciseId: string) => boolean;
  /** Antrenmanı tamamlar ve kaydedilebilir oturum nesnesi döner. */
  finish: () => WorkoutSession | null;
  discard: () => void;
}

function mutateExercises(
  state: SessionState,
  fn: (exercises: ExerciseLog[]) => ExerciseLog[],
): Partial<SessionState> {
  if (!state.active) return {};
  return { active: { ...state.active, exercises: fn(state.active.exercises) } };
}

export const useSessionStore = create<SessionState>((set, get) => ({
  active: null,

  startSession: (region) => {
    set({ active: { region, exercises: [], startedAt: Date.now() } });
  },

  addExercise: (exerciseId, sets) => {
    set((state) =>
      mutateExercises(state, (exercises) => {
        if (exercises.some((e) => e.exerciseId === exerciseId)) return exercises;
        return [...exercises, { exerciseId, sets }];
      }),
    );
  },

  removeExercise: (exIndex) => {
    set((state) => mutateExercises(state, (ex) => ex.filter((_, i) => i !== exIndex)));
  },

  updateSet: (exIndex, setIndex, patch) => {
    set((state) =>
      mutateExercises(state, (ex) =>
        ex.map((e, i) =>
          i === exIndex
            ? { ...e, sets: e.sets.map((s, j) => (j === setIndex ? { ...s, ...patch } : s)) }
            : e,
        ),
      ),
    );
  },

  toggleSetDone: (exIndex, setIndex) => {
    const set_ = get().active?.exercises[exIndex]?.sets[setIndex];
    if (!set_) return;
    get().updateSet(exIndex, setIndex, { done: !set_.done });
  },

  addSet: (exIndex) => {
    set((state) =>
      mutateExercises(state, (ex) =>
        ex.map((e, i) => {
          if (i !== exIndex) return e;
          const last = e.sets[e.sets.length - 1];
          const template: SetLog = last
            ? { ...last, done: false }
            : { reps: 10, weightKg: 0, done: false };
          return { ...e, sets: [...e.sets, template] };
        }),
      ),
    );
  },

  removeSet: (exIndex, setIndex) => {
    set((state) =>
      mutateExercises(state, (ex) =>
        ex.map((e, i) =>
          i === exIndex ? { ...e, sets: e.sets.filter((_, j) => j !== setIndex) } : e,
        ),
      ),
    );
  },

  hasExercise: (exerciseId) =>
    get().active?.exercises.some((e) => e.exerciseId === exerciseId) ?? false,

  finish: () => {
    const active = get().active;
    if (!active) return null;
    const session: WorkoutSession = {
      id: `s_${active.startedAt}`,
      date: new Date(active.startedAt).toISOString(),
      region: active.region,
      exercises: active.exercises,
      completed: true,
      durationSec: Math.round((Date.now() - active.startedAt) / 1000),
    };
    set({ active: null });
    return session;
  },

  discard: () => set({ active: null }),
}));
