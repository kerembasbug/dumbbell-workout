import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorMode } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { configureNotificationHandler } from '@/services/reminders';
import { useHistoryStore } from '@/store/history';
import { useProfileStore } from '@/store/profile';
import { useProgramStore } from '@/store/program';
import { useSessionStore } from '@/store/session';
import { useSettingsStore } from '@/store/settings';

configureNotificationHandler();

export default function RootLayout() {
  const mode = useColorMode();
  const c = Colors[mode];
  const { t } = useT();
  const ready = [
    useProfileStore((s) => s.hydrated),
    useSettingsStore((s) => s.hydrated),
    useProgramStore((s) => s.hydrated),
    useSessionStore((s) => s.hydrated),
  ].every(Boolean);

  useEffect(() => {
    void useProfileStore.getState().hydrate();
    void useHistoryStore.getState().hydrate();
    void useSettingsStore.getState().hydrate();
    void useProgramStore.getState().hydrate();
    void useSessionStore.getState().hydrate();
  }, []);

  const navTheme = mode === 'dark' ? DarkTheme : DefaultTheme;
  const themed = {
    ...navTheme,
    colors: { ...navTheme.colors, background: c.background, card: c.card, text: c.text, border: c.border, primary: c.accent },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={themed}>
          <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
          {!ready ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.background }}>
              <ActivityIndicator color={c.accent} />
            </View>
          ) : (
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: c.background },
                headerTintColor: c.text,
                headerShadowVisible: false,
                contentStyle: { backgroundColor: c.background },
                headerBackButtonDisplayMode: 'minimal',
              }}>
              <Stack.Screen name="index" options={{ title: t('app.name') }} />
              <Stack.Screen name="onboarding" options={{ title: t('onboarding.title'), headerBackVisible: false }} />
              <Stack.Screen name="programs/index" options={{ title: t('programs.title') }} />
              <Stack.Screen name="programs/[id]" options={{ title: t('programs.title') }} />
              <Stack.Screen name="region/[region]" options={{ title: '' }} />
              <Stack.Screen name="exercise/[id]" options={{ title: '' }} />
              <Stack.Screen name="workout" options={{ title: t('workout.title') }} />
              <Stack.Screen name="summary" options={{ title: '', headerBackVisible: false, gestureEnabled: false }} />
              <Stack.Screen name="progress" options={{ title: t('progress.title') }} />
              <Stack.Screen name="settings" options={{ title: t('settings.title') }} />
            </Stack>
          )}
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
