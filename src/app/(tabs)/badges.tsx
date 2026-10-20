import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeroBadge, SuperBadge } from '../../components/Badge';
import { Character } from '../../components/Character';
import { Ring } from '../../components/Ring';
import { Bouncy, Card, Pulse, Screen, T } from '../../components/UI';
import { HEROES, HERO_ORDER, TIERS } from '../../data/content';
import { useGame } from '../../lib/game';
import { colors, fonts } from '../../theme';

export default function Badges() {
  const { count, tierOf, allComplete, isComplete } = useGame();
  const circles = HERO_ORDER.filter(isComplete).length;
  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          <T v="title">My Badges</T>

          <Card style={{ marginTop: 14, alignItems: 'center', backgroundColor: allComplete ? '#FFF3C4' : '#fff' }}>
            <SuperBadge size={170} earned={allComplete} />
            <T v="h3" style={{ marginTop: 4 }}>{allComplete ? 'Swachh Kal Superhero!' : 'Golden Swachh Kal Badge'}</T>
            <T v="small" style={{ textAlign: 'center' }}>{allComplete ? 'You completed all 4 circles!' : `Fill all 4 circles to win it · ${circles}/4`}</T>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
              {HEROES.map((h, i) => (
                <Animated.View key={h.id} entering={ZoomIn.delay(i * 120).springify()}>
                  <Ring size={68} stroke={9} value={count(h.id) / 5} color={h.colors[1]} track={h.soft} delay={i * 150}>
                    <Text style={{ fontSize: 24 }}>{isComplete(h.id) ? '✅' : h.emoji}</Text>
                  </Ring>
                </Animated.View>
              ))}
            </View>
          </Card>

          {HEROES.map((h, i) => {
            const t = tierOf(h.id);
            return (
              <Card key={h.id} delay={200 + i * 120} style={{ marginTop: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Character id={h.id} size={64} cape={isComplete(h.id)} still />
                  <View style={{ marginLeft: 8, flex: 1 }}>
                    <T v="h3">{h.heroTitle}</T>
                    <T v="small">Protect {h.name} · {count(h.id)}/5 habits</T>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 }}>
                  {TIERS.map((tier) => {
                    const earned = count(h.id) >= tier.need;
                    return (
                      <Bouncy key={tier.id} onPress={() => router.push(`/hero/${h.id}`)} style={{ alignItems: 'center' }}>
                        <HeroBadge heroId={h.id} tier={tier.id} size={84} earned={earned} />
                        <T v="small" style={{ fontFamily: fonts.bodyBold, color: earned ? colors.ink : colors.inkSoft }}>{tier.label}</T>
                        <T v="small">{earned ? 'Earned!' : `${tier.need} habits`}</T>
                      </Bouncy>
                    );
                  })}
                </View>
              </Card>
            );
          })}

          <Pulse style={{ marginTop: 18 }}>
            <Bouncy onPress={() => router.push('/rewards')} style={{ backgroundColor: colors.brand, borderRadius: 24, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Text style={{ fontSize: 30 }}>🗺️</Text>
              <Text style={{ flex: 1, fontFamily: fonts.display, color: '#fff', fontSize: 19 }}>How do I earn badges?</Text>
            </Bouncy>
          </Pulse>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
