import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Path, Polygon, Stop } from 'react-native-svg';
import { HeroId, Tier, heroById } from '../data/content';
import { colors, fonts } from '../theme';

const TIER_COLORS: Record<Tier, [string, string]> = {
  bronze: ['#F2B27A', '#B8692B'],
  silver: ['#F4F7FB', '#9AA7BA'],
  gold: ['#FFE27A', '#F5A800'],
};

function star(cx: number, cy: number, R: number, r: number, n = 5) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI / n) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    pts.push(`${cx + Math.cos(a) * rad},${cy + Math.sin(a) * rad}`);
  }
  return pts.join(' ');
}

export function HeroBadge({ heroId, tier, size = 96, earned = true, animate = true }: { heroId: HeroId; tier: Tier; size?: number; earned?: boolean; animate?: boolean }) {
  const hero = heroById(heroId);
  const [c1, c2] = TIER_COLORS[tier];
  const wob = useSharedValue(0);
  const shine = useSharedValue(0);
  useEffect(() => {
    if (!earned || !animate) return;
    wob.value = withRepeat(withSequence(withTiming(-6, { duration: 1100, easing: Easing.inOut(Easing.sin) }), withTiming(6, { duration: 1100, easing: Easing.inOut(Easing.sin) })), -1, true);
    shine.value = withRepeat(withSequence(withDelay(1500, withTiming(1, { duration: 700 })), withTiming(0, { duration: 0 })), -1);
  }, [earned, animate]);
  const a = useAnimatedStyle(() => ({ transform: [{ rotate: `${wob.value}deg` }] }));
  const sh = useAnimatedStyle(() => ({ opacity: 0.8 * (1 - Math.abs(shine.value - 0.5) * 2), transform: [{ translateX: -size * 0.5 + shine.value * size }, { rotate: '20deg' }] }));
  return (
    <Animated.View style={[{ width: size, height: size, opacity: earned ? 1 : 0.35 }, a]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id={`m-${heroId}-${tier}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={c1} />
            <Stop offset="1" stopColor={c2} />
          </LinearGradient>
        </Defs>
        <Path d="M30 4 L50 40 L70 4 Z" fill={hero.colors[1]} />
        <Path d="M38 4 L50 28 L62 4 Z" fill={hero.colors[0]} />
        <Circle cx={50} cy={62} r={34} fill={`url(#m-${heroId}-${tier})`} />
        <Circle cx={50} cy={62} r={27} fill={earned ? hero.soft : '#ddd'} stroke={c2} strokeWidth={3} />
      </Svg>
      <View style={{ position: 'absolute', left: 0, right: 0, top: size * 0.46, alignItems: 'center' }}>
        <Text style={{ fontSize: size * 0.34 }}>{earned ? hero.emoji : '🔒'}</Text>
      </View>
      {earned && animate ? (
        <View style={{ position: 'absolute', left: size * 0.16, top: size * 0.28, width: size * 0.68, height: size * 0.68, borderRadius: 99, overflow: 'hidden' }} pointerEvents="none">
          <Animated.View style={[{ width: size * 0.12, height: size * 1.2, backgroundColor: '#fff' }, sh]} />
        </View>
      ) : null}
    </Animated.View>
  );
}

export function SuperBadge({ size = 140, earned = true }: { size?: number; earned?: boolean }) {
  const spin = useSharedValue(0);
  const pop = useSharedValue(1);
  useEffect(() => {
    if (!earned) return;
    spin.value = withRepeat(withTiming(360, { duration: 9000, easing: Easing.linear }), -1);
    pop.value = withRepeat(withSequence(withTiming(1.06, { duration: 800 }), withTiming(1, { duration: 800 })), -1);
  }, [earned]);
  const rays = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value}deg` }] }));
  const body = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', opacity: earned ? 1 : 0.4 }}>
      <Animated.View style={[{ position: 'absolute', width: size, height: size }, rays]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          {Array.from({ length: 12 }).map((_, i) => (
            <Path key={i} d="M50 50 L46 2 L54 2 Z" fill="#FFE27A" opacity={0.7} transform={`rotate(${i * 30} 50 50)`} />
          ))}
        </Svg>
      </Animated.View>
      <Animated.View style={[{ width: size * 0.74, height: size * 0.74 }, body]}>
        <Svg width={size * 0.74} height={size * 0.74} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FFF1A8" />
              <Stop offset="1" stopColor="#F5A800" />
            </LinearGradient>
          </Defs>
          <Circle cx={50} cy={50} r={46} fill="url(#sg)" stroke="#C77F00" strokeWidth={3} />
          <Circle cx={50} cy={50} r={37} fill="#7C4DFF" />
          <Polygon points={star(50, 52, 26, 11)} fill="#FFE27A" stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
        </Svg>
        <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: size * 0.2, marginTop: -size * 0.12 }}>🌍</Text>
        </View>
      </Animated.View>
      <Text style={{ position: 'absolute', bottom: 0, fontFamily: fonts.display, color: colors.ink, fontSize: size * 0.11 }}>SWACHH KAL</Text>
    </View>
  );
}
