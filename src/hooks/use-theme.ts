/**
 * Aktif renk şemasına göre tema renklerini döndürür (açık/koyu).
 * Ayarlardaki "Görünüm" seçimi sistem ayarını geçersiz kılar.
 */

import { Colors, type Theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSettingsStore } from '@/store/settings';

export function useColorMode(): 'light' | 'dark' {
  const scheme = useColorScheme();
  const pref = useSettingsStore((s) => s.settings.theme);
  if (pref !== 'system') return pref;
  return scheme === 'dark' ? 'dark' : 'light';
}

export function useTheme(): Theme {
  return Colors[useColorMode()];
}
