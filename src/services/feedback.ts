import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

import type { Lang } from '@/i18n/localized';
import { useSettingsStore } from '@/store/settings';

const settings = () => useSettingsStore.getState().settings;

/** Hafif dokunuş titreşimi (set işaretleme, seçim). */
export function tapFeedback() {
  if (!settings().haptics || Platform.OS === 'web') return;
  void Haptics.selectionAsync().catch(() => {});
}

/** Başarı titreşimi (antrenman bitti, rekor). */
export function successFeedback() {
  if (!settings().haptics || Platform.OS === 'web') return;
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

/** Dikkat titreşimi (dinlenme bitti). */
export function alertFeedback() {
  if (!settings().haptics || Platform.OS === 'web') return;
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
}

/** Sesli koç açıksa metni okur. */
export function speak(text: string, lang: Lang) {
  if (!settings().voiceCoach) return;
  try {
    void Speech.stop();
    Speech.speak(text, { language: lang === 'tr' ? 'tr-TR' : 'en-US', rate: 1.0 });
  } catch {
    // Ses motoru yoksa sessizce geç.
  }
}
