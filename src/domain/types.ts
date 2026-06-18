/** Uygulama genelindeki temel veri tipleri. */

export type Goal = 'strength' | 'hypertrophy' | 'endurance' | 'fatloss' | 'general';
export type Experience = 'beginner' | 'intermediate' | 'advanced';
export type Sex = 'male' | 'female' | 'unspecified';

export type BodyRegion =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'core'
  | 'fullbody';

export type Units = 'metric' | 'imperial';

export interface UserProfile {
  goal: Goal;
  experience: Experience;
  sex: Sex;
  weightKg: number;
  heightCm: number;
  /** Kullanıcının evde sahip olduğu dumbbell ağırlıkları (kg). */
  ownedDumbbellsKg: number[];
  units: Units;
}

export interface Exercise {
  id: string;
  name: string;
  /** Birincil + ikincil çalışan bölgeler. İlk eleman birincildir. */
  regions: BodyRegion[];
  equipment: 'dumbbell';
  /** Tek mi çift mi dumbbell ile yapılır (öneri ve takip için). */
  mode: 'single' | 'pair';
  steps: string[];
  tips: string[];
  /** Vücut ağırlığına oranla referans yük (öneri motoru kalibrasyonu). */
  baseLoadFactor: number;
}

export interface SetLog {
  reps: number;
  weightKg: number;
  done: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
}

export interface WorkoutSession {
  id: string;
  /** ISO tarih-zaman. */
  date: string;
  region: BodyRegion;
  exercises: ExerciseLog[];
  completed: boolean;
  /** Toplam süre (sn), opsiyonel. */
  durationSec?: number;
}
