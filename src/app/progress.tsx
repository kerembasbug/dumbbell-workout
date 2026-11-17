import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ActivityCalendar, WeeklyBars } from '@/components/Charts';
import { Button, Card, Row, Screen, SectionTitle, Spacer, StatTile, Text } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { getExercise } from '@/data/exercises';
import {
  activeDays,
  bestSets,
  sessionDoneSets,
  sessionVolume,
  totalVolume,
  weekStreak,
  weeklySeries,
  workoutsThisWeek,
} from '@/domain/progress';
import { useTheme } from '@/hooks/use-theme';
import { useUnits } from '@/hooks/use-units';
import { dateLocale, useT } from '@/i18n';
import { useHistoryStore } from '@/store/history';

export default function ProgressScreen() {
  const c = useTheme();
  const { t, lang } = useT();
  const u = useUnits();
  const router = useRouter();
  const sessions = useHistoryStore((s) => s.sessions);
  const clear = useHistoryStore((s) => s.clear);
  const [confirmClear, setConfirmClear] = useState(false);

  if (sessions.length === 0) {
    return (
      <Screen>
        <Text variant="title" accessibilityRole="header">
          {t('progress.title')}
        </Text>
        <Spacer />
        <Card>
          <Text variant="body" muted style={{ textAlign: 'center' }}>
            {t('progress.empty')}
          </Text>
          <Spacer size={Spacing.md} />
          <Button title={t('progress.emptyButton')} onPress={() => router.replace('/')} />
        </Card>
      </Screen>
    );
  }

  // Rekor listesi: yalnız en az iki kez yapılmış hareketler (ilk sefer rekor sayılmaz).
  const counts: Record<string, number> = {};
  for (const s of sessions) for (const e of s.exercises) if (e.sets.some((x) => x.done)) counts[e.exerciseId] = (counts[e.exerciseId] ?? 0) + 1;
  const records = Object.entries(bestSets(sessions))
    .filter(([id]) => (counts[id] ?? 0) >= 2)
    .sort((a, b) => b[1].e1rm - a[1].e1rm);

  return (
    <Screen>
      <Text variant="title" accessibilityRole="header">
        {t('progress.title')}
      </Text>
      <Text variant="body" muted>
        {t('progress.subtitle')}
      </Text>
      <Spacer />
      <Row gap={Spacing.sm}>
        <StatTile value={`🔥 ${weekStreak(sessions)}`} label={t('progress.streak')} accent />
        <StatTile value={String(workoutsThisWeek(sessions))} label={t('progress.week')} />
        <StatTile value={u.fmtVolume(totalVolume(sessions))} label={t('progress.totalVolume')} />
      </Row>

      <Spacer />
      <Card>
        <SectionTitle title={t('progress.chart')} />
        <WeeklyBars data={weeklySeries(sessions, 8)} formatValue={u.fmtVolume} />
      </Card>

      <Spacer />
      <Card>
        <SectionTitle title={t('progress.calendar')} />
        <ActivityCalendar days={activeDays(sessions)} weeks={12} />
      </Card>

      <Spacer />
      <Card>
        <SectionTitle title={t('progress.records')} />
        {records.length === 0 ? (
          <Text variant="caption" muted>
            {t('progress.recordsEmpty')}
          </Text>
        ) : (
          records.map(([id, best]) => (
            <Row key={id} style={{ justifyContent: 'space-between', paddingVertical: 6 }}>
              <View style={{ flex: 1 }}>
                <Text variant="body">{getExercise(id)?.name ?? id}</Text>
                <Text variant="caption" muted>
                  {t('progress.e1rm', { w: u.fmt(best.e1rm) })}
                </Text>
              </View>
              <Text variant="subtitle" color={c.accent}>
                {u.fmt(best.weightKg)} × {best.reps}
              </Text>
            </Row>
          ))
        )}
      </Card>

      <Spacer />
      <SectionTitle title={t('progress.history')} />
      <View style={{ gap: Spacing.md }}>
        {sessions.map((s) => {
          const mins = s.durationSec ? Math.max(1, Math.round(s.durationSec / 60)) : null;
          const cells: [string | number, string][] = [
            [s.exercises.length, t('progress.row.exercises')],
            [sessionDoneSets(s), t('progress.row.sets')],
            [u.fmtVolume(sessionVolume(s)), t('progress.row.volume')],
          ];
          if (mins) cells.push([mins, t('progress.row.minutes')]);
          return (
            <Card key={s.id}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text variant="subtitle" style={{ flex: 1 }}>
                  {s.title ?? t(`region.${s.region}`)}
                </Text>
                <Text variant="caption" muted>
                  {new Date(s.date).toLocaleDateString(dateLocale(lang), {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </Row>
              <Spacer size={Spacing.sm} />
              <Row gap={Spacing.lg} style={{ flexWrap: 'wrap' }}>
                {cells.map(([v, label]) => (
                  <View key={label}>
                    <Text variant="subtitle" color={c.accent}>
                      {v}
                    </Text>
                    <Text variant="caption" muted>
                      {label}
                    </Text>
                  </View>
                ))}
              </Row>
              <Spacer size={Spacing.sm} />
              <Text variant="caption" muted numberOfLines={2}>
                {s.exercises.map((e) => getExercise(e.exerciseId)?.name ?? e.exerciseId).join(', ')}
              </Text>
            </Card>
          );
        })}
      </View>

      <Spacer size={Spacing.xl} />
      {confirmClear ? (
        <Card style={{ borderColor: c.danger }}>
          <Text variant="body">{t('progress.clearConfirm')}</Text>
          <Spacer size={Spacing.md} />
          <Row gap={Spacing.md}>
            <Button title={t('common.cancel')} variant="secondary" onPress={() => setConfirmClear(false)} style={{ flex: 1 }} />
            <Button
              title={t('progress.clearYes')}
              variant="danger"
              onPress={() => {
                void clear();
                setConfirmClear(false);
              }}
              style={{ flex: 1 }}
            />
          </Row>
        </Card>
      ) : (
        <Button title={t('progress.clear')} variant="ghost" onPress={() => setConfirmClear(true)} />
      )}
      <Spacer size={Spacing.xl} />
    </Screen>
  );
}
