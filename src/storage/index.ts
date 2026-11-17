import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Kalıcılık katmanı — AsyncStorage'ı (web'de localStorage'a düşer) tek bir
 * arayüz arkasına alır. İleride buluta (ör. Supabase) geçişte yalnızca bu
 * dosya değiştirilir; çağıran kod aynı kalır.
 */

export async function loadJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (e) {
    console.warn(`storage load hatası (${key})`, e);
    return null;
  }
}

export async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`storage save hatası (${key})`, e);
  }
}

export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn(`storage remove hatası (${key})`, e);
  }
}

export const StorageKeys = {
  profile: 'dw:profile:v1',
  history: 'dw:history:v1',
  settings: 'dw:settings:v1',
  program: 'dw:program:v1',
  active: 'dw:active:v1',
} as const;
