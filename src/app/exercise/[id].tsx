import { Redirect, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ExerciseDemo } from '@/components/ExerciseDemo';
import { Button, Card, Chip, Row, Screen, Spacer, Text } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { exerciseText, getExercise } from '@/data/exercises';
import { setsFromSuggestion, suggestNext } from '@/domain/overload';
import { bestSets, lastPerformance } from '@/domain/progress';
import { GOAL_SCHEME, recommendRepsForWeight } from '@/domain/recommend';
import { useTheme } from '@/hooks/use-theme';
import { useUnits } from '@/hooks/use-units';
import { useT } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useHistoryStore } from '@/store/history';
import { useProfileStore } from '@/store/profile';
import { useSessionStore } from '@/store/session';

export default function ExerciseScreen() {
  const c = useTheme();
  const { t, lang } = useT();
  const u = useUnits();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = useProfileStore((s) => s.profile);
  const sessions = useHistoryStore((s) => s.sessions);
  const active = useSessionStore((s) => s.active);
  const startSession = useSessionStore((s) => s.startSession);
  const addExercise = useSessionStore((s) => s.addExercise);
  const hasExercise = useSessionStore((s) => s.hasExercise);
  const [picked, setPicked] = useState<number | null>(null);

  const exercise = id ? getExercise(id) : undefined;
  if (!profile) return <Redirect href="/onboarding" />;
  if (!exercise) {
    return (
      <Screen>
        <Text muted>{t('common.notFound')}</Text>
      </Screen>
    );
  }

  const scheme = GOAL_SCHEME[profile.goal];
  const last = lastPerformance(sessions, exercise.id);
  const best = bestSets(sessions)[exercise.id];
  const next = suggestNext(profile, exercise, last);
  const text = exerciseText(exercise, lang);
  const ownedKg = profile.ownedDumbbellsKg.length ? profile.ownedDumbbellsKg : u.common.map(u.fromDisplay);
  const repRec = picked != null ? recommendRepsForWeight(profile, exercise, picked) : null;
  const verdictColor =
    repRec?.verdict === 'good' ? c.success : repRec?.verdict === 'tooHeavy' ? c.danger : c.textSecondary;
  const already = hasExercise(exercise.id);

  const addToWorkout = () => {
    tapFeedback();
    const sets =
      picked != null && repRec
        ? Array.from({ length: repRec.sets }, () => ({ reps: repRec.reps, weightKg: picked, done: false }))
        : setsFromSuggestion(next);
    if (!active) startSession(exercise.regions[0], undefined, [{ exerciseId: exercise.id, sets }]);
    else addExercise(exercise.id, sets);
    router.push('/workout');
  };

  const verdictText = repRec
    ? repRec.verdict === 'good'
      ? t('exercise.verdict.good', { sets: repRec.sets, min: scheme.repRange[0], max: scheme.repRange[1] })
      : repRec.verdict === 'tooLight'
        ? t('exercise.verdict.tooLight', { reps: repRec.reps })
        : t('exercise.verdict.tooHeavy', { sets: repRec.sets, reps: repRec.reps })
    : '';

  return (
    <Screen>
      <Stack.Screen options={{ title: exercise.name }} />
      <ExerciseDemo exercise={exercise} />
      <Spacer size={Spacing.md} />
      <Text variant="title" accessibilityRole="header">
        {exercise.name}
      </Text>
      <Spacer size={Spacing.xs} />
      <Text variant="caption" muted>
        {exercise.regions.map((r) => t(`region.${r}`)).join(' • ')}
      </Text>
      {exercise.support && (
        <>
          <Spacer size={Spacing.sm} />
          <Text variant="caption">{t(`exercise.support.${exercise.support}`)}</Text>
          {exercise.alternative && getExercise(exercise.alternative) && (
            <Text
              variant="caption"
              color={c.accent}
              accessibilityRole="link"
              onPress={() => router.push(`/exercise/${exercise.alternative}`)}
              style={{ marginTop: 2, fontWeight: '600' }}>
              {t('exercise.alternative', { name: getExercise(exercise.alternative)!.name })}
            </Text>
          )}
        </>
      )}

      <Spacer />
      <Card style={{ backgroundColor: c.accentSoft, borderColor: c.accent }}>
        <Text variant="label" color={c.accent}>
          {next.reason === 'first' ? t('exercise.rec.label') : t('exercise.next.label')}
        </Text>
        <Spacer size={Spacing.sm} />
        <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text variant="title" color={c.accent}>
              {u.fmt(next.weightKg)}
            </Text>
            <Text variant="caption" muted>
              {exercise.mode === 'pair' ? t('exercise.mode.pair') : t('exercise.mode.single')}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text variant="subtitle">{t('exercise.rec.scheme', { sets: next.sets, reps: next.reps })}</Text>
            <Text variant="caption" muted>
              {t('exercise.rec.rest', { s: scheme.restSec })}
            </Text>
          </View>
        </Row>
        <Spacer size={Spacing.sm} />
        <Text variant="caption">{t(`exercise.reason.${next.reason}`)}</Text>
        {last && (
          <Text variant="caption" muted style={{ marginTop: Spacing.xs }}>
            {t('exercise.last', { sets: `${u.fmt(last.sets[0].weightKg)} × ${last.sets.map((s) => s.reps).join(', ')}` })}
          </Text>
        )}
        {best && (
          <Text variant="caption" muted>
            {t('exercise.best', { set: `${u.fmt(best.weightKg)} × ${best.reps}` })}
          </Text>
        )}
        {profile.ownedDumbbellsKg.length === 0 && next.reason === 'first' && (
          <Text variant="caption" muted style={{ marginTop: Spacing.xs }}>
            {t('exercise.ownedTip')}
          </Text>
        )}
      </Card>

      <Spacer />
      <Text variant="subtitle">{t('exercise.plan.title')}</Text>
      <Spacer size={Spacing.sm} />
      <Row style={{ flexWrap: 'wrap', gap: Spacing.sm }}>
        {ownedKg.map((kg) => (
          <Chip key={kg} label={u.fmt(kg)} selected={picked === kg} onPress={() => setPicked(picked === kg ? null : kg)} />
        ))}
      </Row>
      {repRec && picked != null && (
        <>
          <Spacer size={Spacing.md} />
          <Card>
            <Text variant="subtitle" color={verdictColor}>
              {t('exercise.plan.result', { w: u.fmt(picked), sets: repRec.sets, reps: repRec.reps })}
            </Text>
            <Spacer size={Spacing.sm} />
            <Text variant="body" muted>
              {verdictText}
            </Text>
          </Card>
        </>
      )}

      <Spacer />
      <Text variant="subtitle" accessibilityRole="header">
        {t('exercise.how')}
      </Text>
      <Spacer size={Spacing.sm} />
      <View style={{ gap: Spacing.sm }}>
        {text.steps.map((s, i) => (
          <Row key={i} style={{ alignItems: 'flex-start' }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: c.accent,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text variant="caption" color={c.onAccent} style={{ fontWeight: '700' }}>
                {i + 1}
              </Text>
            </View>
            <Text variant="body" style={{ flex: 1 }}>
              {s}
            </Text>
          </Row>
        ))}
      </View>

      {text.tips.length > 0 && (
        <>
          <Spacer />
          <Text variant="subtitle">{t('exercise.tips')}</Text>
          <Spacer size={Spacing.sm} />
          <View style={{ gap: Spacing.xs }}>
            {text.tips.map((tip, i) => (
              <Text key={i} variant="body" muted>
                • {tip}
              </Text>
            ))}
          </View>
        </>
      )}

      <Spacer size={Spacing.xl} />
      <Button
        title={already ? t('exercise.already') : active ? t('exercise.add') : t('exercise.start')}
        onPress={already ? () => router.push('/workout') : addToWorkout}
      />
      <Spacer size={Spacing.xl} />
    </Screen>
  );
}
