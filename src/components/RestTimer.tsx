import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Row, Text } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useT } from '@/i18n';
import { alertFeedback, speak } from '@/services/feedback';

/**
 * Dinlenme sayacı durumu. Bitiş anını saklar; böylece uygulama arka plana
 * gidip dönse de kalan süre doğru hesaplanır.
 */
export function useRestTimer() {
  const { t, lang } = useT();
  const [endAt, setEndAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const announced = useRef(false);

  useEffect(() => {
    if (endAt == null) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [endAt]);

  const remaining = endAt == null ? 0 : Math.max(0, Math.ceil((endAt - now) / 1000));

  useEffect(() => {
    if (endAt != null && remaining === 0 && !announced.current) {
      announced.current = true;
      alertFeedback();
      speak(t('voice.restDone'), lang);
      setEndAt(null);
    }
  }, [remaining, endAt, t, lang]);

  const start = useCallback(
    (sec: number, announce = true) => {
      announced.current = false;
      setNow(Date.now());
      setEndAt(Date.now() + sec * 1000);
      if (announce) speak(t('voice.rest', { s: sec }), lang);
    },
    [t, lang],
  );
  const stop = useCallback(() => setEndAt(null), []);
  const add = useCallback((sec: number) => setEndAt((e) => (e == null ? e : e + sec * 1000)), []);

  return { running: endAt != null, remaining, start, stop, add };
}

export function RestTimer({
  timer,
  suggestedSec,
}: {
  timer: ReturnType<typeof useRestTimer>;
  suggestedSec: number;
}) {
  const c = useTheme();
  const { t } = useT();
  const { running, remaining } = timer;
  const mmss = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
  const options = Array.from(new Set([45, suggestedSec, 150])).sort((a, b) => a - b);

  return (
    <View
      accessibilityLiveRegion="polite"
      style={{ backgroundColor: running ? c.accent : c.backgroundElement, borderRadius: Radius.lg, padding: Spacing.md }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text variant={running ? 'heading' : 'subtitle'} color={running ? c.onAccent : c.text}>
          {running ? t('workout.rest.running', { time: mmss }) : t('workout.rest.idle')}
        </Text>
        {running ? (
          <Row gap={Spacing.md}>
            <Pressable onPress={() => timer.add(15)} hitSlop={10} accessibilityRole="button">
              <Text variant="label" color={c.onAccent}>
                {t('workout.rest.add')}
              </Text>
            </Pressable>
            <Pressable onPress={timer.stop} hitSlop={10} accessibilityRole="button">
              <Text variant="label" color={c.onAccent}>
                {t('workout.rest.stop')}
              </Text>
            </Pressable>
          </Row>
        ) : (
          <Row gap={Spacing.sm}>
            {options.map((s) => (
              <Pressable
                key={s}
                onPress={() => timer.start(s)}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={t('common.seconds', { n: s })}
                style={{
                  paddingVertical: Spacing.xs + 2,
                  paddingHorizontal: Spacing.sm,
                  borderRadius: Radius.sm,
                  backgroundColor: s === suggestedSec ? c.accentSoft : c.card,
                }}>
                <Text variant="label" color={c.accent}>
                  {s}s
                </Text>
              </Pressable>
            ))}
          </Row>
        )}
      </Row>
      <Text variant="caption" color={running ? c.onAccent : c.textSecondary} style={{ marginTop: Spacing.xs }}>
        {running ? t('workout.rest.hint') : t('workout.rest.suggested', { s: suggestedSec })}
      </Text>
    </View>
  );
}
