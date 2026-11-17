import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { translate } from '@/i18n';
import type { Lang } from '@/i18n/localized';
import type { ReminderSettings } from '@/store/settings';

const CHANNEL = 'workout-reminders';

export type ReminderResult = 'scheduled' | 'cleared' | 'denied' | 'unsupported';

/** Uygulama ön plandayken gelen bildirimi de göster. */
export function configureNotificationHandler() {
  if (Platform.OS === 'web') return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Hatırlatıcıları ayarlara göre yeniden kurar: önce hepsini siler, açıksa
 * seçilen her gün için haftalık tekrarlayan yerel bildirim planlar.
 * Yerel bildirim internete ve sunucuya ihtiyaç duymaz.
 */
export async function applyReminders(r: ReminderSettings, lang: Lang): Promise<ReminderResult> {
  if (Platform.OS === 'web') return 'unsupported';
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!r.enabled || r.weekdays.length === 0) return 'cleared';

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: translate(lang, 'notify.channel'),
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  let granted = current.granted;
  if (!granted) granted = (await Notifications.requestPermissionsAsync()).granted;
  if (!granted) return 'denied';

  for (const weekday of r.weekdays) {
    await Notifications.scheduleNotificationAsync({
      content: { title: translate(lang, 'notify.title'), body: translate(lang, 'notify.body') },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour: r.hour,
        minute: r.minute,
        channelId: CHANNEL,
      },
    });
  }
  return 'scheduled';
}
