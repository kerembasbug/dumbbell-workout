import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { Card, Row, Screen, Spacer, Text } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { exercisesForRegion } from '@/data/exercises';
import { suggestNext } from '@/domain/overload';
import { lastPerformance } from '@/domain/progress';
import type { BodyRegion } from '@/domain/types';
import { useTheme } from '@/hooks/use-theme';
import { useUnits } from '@/hooks/use-units';
import { useT } from '@/i18n';
import { useHistoryStore } from '@/store/history';
import { useProfileStore } from '@/store/profile';

const REGIONS: BodyRegion[] = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'core', 'fullbody'];

export default function RegionScreen() {
  const c = useTheme();
  const { t } = useT();
  const u = useUnits();
  const router = useRouter();
  const { region } = useLocalSearchParams<{ region: string }>();
  const profile = useProfileStore((s) => s.profile);
  const sessions = useHistoryStore((s) => s.sessions);

  const valid = REGIONS.includes(region as BodyRegion) ? (region as BodyRegion) : null;
  const exercises = valid ? exercisesForRegion(valid) : [];
  const name = valid ? t(`region.${valid}`) : '';

  return (
    <Screen>
      <Stack.Screen options={{ title: name }} />
      <Text variant="title" accessibilityRole="header">
        {name}
      </Text>
      {valid && (
        <>
          <Spacer size={Spacing.xs} />
          <Text variant="body" muted>
            {t(`region.${valid}.desc`)}
          </Text>
        </>
      )}
      <Spacer />
      {exercises.length === 0 ? (
        <Text muted>{t('region.empty')}</Text>
      ) : (
        <View style={{ gap: Spacing.md }}>
          {exercises.map((ex) => {
            const next = profile ? suggestNext(profile, ex, lastPerformance(sessions, ex.id)) : null;
            return (
              <Card key={ex.id} onPress={() => router.push(`/exercise/${ex.id}`)} accessibilityLabel={ex.name} style={{ padding: Spacing.md }}>
                <Row gap={Spacing.md}>
                  {ex.imageMid != null && (
                    <Image
                      source={ex.imageMid}
                      style={{ width: 64, height: 64, borderRadius: Radius.md, backgroundColor: '#16203a' }}
                      contentFit="contain"
                    />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text variant="subtitle">{ex.name}</Text>
                    <Text variant="caption" muted>
                      {ex.regions.map((r) => t(`region.${r}`)).join(' • ')}
                    </Text>
                  </View>
                  {next && (
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text variant="subtitle" color={c.accent}>
                        {u.fmt(next.weightKg)}
                      </Text>
                      <Text variant="caption" muted>
                        {next.sets}×{next.reps}
                        {next.reason === 'increase' ? ' ↑' : ''}
                      </Text>
                    </View>
                  )}
                </Row>
              </Card>
            );
          })}
        </View>
      )}
      <Spacer size={Spacing.xl} />
    </Screen>
  );
}
