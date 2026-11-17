import { getLocales } from 'expo-localization';
import { useMemo } from 'react';

import { useSettingsStore } from '@/store/settings';

import { en } from './en';
import { type Lang } from './localized';
import { tr, type TKey } from './tr';

export type { Lang, L } from './localized';
export { pick } from './localized';
export type { TKey } from './tr';

const DICTS: Record<Lang, Record<TKey, string>> = { tr, en };

/** Cihaz dili Türkçe ise Türkçe, değilse İngilizce. */
export function deviceLang(): Lang {
  try {
    return getLocales()[0]?.languageCode === 'tr' ? 'tr' : 'en';
  } catch {
    return 'tr';
  }
}

export function resolveLang(pref: 'auto' | Lang): Lang {
  return pref === 'auto' ? deviceLang() : pref;
}

export type Params = Record<string, string | number>;

export function translate(lang: Lang, key: TKey, params?: Params): string {
  let s: string = DICTS[lang][key] ?? tr[key] ?? key;
  if (params) for (const [k, v] of Object.entries(params)) s = s.split(`{${k}}`).join(String(v));
  return s;
}

export function useLang(): Lang {
  const pref = useSettingsStore((s) => s.settings.language);
  return resolveLang(pref);
}

/** Bileşenlerde: const { t, lang } = useT(); t('home.title') */
export function useT() {
  const lang = useLang();
  return useMemo(() => ({ lang, t: (key: TKey, params?: Params) => translate(lang, key, params) }), [lang]);
}

export function dateLocale(lang: Lang): string {
  return lang === 'tr' ? 'tr-TR' : 'en-US';
}
