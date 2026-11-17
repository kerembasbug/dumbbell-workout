import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';

import { Button, Card, Row, Screen, SectionTitle, Spacer, StatTile, Text } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { getExercise } from '@/data/exercises';
import { PROGRAM_BY_ID, totalWorkouts } from '@/data/programs';
import { newRecords, sessionDoneSets, sessionVolume, weekStreak } from '@/domain/progress';
import { useTheme } from '@/hooks/use-theme';
import { useUnits } from '@/hooks/use-units';
import { pick, useT } from '@/i18n';
import { speak, successFeedback } from '@/services/feedback';
import { useHistoryStore } from '@/store/history';
import { useProgramStore } from '@/store/program';

export default function SummaryScreen() {
  const c = useTheme();
  const { t, lang } = useT();
  const u = useUnits();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sessions = useHistoryStore((s) => s.sessions);
  const activeProgram = useProgramStore((s) => s.active);
  const celebrated = useRef(false);

  const session = sessions.find((s) => s.id === id);

  useEffect(() => {
    if (session && !celebrated.current) {
      celebrated.current = true;
      successFeedback();
      speak(t('voice.workoutDone'), lang);
    }
  }, [session, t, lang]);

  if (!session) {
    return (
      <Screen>
        <Text muted>{t('common.notFound')}</Text>
        <Spacer />
        <Button title={t('summary.home')} onPress={() => router.replace('/')} />
      </Screen>
    );
  }

  const records = newRecords(session, sessions);
  const streak = weekStreak(sessions);
  const minutes = Math.max(1, Math.round((session.durationSec ?? 0) / 60));
  const program = session.programId ? PROGRAM_BY_ID[session.programId] : undefined;
  const done = activeProgram && program && activeProgram.programId === program.id ? activeProgram.completed : undefined;
  const programFinished = program && done != null && done >= totalWorkouts(program);

  return (
    <Screen>
      <Spacer size={Spacing.lg} />
      <Text style={{ fontSize: 56, textAlign: 'center' }}>🏆</Text>
      <Text variant="title" style={{ textAlign: 'center' }} accessibilityRole="header">
        {t('summary.title')}
      </Text>
      <Text variant="body" muted style={{ textAlign: 'center' }}>
        {session.title ?? t(`region.${session.region}`)} • {t('summary.subtitle')}
      </Text>

      <Spacer />
      <Row gap={Spacing.sm}>
        <StatTile value={t('common.minutes', { n: minutes })} label={t('summary.duration')} />
        <StatTile value={u.fmtVolume(sessionVolume(session))} label={t('summary.volume')} accent />
        <StatTile value={String(sessionDoneSets(session))} label={t('summary.sets')} />
      </Row>

      {records.length > 0 && (
        <>
          <Spacer />
          <Card style={{ borderColor: c.accent, borderWidth: 1.5 }}>
            <SectionTitle title={t('summary.records')} />
            {records.map((r) => (
              <Row key={r.exerciseId} style={{ justifyContent: 'space-between', paddingVertical: 4 }}>
                <Text variant="body" style={{ flex: 1 }}>
                  {getExercise(r.exerciseId)?.name ?? r.exerciseId}
                </Text>
                <Text variant="label" color={c.accent}>
                  {t('summary.record', {
                    prev: `${u.toDisplay(r.previous.weightKg)}×${r.previous.reps}`,
                    cur: `${u.toDisplay(r.current.weightKg)}×${r.current.reps}`,
                  })}
                </Text>
              </Row>
            ))}
          </Card>
        </>
      )}

      <Spacer />
      <Card>
        <View style={{ gap: Spacing.sm }}>
          {streak > 0 && <Text variant="body">{t('summary.streak', { n: streak })}</Text>}
          {program && done != null && (
            <Text variant="body">
              {programFinished
                ? t('summary.programDone', { name: pick(lang, program.name) })
                : t('summary.program', { name: pick(lang, program.name), done, total: totalWorkouts(program) })}
            </Text>
          )}
        </View>
      </Card>

      <Spacer size={Spacing.xl} />
      <Button title={t('summary.home')} onPress={() => router.replace('/')} />
      <Spacer size={Spacing.sm} />
      <Button title={t('summary.progress')} variant="secondary" onPress={() => router.replace('/progress')} />
      <Spacer size={Spacing.xl} />
    </Screen>
  );
}
