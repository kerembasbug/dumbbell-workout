import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform } from 'react-native';

import { Button, Card, Chip, Row, Screen, SectionTitle, Spacer, Stepper, Text, ToggleRow } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import type { Experience, Goal, Sex, Units } from '@/domain/types';
import { useTheme } from '@/hooks/use-theme';
import { useUnits } from '@/hooks/use-units';
import { useT } from '@/i18n';
import { applyReminders, type ReminderResult } from '@/services/reminders';
import { useProfileStore } from '@/store/profile';
import { type AppSettings, type ReminderSettings, useSettingsStore } from '@/store/settings';

const GOALS: Goal[] = ['strength', 'hypertrophy', 'endurance', 'fatloss', 'general'];
const EXPERIENCES: Experience[] = ['beginner', 'intermediate', 'advanced'];
const SEXES: Sex[] = ['male', 'female', 'unspecified'];
/** Pazartesiden başlayan sıra; değerler bildirim sisteminin 1=Pazar numaralandırması. */
const WEEKDAYS = [2, 3, 4, 5, 6, 7, 1];

export default function SettingsScreen() {
  const c = useTheme();
  const { t, lang } = useT();
  const u = useUnits();
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const reset = useProfileStore((s) => s.reset);
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.update);
  const [reminderStatus, setReminderStatus] = useState<ReminderResult | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!profile) {
    return (
      <Screen>
        <Text muted>{t('common.notFound')}</Text>
      </Screen>
    );
  }

  const set = (patch: Partial<AppSettings>) => void updateSettings(patch);

  const setReminders = async (patch: Partial<ReminderSettings>) => {
    const next = { ...settings.reminders, ...patch };
    await updateSettings({ reminders: next });
    const result = await applyReminders(next, lang);
    setReminderStatus(result);
    if (result === 'denied') await updateSettings({ reminders: { ...next, enabled: false } });
  };

  // Gösterilecek dambıl listesi: birimin yaygın kademeleri + kullanıcının zaten seçtikleri.
  const shown = Array.from(new Set([...u.common, ...profile.ownedDumbbellsKg.map(u.toDisplay)])).sort((a, b) => a - b);
  const ownedShown = new Set(profile.ownedDumbbellsKg.map(u.toDisplay));
  const toggleDumbbell = (display: number) => {
    const has = ownedShown.has(display);
    const next = has
      ? profile.ownedDumbbellsKg.filter((kg) => u.toDisplay(kg) !== display)
      : [...profile.ownedDumbbellsKg, u.fromDisplay(display)].sort((a, b) => a - b);
    void updateProfile({ ownedDumbbellsKg: next });
  };

  const onReset = async () => {
    await reset();
    router.replace('/onboarding');
  };

  return (
    <Screen>
      <Text variant="title" accessibilityRole="header">
        {t('settings.title')}
      </Text>

      <Spacer />
      <SectionTitle title={t('settings.profile')} />
      <Card>
        <Text variant="label">{t('settings.goal')}</Text>
        <Spacer size={Spacing.sm} />
        <Row style={{ flexWrap: 'wrap' }}>
          {GOALS.map((g) => (
            <Chip key={g} label={t(`goal.${g}`)} selected={profile.goal === g} onPress={() => void updateProfile({ goal: g })} />
          ))}
        </Row>
        <Spacer size={Spacing.md} />
        <Text variant="label">{t('settings.experience')}</Text>
        <Spacer size={Spacing.sm} />
        <Row style={{ flexWrap: 'wrap' }}>
          {EXPERIENCES.map((e) => (
            <Chip key={e} label={t(`level.${e}`)} selected={profile.experience === e} onPress={() => void updateProfile({ experience: e })} />
          ))}
        </Row>
        <Spacer size={Spacing.md} />
        <Text variant="label">{t('settings.sex')}</Text>
        <Spacer size={Spacing.sm} />
        <Row style={{ flexWrap: 'wrap' }}>
          {SEXES.map((s) => (
            <Chip key={s} label={t(`sex.${s}`)} selected={profile.sex === s} onPress={() => void updateProfile({ sex: s })} />
          ))}
        </Row>
        <Spacer size={Spacing.md} />
        <Text variant="label">{t('settings.units')}</Text>
        <Spacer size={Spacing.sm} />
        <Row>
          {(['metric', 'imperial'] as Units[]).map((un) => (
            <Chip key={un} label={un === 'metric' ? 'kg' : 'lb'} selected={profile.units === un} onPress={() => void updateProfile({ units: un })} />
          ))}
        </Row>
        <Spacer size={Spacing.md} />
        <Row style={{ justifyContent: 'space-between' }}>
          <Text variant="label">{t('settings.weight')}</Text>
          <Stepper
            value={Math.round(u.toDisplay(profile.weightKg))}
            onChange={(v) => void updateProfile({ weightKg: u.fromDisplay(v) })}
            min={u.units === 'imperial' ? 66 : 30}
            max={u.units === 'imperial' ? 550 : 250}
            suffix={u.label}
          />
        </Row>
        <Spacer size={Spacing.sm} />
        <Row style={{ justifyContent: 'space-between' }}>
          <Text variant="label">{t('settings.height')}</Text>
          <Stepper value={profile.heightCm} onChange={(v) => void updateProfile({ heightCm: v })} min={120} max={230} />
        </Row>
      </Card>

      <Spacer />
      <Card>
        <Text variant="label">{t('settings.dumbbells')}</Text>
        <Text variant="caption" muted>
          {t('settings.dumbbellsHint')}
        </Text>
        <Spacer size={Spacing.sm} />
        <Row style={{ flexWrap: 'wrap' }}>
          {shown.map((w) => (
            <Chip key={w} label={`${w} ${u.label}`} selected={ownedShown.has(w)} onPress={() => toggleDumbbell(w)} />
          ))}
        </Row>
      </Card>

      <Spacer />
      <SectionTitle title={t('settings.app')} />
      <Card>
        <Text variant="label">{t('settings.language')}</Text>
        <Spacer size={Spacing.sm} />
        <Row>
          {(['auto', 'tr', 'en'] as const).map((l) => (
            <Chip
              key={l}
              label={l === 'auto' ? t('settings.language.auto') : l === 'tr' ? 'Türkçe' : 'English'}
              selected={settings.language === l}
              onPress={() => set({ language: l })}
            />
          ))}
        </Row>
        <Spacer size={Spacing.md} />
        <Text variant="label">{t('settings.theme')}</Text>
        <Spacer size={Spacing.sm} />
        <Row>
          {(['system', 'light', 'dark'] as const).map((m) => (
            <Chip key={m} label={t(`settings.theme.${m}`)} selected={settings.theme === m} onPress={() => set({ theme: m })} />
          ))}
        </Row>
        <Spacer size={Spacing.sm} />
        <ToggleRow label={t('settings.voice')} hint={t('settings.voiceHint')} value={settings.voiceCoach} onChange={(v) => set({ voiceCoach: v })} />
        <ToggleRow label={t('settings.autoRest')} hint={t('settings.autoRestHint')} value={settings.autoRest} onChange={(v) => set({ autoRest: v })} />
        <ToggleRow label={t('settings.haptics')} value={settings.haptics} onChange={(v) => set({ haptics: v })} />
      </Card>

      <Spacer />
      <Card>
        <ToggleRow
          label={t('settings.reminders')}
          hint={t('settings.remindersHint')}
          value={settings.reminders.enabled}
          onChange={(v) => void setReminders({ enabled: v })}
        />
        {settings.reminders.enabled && (
          <>
            <Spacer size={Spacing.sm} />
            <Row style={{ flexWrap: 'wrap' }}>
              {WEEKDAYS.map((d) => {
                const on = settings.reminders.weekdays.includes(d);
                return (
                  <Chip
                    key={d}
                    label={t(`weekday.short.${d}` as 'weekday.short.1')}
                    selected={on}
                    onPress={() =>
                      void setReminders({
                        weekdays: on ? settings.reminders.weekdays.filter((x) => x !== d) : [...settings.reminders.weekdays, d],
                      })
                    }
                  />
                );
              })}
            </Row>
            <Spacer size={Spacing.md} />
            <Row style={{ justifyContent: 'space-between' }}>
              <Text variant="label">{t('settings.reminderTime')}</Text>
              <Row gap={Spacing.xs}>
                <Stepper value={settings.reminders.hour} onChange={(v) => void setReminders({ hour: v })} min={0} max={23} />
                <Text variant="subtitle">:</Text>
                <Stepper value={settings.reminders.minute} onChange={(v) => void setReminders({ minute: v })} step={15} min={0} max={45} />
              </Row>
            </Row>
          </>
        )}
        {reminderStatus === 'denied' && (
          <Text variant="caption" color={c.danger} style={{ marginTop: Spacing.sm }}>
            {t('settings.reminderDenied')}
          </Text>
        )}
        {(reminderStatus === 'unsupported' || (Platform.OS === 'web' && settings.reminders.enabled)) && (
          <Text variant="caption" muted style={{ marginTop: Spacing.sm }}>
            {t('settings.reminderWeb')}
          </Text>
        )}
      </Card>

      <Spacer />
      <Text variant="caption" muted style={{ textAlign: 'center' }}>
        🔒 {t('settings.privacy')}
      </Text>
      <Spacer size={Spacing.lg} />
      {confirmReset ? (
        <Card style={{ borderColor: c.danger }}>
          <Text variant="body">{t('settings.resetConfirm')}</Text>
          <Spacer size={Spacing.md} />
          <Row gap={Spacing.md}>
            <Button title={t('common.cancel')} variant="secondary" onPress={() => setConfirmReset(false)} style={{ flex: 1 }} />
            <Button title={t('settings.resetYes')} variant="danger" onPress={() => void onReset()} style={{ flex: 1 }} />
          </Row>
        </Card>
      ) : (
        <Button title={t('settings.reset')} variant="ghost" onPress={() => setConfirmReset(true)} />
      )}
      <Spacer size={Spacing.md} />
      <Text variant="caption" muted style={{ textAlign: 'center' }}>
        {t('common.disclaimer')}
      </Text>
      <Spacer size={Spacing.xl} />
    </Screen>
  );
}
