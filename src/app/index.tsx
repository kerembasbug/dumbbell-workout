import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { BodyMap } from '@/components/BodyMap';
import { Button, Card, Chip, Row, Screen, Spacer, Text } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { BODY_REGIONS, regionName } from '@/data/bodyRegions';
import { GOAL_SCHEME } from '@/domain/recommend';
import type { BodyRegion } from '@/domain/types';
import { useTheme } from '@/hooks/use-theme';
import { useHistoryStore } from '@/store/history';
import { useProfileStore } from '@/store/profile';
import { useSessionStore } from '@/store/session';

export default function HomeScreen() {
  const t = useTheme();
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const sessions = useHistoryStore((s) => s.sessions);
  const active = useSessionStore((s) => s.active);
  const [selected, setSelected] = useState<BodyRegion | null>(null);

  if (!profile) return <Redirect href="/onboarding" />;

  const go = (region: BodyRegion) => router.push(`/region/${region}`);
  const last = sessions[0];

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <View>
          <Text variant="caption" muted>
            Hedef: {GOAL_SCHEME[profile.goal].label}
          </Text>
          <Text variant="heading">Bugün ne çalışıyoruz?</Text>
        </View>
        <Pressable onPress={() => router.push('/settings')} hitSlop={10}>
          <Text variant="subtitle" color={t.accent}>
            Profil
          </Text>
        </Pressable>
      </Row>

      {active && (
        <>
          <Spacer size={Spacing.md} />
          <Card style={{ backgroundColor: t.accentSoft, borderColor: t.accent }}>
            <Text variant="label" color={t.accent}>
              DEVAM EDEN ANTRENMAN
            </Text>
            <Spacer size={Spacing.xs} />
            <Text variant="body">
              {regionName(active.region)} • {active.exercises.length} egzersiz
            </Text>
            <Spacer size={Spacing.md} />
            <Button title="Antrenmana Dön" onPress={() => router.push('/workout')} />
          </Card>
        </>
      )}

      <Spacer />
      <Text variant="caption" muted style={{ textAlign: 'center' }}>
        Bölgeye dokun veya aşağıdan seç
      </Text>
      <Spacer size={Spacing.sm} />
      <BodyMap selected={selected} onSelect={(r) => setSelected(r)} />

      <Spacer size={Spacing.md} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center' }}>
        {BODY_REGIONS.map((r) => (
          <Chip
            key={r.id}
            label={r.name}
            selected={selected === r.id}
            onPress={() => setSelected(r.id)}
          />
        ))}
      </View>

      <Spacer />
      <Button
        title={selected ? `${regionName(selected)} egzersizleri` : 'Önce bir bölge seç'}
        onPress={() => selected && go(selected)}
        disabled={!selected}
      />

      <Spacer />
      <Card onPress={() => router.push('/history')}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text variant="subtitle">Geçmiş</Text>
          <Text variant="body" color={t.accent}>
            {sessions.length} antrenman →
          </Text>
        </Row>
        {last && (
          <>
            <Spacer size={Spacing.sm} />
            <Text variant="caption" muted>
              Son: {regionName(last.region)} • {new Date(last.date).toLocaleDateString('tr-TR')}
            </Text>
          </>
        )}
      </Card>
    </Screen>
  );
}
