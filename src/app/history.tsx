import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button, Card, Row, Screen, Spacer, Text } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { regionName } from '@/data/bodyRegions';
import { getExercise } from '@/data/exercises';
import type { WorkoutSession } from '@/domain/types';
import { useTheme } from '@/hooks/use-theme';
import { useHistoryStore } from '@/store/history';

function volume(session: WorkoutSession): number {
  return session.exercises.reduce(
    (sum, e) => sum + e.sets.reduce((s, set) => s + (set.done ? set.reps * set.weightKg : 0), 0),
    0,
  );
}

export default function HistoryScreen() {
  const t = useTheme();
  const router = useRouter();
  const sessions = useHistoryStore((s) => s.sessions);
  const clear = useHistoryStore((s) => s.clear);

  return (
    <Screen>
      <Text variant="title">Geçmiş</Text>
      <Spacer size={Spacing.xs} />
      <Text variant="body" muted>
        Tamamladığın antrenmanlar ve toplam hacim.
      </Text>
      <Spacer />

      {sessions.length === 0 ? (
        <Card>
          <Text variant="body" muted style={{ textAlign: 'center' }}>
            Henüz kayıtlı antrenman yok. İlk antrenmanını tamamla!
          </Text>
          <Spacer size={Spacing.md} />
          <Button title="Antrenmana başla" onPress={() => router.replace('/')} />
        </Card>
      ) : (
        <View style={{ gap: Spacing.md }}>
          {sessions.map((s) => {
            const sets = s.exercises.reduce((n, e) => n + e.sets.filter((x) => x.done).length, 0);
            const mins = s.durationSec ? Math.max(1, Math.round(s.durationSec / 60)) : null;
            return (
              <Card key={s.id}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text variant="subtitle">{regionName(s.region)}</Text>
                  <Text variant="caption" muted>
                    {new Date(s.date).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </Row>
                <Spacer size={Spacing.sm} />
                <Row style={{ gap: Spacing.lg }}>
                  <View>
                    <Text variant="heading" color={t.accent}>
                      {s.exercises.length}
                    </Text>
                    <Text variant="caption" muted>
                      egzersiz
                    </Text>
                  </View>
                  <View>
                    <Text variant="heading" color={t.accent}>
                      {sets}
                    </Text>
                    <Text variant="caption" muted>
                      set
                    </Text>
                  </View>
                  <View>
                    <Text variant="heading" color={t.accent}>
                      {Math.round(volume(s))}
                    </Text>
                    <Text variant="caption" muted>
                      kg hacim
                    </Text>
                  </View>
                  {mins && (
                    <View>
                      <Text variant="heading" color={t.accent}>
                        {mins}
                      </Text>
                      <Text variant="caption" muted>
                        dk
                      </Text>
                    </View>
                  )}
                </Row>
                <Spacer size={Spacing.sm} />
                <Text variant="caption" muted>
                  {s.exercises.map((e) => getExercise(e.exerciseId)?.name ?? e.exerciseId).join(', ')}
                </Text>
              </Card>
            );
          })}
          <Spacer size={Spacing.sm} />
          <Button title="Geçmişi temizle" variant="ghost" onPress={clear} />
        </View>
      )}
      <Spacer size={Spacing.xl} />
    </Screen>
  );
}
