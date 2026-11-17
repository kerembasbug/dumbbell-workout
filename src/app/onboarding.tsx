import { getLocales } from 'expo-localization';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, View } from 'react-native';

import { Button, Card, Chip, Row, Screen, Spacer, Stepper, Text } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import type { Experience, Goal, Sex, Units, UserProfile } from '@/domain/types';
import { COMMON_DUMBBELLS, fromDisplay, toDisplay, unitLabel } from '@/domain/units';
import { useTheme } from '@/hooks/use-theme';
import { type TKey, useT } from '@/i18n';
import { tapFeedback } from '@/services/feedback';
import { useProfileStore } from '@/store/profile';

const HERO = require('../../assets/generated/onboarding-hero.jpg');
const GOALS: Goal[] = ['hypertrophy', 'strength', 'fatloss', 'endurance', 'general'];
const EXPERIENCES: Experience[] = ['beginner', 'intermediate', 'advanced'];
const SEXES: Sex[] = ['male', 'female', 'unspecified'];

function defaultUnits(): Units {
  try {
    return getLocales()[0]?.measurementSystem === 'us' ? 'imperial' : 'metric';
  } catch {
    return 'metric';
  }
}

export default function OnboardingScreen() {
  const c = useTheme();
  const { t } = useT();
  const router = useRouter();
  const setProfile = useProfileStore((s) => s.setProfile);

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal>('hypertrophy');
  const [experience, setExperience] = useState<Experience>('beginner');
  const [sex, setSex] = useState<Sex>('unspecified');
  const [units, setUnits] = useState<Units>(defaultUnits);
  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(175);
  const [owned, setOwned] = useState<number[]>([]);

  const ul = unitLabel(units);
  const toggleDumbbell = (display: number) => {
    const kg = fromDisplay(display, units);
    setOwned((prev) =>
      prev.some((w) => toDisplay(w, units) === display)
        ? prev.filter((w) => toDisplay(w, units) !== display)
        : [...prev, kg].sort((a, b) => a - b),
    );
  };

  const steps: { title: TKey; subtitle: TKey; body: React.ReactNode }[] = [
    {
      title: 'onboarding.goal.title',
      subtitle: 'onboarding.goal.subtitle',
      body: (
        <View style={{ gap: Spacing.sm }}>
          {GOALS.map((g) => (
            <Card
              key={g}
              onPress={() => {
                tapFeedback();
                setGoal(g);
              }}
              accessibilityLabel={t(`goal.${g}`)}
              style={goal === g ? { borderColor: c.accent, borderWidth: 2 } : undefined}>
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text variant="subtitle">{t(`goal.${g}`)}</Text>
                  <Text variant="caption" muted>
                    {t(`goal.${g}.desc`)}
                  </Text>
                </View>
                {goal === g && (
                  <Text color={c.accent} variant="subtitle">
                    ✓
                  </Text>
                )}
              </Row>
            </Card>
          ))}
        </View>
      ),
    },
    {
      title: 'onboarding.exp.title',
      subtitle: 'onboarding.exp.subtitle',
      body: (
        <Row style={{ flexWrap: 'wrap' }}>
          {EXPERIENCES.map((e) => (
            <Chip key={e} label={t(`level.${e}`)} selected={experience === e} onPress={() => setExperience(e)} />
          ))}
        </Row>
      ),
    },
    {
      title: 'onboarding.body.title',
      subtitle: 'onboarding.body.subtitle',
      body: (
        <Card>
          <Row style={{ flexWrap: 'wrap' }}>
            {SEXES.map((s) => (
              <Chip key={s} label={t(`sex.${s}`)} selected={sex === s} onPress={() => setSex(s)} />
            ))}
          </Row>
          <Spacer size={Spacing.md} />
          <Row>
            {(['metric', 'imperial'] as Units[]).map((un) => (
              <Chip key={un} label={unitLabel(un)} selected={units === un} onPress={() => setUnits(un)} />
            ))}
          </Row>
          <Spacer size={Spacing.md} />
          <Row style={{ justifyContent: 'space-between' }}>
            <Text variant="label">{t('settings.weight')}</Text>
            <Stepper
              value={Math.round(toDisplay(weightKg, units))}
              onChange={(v) => setWeightKg(fromDisplay(v, units))}
              min={units === 'imperial' ? 66 : 30}
              max={units === 'imperial' ? 550 : 250}
              suffix={ul}
            />
          </Row>
          <Spacer size={Spacing.sm} />
          <Row style={{ justifyContent: 'space-between' }}>
            <Text variant="label">{t('settings.height')}</Text>
            <Stepper value={heightCm} onChange={setHeightCm} min={120} max={230} />
          </Row>
        </Card>
      ),
    },
    {
      title: 'onboarding.dumbbells.title',
      subtitle: 'onboarding.dumbbells.subtitle',
      body: (
        <Row style={{ flexWrap: 'wrap' }}>
          {COMMON_DUMBBELLS[units].map((w) => (
            <Chip
              key={w}
              label={`${w} ${ul}`}
              selected={owned.some((kg) => toDisplay(kg, units) === w)}
              onPress={() => toggleDumbbell(w)}
            />
          ))}
        </Row>
      ),
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const finish = async () => {
    const profile: UserProfile = { goal, experience, sex, weightKg, heightCm, ownedDumbbellsKg: owned, units };
    await setProfile(profile);
    router.replace('/');
  };

  return (
    <Screen>
      {step === 0 && (
        <Image
          source={HERO}
          style={{ width: '100%', height: 180, borderRadius: 16, marginBottom: Spacing.md }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      )}
      <Text variant="caption" muted>
        {t('onboarding.step', { n: step + 1, total: steps.length })} • {t(`goal.${goal}`)}
      </Text>
      <Spacer size={Spacing.sm} />
      <View style={{ height: 4, borderRadius: 2, backgroundColor: c.backgroundElement }}>
        <View style={{ width: `${((step + 1) / steps.length) * 100}%`, height: 4, borderRadius: 2, backgroundColor: c.accent }} />
      </View>
      <Spacer size={Spacing.md} />
      <Text variant="title" accessibilityRole="header">
        {t(current.title)}
      </Text>
      <Spacer size={Spacing.sm} />
      <Text variant="body" muted>
        {t(current.subtitle)}
      </Text>
      <Spacer />
      {current.body}
      <Spacer size={Spacing.xl} />
      <Row style={{ gap: Spacing.md }}>
        {step > 0 && <Button title={t('common.back')} variant="secondary" onPress={() => setStep(step - 1)} style={{ flex: 1 }} />}
        <Button
          title={isLast ? t('onboarding.finish') : t('common.continue')}
          onPress={() => (isLast ? void finish() : setStep(step + 1))}
          style={{ flex: 2 }}
        />
      </Row>
      <Spacer size={Spacing.xl} />
      <Text variant="caption" muted style={{ textAlign: 'center' }}>
        {t('common.disclaimer')}
      </Text>
    </Screen>
  );
}
