import { create } from 'zustand';

import { loadJSON, saveJSON, StorageKeys } from '@/storage';

export interface ReminderSettings {
  enabled: boolean;
  /** 1 = Pazar ... 7 = Cumartesi (bildirim sisteminin numaralandırması). */
  weekdays: number[];
  hour: number;
  minute: number;
}

export interface AppSettings {
  language: 'auto' | 'tr' | 'en';
  theme: 'system' | 'light' | 'dark';
  voiceCoach: boolean;
  autoRest: boolean;
  haptics: boolean;
  reminders: ReminderSettings;
}

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'auto',
  theme: 'system',
  voiceCoach: true,
  autoRest: true,
  haptics: true,
  reminders: { enabled: false, weekdays: [2, 4, 6], hour: 19, minute: 0 },
};

interface SettingsState {
  settings: AppSettings;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  update: (patch: Partial<AppSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  hydrated: false,
  hydrate: async () => {
    const saved = await loadJSON<Partial<AppSettings>>(StorageKeys.settings);
    set({
      settings: { ...DEFAULT_SETTINGS, ...saved, reminders: { ...DEFAULT_SETTINGS.reminders, ...saved?.reminders } },
      hydrated: true,
    });
  },
  update: async (patch) => {
    const next = { ...get().settings, ...patch };
    set({ settings: next });
    await saveJSON(StorageKeys.settings, next);
  },
}));
