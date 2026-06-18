import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Chip, Row, Screen, Spacer, Text } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { regionName } from '@/data/bodyRegions';
import { getExercise } from '@/data/exercises';
import { buildInitialSets, recommendRepsForWeight, recommendWeight } from '@/domain/recommend';
import { useTheme } from '@/hooks/use-theme';
import { useProfileStore } from '@/store/profile';
import { useSessionStore } from '@/store/session';

const COMMON_DUMBBELLS = [2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 30];

export default function ExerciseScreen() {
  const t = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = useProfileStore((s) => s.profile);
  const active = useSessionStore((s) => s.active);
  const startSession = useSessionStore((s) => s.startSession);
  const addExercise = useSessionStore((s) => s.addExercise);
  const hasExercise = useSessionStore((s) => s.hasExercise);

  const exercise = id ? getExercise(id) : undefined;
  const [picked, setPicked] = useState<number | null>(null);

  if (!exercise || !profile) {
    return (
      <Screen>
        <Text variant="body" muted>
          Egzersiz bulunamadı.
        </Text>
      </Screen>
    );
  }

  const rec = recommendWeight(profile, exercise);
  const modeLabel = exercise.mode === 'pair' ? 'her elde bir dumbbell' : 'tek dumbbell';
  const dumbbellChoices = profile.ownedDumbbellsKg.length ? profile.ownedDumbbellsKg : COMMON_DUMBBELLS;
  const repRec = picked != null ? recommendRepsForWeight(profile, exercise, picked) : null;
  const verdictColor =
    repRec?.verdict === 'good' ? t.success : repRec?.verdict === 'tooHeavy' ? t.danger : t.textSecondary;

  const addToWorkout = () => {
    if (!active) startSession(exercise.regions[0]);
    const sets = buildInitialSets(picked ?? rec.weightKg, rec.scheme);
    addExercise(exercise.id, sets);
    router.push('/workout');
  };

  const already = hasExercise(exercise.id);

  return (
    <Screen>
      <Stack.Screen options={{ title: exercise.name }} />
      <Text variant="title">{exercise.name}</Text>
      <Spacer size={Spacing.xs} />
      <Text variant="caption" muted>
        {exercise.regions.map(regionName).join(' • ')}
      </Text>

      {/* Kişiye özel öneri */}
      <Spacer />
      <Card style={{ backgroundColor: t.accentSoft, borderColor: t.accent }}>
        <Text variant="label" color={t.accent}>
          SANA ÖZEL ÖNERİ
        </Text>
        <Spacer size={Spacing.sm} />
        <Row style={{ justifyContent: 'space-between' }}>
          <View>
            <Text variant="title" color={t.accent}>
              {rec.weightKg} kg
            </Text>
            <Text variant="caption" muted>
              {modeLabel}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text variant="subtitle">
              {rec.scheme.sets} set × {rec.scheme.repRange[0]}-{rec.scheme.repRange[1]} tekrar
            </Text>
            <Text variant="caption" muted>
              Dinlenme ~{rec.scheme.restSec} sn
            </Text>
          </View>
        </Row>
        {!rec.matchedOwned && (
          <>
            <Spacer size={Spacing.sm} />
            <Text variant="caption" muted>
              İpucu: Sahip olduğun dumbbell’ları profile eklersen öneri onlara yuvarlanır.
            </Text>
          </>
        )}
      </Card>

      {/* Tersine: ağırlık → tekrar */}
      <Spacer />
      <Text variant="subtitle">Elindeki ağırlığa göre planla</Text>
      <Spacer size={Spacing.sm} />
      <Row style={{ flexWrap: 'wrap', gap: Spacing.sm }}>
        {dumbbellChoices.map((w) => (
          <Chip key={w} label={`${w} kg`} selected={picked === w} onPress={() => setPicked(w)} />
        ))}
      </Row>
      {repRec && (
        <>
          <Spacer size={Spacing.md} />
          <Card>
            <Text variant="subtitle" color={verdictColor}>
              {picked} kg → {repRec.sets} set × {repRec.reps} tekrar
            </Text>
            <Spacer size={Spacing.sm} />
            <Text variant="body" muted>
              {repRec.message}
            </Text>
          </Card>
        </>
      )}

      {/* Yapılış */}
      <Spacer />
      <Text variant="subtitle">Nasıl yapılır?</Text>
      <Spacer size={Spacing.sm} />
      <View style={{ gap: Spacing.sm }}>
        {exercise.steps.map((s, i) => (
          <Row key={i} style={{ alignItems: 'flex-start' }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: t.accent,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text variant="caption" color={t.onAccent} style={{ fontWeight: '700' }}>
                {i + 1}
              </Text>
            </View>
            <Text variant="body" style={{ flex: 1 }}>
              {s}
            </Text>
          </Row>
        ))}
      </View>

      {exercise.tips.length > 0 && (
        <>
          <Spacer />
          <Text variant="subtitle">İpuçları</Text>
          <Spacer size={Spacing.sm} />
          <View style={{ gap: Spacing.xs }}>
            {exercise.tips.map((tip, i) => (
              <Text key={i} variant="body" muted>
                • {tip}
              </Text>
            ))}
          </View>
        </>
      )}

      <Spacer size={Spacing.xl} />
      <Button
        title={already ? 'Antrenmanda ✓ — Antrenmana git' : active ? 'Antrenmana ekle' : 'Antrenmanı başlat'}
        onPress={already ? () => router.push('/workout') : addToWorkout}
      />
      <Spacer size={Spacing.xl} />
    </Screen>
  );
}
