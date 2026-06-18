import { Pressable, View } from 'react-native';
import Svg, { Circle, Ellipse, Rect } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';
import type { BodyRegion } from '@/domain/types';

const W = 200;
const H = 360;

/** Tıklanabilir bölge alanları (SVG koordinat uzayında bounding box). */
const HITBOXES: { region: BodyRegion; x: number; y: number; w: number; h: number }[] = [
  { region: 'shoulders', x: 48, y: 60, w: 36, h: 26 },
  { region: 'shoulders', x: 116, y: 60, w: 36, h: 26 },
  { region: 'chest', x: 72, y: 62, w: 56, h: 44 },
  { region: 'biceps', x: 46, y: 86, w: 22, h: 58 },
  { region: 'biceps', x: 132, y: 86, w: 22, h: 58 },
  { region: 'core', x: 76, y: 110, w: 48, h: 64 },
  { region: 'legs', x: 76, y: 182, w: 48, h: 140 },
];

/**
 * Önden görünüm vücut figürü. SVG yalnızca çizim içindir (web'de event
 * uyarısı üretmemesi için handler taşımaz); tıklama, üstüne bindirilen şeffaf
 * Pressable bölgeleriyle yapılır. Arka/triceps/tüm vücut ekrandaki çiplerden seçilir.
 */
export function BodyMap({
  selected,
  onSelect,
}: {
  selected?: BodyRegion | null;
  onSelect: (region: BodyRegion) => void;
}) {
  const t = useTheme();
  const fill = (region: BodyRegion) => (selected === region ? t.accent : t.backgroundElement);
  const stroke = t.border;

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: W, height: H }}>
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {/* Baş + boyun (dekoratif) */}
          <Circle cx={100} cy={28} r={18} fill={t.backgroundElement} stroke={stroke} strokeWidth={1.5} />
          <Rect x={92} y={44} width={16} height={12} fill={t.backgroundElement} stroke={stroke} strokeWidth={1.5} />
          {/* Omuzlar */}
          <Ellipse cx={66} cy={72} rx={16} ry={12} fill={fill('shoulders')} stroke={stroke} strokeWidth={1.5} />
          <Ellipse cx={134} cy={72} rx={16} ry={12} fill={fill('shoulders')} stroke={stroke} strokeWidth={1.5} />
          {/* Göğüs */}
          <Rect x={72} y={62} width={56} height={44} rx={10} fill={fill('chest')} stroke={stroke} strokeWidth={1.5} />
          {/* Biceps (üst kollar) */}
          <Rect x={48} y={86} width={16} height={58} rx={8} fill={fill('biceps')} stroke={stroke} strokeWidth={1.5} />
          <Rect x={136} y={86} width={16} height={58} rx={8} fill={fill('biceps')} stroke={stroke} strokeWidth={1.5} />
          {/* Karın */}
          <Rect x={76} y={110} width={48} height={64} rx={10} fill={fill('core')} stroke={stroke} strokeWidth={1.5} />
          {/* Bacaklar */}
          <Rect x={78} y={182} width={20} height={140} rx={10} fill={fill('legs')} stroke={stroke} strokeWidth={1.5} />
          <Rect x={102} y={182} width={20} height={140} rx={10} fill={fill('legs')} stroke={stroke} strokeWidth={1.5} />
        </Svg>

        {/* Şeffaf tıklama katmanları */}
        {HITBOXES.map((h, i) => (
          <Pressable
            key={`${h.region}-${i}`}
            onPress={() => onSelect(h.region)}
            accessibilityRole="button"
            accessibilityLabel={h.region}
            style={{ position: 'absolute', left: h.x, top: h.y, width: h.w, height: h.h }}
          />
        ))}
      </View>
    </View>
  );
}
