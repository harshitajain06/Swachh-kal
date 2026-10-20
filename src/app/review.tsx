import * as StoreReview from 'expo-store-review';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Character } from '../components/Character';
import { Bouncy, Button, Screen, T } from '../components/UI';
import { useGame } from '../lib/game';
import { colors, fonts, radius } from '../theme';

const ENJOYED = ['Completing challenges', 'Earning badges', 'Learning about the environment', 'The Hero characters', 'Something else'];

function Stars({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Bouncy key={n} onPress={() => onChange(n)} scaleTo={0.7}>
          <Animated.Text key={value >= n ? 'on' + n : 'off' + n} entering={value >= n ? ZoomIn.springify().damping(5) : undefined} style={{ fontSize: 44, opacity: value >= n ? 1 : 0.3 }}>⭐</Animated.Text>
        </Bouncy>
      ))}
    </View>
  );
}

export default function Review() {
  const { markReviewed, allComplete } = useGame();
  const [hero, setHero] = useState(0);
  const [journey, setJourney] = useState(0);
  const [enjoyed, setEnjoyed] = useState<string[]>([]);
  const [thanks, setThanks] = useState(false);

  const submit = async () => {
    await markReviewed({ heroRating: hero, journeyRating: journey, enjoyed });
    setThanks(true);
    if (Math.max(hero, journey) >= 4 && (await StoreReview.hasAction())) StoreReview.requestReview().catch(() => {});
  };

  return (
    <Screen gradient={['#FFF4D6', '#FFD9F0']}>
      <SafeAreaView style={{ flex: 1 }}>
        {thanks ? (
          <Animated.View entering={ZoomIn.springify().damping(7)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <Character id="dharti" size={170} mood="cheer" jump />
            <T v="title" style={{ textAlign: 'center' }}>Thank you! 💖</T>
            <T style={{ textAlign: 'center', marginTop: 6 }}>Your feedback helps us make Swachh Kal better.</T>
            <Button label="Back to my journey" onPress={() => router.back()} style={{ marginTop: 24 }} />
          </Animated.View>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130, gap: 16 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 60 }}>{allComplete ? '🦸' : '🎉'}</Text>
              <T v="h2" style={{ textAlign: 'center' }}>{allComplete ? 'You’re now a Swachh Kal Superhero!' : 'You did it!'}</T>
            </View>
            <View style={{ backgroundColor: '#fff', borderRadius: radius.lg, padding: 16, gap: 8 }}>
              <T v="h3" style={{ textAlign: 'center' }}>What did you think of your Hero journey?</T>
              <Stars value={hero} onChange={setHero} />
            </View>
            <View style={{ backgroundColor: '#fff', borderRadius: radius.lg, padding: 16, gap: 8 }}>
              <T v="h3" style={{ textAlign: 'center' }}>How was your Swachh Kal journey?</T>
              <Stars value={journey} onChange={setJourney} />
            </View>
            <View style={{ backgroundColor: '#fff', borderRadius: radius.lg, padding: 16, gap: 8 }}>
              <T v="h3">What did you enjoy most?</T>
              {ENJOYED.map((e) => {
                const on = enjoyed.includes(e);
                return (
                  <Bouncy key={e} onPress={() => setEnjoyed(on ? enjoyed.filter((x) => x !== e) : [...enjoyed, e])} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', padding: 10, borderRadius: 16, backgroundColor: on ? '#EFE7FF' : '#F7F3E6' }}>
                    <Text style={{ fontSize: 22 }}>{on ? '☑️' : '⬜'}</Text>
                    <Text style={{ fontFamily: fonts.bodyBold, color: colors.ink, flex: 1 }}>{e}</Text>
                  </Bouncy>
                );
              })}
            </View>
          </ScrollView>
        )}
        {!thanks && (
          <View style={{ position: 'absolute', left: 24, right: 24, bottom: 28, flexDirection: 'row', gap: 12 }}>
            <Button label="Later" onPress={() => router.back()} color="#fff" dark="#E0D6B8" style={{ width: 110 }} />
            <Button label="Send" onPress={submit} disabled={!hero && !journey} style={{ flex: 1 }} />
          </View>
        )}
      </SafeAreaView>
    </Screen>
  );
}
