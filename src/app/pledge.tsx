import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Pressable } from 'react-native';
import Animated, { Easing, FadeInDown, FadeInUp, runOnJS, useAnimatedProps, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Character } from '../components/Character';
import { Screen, T } from '../components/UI';
import { HERO_ORDER, PLEDGE_TEXT } from '../data/content';
import { useGame } from '../lib/game';
import { colors, fonts } from '../theme';

const AC = Animated.createAnimatedComponent(Circle);
const SIZE = 210;
const R = 92;
const C = 2 * Math.PI * R;

export default function Pledge() {
  const { takePledge, pledgedAt, celebration } = useGame();
  const [taken, setTaken] = useState(false);
  const p = useSharedValue(0);
  const glow = useSharedValue(1);

  useEffect(() => {
    glow.value = withRepeat(withSequence(withTiming(1.08, { duration: 800, easing: Easing.inOut(Easing.quad) }), withTiming(1, { duration: 800, easing: Easing.inOut(Easing.quad) })), -1);
  }, []);

  useEffect(() => {
    if (taken && pledgedAt && !celebration) router.replace('/(tabs)');
  }, [taken, pledgedAt, celebration]);

  const finish = () => {
    setTaken(true);
    takePledge();
  };
  const tick = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

  const ap = useAnimatedProps(() => ({ strokeDashoffset: C * (1 - p.value) }));
  const btn = useAnimatedStyle(() => ({ transform: [{ scale: glow.value * (1 - p.value * 0.08) }] }));

  return (
    <Screen gradient={['#7C4DFF', '#FF5CA8']}>
      <SafeAreaView style={{ flex: 1, alignItems: 'center', padding: 24 }}>
        <Animated.View entering={FadeInUp.springify()} style={{ alignItems: 'center', marginTop: 8 }}>
          <T v="title" style={{ color: '#fff', textAlign: 'center', fontSize: 32, lineHeight: 38 }}>Do you want to be a Swachh Hero?</T>
          <T v="h3" style={{ color: '#FFE27A', textAlign: 'center', marginTop: 4 }}>Let’s take the Swachh Pledge first!</T>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={{ backgroundColor: '#fff', borderRadius: 28, padding: 20, marginTop: 20 }}>
          <T v="h3" style={{ textAlign: 'center', fontFamily: fonts.displayMed, fontSize: 21, lineHeight: 28 }}>“{PLEDGE_TEXT}”</T>
          <T v="h2" style={{ textAlign: 'center', color: colors.brand, marginTop: 8 }}>I Pledge!</T>
        </Animated.View>

        <View style={{ flexDirection: 'row', marginTop: 14 }}>
          {HERO_ORDER.map((id) => (
            <Character key={id} id={id} size={66} mood="cheer" />
          ))}
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Pressable
            onPressIn={() => {
              tick();
              p.value = withTiming(1, { duration: 1800, easing: Easing.linear }, (done) => {
                if (done) runOnJS(finish)();
              });
            }}
            onPressOut={() => {
              if (p.value < 1) p.value = withSpring(0, { damping: 12 });
            }}
          >
            <Animated.View style={[{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }, btn]}>
              <Svg width={SIZE} height={SIZE} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
                <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke="#ffffff40" strokeWidth={14} fill="none" />
                <AC cx={SIZE / 2} cy={SIZE / 2} r={R} stroke="#FFE27A" strokeWidth={14} strokeLinecap="round" fill="none" strokeDasharray={`${C} ${C}`} animatedProps={ap} />
              </Svg>
              <View style={{ width: 160, height: 160, borderRadius: 80, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 76 }}>✋</Text>
              </View>
            </Animated.View>
          </Pressable>
          <T v="h3" style={{ color: '#fff', marginTop: 14 }}>Press and hold to pledge</T>
        </View>
      </SafeAreaView>
    </Screen>
  );
}
