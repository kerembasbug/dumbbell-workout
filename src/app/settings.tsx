import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button, Card, Chip, Row, Screen, Spacer, Stepper, Text } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import type { Experience, Goal, Sex } from '@/domain/types';
import { useProfileStore } from '@/store/profile';

const GOALS: { id: Goal; label: string }[] = [
  { id: 'strength', label: 'Güç' },
  { id: 'hypertrophy', label: 'Kas Gelişimi' },
  { id: 'endurance', label: 'Dayanıklılık' },
  { id: 'fatloss', label: 'Yağ Yakımı' },
  { id: 'general', label: 'Genel' },
];
const EXPERIENCES: { id: Experience; label: string }[] = [
  { id: 'beginner', label: 'Acemi' },
  { id: 'intermediate', label: 'Orta' },
  { id: 'advanced', label: 'İleri' },
];
const SEXES: { id: Sex; label: string }[] = [
  { id: 'male', label: 'Erkek' },
  { id: 'female', label: 'Kadın' },
  { id: 'unspecified', label: 'Belirtmedim' },
];
const COMMON_DUMBBELLS = [2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 30];

export default function SettingsScreen() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const reset = useProfileStore((s) => s.reset);

  if (!profile) {
    return (
      <Screen>
        <Text variant="body" muted>
          Profil bulunamadı.
        </Text>
      </Screen>
    );
  }

  const toggleDumbbell = (w: number) => {
    const has = profile.ownedDumbbellsKg.includes(w);
    const next = has
      ? profile.ownedDumbbellsKg.filter((x) => x !== w)
      : [...profile.ownedDumbbellsKg, w].sort((a, b) => a - b);
    updateProfile({ ownedDumbbellsKg: next });
  };

  const onReset = async () => {
    await reset();
    router.replace('/onboarding');
  };

  return (
    <Screen>
      <Text variant="title">Profil & Ayarlar</Text>
      <Spacer />

      <Card>
        <Text variant="subtitle">Hedef</Text>
        <Spacer size={Spacing.sm} />
        <Row style={{ flexWrap: 'wrap', gap: Spacing.sm }}>
          {GOALS.map((g) => (
            <Chip key={g.id} label={g.label} selected={profile.goal === g.id} onPress={() => updateProfile({ goal: g.id })} />
          ))}
        </Row>
      </Card>

      <Spacer />
      <Card>
        <Text variant="subtitle">Deneyim</Text>
        <Spacer size={Spacing.sm} />
        <Row style={{ flexWrap: 'wrap', gap: Spacing.sm }}>
          {EXPERIENCES.map((e) => (
            <Chip
              key={e.id}
              label={e.label}
              selected={profile.experience === e.id}
              onPress={() => updateProfile({ experience: e.id })}
            />
          ))}
        </Row>
      </Card>

      <Spacer />
      <Card>
        <Text variant="subtitle">Cinsiyet</Text>
        <Spacer size={Spacing.sm} />
        <Row style={{ flexWrap: 'wrap', gap: Spacing.sm }}>
          {SEXES.map((s) => (
            <Chip key={s.id} label={s.label} selected={profile.sex === s.id} onPress={() => updateProfile({ sex: s.id })} />
          ))}
        </Row>
      </Card>

      <Spacer />
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text variant="subtitle">Kilo</Text>
          <Stepper value={profile.weightKg} onChange={(v) => updateProfile({ weightKg: v })} min={30} max={250} suffix="kg" />
        </Row>
        <Spacer size={Spacing.md} />
        <Row style={{ justifyContent: 'space-between' }}>
          <Text variant="subtitle">Boy</Text>
          <Stepper value={profile.heightCm} onChange={(v) => updateProfile({ heightCm: v })} min={120} max={230} suffix="cm" />
        </Row>
      </Card>

      <Spacer />
      <Card>
        <Text variant="subtitle">Sahip olunan dumbbell’lar</Text>
        <Spacer size={Spacing.sm} />
        <Row style={{ flexWrap: 'wrap', gap: Spacing.sm }}>
          {COMMON_DUMBBELLS.map((w) => (
            <Chip
              key={w}
              label={`${w} kg`}
              selected={profile.ownedDumbbellsKg.includes(w)}
              onPress={() => toggleDumbbell(w)}
            />
          ))}
        </Row>
      </Card>

      <Spacer size={Spacing.xl} />
      <Button title="Profili sıfırla" variant="danger" onPress={onReset} />
      <Spacer size={Spacing.xl} />
      <Text variant="caption" muted style={{ textAlign: 'center' }}>
        Öneriler rehber niteliğindedir, tıbbi tavsiye değildir.
      </Text>
      <Spacer size={Spacing.xl} />
    </Screen>
  );
}
