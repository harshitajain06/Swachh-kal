import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Character } from '../components/Character';
import { Bar, Bouncy, Button, Confetti, Screen, T } from '../components/UI';
import { HeroId, heroById } from '../data/content';
import { QUIZ } from '../data/quiz';
import { useGame } from '../lib/game';
import { colors, fonts, shadow } from '../theme';

const shuffle = <A,>(a: A[]) => [...a].sort(() => Math.random() - 0.5);

export default function Quiz() {
  const { id } = useLocalSearchParams<{ id: HeroId }>();
  const hero = heroById(id);
  const q = QUIZ[id];
  const { saveQuiz, quizBest } = useGame();
  const items = useMemo(() => shuffle(q.items), [id]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const x = useSharedValue(0);
  const shake = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const finished = i >= items.length;
  const cur = items[i];

  const choose = (b: string) => {
    if (picked || !cur) return;
    setPicked(b);
    const ok = b === cur.bucket;
    if (ok) {
      setScore((s) => s + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      x.value = withSequence(withTiming(-12, { duration: 50 }), withTiming(12, { duration: 80 }), withTiming(-8, { duration: 80 }), withTiming(0, { duration: 50 }));
    }
    setTimeout(() => {
      const next = i + 1;
      if (next >= items.length) saveQuiz(id, score + (ok ? 1 : 0));
      setPicked(null);
      setI(next);
    }, ok ? 700 : 1500);
  };

  const correctB = cur ? q.buckets.find((b) => b.id === cur.bucket)! : null;
  const ok = picked && cur && picked === cur.bucket;

  return (
    <Screen gradient={[hero.soft, '#FFF4D6']}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}>
          <Bouncy onPress={() => router.back()} style={{ backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 }}>
            <Text style={{ fontFamily: fonts.bodyBold, color: hero.dark }}>← Back</Text>
          </Bouncy>
          <View style={{ flex: 1 }}>
            <Bar value={finished ? 1 : i / items.length} color={hero.colors[1]} track="#00000014" />
          </View>
        </View>

        {finished ? (
          <Animated.View entering={ZoomIn.springify().damping(8)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <Confetti count={40} />
            <Character id={id} size={160} mood="cheer" jump />
            <T v="title" style={{ textAlign: 'center' }}>{score} / {items.length} correct!</T>
            <T v="h3" style={{ color: '#B07A00' }}>+{score * 15} points ⭐</T>
            <T style={{ textAlign: 'center', marginTop: 6 }}>{score === items.length ? 'Perfect, Hero!' : 'Try again to beat your best!'} Your best: {Math.max(quizBest[id] ?? 0, score)}</T>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
              <Button label="Again" onPress={() => { setI(0); setScore(0); }} color="#fff" dark="#E0D6B8" style={{ width: 130 }} />
              <Button label="Done" onPress={() => router.back()} color={hero.colors[1]} dark={hero.dark} style={{ width: 130 }} />
            </View>
          </Animated.View>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
            <T v="small" style={{ fontFamily: fonts.bodyBold }}>{q.title} · {i + 1}/{items.length}</T>
            <Character id={id} size={100} mood={picked ? (ok ? 'cheer' : 'sad') : 'happy'} />
            <T v="h3" style={{ textAlign: 'center', marginBottom: 10 }}>{q.question}</T>
            <Animated.View key={i} entering={FadeInDown.springify().damping(12)} style={[{ backgroundColor: '#fff', borderRadius: 28, padding: 24, width: '100%', minHeight: 110, alignItems: 'center', justifyContent: 'center', ...shadow }, shake]}>
              <Text style={{ fontFamily: fonts.display, fontSize: 26, color: colors.ink, textAlign: 'center', lineHeight: 32 }}>{cur.text}</Text>
            </Animated.View>
            <View style={{ height: 34, justifyContent: 'center' }}>
              {picked ? (
                <Animated.Text entering={FadeIn} style={{ fontFamily: fonts.display, fontSize: 18, color: ok ? '#1B8A32' : '#B23A48' }}>
                  {ok ? 'Yes! +15 points 🎉' : `Oops! It goes with ${correctB!.label}`}
                </Animated.Text>
              ) : null}
            </View>
            <View style={{ width: '100%', gap: 10 }}>
              {q.buckets.map((b) => {
                const isRight = picked && b.id === cur.bucket;
                const isWrong = picked === b.id && b.id !== cur.bucket;
                return (
                  <Bouncy key={b.id} onPress={() => choose(b.id)} style={{ backgroundColor: b.color, borderRadius: 24, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: picked && !isRight && !isWrong ? 0.45 : 1, borderWidth: isRight ? 4 : 0, borderColor: '#FFE27A' }}>
                    <Text style={{ fontSize: 28 }}>{b.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: fonts.display, color: '#fff', fontSize: 20 }}>{b.label}</Text>
                      {b.sub ? <Text style={{ fontFamily: fonts.bodyBold, color: '#ffffffd0', fontSize: 13 }}>{b.sub}</Text> : null}
                    </View>
                    {isWrong ? <Text style={{ fontSize: 24 }}>❌</Text> : null}
                    {isRight ? <Text style={{ fontSize: 24 }}>✅</Text> : null}
                  </Bouncy>
                );
              })}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Screen>
  );
}
