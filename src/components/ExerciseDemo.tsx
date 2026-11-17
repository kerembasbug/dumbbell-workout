import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import type { Exercise } from '@/domain/types';
import { useT } from '@/i18n';
import { useTheme } from '@/hooks/use-theme';

/** Başlangıç → Orta → Bitiş → Orta → … döngüsü (hareketin gidiş-dönüşü). */
const SEQUENCE = [0, 1, 2, 1];
const FRAME_MS = 900;

/**
 * Üç pozu yumuşak geçişle döngüye sokarak hareketi canlandırır.
 * Dokununca durur/devam eder. "Hareketi azalt" erişilebilirlik ayarı açıksa
 * kendiliğinden oynamaz.
 */
export function ExerciseDemo({ exercise, height = 260 }: { exercise: Exercise; height?: number }) {
  const t = useTheme();
  const { t: tr } = useT();
  const frames = [exercise.imageStart, exercise.imageMid, exercise.imageEnd];
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduce) => !cancelled && reduce && setPlaying(false))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setStep((s) => (s + 1) % SEQUENCE.length), FRAME_MS);
    return () => clearInterval(id);
  }, [playing]);

  if (!frames[0] || !frames[1] || !frames[2]) return null;
  const phase = SEQUENCE[step];
  const labels = [tr('exercise.phase.start'), tr('exercise.phase.mid'), tr('exercise.phase.end')];

  return (
    <View>
      <Pressable
        onPress={() => setPlaying((p) => !p)}
        accessibilityRole="imagebutton"
        accessibilityLabel={`${exercise.name}: ${labels.join(' → ')}`}
        style={{ height, borderRadius: Radius.xl, overflow: 'hidden', backgroundColor: '#16203a' }}>
        <Image source={frames[phase]} style={{ flex: 1 }} contentFit="contain" transition={350} />
        {!playing && (
          <View
            style={{
              position: 'absolute',
              right: Spacing.md,
              bottom: Spacing.md,
              backgroundColor: 'rgba(0,0,0,0.55)',
              borderRadius: Radius.pill,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.xs,
            }}>
            <Text variant="label" color="#fff">
              ▶
            </Text>
          </View>
        )}
      </Pressable>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: Spacing.lg, marginTop: Spacing.sm }}>
        {labels.map((label, i) => (
          <Pressable
            key={label}
            onPress={() => {
              setPlaying(false);
              setStep(SEQUENCE.indexOf(i));
            }}
            hitSlop={8}
            style={{ alignItems: 'center', gap: 4 }}>
            <View
              style={{
                width: phase === i ? 22 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: phase === i ? t.accent : t.backgroundSelected,
              }}
            />
            <Text variant="caption" color={phase === i ? t.accent : t.textMuted}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
