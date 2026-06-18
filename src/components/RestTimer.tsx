import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Row, Text } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Geri sayan dinlenme zamanlayıcısı. Set tamamlanınca elle başlatılır. */
export function RestTimer({ defaultSec = 90 }: { defaultSec?: number }) {
  const t = useTheme();
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const start = (sec: number) => {
    setRemaining(sec);
    setRunning(true);
  };
  const stop = () => {
    setRunning(false);
    setRemaining(0);
  };

  const mmss = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;

  return (
    <View
      style={{
        backgroundColor: running ? t.accent : t.backgroundElement,
        borderRadius: Radius.lg,
        padding: Spacing.md,
      }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Text variant="subtitle" color={running ? t.onAccent : t.text}>
          {running ? `Dinlenme: ${mmss}` : 'Dinlenme zamanlayıcısı'}
        </Text>
        {running ? (
          <Pressable onPress={stop} hitSlop={8}>
            <Text variant="label" color={t.onAccent}>
              Durdur
            </Text>
          </Pressable>
        ) : (
          <Row style={{ gap: Spacing.sm }}>
            {[45, 90, 150].map((s) => (
              <Pressable
                key={s}
                onPress={() => start(s)}
                style={{
                  paddingVertical: Spacing.xs,
                  paddingHorizontal: Spacing.sm,
                  borderRadius: Radius.sm,
                  backgroundColor: t.card,
                }}>
                <Text variant="label" color={t.accent}>
                  {s}s
                </Text>
              </Pressable>
            ))}
          </Row>
        )}
      </Row>
      <Text variant="caption" color={running ? t.onAccent : t.textSecondary} style={{ marginTop: Spacing.xs }}>
        {running ? 'Sonraki sete hazırlan' : `Önerilen: ${defaultSec} sn`}
      </Text>
    </View>
  );
}
