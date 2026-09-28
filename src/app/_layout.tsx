import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorMode } from '@/hooks/use-theme';
import { useHistoryStore } from '@/store/history';
import { useProfileStore } from '@/store/profile';

export default function RootLayout() {
  const mode = useColorMode();
  const t = Colors[mode];
  const hydrateProfile = useProfileStore((s) => s.hydrate);
  const profileHydrated = useProfileStore((s) => s.hydrated);
  const hydrateHistory = useHistoryStore((s) => s.hydrate);

  useEffect(() => {
    hydrateProfile();
    hydrateHistory();
  }, [hydrateProfile, hydrateHistory]);

  const navTheme = mode === 'dark' ? DarkTheme : DefaultTheme;
  const themed = {
    ...navTheme,
    colors: { ...navTheme.colors, background: t.background, card: t.card, text: t.text, border: t.border, primary: t.accent },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={themed}>
          <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
          {!profileHydrated ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: t.background }}>
              <ActivityIndicator color={t.accent} />
            </View>
          ) : (
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: t.background },
                headerTintColor: t.text,
                headerShadowVisible: false,
                contentStyle: { backgroundColor: t.background },
              }}>
              <Stack.Screen name="index" options={{ title: 'Dambıl Antrenman' }} />
              <Stack.Screen name="onboarding" options={{ title: 'Başlangıç', headerBackVisible: false }} />
              <Stack.Screen name="region/[region]" options={{ title: 'Egzersizler' }} />
              <Stack.Screen name="exercise/[id]" options={{ title: 'Egzersiz' }} />
              <Stack.Screen name="workout" options={{ title: 'Antrenman' }} />
              <Stack.Screen name="history" options={{ title: 'Geçmiş' }} />
              <Stack.Screen name="settings" options={{ title: 'Profil & Ayarlar' }} />
            </Stack>
          )}
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
