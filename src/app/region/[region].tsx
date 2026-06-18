import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { Card, Row, Screen, Spacer, Text } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { regionName, REGION_BY_ID } from '@/data/bodyRegions';
import { exercisesForRegion } from '@/data/exercises';
import { recommendWeight } from '@/domain/recommend';
import type { BodyRegion } from '@/domain/types';
import { useTheme } from '@/hooks/use-theme';
import { useProfileStore } from '@/store/profile';

export default function RegionScreen() {
  const t = useTheme();
  const router = useRouter();
  const { region } = useLocalSearchParams<{ region: BodyRegion }>();
  const profile = useProfileStore((s) => s.profile);

  const info = region ? REGION_BY_ID[region as BodyRegion] : undefined;
  const exercises = region ? exercisesForRegion(region as BodyRegion) : [];

  return (
    <Screen>
      <Stack.Screen options={{ title: info ? info.name : 'Egzersizler' }} />
      <Text variant="title">{info?.name ?? 'Egzersizler'}</Text>
      {info && (
        <>
          <Spacer size={Spacing.xs} />
          <Text variant="body" muted>
            {info.description}
          </Text>
        </>
      )}
      <Spacer />
      {exercises.length === 0 ? (
        <Text variant="body" muted>
          Bu bölge için egzersiz bulunamadı.
        </Text>
      ) : (
        <View style={{ gap: Spacing.md }}>
          {exercises.map((ex) => {
            const rec = profile ? recommendWeight(profile, ex) : null;
            return (
              <Card key={ex.id} onPress={() => router.push(`/exercise/${ex.id}`)}>
                <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, paddingRight: Spacing.sm }}>
                    <Text variant="subtitle">{ex.name}</Text>
                    <Spacer size={Spacing.xs} />
                    <Text variant="caption" muted>
                      {ex.regions.map(regionName).join(' • ')}
                    </Text>
                  </View>
                  {rec && (
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text variant="subtitle" color={t.accent}>
                        {rec.weightKg} kg
                      </Text>
                      <Text variant="caption" muted>
                        {rec.scheme.sets}×{rec.scheme.repRange[0]}-{rec.scheme.repRange[1]}
                      </Text>
                    </View>
                  )}
                </Row>
              </Card>
            );
          })}
        </View>
      )}
    </Screen>
  );
}
