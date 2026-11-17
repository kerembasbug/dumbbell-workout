import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Badge, Card, Row, Screen, Spacer, Text } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { rankPrograms } from '@/data/programs';
import { useTheme } from '@/hooks/use-theme';
import { pick, useT } from '@/i18n';
import { useProfileStore } from '@/store/profile';
import { useProgramStore } from '@/store/program';

export default function ProgramsScreen() {
  const c = useTheme();
  const { t, lang } = useT();
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const activeId = useProgramStore((s) => s.active?.programId);
  const programs = rankPrograms(profile?.goal ?? 'general', profile?.experience ?? 'beginner');

  return (
    <Screen>
      <Text variant="title" accessibilityRole="header">
        {t('programs.title')}
      </Text>
      <Spacer size={Spacing.xs} />
      <Text variant="body" muted>
        {t('programs.subtitle')}
      </Text>
      <Spacer />
      <View style={{ gap: Spacing.md }}>
        {programs.map((p, i) => (
          <Card
            key={p.id}
            onPress={() => router.push(`/programs/${p.id}`)}
            accessibilityLabel={pick(lang, p.name)}
            style={p.id === activeId ? { borderColor: c.accent, borderWidth: 1.5 } : undefined}>
            <Row style={{ flexWrap: 'wrap' }}>
              {p.id === activeId && <Badge label={t('programs.active')} tone="success" />}
              {i === 0 && p.id !== activeId && <Badge label={t('programs.recommended')} />}
              <Badge label={t(`level.${p.level}`)} tone="neutral" />
            </Row>
            <Spacer size={Spacing.sm} />
            <Text variant="subtitle">{pick(lang, p.name)}</Text>
            <Spacer size={Spacing.xs} />
            <Text variant="body" muted>
              {pick(lang, p.summary)}
            </Text>
            <Spacer size={Spacing.sm} />
            <Text variant="caption" color={c.accent} style={{ fontWeight: '600' }}>
              {t('programs.meta', { weeks: p.weeks, days: p.daysPerWeek, min: p.minutes })}
            </Text>
          </Card>
        ))}
      </View>
      <Spacer size={Spacing.xl} />
    </Screen>
  );
}
