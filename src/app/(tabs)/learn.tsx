import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Character } from '../../components/Character';
import { Bouncy, Button, Card, Screen, T } from '../../components/UI';
import { BOOKLET_INSIDE, BOOKLET_URL, heroById } from '../../data/content';
import { useTimeTracker } from '../../lib/engagement';
import { colors, fonts, radius, shadow } from '../../theme';

export default function Learn() {
  useTimeTracker('booklet', 'learn-tab');
  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          <T v="title">Learn</T>
          <Card style={{ marginTop: 14 }}>
            <T v="h2">📘 Swachh Kal Booklet</T>
            <T v="h3" style={{ marginTop: 6, fontSize: 17 }}>What’s inside?</T>
            <View style={{ gap: 10, marginTop: 10 }}>
              {BOOKLET_INSIDE.map((b, i) => {
                const h = heroById(b.heroId);
                return (
                  <Animated.View key={b.heroId} entering={FadeInDown.delay(i * 100).springify()} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: h.soft, borderRadius: radius.md, padding: 10 }}>
                    <Character id={h.id} size={48} still />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: fonts.display, color: h.dark, fontSize: 17 }}>{h.name} ({h.element})</Text>
                      <T v="small" style={{ color: colors.ink }}>{b.text}</T>
                    </View>
                  </Animated.View>
                );
              })}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF3C4', borderRadius: radius.md, padding: 12 }}>
                <Text style={{ fontSize: 32 }}>🌟</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.display, fontSize: 17, color: '#B07A00' }}>Daily Swachh Habits</Text>
                  <T v="small" style={{ color: colors.ink }}>Simple habits to practise at home, at school, and everywhere.</T>
                </View>
              </View>
            </View>
            <Button label="Download the booklet" icon="⬇️" onPress={() => WebBrowser.openBrowserAsync(BOOKLET_URL)} style={{ marginTop: 16 }} />
          </Card>

          <View style={{ gap: 14, marginTop: 14 }}>
            <Bouncy onPress={() => router.push('/rewards')} style={{ backgroundColor: '#fff', borderRadius: radius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, ...shadow }}>
              <Text style={{ fontSize: 36 }}>🗺️</Text>
              <View style={{ flex: 1 }}>
                <T v="h3">Your Hero Journey</T>
                <T v="small">Complete habits. Earn badges. Become a Hero!</T>
              </View>
            </Bouncy>
            <Bouncy onPress={() => router.push('/certificate')} style={{ backgroundColor: '#fff', borderRadius: radius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, ...shadow }}>
              <Text style={{ fontSize: 36 }}>📜</Text>
              <View style={{ flex: 1 }}>
                <T v="h3">365-Day Swachh Pledge</T>
                <T v="small">One year. One cleaner tomorrow. Win a certificate!</T>
              </View>
            </Bouncy>
            <Bouncy onPress={() => router.push('/about')} style={{ backgroundColor: '#fff', borderRadius: radius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, ...shadow }}>
              <Text style={{ fontSize: 36 }}>💚</Text>
              <View style={{ flex: 1 }}>
                <T v="h3">About Swachh Kal</T>
                <T v="small">Founded by Mehr Dhawan</T>
              </View>
            </Bouncy>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
