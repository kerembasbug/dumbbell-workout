import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as RNText,
  TextProps as RNTextProps,
  View,
  ViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FontSize, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Ekran kapsayıcısı: güvenli alan + arka plan + (opsiyonel) kaydırma + web ortalama. */
export function Screen({
  children,
  scroll = true,
  padded = true,
  contentStyle,
}: {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  contentStyle?: ViewProps['style'];
}) {
  const t = useTheme();
  const inner = (
    <View
      style={[
        { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
        padded && { padding: Spacing.lg },
        contentStyle,
      ]}>
      {children}
    </View>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.background }} edges={['top', 'bottom']}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {inner}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{inner}</View>
      )}
    </SafeAreaView>
  );
}

type Variant = 'title' | 'heading' | 'subtitle' | 'body' | 'caption' | 'label';
type FontWeight = '400' | '600' | '700' | '800';

const VARIANT: Record<Variant, { fontSize: number; fontWeight: FontWeight }> = {
  title: { fontSize: FontSize.xxxl, fontWeight: '800' },
  heading: { fontSize: FontSize.xl, fontWeight: '700' },
  subtitle: { fontSize: FontSize.lg, fontWeight: '600' },
  body: { fontSize: FontSize.md, fontWeight: '400' },
  caption: { fontSize: FontSize.sm, fontWeight: '400' },
  label: { fontSize: FontSize.sm, fontWeight: '600' },
};

export function Text({
  variant = 'body',
  color,
  muted,
  style,
  ...rest
}: RNTextProps & { variant?: Variant; color?: string; muted?: boolean }) {
  const t = useTheme();
  const v = VARIANT[variant];
  return (
    <RNText
      style={[
        { color: color ?? (muted ? t.textSecondary : t.text), fontSize: v.fontSize, fontWeight: v.fontWeight },
        style,
      ]}
      {...rest}
    />
  );
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: ViewProps['style']; onPress?: () => void }) {
  const t = useTheme();
  const content = (
    <View
      style={[
        {
          backgroundColor: t.card,
          borderRadius: Radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: t.border,
          padding: Spacing.lg,
        },
        style,
      ]}>
      {children}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
      {content}
    </Pressable>
  );
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewProps['style'];
}) {
  const t = useTheme();
  const bg =
    variant === 'primary' ? t.accent : variant === 'danger' ? t.danger : variant === 'secondary' ? t.backgroundElement : 'transparent';
  const fg =
    variant === 'primary' || variant === 'danger' ? t.onAccent : variant === 'secondary' ? t.text : t.accent;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          borderRadius: Radius.md,
          paddingVertical: Spacing.md + 2,
          paddingHorizontal: Spacing.lg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
          minHeight: 50,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <RNText style={{ color: fg, fontSize: FontSize.md, fontWeight: '700' }}>{title}</RNText>
      )}
    </Pressable>
  );
}

/** Seçilebilir etiket/çip. */
export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: Spacing.sm,
          paddingHorizontal: Spacing.md,
          borderRadius: Radius.pill,
          backgroundColor: selected ? t.accent : t.backgroundElement,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: selected ? t.accent : t.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}>
      <RNText style={{ color: selected ? t.onAccent : t.text, fontWeight: '600', fontSize: FontSize.sm }}>
        {label}
      </RNText>
    </Pressable>
  );
}

/** +/- ile sayı ayarlayıcı. */
export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 9999,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  const t = useTheme();
  const clamp = (v: number) => Math.max(min, Math.min(max, Math.round(v * 100) / 100));
  const btn = (label: string, delta: number) => (
    <Pressable
      onPress={() => onChange(clamp(value + delta))}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderRadius: Radius.sm,
        backgroundColor: t.backgroundElement,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
      })}>
      <RNText style={{ color: t.text, fontSize: FontSize.xl, fontWeight: '700' }}>{label}</RNText>
    </Pressable>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
      {btn('−', -step)}
      <View style={{ minWidth: 64, alignItems: 'center' }}>
        <RNText style={{ color: t.text, fontSize: FontSize.lg, fontWeight: '700' }}>
          {value}
          {suffix ? ` ${suffix}` : ''}
        </RNText>
      </View>
      {btn('+', step)}
    </View>
  );
}

export function Row({ children, style, gap = Spacing.sm }: { children: ReactNode; style?: ViewProps['style']; gap?: number }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

export function Spacer({ size = Spacing.lg }: { size?: number }) {
  return <View style={{ height: size }} />;
}
