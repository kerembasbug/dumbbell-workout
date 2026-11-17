import { activateKeepAwakeAsync, deactivateKeepAwake, isAvailableAsync } from 'expo-keep-awake';
import { Image } from 'expo-image';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { RestTimer, useRestTimer } from '@/components/RestTimer';
import { Button, Card, Row, Screen, Spacer, Stepper, Text } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { getExercise } from '@/data/exercises';
import { lastPerformance } from '@/domain/progress';
import { GOAL_SCHEME } from '@/domain/recommend';
import { useTheme } from '@/hooks/use-theme';
import { useUnits } from '@/hooks/use-units';
import { useT } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useHistoryStore } from '@/store/history';
import { useProfileStore } from '@/store/profile';
import { useProgramStore } from '@/store/program';
import { useSessionStore } from '@/store/session';
import { useSettingsStore } from '@/store/settings';

const KEEP_AWAKE_TAG = 'workout';

/** Antrenman sırasında ekranın kararmasını engeller. */
function useScreenAwake() {
  useEffect(() => {
    let on = false;
    isAvailableAsync()
      .then((ok) => (ok ? activateKeepAwakeAsync(KEEP_AWAKE_TAG).then(() => (on = true)) : undefined))
      .catch(() => {});
    return () => {
      if (on) void deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
    };
  }, []);
}

