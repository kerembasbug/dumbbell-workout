export type Lang = 'tr' | 'en';
/** İki dilli metin. */
export type L = { tr: string; en: string };
export function pick(lang: Lang, text: L): string {
  return text[lang] ?? text.tr;
}
