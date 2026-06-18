import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Chip, Row, Screen, Spacer, Stepper, Text } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { GOAL_SCHEME } from '@/domain/recommend';
import type { Experience, Goal, Sex, UserProfile } from '@/domain/types';
import { useTheme } from '@/hooks/use-theme';
import { useProfileStore } from '@/store/profile';

const GOALS: { id: Goal; label: string; desc: string }[] = [
  { id: 'strength', label: 'Güç', desc: 'Daha ağır, az tekrar' },
  { id: 'hypertrophy', label: 'Kas Gelişimi', desc: 'Orta ağırlık, 8-12 tekrar' },
  { id: 'endurance', label: 'Dayanıklılık', desc: 'Hafif, çok tekrar' },
  { id: 'fatloss', label: 'Yağ Yakımı', desc: 'Yüksek tempo, çok tekrar' },
  { id: 'general', label: 'Genel Fitness', desc: 'Dengeli antrenman' },
];

const EXPERIENCES: { id: Experience; label: string }[] = [
  { id: 'beginner', label: 'Acemi' },
  { id: 'intermediate', label: 'Orta' },
  { id: 'advanced', label: 'İleri' },
];

const SEXES: { id: Sex; label: string }[] = [
  { id: 'male', label: 'Erkek' },
  { id: 'female', label: 'Kadın' },
  { id: 'unspecified', label: 'Belirtmek istemiyorum' },
];

const COMMON_DUMBBELLS = [2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 30];

export default function OnboardingScreen() {
  const t = useTheme();
  const router = useRouter();
  const setProfile = useProfileStore((s) => s.setProfile);

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal>('hypertrophy');
  const [experience, setExperience] = useState<Experience>('beginner');
  const [sex, setSex] = useState<Sex>('unspecified');
  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(175);
  const [owned, setOwned] = useState<number[]>([]);

  const toggleDumbbell = (w: number) =>
    setOwned((prev) => (prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w].sort((a, b) => a - b)));

  const steps = [
    {
      title: 'Hedefin ne?',
      subtitle: 'Sana uygun set ve tekrar planını buna göre belirleyeceğiz.',
      body: (
        <View style={{ gap: Spacing.sm }}>
          {GOALS.map((g) => (
            <Card key={g.id} onPress={() => setGoal(g.id)} style={goal === g.id ? { borderColor: t.accent, borderWidth: 2 } : undefined}>
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text variant="subtitle">{g.label}</Text>
                  <Text variant="caption" muted>
                    {g.desc}
                  </Text>
                </View>
                {goal === g.id && <Text color={t.accent} variant="subtitle">✓</Text>}
              </Row>
            </Card>
          ))}
        </View>
      ),
    },
    {
      title: 'Deneyim seviyen?',
      subtitle: 'Ağırlık önerisini buna göre ölçekleriz.',
      body: (
        <Row style={{ flexWrap: 'wrap', gap: Spacing.sm }}>
          {EXPERIENCES.map((e) => (
            <Chip key={e.id} label={e.label} selected={experience === e.id} onPress={() => setExperience(e.id)} />
          ))}
        </Row>
      ),
    },
    {
      title: 'Biraz da senden bahset',
      subtitle: 'Önerilen ağırlık kilo, cinsiyet ve deneyimine göre hesaplanır.',
      body: (
        <View style={{ gap: Spacing.lg }}>
          <View>
            <Text variant="label" muted>
              Cinsiyet
            </Text>
            <Spacer size={Spacing.sm} />
            <Row style={{ flexWrap: 'wrap', gap: Spacing.sm }}>
              {SEXES.map((s) => (
                <Chip key={s.id} label={s.label} selected={sex === s.id} onPress={() => setSex(s.id)} />
              ))}
            </Row>
          </View>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text variant="subtitle">Kilo</Text>
            <Stepper value={weightKg} onChange={setWeightKg} step={1} min={30} max={250} suffix="kg" />
          </Row>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text variant="subtitle">Boy</Text>
            <Stepper value={heightCm} onChange={setHeightCm} step={1} min={120} max={230} suffix="cm" />
          </Row>
        </View>
      ),
    },
    {
      title: 'Hangi dumbbell’lar var?',
      subtitle: 'Sahip olduğun ağırlıkları seç — öneriler bunlara yuvarlanır. (İsteğe bağlı)',
      body: (
        <Row style={{ flexWrap: 'wrap', gap: Spacing.sm }}>
          {COMMON_DUMBBELLS.map((w) => (
            <Chip key={w} label={`${w} kg`} selected={owned.includes(w)} onPress={() => toggleDumbbell(w)} />
          ))}
        </Row>
      ),
    },
  ];

  const isLast = step === steps.length - 1;
  const current = steps[step];

  const finish = async () => {
    const profile: UserProfile = {
      goal,
      experience,
      sex,
      weightKg,
      heightCm,
      ownedDumbbellsKg: owned,
      units: 'metric',
    };
    await setProfile(profile);
    router.replace('/');
  };

  return (
    <Screen>
      <Text variant="caption" muted>
        Adım {step + 1} / {steps.length} • {GOAL_SCHEME[goal].label}
      </Text>
      <Spacer size={Spacing.sm} />
      <Text variant="title">{current.title}</Text>
      <Spacer size={Spacing.sm} />
      <Text variant="body" muted>
        {current.subtitle}
      </Text>
      <Spacer />
      {current.body}
      <Spacer size={Spacing.xl} />
      <Row style={{ gap: Spacing.md }}>
        {step > 0 && (
          <Button title="Geri" variant="secondary" onPress={() => setStep(step - 1)} style={{ flex: 1 }} />
        )}
        <Button
          title={isLast ? 'Başla' : 'Devam'}
          onPress={() => (isLast ? finish() : setStep(step + 1))}
          style={{ flex: 2 }}
        />
      </Row>
      <Spacer size={Spacing.xl} />
      <Text variant="caption" muted style={{ textAlign: 'center' }}>
        Bu uygulama rehber niteliğindedir, tıbbi tavsiye değildir.
      </Text>
    </Screen>
  );
}
