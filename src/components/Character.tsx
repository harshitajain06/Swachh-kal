import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { HeroId } from '../data/content';

const AEllipse = Animated.createAnimatedComponent(Ellipse);

type Mood = 'happy' | 'sad' | 'cheer';

function Face({ cx, cy, mood, scale = 1 }: { cx: number; cy: number; mood: Mood; scale?: number }) {
  const ry = useSharedValue(8);
  useEffect(() => {
    ry.value = withRepeat(withSequence(withDelay(2400, withTiming(0.8, { duration: 90 })), withTiming(8, { duration: 130 })), -1);
  }, []);
  const ap = useAnimatedProps(() => ({ ry: ry.value }));
  const s = scale;
  const ex = 22 * s;
  return (
    <G>
      <AEllipse cx={cx - ex} cy={cy} rx={7 * s} animatedProps={ap} fill="#2B2350" />
      <AEllipse cx={cx + ex} cy={cy} rx={7 * s} animatedProps={ap} fill="#2B2350" />
      <Circle cx={cx - ex + 2} cy={cy - 3} r={2.2 * s} fill="#fff" />
      <Circle cx={cx + ex + 2} cy={cy - 3} r={2.2 * s} fill="#fff" />
      <Ellipse cx={cx - 36 * s} cy={cy + 12 * s} rx={8 * s} ry={5 * s} fill="#FF7BAC" opacity={0.55} />
      <Ellipse cx={cx + 36 * s} cy={cy + 12 * s} rx={8 * s} ry={5 * s} fill="#FF7BAC" opacity={0.55} />
      {mood === 'happy' && <Path d={`M ${cx - 11 * s} ${cy + 12 * s} Q ${cx} ${cy + 26 * s} ${cx + 11 * s} ${cy + 12 * s}`} stroke="#2B2350" strokeWidth={4 * s} strokeLinecap="round" fill="none" />}
      {mood === 'sad' && <Path d={`M ${cx - 10 * s} ${cy + 22 * s} Q ${cx} ${cy + 10 * s} ${cx + 10 * s} ${cy + 22 * s}`} stroke="#2B2350" strokeWidth={4 * s} strokeLinecap="round" fill="none" />}
      {mood === 'cheer' && (
        <Path d={`M ${cx - 14 * s} ${cy + 10 * s} Q ${cx} ${cy + 36 * s} ${cx + 14 * s} ${cy + 10 * s} Z`} fill="#C2185B" stroke="#2B2350" strokeWidth={3 * s} strokeLinejoin="round" />
      )}
    </G>
  );
}

function Cape({ color }: { color: string }) {
  return <Path d="M 62 92 Q 20 140 36 196 Q 100 172 164 196 Q 180 140 138 92 Z" fill={color} opacity={0.95} />;
}

function Body({ id, mood, cape }: { id: HeroId; mood: Mood; cape: boolean }) {
  switch (id) {
    case 'vayu':
      return (
        <G>
          {cape && <Cape color="#FF4D6D" />}
          <Path d="M20 70 Q40 62 60 70 M10 90 Q36 80 52 90" stroke="#B5ECFF" strokeWidth={5} strokeLinecap="round" fill="none" />
          <Path d="M150 60 Q170 52 186 62 Q196 76 182 82" stroke="#B5ECFF" strokeWidth={5} strokeLinecap="round" fill="none" />
          <G>
            <Circle cx={66} cy={112} r={40} fill="url(#vg)" />
            <Circle cx={108} cy={88} r={48} fill="url(#vg)" />
            <Circle cx={148} cy={114} r={38} fill="url(#vg)" />
            <Rect x={44} y={112} width={128} height={44} rx={22} fill="url(#vg)" />
          </G>
          <Face cx={106} cy={112} mood={mood} />
        </G>
      );
    case 'tarun':
      return (
        <G>
          {cape && <Cape color="#FF4D6D" />}
          <Path d="M88 150 L84 196 L120 196 L116 150 Z" fill="#9B6A3C" />
          <Path d="M70 190 Q100 180 134 190" stroke="#7A4F28" strokeWidth={5} strokeLinecap="round" fill="none" />
          <Circle cx={60} cy={96} r={36} fill="#2FBF4B" />
          <Circle cx={144} cy={96} r={36} fill="#2FBF4B" />
          <Circle cx={102} cy={64} r={44} fill="#4FD95E" />
          <Circle cx={102} cy={116} r={46} fill="#3FD055" />
          <Path d="M102 22 Q108 6 124 8 Q122 24 102 22 Z" fill="#8BE86B" />
          <Face cx={102} cy={108} mood={mood} />
        </G>
      );
    case 'dharti':
      return (
        <G>
          {cape && <Cape color="#FF4D6D" />}
          <Circle cx={100} cy={106} r={72} fill="url(#dg)" />
          <Path d="M52 84 Q66 56 92 62 Q96 82 78 90 Q64 108 52 84 Z" fill="#4FD95E" />
          <Path d="M130 130 Q158 112 160 140 Q150 168 128 156 Q120 142 130 130 Z" fill="#4FD95E" />
          <Path d="M112 50 Q132 44 142 62 Q124 70 112 50 Z" fill="#4FD95E" />
          <Ellipse cx={72} cy={72} rx={14} ry={8} fill="#fff" opacity={0.35} transform="rotate(-30 72 72)" />
          <Face cx={100} cy={108} mood={mood} />
        </G>
      );
    case 'jal':
      return (
        <G>
          {cape && <Cape color="#FF4D6D" />}
          <Path d="M100 14 C100 14 40 88 40 130 A60 60 0 0 0 160 130 C160 88 100 14 100 14 Z" fill="url(#jg)" />
          <Path d="M64 120 Q62 94 82 70" stroke="#fff" strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.55} />
          <Face cx={100} cy={128} mood={mood} />
        </G>
      );
  }
}

