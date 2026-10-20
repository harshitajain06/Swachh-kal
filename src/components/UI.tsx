import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo } from 'react';
import { Dimensions, Pressable, StyleProp, StyleSheet, Text, TextProps, TextStyle, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, fonts, radius, shadow } from '../theme';

const { width: W, height: H } = Dimensions.get('window');

/* ---------- Text ---------- */
type Variant = 'title' | 'h2' | 'h3' | 'body' | 'small' | 'label';
const textStyles: Record<Variant, TextStyle> = {
  title: { fontFamily: fonts.display, fontSize: 36, lineHeight: 42, color: colors.ink },
  h2: { fontFamily: fonts.display, fontSize: 26, lineHeight: 32, color: colors.ink },
  h3: { fontFamily: fonts.displayMed, fontSize: 20, lineHeight: 26, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 23, color: colors.ink },
  small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.inkSoft },
  label: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
};
export function T({ v = 'body', style, ...p }: TextProps & { v?: Variant }) {
  return <Text {...p} style={[textStyles[v], style]} />;
}

/* ---------- Bouncy pressable ---------- */
export function Bouncy({
  children,
  onPress,
  style,
  disabled,
  haptic = true,
  scaleTo = 0.93,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  haptic?: boolean;
  scaleTo?: number;
}) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => {
        s.value = withSpring(scaleTo, { damping: 12, stiffness: 400 });
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }}
      onPressOut={() => (s.value = withSpring(1, { damping: 6, stiffness: 220 }))}
      onPress={onPress}
    >
      <Animated.View style={[a, style]}>{children}</Animated.View>
    </Pressable>
  );
}

/* ---------- Chunky 3D button ---------- */
export function Button({
  label,
  onPress,
  color = colors.brand,
  dark = colors.brandDark,
  disabled,
  style,
  icon,
}: {
  label: string;
  onPress?: () => void;
  color?: string;
  dark?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: string;
}) {
  return (
    <Bouncy onPress={onPress} disabled={disabled} style={[{ opacity: disabled ? 0.45 : 1 }, style]}>
      <View style={{ backgroundColor: dark, borderRadius: radius.pill, paddingBottom: 6 }}>
        <View style={{ backgroundColor: color, borderRadius: radius.pill, paddingVertical: 14, paddingHorizontal: 26, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          {icon ? <Text style={{ fontSize: 22 }}>{icon}</Text> : null}
          <Text style={{ fontFamily: fonts.display, fontSize: 21, color: '#fff' }}>{label}</Text>
        </View>
      </View>
    </Bouncy>
  );
}

/* ---------- Card ---------- */
export function Card({ children, style, delay = 0 }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; delay?: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify().damping(14)} style={[styles.card, style]}>
      {children}
    </Animated.View>
  );
}

/* ---------- Floating decorations ---------- */
const DECOR = ['⭐', '☁️', '🍃', '💧', '✨', '🌈', '🦋', '🌼'];
function Floaty({ i }: { i: number }) {
  const y = useSharedValue(0);
  const r = useSharedValue(0);
  const cfg = useMemo(
    () => ({ x: ((i * 97) % 100) / 100, top: ((i * 53) % 90) / 100, size: 18 + ((i * 7) % 16), dur: 3200 + ((i * 431) % 2600) }),
    [i],
  );
  useEffect(() => {
    y.value = withRepeat(withSequence(withTiming(-18, { duration: cfg.dur, easing: Easing.inOut(Easing.sin) }), withTiming(18, { duration: cfg.dur, easing: Easing.inOut(Easing.sin) })), -1, true);
    r.value = withRepeat(withSequence(withTiming(-12, { duration: cfg.dur }), withTiming(12, { duration: cfg.dur })), -1, true);
  }, []);
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }, { rotate: `${r.value}deg` }] }));
  return (
    <Animated.Text style={[{ position: 'absolute', left: cfg.x * (W - 30), top: cfg.top * H, fontSize: cfg.size, opacity: 0.55 }, a]}>
      {DECOR[i % DECOR.length]}
    </Animated.Text>
  );
}

