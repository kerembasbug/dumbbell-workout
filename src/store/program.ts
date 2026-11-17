import { create } from 'zustand';

import { loadJSON, saveJSON, StorageKeys } from '@/storage';

export interface ActiveProgram {
  programId: string;
  startedAt: string;
  /** Tamamlanan program antrenmanı sayısı. */
  completed: number;
}

interface ProgramState {
  active: ActiveProgram | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  start: (programId: string) => Promise<void>;
  stop: () => Promise<void>;
  /** Programdan başlatılan bir antrenman bitince çağrılır. */
  markDayDone: (programId: string) => Promise<void>;
}

export const useProgramStore = create<ProgramState>((set, get) => ({
  active: null,
  hydrated: false,
  hydrate: async () => {
    const active = await loadJSON<ActiveProgram>(StorageKeys.program);
    set({ active: active ?? null, hydrated: true });
  },
  start: async (programId) => {
    const active = { programId, startedAt: new Date().toISOString(), completed: 0 };
    set({ active });
    await saveJSON(StorageKeys.program, active);
  },
  stop: async () => {
    set({ active: null });
    await saveJSON(StorageKeys.program, null);
  },
  markDayDone: async (programId) => {
    const cur = get().active;
    if (!cur || cur.programId !== programId) return;
    const next = { ...cur, completed: cur.completed + 1 };
    set({ active: next });
    await saveJSON(StorageKeys.program, next);
  },
}));