export default function WorkoutScreen() {
  const c = useTheme();
  const { t } = useT();
  const u = useUnits();
  const router = useRouter();
  const active = useSessionStore((s) => s.active);
  const updateSet = useSessionStore((s) => s.updateSet);
  const toggleSetDone = useSessionStore((s) => s.toggleSetDone);
  const addSet = useSessionStore((s) => s.addSet);
  const removeSet = useSessionStore((s) => s.removeSet);
  const removeExercise = useSessionStore((s) => s.removeExercise);
  const finish = useSessionStore((s) => s.finish);
  const discard = useSessionStore((s) => s.discard);
  const addSession = useHistoryStore((s) => s.addSession);
  const history = useHistoryStore((s) => s.sessions);
  const markDayDone = useProgramStore((s) => s.markDayDone);
  const profile = useProfileStore((s) => s.profile);
  const autoRest = useSettingsStore((s) => s.settings.autoRest);
  const timer = useRestTimer();
  const [confirmCancel, setConfirmCancel] = useState(false);
  useScreenAwake();

  if (!active) return <Redirect href="/" />;

  const restSec = profile ? GOAL_SCHEME[profile.goal].restSec : 90;
  const totalSets = active.exercises.reduce((n, e) => n + e.sets.length, 0);
  const doneSets = active.exercises.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0);
  const title = active.title ?? t(`region.${active.region}`);

  const onToggle = (exIndex: number, setIndex: number) => {
    const wasDone = active.exercises[exIndex].sets[setIndex].done;
    toggleSetDone(exIndex, setIndex);
    tapFeedback();
    if (!wasDone && autoRest) timer.start(restSec);
  };

  const onFinish = async () => {
    const session = finish();
    if (!session) return;
    await addSession(session);
    if (session.programId) await markDayDone(session.programId);
    router.replace({ pathname: '/summary', params: { id: session.id } });
  };

  const onDiscard = () => {
    discard();
    router.replace('/');
  };

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text variant="caption" muted>
            {title}
          </Text>
          <Text variant="heading" accessibilityLiveRegion="polite">
            {t('workout.progress', { done: doneSets, total: totalSets })}
          </Text>
        </View>
        <Pressable onPress={() => setConfirmCancel(true)} hitSlop={12} accessibilityRole="button">
          <Text variant="label" color={c.danger}>
            {t('workout.cancel')}
          </Text>
        </Pressable>
      </Row>
      <Spacer size={Spacing.sm} />
      <View style={{ height: 6, borderRadius: 3, backgroundColor: c.backgroundElement, overflow: 'hidden' }}>
        <View style={{ width: `${totalSets ? (doneSets / totalSets) * 100 : 0}%`, height: 6, backgroundColor: c.accent }} />
      </View>

      {confirmCancel && (
        <>
          <Spacer size={Spacing.md} />
          <Card style={{ borderColor: c.danger }}>
            <Text variant="body">{t('workout.cancelConfirm')}</Text>
            <Spacer size={Spacing.md} />
            <Row gap={Spacing.md}>
              <Button title={t('common.cancel')} variant="secondary" onPress={() => setConfirmCancel(false)} style={{ flex: 1 }} />
              <Button title={t('workout.cancelYes')} variant="danger" onPress={onDiscard} style={{ flex: 1 }} />
            </Row>
          </Card>
        </>
      )}

      <Spacer size={Spacing.md} />
      <RestTimer timer={timer} suggestedSec={restSec} />

      {active.exercises.length === 0 && (
        <>
          <Spacer />
          <Text variant="body" muted style={{ textAlign: 'center' }}>
            {t('workout.empty')}
          </Text>
        </>
      )}

      {active.exercises.map((log, exIndex) => {
        const ex = getExercise(log.exerciseId);
        const prev = lastPerformance(history, log.exerciseId);
        return (
          <View key={log.exerciseId}>
            <Spacer size={Spacing.md} />
            <Card>
              <Row style={{ justifyContent: 'space-between' }}>
                <Pressable
                  onPress={() => router.push(`/exercise/${log.exerciseId}`)}
                  accessibilityRole="link"
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                  {ex?.imageMid != null && (
                    <Image
                      source={ex.imageMid}
                      style={{ width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: '#16203a' }}
                      contentFit="contain"
                    />
                  )}
                  <Text variant="subtitle" style={{ flex: 1 }}>
                    {ex?.name ?? log.exerciseId}
                  </Text>
                </Pressable>
                <Pressable onPress={() => removeExercise(exIndex)} hitSlop={10} accessibilityRole="button">
                  <Text variant="label" color={c.textSecondary}>
                    {t('workout.remove')}
                  </Text>
                </Pressable>
              </Row>
              <Spacer size={Spacing.md} />

              <Row style={{ paddingHorizontal: Spacing.xs }}>
                <Text variant="caption" muted style={{ width: 22 }}>
                  {t('workout.col.set')}
                </Text>
                <Text variant="caption" muted style={{ width: 48 }}>
                  {t('workout.col.prev')}
                </Text>
                <Text variant="caption" muted style={{ flex: 1, textAlign: 'center' }}>
                  {t('workout.col.reps')}
                </Text>
                <Text variant="caption" muted style={{ flex: 1, textAlign: 'center' }}>
                  {t('workout.col.weight')} ({u.label})
                </Text>
                <View style={{ width: 44 }} />
              </Row>

              {log.sets.map((set, setIndex) => {
                const p = prev?.sets[setIndex];
                return (
                  <View
                    key={setIndex}
                    style={{
                      backgroundColor: set.done ? c.accentSoft : 'transparent',
                      borderRadius: Radius.md,
                      paddingVertical: Spacing.xs,
                      paddingHorizontal: Spacing.xs,
                      marginTop: Spacing.xs,
                    }}>
                    <Row style={{ justifyContent: 'space-between' }} gap={4}>
                      <Text variant="subtitle" style={{ width: 22 }}>
                        {setIndex + 1}
                      </Text>
                      <Text variant="caption" muted style={{ width: 48 }}>
                        {p ? `${u.toDisplay(p.weightKg)}×${p.reps}` : '—'}
                      </Text>
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <Stepper
                          value={set.reps}
                          onChange={(v) => updateSet(exIndex, setIndex, { reps: v })}
                          step={1}
                          min={1}
                          max={100}
                          compact
                        />
                      </View>
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <Stepper
                          value={u.toDisplay(set.weightKg)}
                          onChange={(v) => updateSet(exIndex, setIndex, { weightKg: u.fromDisplay(v) })}
                          step={u.step}
                          min={0}
                          max={u.units === 'imperial' ? 220 : 100}
                          compact
                        />
                      </View>
                      <Pressable
                        onPress={() => onToggle(exIndex, setIndex)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: set.done }}
                        accessibilityLabel={t('workout.markDone', { n: setIndex + 1 })}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          backgroundColor: set.done ? c.success : c.backgroundElement,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text color={set.done ? '#fff' : c.textSecondary} variant="subtitle">
                          ✓
                        </Text>
                      </Pressable>
                    </Row>
                    {log.sets.length > 1 && (
                      <Pressable onPress={() => removeSet(exIndex, setIndex)} hitSlop={6} style={{ alignSelf: 'flex-end' }}>
                        <Text variant="caption" color={c.textMuted}>
                          {t('workout.removeSet')}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                );
              })}

              <Spacer size={Spacing.sm} />
              <Button title={t('workout.addSet')} variant="ghost" onPress={() => addSet(exIndex)} />
            </Card>
          </View>
        );
      })}

      <Spacer />
      <Button title={t('workout.addExercise')} variant="secondary" onPress={() => router.push(`/region/${active.region}`)} />
      <Spacer size={Spacing.md} />
      <Button title={t('workout.finish')} onPress={() => void onFinish()} disabled={doneSets === 0} />
      <Spacer size={Spacing.xl} />
    </Screen>
  );
}