export interface CharacterProps {
  id: HeroId;
  size?: number;
  mood?: Mood;
  /** draw the red hero cape (earned the hero identity) */
  cape?: boolean;
  /** greyed out, for locked heroes */
  locked?: boolean;
  /** stop the idle animation */
  still?: boolean;
  /** one-shot jump (e.g. on celebration) */
  jump?: boolean;
}

export function Character({ id, size = 140, mood = 'happy', cape = false, locked = false, still = false, jump = false }: CharacterProps) {
  const y = useSharedValue(0);
  const rot = useSharedValue(0);
  const sx = useSharedValue(1);
  const sy = useSharedValue(1);
  const hop = useSharedValue(0);

  useEffect(() => {
    if (still || locked) return;
    const ease = Easing.inOut(Easing.sin);
    if (id === 'vayu') {
      y.value = withRepeat(withSequence(withTiming(-10, { duration: 1400, easing: ease }), withTiming(6, { duration: 1400, easing: ease })), -1, true);
      rot.value = withRepeat(withSequence(withTiming(-5, { duration: 1800, easing: ease }), withTiming(5, { duration: 1800, easing: ease })), -1, true);
    } else if (id === 'tarun') {
      rot.value = withRepeat(withSequence(withTiming(-6, { duration: 1500, easing: ease }), withTiming(6, { duration: 1500, easing: ease })), -1, true);
      y.value = withRepeat(withSequence(withTiming(-4, { duration: 900, easing: ease }), withTiming(0, { duration: 900, easing: ease })), -1, true);
    } else if (id === 'dharti') {
      rot.value = withRepeat(withTiming(360, { duration: 14000, easing: Easing.linear }), -1);
      y.value = withRepeat(withSequence(withTiming(-8, { duration: 1100, easing: ease }), withTiming(0, { duration: 1100, easing: ease })), -1, true);
    } else {
      sy.value = withRepeat(withSequence(withTiming(1.07, { duration: 900, easing: ease }), withTiming(0.95, { duration: 900, easing: ease })), -1, true);
      sx.value = withRepeat(withSequence(withTiming(0.95, { duration: 900, easing: ease }), withTiming(1.05, { duration: 900, easing: ease })), -1, true);
    }
  }, [id, still, locked]);

  useEffect(() => {
    if (!jump) return;
    hop.value = withRepeat(withSequence(withTiming(-26, { duration: 260, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: 260, easing: Easing.in(Easing.quad) })), 4);
  }, [jump]);

  // Dharti rotates the whole globe's body only subtly so the face stays readable
  const a = useAnimatedStyle(() => ({
    transform: [
      { translateY: y.value + hop.value },
      { rotate: `${id === 'dharti' ? Math.sin((rot.value * Math.PI) / 180) * 6 : rot.value}deg` },
      { scaleX: sx.value },
      { scaleY: sy.value },
    ],
  }));

  return (
    <Animated.View style={[{ width: size, height: size, opacity: locked ? 0.5 : 1 }, a]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" />
            <Stop offset="1" stopColor="#BDEBFF" />
          </LinearGradient>
          <LinearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#5CC8FF" />
            <Stop offset="1" stopColor="#2A8AE8" />
          </LinearGradient>
          <LinearGradient id="jg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#8FD3FF" />
            <Stop offset="1" stopColor="#3A6BFF" />
          </LinearGradient>
        </Defs>
        {locked ? (
          <G opacity={0.9}>
            <Body id={id} mood="sad" cape={false} />
          </G>
        ) : (
          <Body id={id} mood={mood} cape={cape} />
        )}
      </Svg>
      {locked && (
        <View style={{ position: 'absolute', right: 0, bottom: 0, width: size * 0.3, height: size * 0.3, borderRadius: 99, backgroundColor: '#2B2350', alignItems: 'center', justifyContent: 'center' }}>
          <Animated.Text style={{ fontSize: size * 0.17 }}>🔒</Animated.Text>
        </View>
      )}
    </Animated.View>
  );
}

/** Replace SVG art with the client's PNGs by swapping this map (Vayu.png etc.) */
export const HERO_IMAGES: Partial<Record<HeroId, any>> = {};
