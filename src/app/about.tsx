import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Character } from '../components/Character';
import { Bouncy, Button, Card, Screen, T } from '../components/UI';
import { ABOUT_TEXT, HERO_ORDER } from '../data/content';
import { useGame } from '../lib/game';
import { colors, fonts } from '../theme';

export default function About() {
  const { pledgedAt } = useGame();
  return (
    <Screen gradient={['#FFF4D6', '#E3F9D9']}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 130 }}>
          {pledgedAt ? (
            <Bouncy onPress={() => router.back()} style={{ alignSelf: 'flex-start', paddingVertical: 6 }}>
              <T v="label" style={{ color: colors.brand }}>← Back</T>
            </Bouncy>
          ) : null}
          <Animated.View entering={ZoomIn.springify().damping(8)} style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', marginBottom: -10 }}>
              {HERO_ORDER.map((id) => (
                <Character key={id} id={id} size={70} />
              ))}
            </View>
            <Text style={{ fontFamily: fonts.display, fontSize: 40, color: colors.brand }}>Swachh Kal</Text>
            <T v="h3" style={{ color: colors.pink }}>आज आपका कल है</T>
            <T v="small" style={{ marginTop: 2 }}>About the Swachh Kal App</T>
          </Animated.View>
          <View style={{ gap: 14, marginTop: 18 }}>
            {ABOUT_TEXT.map((p, i) => (
              <Card key={i} delay={300 + i * 180}>
                <T>{p}</T>
              </Card>
            ))}
          </View>
        </ScrollView>
        {!pledgedAt && (
          <Animated.View entering={FadeInDown.delay(1100)} style={{ position: 'absolute', left: 24, right: 24, bottom: 28 }}>
            <Button label="Let’s take the pledge!" icon="✋" onPress={() => router.replace('/pledge')} />
          </Animated.View>
        )}
      </SafeAreaView>
    </Screen>
  );
}
