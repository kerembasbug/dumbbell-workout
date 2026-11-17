import { addDays, format, startOfWeek, subWeeks } from 'date-fns';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

import { Text } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import type { WeekBucket } from '@/domain/progress';
import { useTheme } from '@/hooks/use-theme';

/** Haftalık hacim çubuk grafiği. */
export function WeeklyBars({ data, formatValue }: { data: WeekBucket[]; formatValue: (v: number) => string }) {
  const t = useTheme();
  const [width, setWidth] = useState(0);
  const height = 150;
  const labelH = 18;
  const max = Math.max(1, ...data.map((d) => d.volume));
  const gap = 8;
  const barW = width > 0 ? (width - gap * (data.length - 1)) / data.length : 0;
  const last = data[data.length - 1];

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      accessible
      accessibilityLabel={data.map((d) => `${d.weekStart}: ${formatValue(d.volume)}`).join(', ')}>
      {width > 0 && (
        <Svg width={width} height={height + labelH}>
          {data.map((d, i) => {
            const h = Math.max(d.volume > 0 ? 4 : 2, (d.volume / max) * (height - 20));
            const x = i * (barW + gap);
            const isLast = i === data.length - 1;
            return (
              <Rect
                key={d.weekStart}
                x={x}
                y={height - h}
                width={barW}
                height={h}
                rx={6}
                fill={isLast ? t.accent : d.volume > 0 ? t.accentSoft : t.backgroundElement}
              />
            );
          })}
          {data.map((d, i) => (
            <SvgText
              key={`l-${d.weekStart}`}
              x={i * (barW + gap) + barW / 2}
              y={height + 14}
              fontSize={10}
              fill={t.textMuted}
              textAnchor="middle">
              {format(new Date(d.weekStart), 'd.M')}
            </SvgText>
          ))}
        </Svg>
      )}
      <Text variant="caption" muted style={{ marginTop: Spacing.xs }}>
        {formatValue(last?.volume ?? 0)}
      </Text>
    </View>
  );
}

/** Son N haftanın antrenman günleri ısı haritası (satırlar: Pzt…Paz). */
export function ActivityCalendar({ days, weeks = 12 }: { days: Set<string>; weeks?: number }) {
  const t = useTheme();
  const start = subWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weeks - 1);
  const today = format(new Date(), 'yyyy-MM-dd');
  const cols = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => format(addDays(start, w * 7 + d), 'yyyy-MM-dd')),
  );
  return (
    <View
      style={{ flexDirection: 'row', gap: 4, justifyContent: 'space-between' }}
      accessible
      accessibilityLabel={`${days.size}`}>
      {cols.map((col, ci) => (
        <View key={ci} style={{ gap: 4, flex: 1 }}>
          {col.map((d) => (
            <View
              key={d}
              style={{
                aspectRatio: 1,
                borderRadius: Radius.sm / 2,
                backgroundColor: days.has(d) ? t.accent : d > today ? 'transparent' : t.backgroundElement,
                borderWidth: d === today ? 1.5 : 0,
                borderColor: t.text,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
