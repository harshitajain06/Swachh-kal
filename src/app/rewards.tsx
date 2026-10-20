import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInLeft, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SuperBadge } from '../components/Badge';
import { Character } from '../components/Character';
import { Bouncy, Card, Screen, T } from '../components/UI';
import { HEROES, HOW_IT_WORKS } from '../data/content';
import { colors, fonts } from '../theme';

export default function Rewards() {
  return (
    <Screen gradient={['#FFF4D6', '#E6DDFF']}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
          <Bouncy onPress={() => router.back()} style={{ alignSelf: 'flex-start' }}>
            <T v="label" style={{ color: colors.brand }}>← Back</T>
          </Bouncy>
          <Text style={{ fontFamily: fonts.display, fontSize: 34, color: colors.brand, marginTop: 8 }}>YOUR HERO JOURNEY</Text>
          <T v="h3">Complete habits. Earn badges. Become a Hero!</T>
          <View style={{ gap: 10, marginTop: 16 }}>
            {HOW_IT_WORKS.map((s, i) => (
              <Animated.View key={i} entering={FadeInLeft.delay(i * 130).springify().damping(12)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 22, padding: 14 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontFamily: fonts.display, fontSize: 20 }}>{i < 5 ? i + 1 : '★'}</Text>
                </View>
                <Text style={{ fontSize: 26 }}>{s.icon}</Text>
                <T style={{ flex: 1, fontFamily: fonts.bodyBold }}>{s.text}</T>
              </Animated.View>
            ))}
          </View>
          <Card style={{ marginTop: 18 }} delay={900}>
            <T v="h3">The 4 Heroes</T>
            <View style={{ marginTop: 8, gap: 6 }}>
              {HEROES.map((h) => (
                <View key={h.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Character id={h.id} size={44} still />
                  <T style={{ flex: 1 }}><Text style={{ fontFamily: fonts.bodyBold }}>{h.heroTitle}</Text> → protects {h.name}</T>
                </View>
              ))}
            </View>
          </Card>
          <Animated.View entering={ZoomIn.delay(1200).springify()} style={{ alignItems: 'center', marginTop: 16 }}>
            <SuperBadge size={170} />
            <T v="h3" style={{ textAlign: 'center' }}>Level 2 waits for you… adventure ahead!</T>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
