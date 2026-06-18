/**
 * Aktif renk şemasına göre tema renklerini döndürür (açık/koyu).
 */

import { Colors, type Theme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme(): Theme {
  const scheme = useColorScheme();
  const mode = scheme === 'dark' ? 'dark' : 'light';
  return Colors[mode];
}

export function useColorMode(): 'light' | 'dark' {
  const scheme = useColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}
