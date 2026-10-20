import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Character } from '../../components/Character';
import { Bar, Bouncy, Card, Pulse, Screen, T } from '../../components/UI';
import { HEROES, HERO_ORDER, Hero, TIERS, heroById } from '../../data/content';
import { dayKey } from '../../lib/dates';
import { useGame } from '../../lib/game';
import { colors, fonts, radius, shadow } from '../../theme';

function HeroCard({ hero, index }: { hero: Hero; index: number }) {
  const { count, isUnlocked, isComplete, tierOf } = useGame();
  const unlocked = isUnlocked(hero.id);
  const n = count(hero.id);
  const tier = tierOf(hero.id);
  const x = useSharedValue(0);
  const shake = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  const open = () => {
    if (!unlocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      x.value = withSequence(withTiming(-10, { duration: 50 }), withTiming(10, { duration: 80 }), withTiming(-8, { duration: 80 }), withTiming(8, { duration: 80 }), withTiming(0, { duration: 50 }));
      return;
    }
    router.push(`/hero/${hero.id}`);
  };
  const prev = HERO_ORDER[HERO_ORDER.indexOf(hero.id) - 1];

  return (
    <Animated.View entering={FadeInDown.delay(150 + index * 120).springify().damping(11)} style={{ width: '48%' }}>
      <Animated.View style={shake}>
        <Bouncy onPress={open} haptic={unlocked}>
          <LinearGradient colors={unlocked ? hero.colors : ['#C9C3DA', '#A9A2C4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radius.lg, padding: 14, minHeight: 230, ...shadow }}>
            <View style={{ alignItems: 'center', marginTop: -2 }}>
              <Character id={hero.id} size={104} locked={!unlocked} cape={isComplete(hero.id)} />
            </View>
            <Text style={{ fontFamily: fonts.display, fontSize: 26, color: '#fff', lineHeight: 30 }}>{hero.hindi}</Text>
            <Text style={{ fontFamily: fonts.bodyBold, color: '#ffffffd0', fontSize: 13 }}>{hero.element} · {hero.name}</Text>
            <View style={{ marginTop: 10 }}>
              {unlocked ? (
                <>
                  <Bar value={n / 5} color="#fff" track="#ffffff40" height={10} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: '#fff' }}>{isComplete(hero.id) ? '✅ Mission done!' : `${n}/5 habits`}</Text>
                    <Text style={{ fontSize: 14 }}>{TIERS.filter((t) => n >= t.need).map((t) => t.emoji).join('')}</Text>
                  </View>
                </>
              ) : (
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: '#fff' }}>🔒 Finish {heroById(prev).name} to unlock</Text>
              )}
            </View>
          </LinearGradient>
        </Bouncy>
      </Animated.View>
    </Animated.View>
  );
}

export default function Home() {
  const { profile, streak, nextHero, count, totalDone, checkins, allComplete } = useGame();
  const today = checkins[dayKey()] ?? {};
  const next = nextHero ? heroById(nextHero) : null;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.springify()} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <T v="small">Namaste! 🙏 {greet}</T>
              <Text style={{ fontFamily: fonts.display, fontSize: 30, lineHeight: 36, color: colors.ink }}>Hi {profile?.name || 'Hero'}!</Text>
              <T v="label" style={{ color: colors.brand }}>{allComplete ? 'You are a Swachh Kal Superhero! 🦸' : 'Ready to be a Swachh Hero?'}</T>
            </View>
            <Pulse>
              <View style={{ backgroundColor: '#fff', borderRadius: 24, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center', ...shadow }}>
                <Text style={{ fontSize: 24 }}>🔥</Text>
                <Text style={{ fontFamily: fonts.display, fontSize: 18, color: '#FF7A00', lineHeight: 20 }}>{streak}</Text>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10, color: colors.inkSoft }}>day streak</Text>
              </View>
            </Pulse>
          </Animated.View>

          {next && (
            <Animated.View entering={FadeInRight.delay(100).springify()} style={{ marginTop: 16 }}>
              <Bouncy onPress={() => router.push(`/hero/${next.id}`)}>
                <LinearGradient colors={['#7C4DFF', '#FF5CA8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: radius.lg, padding: 14, flexDirection: 'row', alignItems: 'center', ...shadow }}>
                  <Character id={next.id} size={64} />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={{ fontFamily: fonts.bodyBold, color: '#FFE27A', fontSize: 12 }}>{count(next.id) === 0 ? 'NEW MISSION' : 'KEEP GOING'}</Text>
                    <Text style={{ fontFamily: fonts.display, color: '#fff', fontSize: 20, lineHeight: 24 }}>{next.goal}!</Text>
                    <Text style={{ fontFamily: fonts.body, color: '#ffffffe0', fontSize: 13 }}>{5 - count(next.id)} habits to go</Text>
                  </View>
                  <Text style={{ fontSize: 28, color: '#fff' }}>▶</Text>
                </LinearGradient>
              </Bouncy>
            </Animated.View>
          )}

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14, marginTop: 18 }}>
            {HEROES.map((h, i) => (
              <HeroCard key={h.id} hero={h} index={i} />
            ))}
          </View>

          <Card delay={700} style={{ marginTop: 18, borderLeftWidth: 8, borderLeftColor: colors.mint }}>
            <Text style={{ fontFamily: fonts.displayMed, fontSize: 20, color: colors.ink, fontStyle: 'italic' }}>“छोटे-छोटे कदम, बड़े बदलाव की ओर।”</Text>
            <T v="small" style={{ marginTop: 2 }}>Small steps, towards big change.</T>
          </Card>

          <Card delay={850} style={{ marginTop: 14 }}>
            <T v="h3">⏰ Today’s Check-in</T>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 10 }}>
              <Bouncy onPress={() => router.push('/checkin')} style={{ flex: 1, backgroundColor: '#FFF3C4', borderRadius: radius.md, padding: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 28 }}>☀️</Text>
                <T v="label">Morning · 8 AM</T>
                <T v="small" style={{ color: today.morningCommitted ? '#1B8A32' : '#E67E00' }}>{today.morningCommitted ? '✅ Committed' : '⏳ Pending'}</T>
              </Bouncy>
              <Bouncy onPress={() => router.push('/checkin')} style={{ flex: 1, backgroundColor: '#E6DDFF', borderRadius: radius.md, padding: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 28 }}>🌙</Text>
                <T v="label">Evening · 6 PM</T>
                <T v="small" style={{ color: today.eveningSaved ? '#1B8A32' : '#E67E00' }}>{today.eveningSaved ? '✅ Saved' : '⏳ Pending'}</T>
              </Bouncy>
            </View>
          </Card>

          <Card delay={1000} style={{ marginTop: 14 }}>
            <Bouncy onPress={() => router.push('/rewards')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 36 }}>🗺️</Text>
              <View style={{ flex: 1 }}>
                <T v="h3">How do rewards work?</T>
                <T v="small">{totalDone === 0 ? 'Adventure ahead… tap to see!' : 'Level 2 waits for you!'}</T>
              </View>
              <Text style={{ fontSize: 22 }}>›</Text>
            </Bouncy>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
