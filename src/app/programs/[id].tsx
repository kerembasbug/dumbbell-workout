import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Badge, Button, Card, Row, Screen, SectionTitle, Spacer, Text } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { getExercise } from '@/data/exercises';
import { PROGRAM_BY_ID, programPosition } from '@/data/programs';
import { useTheme } from '@/hooks/use-theme';
import { pick, useT } from '@/i18n';
import { successFeedback } from '@/services/feedback';
import { useProgramStore } from '@/store/program';

export default function ProgramDetailScreen() {
  const c = useTheme();
  const { t, lang } = useT();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const active = useProgramStore((s) => s.active);
  const start = useProgramStore((s) => s.start);
  const stop = useProgramStore((s) => s.stop);
  const [confirmSwitch, setConfirmSwitch] = useState(false);

  const program = id ? PROGRAM_BY_ID[id] : undefined;
  if (!program) {
    return (
      <Screen>
        <Text muted>{t('common.notFound')}</Text>
      </Screen>
    );
  }

  const isActive = active?.programId === program.id;
  const otherActive = !!active && !isActive;
  const pos = isActive && active ? programPosition(program, active.completed) : undefined;

  const begin = async () => {
    await start(program.id);
    successFeedback();
    router.replace('/');
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: pick(lang, program.name) }} />
      <Row>
        {isActive && <Badge label={t('programs.active')} tone="success" />}
        <Badge label={t(`level.${program.level}`)} tone="neutral" />
      </Row>
      <Spacer size={Spacing.sm} />
      <Text variant="title" accessibilityRole="header">
        {pick(lang, program.name)}
      </Text>
      <Spacer size={Spacing.xs} />
      <Text variant="body" muted>
        {pick(lang, program.summary)}
      </Text>
      <Spacer size={Spacing.sm} />
      <Text variant="label" color={c.accent}>
        {t('programs.meta', { weeks: program.weeks, days: program.daysPerWeek, min: program.minutes })}
      </Text>
      {pos && (
        <>
          <Spacer size={Spacing.xs} />
          <Text variant="caption" muted>
            {t('programs.progress', { done: pos.completed, total: pos.total })}
          </Text>
        </>
      )}

      <Spacer />
      <SectionTitle title={t('programs.days')} />
      <View style={{ gap: Spacing.md }}>
        {program.days.map((day, i) => (
          <Card key={i} style={pos && pos.dayIndex === i && !pos.finished ? { borderColor: c.accent, borderWidth: 1.5 } : undefined}>
            <Text variant="subtitle">{pick(lang, day.name)}</Text>
            <Spacer size={Spacing.sm} />
            {day.exercises.map((exId, j) => (
              <Row key={exId} style={{ paddingVertical: 4 }}>
                <Text variant="caption" color={c.accent} style={{ width: 20, fontWeight: '700' }}>
                  {j + 1}
                </Text>
                <Text
                  variant="body"
                  style={{ flex: 1 }}
                  onPress={() => router.push(`/exercise/${exId}`)}
                  accessibilityRole="link">
                  {getExercise(exId)?.name ?? exId}
                </Text>
              </Row>
            ))}
          </Card>
        ))}
      </View>

      <Spacer size={Spacing.xl} />
      {isActive ? (
        <>
          <Button title={t('programs.activeButton')} onPress={() => router.replace('/')} />
          <Spacer size={Spacing.sm} />
          <Button title={t('programs.stopButton')} variant="ghost" onPress={() => void stop()} />
        </>
      ) : otherActive && !confirmSwitch ? (
        <Button title={t('programs.startButton')} onPress={() => setConfirmSwitch(true)} />
      ) : otherActive ? (
        <Card style={{ borderColor: c.danger }}>
          <Text variant="body">{t('programs.switchWarn')}</Text>
          <Spacer size={Spacing.md} />
          <Button title={t('programs.switchButton')} variant="danger" onPress={() => void begin()} />
          <Spacer size={Spacing.sm} />
          <Button title={t('common.cancel')} variant="ghost" onPress={() => setConfirmSwitch(false)} />
        </Card>
      ) : (
        <Button title={t('programs.startButton')} onPress={() => void begin()} />
      )}
      <Spacer size={Spacing.xl} />
    </Screen>
  );
}
