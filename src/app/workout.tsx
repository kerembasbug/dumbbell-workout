import { Redirect, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { RestTimer } from '@/components/RestTimer';
import { Button, Card, Row, Screen, Spacer, Stepper, Text } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { regionName } from '@/data/bodyRegions';
import { getExercise } from '@/data/exercises';
import { GOAL_SCHEME } from '@/domain/recommend';
import { useTheme } from '@/hooks/use-theme';
import { useHistoryStore } from '@/store/history';
import { useProfileStore } from '@/store/profile';
import { useSessionStore } from '@/store/session';

export default function WorkoutScreen() {
  const t = useTheme();
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
  const profile = useProfileStore((s) => s.profile);

  if (!active) return <Redirect href="/" />;

  const restSec = profile ? GOAL_SCHEME[profile.goal].restSec : 90;
  const totalSets = active.exercises.reduce((n, e) => n + e.sets.length, 0);
  const doneSets = active.exercises.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0);

  const onFinish = async () => {
    const session = finish();
    if (session) await addSession(session);
    router.replace('/history');
  };

  const onDiscard = () => {
    discard();
    router.replace('/');
  };

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <View>
          <Text variant="caption" muted>
            {regionName(active.region)} antrenmanı
          </Text>
          <Text variant="heading">
            {doneSets}/{totalSets} set tamam
          </Text>
        </View>
        <Pressable onPress={onDiscard} hitSlop={10}>
          <Text variant="label" color={t.danger}>
            İptal
          </Text>
        </Pressable>
      </Row>

      <Spacer />
      <RestTimer defaultSec={restSec} />

      {active.exercises.length === 0 && (
        <>
          <Spacer />
          <Text variant="body" muted style={{ textAlign: 'center' }}>
            Henüz egzersiz yok. Bir bölge seçip egzersiz ekle.
          </Text>
        </>
      )}

      {active.exercises.map((log, exIndex) => {
        const ex = getExercise(log.exerciseId);
        return (
          <View key={log.exerciseId}>
            <Spacer />
            <Card>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text variant="subtitle" style={{ flex: 1 }}>
                  {ex?.name ?? log.exerciseId}
                </Text>
                <Pressable onPress={() => removeExercise(exIndex)} hitSlop={8}>
                  <Text variant="label" color={t.textSecondary}>
                    Kaldır
                  </Text>
                </Pressable>
              </Row>
              <Spacer size={Spacing.md} />

              {/* Set başlıkları */}
              <Row style={{ paddingHorizontal: Spacing.xs }}>
                <Text variant="caption" muted style={{ width: 36 }}>
                  Set
                </Text>
                <Text variant="caption" muted style={{ flex: 1, textAlign: 'center' }}>
                  Tekrar
                </Text>
                <Text variant="caption" muted style={{ flex: 1, textAlign: 'center' }}>
                  Ağırlık
                </Text>
                <View style={{ width: 44 }} />
              </Row>

              {log.sets.map((set, setIndex) => (
                <View
                  key={setIndex}
                  style={{
                    backgroundColor: set.done ? t.accentSoft : 'transparent',
                    borderRadius: Radius.md,
                    paddingVertical: Spacing.sm,
                    paddingHorizontal: Spacing.xs,
                    marginTop: Spacing.sm,
                  }}>
                  <Row style={{ justifyContent: 'space-between' }}>
                    <Text variant="subtitle" style={{ width: 36 }}>
                      {setIndex + 1}
                    </Text>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Stepper
                        value={set.reps}
                        onChange={(v) => updateSet(exIndex, setIndex, { reps: v })}
                        step={1}
                        min={1}
                        max={100}
                      />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Stepper
                        value={set.weightKg}
                        onChange={(v) => updateSet(exIndex, setIndex, { weightKg: v })}
                        step={2.5}
                        min={0}
                        max={100}
                        suffix="kg"
                      />
                    </View>
                    <Pressable
                      onPress={() => toggleSetDone(exIndex, setIndex)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: set.done ? t.success : t.backgroundElement,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text color={set.done ? '#fff' : t.textSecondary} variant="subtitle">
                        ✓
                      </Text>
                    </Pressable>
                  </Row>
                  {log.sets.length > 1 && (
                    <Pressable onPress={() => removeSet(exIndex, setIndex)} hitSlop={6} style={{ marginTop: 2 }}>
                      <Text variant="caption" color={t.textMuted} style={{ textAlign: 'right' }}>
                        seti sil
                      </Text>
                    </Pressable>
                  )}
                </View>
              ))}

              <Spacer size={Spacing.sm} />
              <Button title="+ Set ekle" variant="ghost" onPress={() => addSet(exIndex)} />
            </Card>
          </View>
        );
      })}

      <Spacer />
      <Button
        title="+ Egzersiz ekle"
        variant="secondary"
        onPress={() => router.push(`/region/${active.region}`)}
      />
      <Spacer size={Spacing.md} />
      <Button title="Antrenmanı bitir ve kaydet" onPress={onFinish} disabled={active.exercises.length === 0} />
      <Spacer size={Spacing.xl} />
    </Screen>
  );
}
