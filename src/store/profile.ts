import { create } from 'zustand';

import { loadJSON, removeKey, saveJSON, StorageKeys } from '@/storage';
import type { UserProfile } from '@/domain/types';

interface ProfileState {
  profile: UserProfile | null;
  hydrated: boolean;
  /** Açılışta yerel veriyi yükler. */
  hydrate: () => Promise<void>;
  /** Profili kaydeder (onboarding / ayarlar). */
  setProfile: (profile: UserProfile) => Promise<void>;
  /** Profili kısmen günceller. */
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  /** Profili siler (test / sıfırlama). */
  reset: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  hydrated: false,

  hydrate: async () => {
    const profile = await loadJSON<UserProfile>(StorageKeys.profile);
    set({ profile, hydrated: true });
  },

  setProfile: async (profile) => {
    set({ profile });
    await saveJSON(StorageKeys.profile, profile);
  },

  updateProfile: async (patch) => {
    const current = get().profile;
    if (!current) return;
    const next = { ...current, ...patch };
    set({ profile: next });
    await saveJSON(StorageKeys.profile, next);
  },

  reset: async () => {
    set({ profile: null });
    await removeKey(StorageKeys.profile);
  },
}));
