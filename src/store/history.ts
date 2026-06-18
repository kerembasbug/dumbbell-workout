import { create } from 'zustand';

import { loadJSON, saveJSON, StorageKeys } from '@/storage';
import type { WorkoutSession } from '@/domain/types';

interface HistoryState {
  sessions: WorkoutSession[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addSession: (session: WorkoutSession) => Promise<void>;
  clear: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  sessions: [],
  hydrated: false,

  hydrate: async () => {
    const sessions = (await loadJSON<WorkoutSession[]>(StorageKeys.history)) ?? [];
    set({ sessions, hydrated: true });
  },

  addSession: async (session) => {
    // En yeni en başta.
    const next = [session, ...get().sessions];
    set({ sessions: next });
    await saveJSON(StorageKeys.history, next);
  },

  clear: async () => {
    set({ sessions: [] });
    await saveJSON(StorageKeys.history, []);
  },
}));
