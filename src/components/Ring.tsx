import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AC = Animated.createAnimatedComponent(Circle);

export function Ring({ size = 80, stroke = 10, value, color, track = '#00000018', children, delay = 0 }: { size?: number; stroke?: number; value: number; color: string; track?: string; children?: React.ReactNode; delay?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withTiming(Math.max(0, Math.min(1, value)), { duration: 900, easing: Easing.out(Easing.cubic) }));
  }, [value]);
  const ap = useAnimatedProps(() => ({ strokeDashoffset: c * (1 - p.value) }));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <AC cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} strokeLinecap="round" fill="none" strokeDasharray={`${c} ${c}`} animatedProps={ap} />
      </Svg>
      {children}
    </View>
  );
}
