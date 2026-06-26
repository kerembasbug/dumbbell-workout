import { Pressable, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';
import type { BodyRegion } from '@/domain/types';

const W = 200;
const H = 360;

/** Sol taraf yolları; sağ taraf ayna ile (translate+scale) üretilir. */
const MIRROR = `translate(${W}, 0) scale(-1, 1)`;

/** Tıklanabilir bölge alanları (SVG koordinat uzayında bounding box). */
const HITBOXES: { region: BodyRegion; x: number; y: number; w: number; h: number }[] = [
  { region: 'chest', x: 66, y: 60, w: 68, h: 36 },
  { region: 'shoulders', x: 32, y: 58, w: 42, h: 36 },
  { region: 'shoulders', x: 126, y: 58, w: 42, h: 36 },
  { region: 'biceps', x: 32, y: 90, w: 28, h: 46 },
  { region: 'biceps', x: 140, y: 90, w: 28, h: 46 },
  { region: 'core', x: 70, y: 96, w: 60, h: 78 },
  { region: 'legs', x: 74, y: 174, w: 52, h: 166 },
];

/**
 * Önden görünüm kaslı vücut figürü. SVG yalnızca çizim içindir (web'de event
 * uyarısı üretmemesi için handler taşımaz); tıklama, üstüne bindirilen şeffaf
 * Pressable bölgeleriyle yapılır. Sırt/triceps/tüm vücut çiplerden seçilir.
 */
export function BodyMap({
  selected,
  onSelect,
}: {
  selected?: BodyRegion | null;
  onSelect: (region: BodyRegion) => void;
}) {
  const t = useTheme();
  const fillOf = (region: BodyRegion) => (selected === region ? t.accent : t.backgroundElement);
  const stroke = t.border;
  const sw = 1.5;

  // Sol taraf kas yolları (sağ taraf ayna ile çizilir).
  const DELT = 'M74 70 C 60 56, 40 60, 36 78 C 34 90, 46 98, 60 92 C 72 87, 78 80, 74 70 Z';
  const PEC = 'M99 66 C 86 60, 72 63, 68 75 C 66 87, 79 95, 93 90 C 98 88, 99 82, 99 75 Z';
  const BICEP = 'M54 90 C 40 92, 35 110, 39 130 C 42 142, 56 142, 58 127 C 60 109, 60 94, 56 90 Z';
  const FOREARM = 'M44 134 C 35 146, 35 168, 41 186 C 44 196, 56 194, 56 181 C 56 162, 54 142, 51 134 Z';
  const LEG = 'M90 174 C 80 198, 78 244, 80 288 C 81 310, 85 330, 90 338 C 99 340, 101 331, 100 316 C 99 252, 100 200, 99 178 Z';

  // Merkez (simetrik) yollar.
  const CORE = 'M72 90 C 70 112, 74 146, 86 170 C 94 184, 106 184, 114 170 C 126 146, 130 112, 128 90 C 116 100, 84 100, 72 90 Z';
  const NECK = 'M90 40 H110 V50 Q100 58 90 50 Z';
  const TRAP = 'M70 66 Q100 54 130 66 Q100 74 70 66 Z';

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: W, height: H }}>
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {/* Baş + boyun + trapez (dekoratif) */}
          <Circle cx={100} cy={26} r={17} fill={t.backgroundElement} stroke={stroke} strokeWidth={sw} />
          <Path d={NECK} fill={t.backgroundElement} stroke={stroke} strokeWidth={sw} />
          <Path d={TRAP} fill={t.backgroundElement} stroke={stroke} strokeWidth={sw} />

          {/* Bacaklar (en altta) */}
          <Path d={LEG} fill={fillOf('legs')} stroke={stroke} strokeWidth={sw} />
          <G transform={MIRROR}>
            <Path d={LEG} fill={fillOf('legs')} stroke={stroke} strokeWidth={sw} />
          </G>

          {/* Karın / gövde */}
          <Path d={CORE} fill={fillOf('core')} stroke={stroke} strokeWidth={sw} />

          {/* Ön kollar (dekoratif) */}
          <Path d={FOREARM} fill={t.backgroundElement} stroke={stroke} strokeWidth={sw} />
          <G transform={MIRROR}>
            <Path d={FOREARM} fill={t.backgroundElement} stroke={stroke} strokeWidth={sw} />
          </G>

          {/* Biceps (üst kollar) */}
          <Path d={BICEP} fill={fillOf('biceps')} stroke={stroke} strokeWidth={sw} />
          <G transform={MIRROR}>
            <Path d={BICEP} fill={fillOf('biceps')} stroke={stroke} strokeWidth={sw} />
          </G>

          {/* Göğüs (pectoral) */}
          <Path d={PEC} fill={fillOf('chest')} stroke={stroke} strokeWidth={sw} />
          <G transform={MIRROR}>
            <Path d={PEC} fill={fillOf('chest')} stroke={stroke} strokeWidth={sw} />
          </G>

          {/* Omuzlar (deltoid) — en üstte */}
          <Path d={DELT} fill={fillOf('shoulders')} stroke={stroke} strokeWidth={sw} />
          <G transform={MIRROR}>
            <Path d={DELT} fill={fillOf('shoulders')} stroke={stroke} strokeWidth={sw} />
          </G>
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
