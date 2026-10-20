import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';

function Puff({ i, w, h }: { i: number; w: number; h: number }) {
  const y = useSharedValue(0);
  const x = useSharedValue(0);
  const size = 50 + ((i * 37) % 60);
  const left = ((i * 83) % 100) / 100;
  useEffect(() => {
    y.value = withDelay(i * 300, withRepeat(withTiming(-h * 0.8, { duration: 5000 + i * 450, easing: Easing.out(Easing.quad) }), -1));
    x.value = withDelay(i * 300, withRepeat(withTiming(i % 2 ? 40 : -40, { duration: 5000 + i * 450, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, []);
  const a = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { translateX: x.value }],
    opacity: Math.max(0, 1 + y.value / (h * 0.8)) * 0.8,
  }));
  return <Animated.View style={[{ position: 'absolute', bottom: -size / 2, left: left * (w - size), width: size, height: size, borderRadius: size, backgroundColor: '#8D939A' }, a]} />;
}

/** Drifting grey smog. `amount` 1 = thick smog, 0 = clear (renders nothing). */
export function Smoke({ amount, width, height, count = 7 }: { amount: number; width: number; height: number; count?: number }) {
  if (amount <= 0.02) return null;
  return (
    <View style={[StyleSheet.absoluteFill, { opacity: Math.min(1, amount) }]} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => (
        <Puff key={i} i={i} w={width} h={height} />
      ))}
    </View>
  );
}
