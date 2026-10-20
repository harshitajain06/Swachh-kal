import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Character } from '../components/Character';
import { Bouncy, Button, Pulse, Screen, T } from '../components/UI';
import { HEROES } from '../data/content';
import { dayKey } from '../lib/dates';
import { useGame } from '../lib/game';
import { colors, fonts, radius } from '../theme';

export default function CheckIn() {
  const { checkins, saveCheckin, isUnlocked, todayMicro, toggleMicro, nextHero } = useGame();
  const today = checkins[dayKey()] ?? {};
  const evening = new Date().getHours() >= 15;
  const [mode, setMode] = useState<'morning' | 'evening'>(evening ? 'evening' : 'morning');
  const [saved, setSaved] = useState(false);

  const heroes = HEROES.filter((h) => isUnlocked(h.id));
  const focus = nextHero ? HEROES.find((h) => h.id === nextHero)! : HEROES[0];

  const commit = async () => {
    await saveCheckin({ morningCommitted: true });
    setSaved(true);
  };
  const saveEvening = async () => {
    await saveCheckin({ eveningSaved: true, eveningCompleted: todayMicro });
    setSaved(true);
  };

  return (
    <Screen gradient={mode === 'morning' ? ['#FFF3C4', '#FFD9A8'] : ['#E6DDFF', '#C9D6FF']}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', margin: 16, backgroundColor: '#ffffffa0', borderRadius: 99, padding: 4 }}>
          {(['morning', 'evening'] as const).map((m) => (
            <Bouncy key={m} onPress={() => { setMode(m); setSaved(false); }} style={{ flex: 1, paddingVertical: 10, borderRadius: 99, alignItems: 'center', backgroundColor: mode === m ? '#fff' : 'transparent' }}>
              <T v="label">{m === 'morning' ? '☀️ Morning · 8 AM' : '🌙 Evening · 6 PM'}</T>
            </Bouncy>
          ))}
        </View>

        {saved ? (
          <Animated.View entering={ZoomIn.springify().damping(7)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <Character id={nextHero ?? 'vayu'} size={170} mood="cheer" jump />
            <T v="title" style={{ textAlign: 'center' }}>{mode === 'morning' ? 'You promised! 💪' : 'Great job, Hero! 🎉'}</T>
            <T style={{ textAlign: 'center', marginTop: 6 }}>{mode === 'morning' ? 'Go make today a little cleaner.' : 'Your progress is saved.'}</T>
            <Button label="Done" onPress={() => router.back()} style={{ marginTop: 24, minWidth: 180 }} />
          </Animated.View>
        ) : mode === 'morning' ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <Pulse amount={1.1} duration={1200}>
              <Text style={{ fontSize: 120 }}>☀️</Text>
            </Pulse>
            <T v="title" style={{ textAlign: 'center' }}>Good morning, Hero!</T>
            <T style={{ textAlign: 'center', marginVertical: 12, fontSize: 18 }}>“Today I will help {focus.name}!”</T>
            {today.morningCommitted ? <T v="h3" style={{ color: '#1B8A32' }}>✅ You already committed today!</T> : <Button label="I Commit!" icon="🤝" onPress={commit} style={{ minWidth: 220 }} />}
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 120, gap: 10 }}>
              <T v="h2">What did you complete today?</T>
              {heroes.map((h) => (
                <View key={h.id} style={{ gap: 8 }}>
                  <Text style={{ fontFamily: fonts.display, fontSize: 20, color: h.dark, marginTop: 6 }}>{h.emoji} {h.name}</Text>
                  {h.microHabits.map((x, i) => {
                    const on = todayMicro.includes(x.id);
                    return (
                      <Animated.View key={x.id} entering={FadeInDown.delay(i * 40).springify()}>
                        <Bouncy onPress={() => toggleMicro(x.id)} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: on ? h.soft : '#fff', borderRadius: radius.md, padding: 12, borderWidth: 3, borderColor: on ? h.colors[1] : 'transparent' }}>
                          <Text style={{ fontSize: 24 }}>{on ? '✅' : '⬜'}</Text>
                          <T v="small" style={{ flex: 1, color: colors.ink, fontSize: 14 }}>{x.text}</T>
                        </Bouncy>
                      </Animated.View>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
            <View style={{ position: 'absolute', left: 24, right: 24, bottom: 28 }}>
              <Button label="Save progress" onPress={saveEvening} />
            </View>
          </>
        )}
      </SafeAreaView>
    </Screen>
  );
}
