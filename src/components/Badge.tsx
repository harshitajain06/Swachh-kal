import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { ULTIMATE_BADGE, LEVEL_BADGE } from '../data/art';
import { HeroId, Tier, heroById } from '../data/content';
import { colors, fonts } from '../theme';

/** Level 1/2/3 medal from the client, with a small chip showing which hero it belongs to. */
export function HeroBadge({ heroId, tier, size = 96, earned = true, animate = true }: { heroId: HeroId; tier: Tier; size?: number; earned?: boolean; animate?: boolean }) {
  const hero = heroById(heroId);
  const wob = useSharedValue(0);
  const shine = useSharedValue(0);
  useEffect(() => {
    if (!earned || !animate) return;
    wob.value = withRepeat(withSequence(withTiming(-5, { duration: 1100, easing: Easing.inOut(Easing.sin) }), withTiming(5, { duration: 1100, easing: Easing.inOut(Easing.sin) })), -1, true);
    shine.value = withRepeat(withSequence(withDelay(1500, withTiming(1, { duration: 700 })), withTiming(0, { duration: 0 })), -1);
  }, [earned, animate]);
  const a = useAnimatedStyle(() => ({ transform: [{ rotate: `${wob.value}deg` }] }));
  const sh = useAnimatedStyle(() => ({ opacity: 0.7 * (1 - Math.abs(shine.value - 0.5) * 2), transform: [{ translateX: -size * 0.6 + shine.value * size * 1.2 }, { rotate: '20deg' }] }));
  return (
    <Animated.View style={[{ width: size, height: size }, a]}>
      <View style={{ width: size, height: size, borderRadius: size * 0.2, overflow: 'hidden', opacity: earned ? 1 : 0.28 }}>
        <Image source={LEVEL_BADGE[tier]} style={{ width: size, height: size }} contentFit="cover" />
        {earned && animate ? <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: -size * 0.1, width: size * 0.12, height: size * 1.3, backgroundColor: '#fff' }, sh]} /> : null}
      </View>
      <View style={{ position: 'absolute', right: -2, bottom: -2, width: size * 0.34, height: size * 0.34, borderRadius: 99, backgroundColor: hero.colors[1], borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: size * 0.18 }}>{earned ? hero.emoji : '🔒'}</Text>
      </View>
    </Animated.View>
  );
}

/** The final Swachh Kal badge, with rotating sun rays. */
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
      <Animated.View style={[{ width: size * 0.78, height: size * 0.78, borderRadius: size * 0.2, overflow: 'hidden' }, body]}>
        <Image source={ULTIMATE_BADGE} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      </Animated.View>
    </View>
  );
}
