import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { BodyMap } from '@/components/BodyMap';
import { Badge, Button, Card, Chip, Row, Screen, SectionTitle, Spacer, StatTile, Text } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { BODY_REGIONS } from '@/data/bodyRegions';
import { getExercise } from '@/data/exercises';
import { PROGRAM_BY_ID, PROGRAMS, programPosition } from '@/data/programs';
import { buildProgramDay } from '@/domain/plan';
import { weekStreak, workoutsThisWeek } from '@/domain/progress';
import type { BodyRegion } from '@/domain/types';
import { useTheme } from '@/hooks/use-theme';
import { dateLocale, pick, useT } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useHistoryStore } from '@/store/history';
import { useProfileStore } from '@/store/profile';
import { useProgramStore } from '@/store/program';
import { useSessionStore } from '@/store/session';

export default function HomeScreen() {
  const c = useTheme();
  const { t, lang } = useT();
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const sessions = useHistoryStore((s) => s.sessions);
  const active = useSessionStore((s) => s.active);
  const startSession = useSessionStore((s) => s.startSession);
  const activeProgram = useProgramStore((s) => s.active);
  const [selected, setSelected] = useState<BodyRegion | null>(null);

  if (!profile) return <Redirect href="/onboarding" />;

  const program = activeProgram ? PROGRAM_BY_ID[activeProgram.programId] : undefined;
  const pos = program && activeProgram ? programPosition(program, activeProgram.completed) : undefined;
  const nextDay = program && pos ? program.days[pos.dayIndex] : undefined;
  const last = sessions[0];

  const startProgramDay = () => {
    if (!program || !pos) return;
    tapFeedback();
    const day = buildProgramDay(profile, program, pos.dayIndex, sessions, lang);
    startSession(
      'fullbody',
      { title: day.title, programId: program.id, programDayIndex: pos.dayIndex },
      day.exercises,
    );
    router.push('/workout');
  };

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text variant="caption" muted>
            {t('home.goal', { goal: t(`goal.${profile.goal}`) })}
          </Text>
          <Text variant="heading" accessibilityRole="header">
            {t('home.title')}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/settings')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t('home.settings')}
          style={{ padding: Spacing.xs }}>
          <Text variant="heading" color={c.textSecondary}>
            ⚙︎
          </Text>
        </Pressable>
      </Row>

      <Spacer size={Spacing.md} />
      <Row gap={Spacing.sm}>
        <StatTile value={`🔥 ${weekStreak(sessions)}`} label={t('home.stat.streak')} accent />
        <StatTile value={String(workoutsThisWeek(sessions))} label={t('home.stat.week')} />
        <StatTile value={String(sessions.length)} label={t('home.stat.total')} />
      </Row>

      {active && (
        <>
          <Spacer size={Spacing.md} />
          <Card style={{ backgroundColor: c.accentSoft, borderColor: c.accent }}>
            <Text variant="label" color={c.accent}>
              {t('home.active.label')}
            </Text>
            <Spacer size={Spacing.xs} />
            <Text variant="body">
              {active.title ?? t(`region.${active.region}`)} • {t('common.exercises', { n: active.exercises.length })}
            </Text>
            <Spacer size={Spacing.md} />
            <Button title={t('home.active.button')} onPress={() => router.push('/workout')} />
          </Card>
        </>
      )}

      <Spacer />
      {program && pos && nextDay ? (
        <Card style={{ borderColor: c.accent, borderWidth: 1.5 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text variant="label" color={c.accent}>
              {t('home.next.label')}
            </Text>
            <Pressable onPress={() => router.push('/programs')} hitSlop={10} accessibilityRole="link">
              <Text variant="label" color={c.textSecondary}>
                {t('home.next.change')} →
              </Text>
            </Pressable>
          </Row>
          <Spacer size={Spacing.xs} />
          <Text variant="caption" muted>
            {pick(lang, program.name)}
          </Text>
          {pos.finished ? (
            <>
              <Spacer size={Spacing.sm} />
              <Text variant="body">{t('home.next.finished')}</Text>
              <Spacer size={Spacing.md} />
              <Button title={t('home.noProgram.button')} onPress={() => router.push('/programs')} />
            </>
          ) : (
            <>
              <Text variant="heading">{pick(lang, nextDay.name)}</Text>
              <Text variant="caption" muted>
                {t('home.next.position', { week: pos.week, day: pos.dayOfWeek, perWeek: program.daysPerWeek })} •{' '}
                {t('common.minutes', { n: program.minutes })}
              </Text>
              <Spacer size={Spacing.sm} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs }}>
                {nextDay.exercises.map((id) => (
                  <Badge key={id} label={getExercise(id)?.name ?? id} tone="neutral" />
                ))}
              </View>
              <Spacer size={Spacing.md} />
              <Button title={`${t('common.start')} →`} onPress={startProgramDay} disabled={!!active} />
            </>
          )}
        </Card>
      ) : (
        <Card style={{ borderColor: c.accent, borderWidth: 1.5 }}>
          <Text variant="subtitle">{t('home.noProgram.title')}</Text>
          <Spacer size={Spacing.xs} />
          <Text variant="body" muted>
            {t('home.noProgram.body', { n: PROGRAMS.length })}
          </Text>
          <Spacer size={Spacing.md} />
          <Button title={t('home.noProgram.button')} onPress={() => router.push('/programs')} />
        </Card>
      )}

      <Spacer size={Spacing.xl} />
      <SectionTitle title={t('home.free.title')} />
      <Text variant="caption" muted style={{ textAlign: 'center' }}>
        {t('home.free.hint')}
      </Text>
      <Spacer size={Spacing.sm} />
      <BodyMap selected={selected} onSelect={(r) => setSelected(r)} />
      <Spacer size={Spacing.md} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center' }}>
        {BODY_REGIONS.map((r) => (
          <Chip key={r.id} label={t(`region.${r.id}`)} selected={selected === r.id} onPress={() => setSelected(r.id)} />
        ))}
      </View>
      <Spacer />
      <Button
        variant={program ? 'secondary' : 'primary'}
        title={selected ? t('home.free.button', { region: t(`region.${selected}`) }) : t('home.free.pick')}
        onPress={() => selected && router.push(`/region/${selected}`)}
        disabled={!selected}
      />

      <Spacer />
      <Card onPress={() => router.push('/progress')} accessibilityLabel={t('home.progress')}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text variant="subtitle">{t('home.progress')}</Text>
          <Text variant="body" color={c.accent}>
            {t('home.progress.count', { n: sessions.length })}
          </Text>
        </Row>
        {last && (
          <>
            <Spacer size={Spacing.sm} />
            <Text variant="caption" muted>
              {t('home.progress.last', {
                title: last.title ?? t(`region.${last.region}`),
                date: new Date(last.date).toLocaleDateString(dateLocale(lang)),
              })}
            </Text>
          </>
        )}
      </Card>
      <Spacer size={Spacing.xl} />
    </Screen>
  );
}