export function FloatingBg({ count = 8 }: { count?: number }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => (
        <Floaty key={i} i={i} />
      ))}
    </View>
  );
}

export function Screen({
  children,
  gradient,
  style,
  decor = true,
}: {
  children: React.ReactNode;
  gradient?: [string, string];
  style?: StyleProp<ViewStyle>;
  decor?: boolean;
}) {
  return (
    <View style={[{ flex: 1, backgroundColor: colors.bg }, style]}>
      {gradient ? <LinearGradient colors={gradient} style={StyleSheet.absoluteFill} /> : null}
      {decor ? <FloatingBg /> : null}
      {children}
    </View>
  );
}

/* ---------- Pulse wrapper (attention) ---------- */
export function Pulse({ children, style, amount = 1.06, duration = 700 }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; amount?: number; duration?: number }) {
  const s = useSharedValue(1);
  useEffect(() => {
    s.value = withRepeat(withSequence(withTiming(amount, { duration, easing: Easing.inOut(Easing.quad) }), withTiming(1, { duration, easing: Easing.inOut(Easing.quad) })), -1);
  }, []);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return <Animated.View style={[a, style]}>{children}</Animated.View>;
}

/* ---------- Pop-in ---------- */
export function PopIn({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const s = useSharedValue(0);
  useEffect(() => {
    s.value = withDelay(delay, withSpring(1, { damping: 7, stiffness: 140 }));
  }, []);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }], opacity: s.value }));
  return <Animated.View style={[a, style]}>{children}</Animated.View>;
}

/* ---------- Confetti ---------- */
const CONF = ['#FF5CA8', '#FFC93C', '#2ED9A0', '#4FD8FF', '#7C4DFF', '#FF8A1F'];
function Piece({ i, total }: { i: number; total: number }) {
  const y = useSharedValue(-40);
  const x = useSharedValue(0);
  const r = useSharedValue(0);
  const cfg = useMemo(() => {
    const seed = (i * 9301 + 49297) % 233280;
    const rnd = (n: number) => (((seed * (n + 3)) % 1000) / 1000);
    return { left: (i / total) * W, delay: rnd(1) * 700, dur: 2200 + rnd(2) * 1800, drift: (rnd(3) - 0.5) * 120, size: 8 + rnd(4) * 8, color: CONF[i % CONF.length], round: i % 3 === 0 };
  }, []);
  useEffect(() => {
    y.value = withDelay(cfg.delay, withTiming(H + 40, { duration: cfg.dur, easing: Easing.in(Easing.quad) }));
    x.value = withDelay(cfg.delay, withTiming(cfg.drift, { duration: cfg.dur }));
    r.value = withDelay(cfg.delay, withTiming(720, { duration: cfg.dur }));
  }, []);
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }, { translateX: x.value }, { rotate: `${r.value}deg` }] }));
  return (
    <Animated.View
      style={[{ position: 'absolute', left: cfg.left, top: 0, width: cfg.size, height: cfg.size * (cfg.round ? 1 : 1.6), backgroundColor: cfg.color, borderRadius: cfg.round ? 99 : 2 }, a]}
    />
  );
}
export function Confetti({ count = 48 }: { count?: number }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => (
        <Piece key={i} i={i} total={count} />
      ))}
    </View>
  );
}

/* ---------- Progress bar ---------- */
export function Bar({ value, color = colors.brand, track = '#00000014', height = 14 }: { value: number; color?: string; track?: string; height?: number }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withSpring(Math.max(0, Math.min(1, value)), { damping: 14 });
  }, [value]);
  const a = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <View style={{ height, borderRadius: height, backgroundColor: track, overflow: 'hidden' }}>
      <Animated.View style={[{ height, borderRadius: height, backgroundColor: color }, a]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 18, ...shadow },
});
