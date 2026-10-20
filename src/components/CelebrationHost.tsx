import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated, { BounceIn, FadeIn, FadeInDown, FadeInUp, ZoomIn, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { HERO_ORDER, MESSAGES, TRANSITIONS, TIERS, heroById } from '../data/content';
import { useGame } from '../lib/game';
import { colors, fonts } from '../theme';
import { HeroBadge, SuperBadge } from './Badge';
import { Character } from './Character';
import { Button, Confetti, Pulse, Rainbow, T } from './UI';

const pickMsg = (list: string[]) => list[Math.floor(Math.random() * list.length)];

function WavingHand() {
  const r = useSharedValue(0);
  useEffect(() => {
    r.value = withRepeat(withSequence(withTiming(-18, { duration: 260 }), withTiming(18, { duration: 260 })), -1, true);
  }, []);
  const a = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value}deg` }, { translateY: 10 }] }));
  return <Animated.Text style={[{ fontSize: 96 }, a]}>✋</Animated.Text>;
}

function Trophy() {
  const s = useSharedValue(0);
  useEffect(() => {
    s.value = withDelay(100, withSpring(1, { damping: 5, stiffness: 120 }));
  }, []);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }, { translateY: (1 - s.value) * -200 }] }));
  return <Animated.Text style={[{ fontSize: 130 }, a]}>🏆</Animated.Text>;
}

export function CelebrationHost() {
  const { celebration, dismissCelebration, askReview } = useGame();
  const [step, setStep] = useState(0); // pledge: 0 = hand + characters, 1 = trophy

  useEffect(() => {
    if (!celebration) return;
    setStep(0);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (celebration.kind === 'pledge') {
      const t = setTimeout(() => {
        setStep(1);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }, 2600);
      return () => clearTimeout(t);
    }
  }, [celebration]);

  const unlockMsg = useMemo(() => pickMsg(MESSAGES.unlock), [celebration]);
  const doneMsg = useMemo(() => pickMsg(MESSAGES.complete), [celebration]);

  const close = () => {
    const wantsReview = askReview;
    dismissCelebration();
    if (wantsReview) setTimeout(() => router.push('/review'), 350);
  };

  if (!celebration) return null;

  let bg: [string, string] = ['#7C4DFF', '#FF5CA8'];
  let body: React.ReactNode = null;
  let cta = 'Awesome!';

  if (celebration.kind === 'pledge') {
    bg = ['#7C4DFF', '#FF5CA8'];
    cta = step === 1 ? 'Unlock the 4 themes!' : '';
    body =
      step === 0 ? (
        <Animated.View entering={FadeIn} style={{ alignItems: 'center' }}>
          <T v="h2" style={{ color: '#fff', textAlign: 'center' }}>Heroes taking the pledge!</T>
          <View style={{ flexDirection: 'row', marginTop: 24, alignItems: 'flex-end' }}>
            {HERO_ORDER.map((id, i) => (
              <Animated.View key={id} entering={BounceIn.delay(i * 220)} style={{ marginHorizontal: -6 }}>
                <Character id={id} size={86} mood="cheer" />
              </Animated.View>
            ))}
          </View>
          <WavingHand />
          <T v="h3" style={{ color: '#fff', textAlign: 'center', marginTop: 8 }}>I Pledge!</T>
        </Animated.View>
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Trophy />
          <Animated.View entering={FadeInUp.delay(500)}>
            <T v="h2" style={{ color: '#fff', textAlign: 'center', marginTop: 12 }}>You’re on your way to becoming a Swachh Hero!</T>
            <T style={{ color: '#fff', textAlign: 'center', marginTop: 8, fontFamily: fonts.bodyBold }}>Ready to unlock the 4 themes?</T>
            <T style={{ color: '#FFE27A', textAlign: 'center', marginTop: 4, fontFamily: fonts.display, fontSize: 20 }}>Vayu | Tarun | Dharti | Jal</T>
          </Animated.View>
        </View>
      );
  } else if (celebration.kind === 'tier') {
    const hero = heroById(celebration.heroId);
    bg = hero.colors;
    const tier = TIERS.find((t) => t.id === celebration.tier)!;
    body = (
      <View style={{ alignItems: 'center' }}>
        <Animated.View entering={ZoomIn.springify().damping(6)}>
          <HeroBadge heroId={hero.id} tier={tier.id} size={190} />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(400)} style={{ alignItems: 'center' }}>
          <T v="title" style={{ color: '#fff', marginTop: 8, textAlign: 'center' }}>{unlockMsg}</T>
          <T v="h3" style={{ color: '#fff', textAlign: 'center' }}>{tier.emoji} {tier.label} {hero.name} Badge</T>
          <T style={{ color: '#fff', textAlign: 'center', marginTop: 8, fontFamily: fonts.bodyBold, fontSize: 18 }}>“{hero.tierMessages[tier.id]}”</T>
        </Animated.View>
      </View>
    );
  } else if (celebration.kind === 'hero-complete') {
    const hero = heroById(celebration.heroId);
    bg = hero.colors;
    const idx = HERO_ORDER.indexOf(hero.id);
    const next = HERO_ORDER[idx + 1];
    body = (
      <View style={{ alignItems: 'center' }}>
        <Rainbow size={300} />
        <View style={{ marginTop: -70 }}>
          <Character id={hero.id} size={180} mood="cheer" cape jump />
        </View>
        <Animated.View entering={FadeInUp.delay(300)} style={{ alignItems: 'center' }}>
          <T v="title" style={{ color: '#fff', textAlign: 'center' }}>{doneMsg}</T>
          <T v="h3" style={{ color: '#fff', textAlign: 'center' }}>{hero.completeMessage}</T>
          <T v="h3" style={{ color: '#FFE27A', textAlign: 'center' }}>Badge: {hero.heroTitle} 🥇</T>
          <T style={{ color: '#fff', textAlign: 'center', marginTop: 10, fontFamily: fonts.bodyBold, fontSize: 17 }}>{TRANSITIONS[hero.id].done}</T>
          {next ? (
            <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff30', borderRadius: 24, padding: 10, paddingRight: 18 }}>
              <Character id={next} size={64} />
              <T style={{ color: '#fff', flex: 1, fontFamily: fonts.bodyBold }}>{TRANSITIONS[hero.id].next}</T>
            </View>
          ) : null}
        </Animated.View>
      </View>
    );
  } else if (celebration.kind === 'superhero') {
    bg = ['#FFB300', '#FF5CA8'];
    body = (
      <View style={{ alignItems: 'center' }}>
        <Rainbow size={300} />
        <View style={{ marginTop: -60 }}>
          <SuperBadge size={220} />
        </View>
        <Animated.View entering={FadeInUp.delay(400)} style={{ alignItems: 'center' }}>
          <T v="title" style={{ color: '#fff', textAlign: 'center' }}>🦸 Swachh Kal Superhero!</T>
          <T v="h3" style={{ color: '#fff', textAlign: 'center' }}>All 4 Hero missions complete</T>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            {HERO_ORDER.map((id) => (
              <HeroBadge key={id} heroId={id} tier="gold" size={70} />
            ))}
          </View>
          <T style={{ color: '#fff', marginTop: 6, fontFamily: fonts.bodyBold }}>All characters are healthy! You are a Swachh Hero ⭐</T>
        </Animated.View>
      </View>
    );
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
      <LinearGradient colors={bg} style={StyleSheet.absoluteFill} />
      <Confetti count={60} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        {body}
        {cta ? (
          <Animated.View entering={FadeInDown.delay(900)} style={{ marginTop: 28 }}>
            <Pulse>
              <Button label={cta} onPress={close} color="#FFC93C" dark="#C98F00" style={{ minWidth: 220 }} />
            </Pulse>
          </Animated.View>
        ) : null}
      </View>
    </Modal>
  );
}
