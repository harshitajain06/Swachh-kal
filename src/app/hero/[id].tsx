import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInRight, FadeOutLeft, LinearTransition, ZoomIn, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeroBadge } from '../../components/Badge';
import { Character } from '../../components/Character';
import { Bar, Bouncy, Button, Card, Confetti, Pulse, T } from '../../components/UI';
import { HeroId, TIERS, heroById } from '../../data/content';
import { useTimeTracker } from '../../lib/engagement';
import { useGame } from '../../lib/game';
import { colors, fonts, radius, shadow } from '../../theme';

type TabId = 'story' | 'habits' | 'facts' | 'videos' | 'sdg';
const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'story', label: 'Story', icon: '📖' },
  { id: 'habits', label: 'Habits', icon: '✅' },
  { id: 'facts', label: 'Facts', icon: '💡' },
  { id: 'videos', label: 'Videos', icon: '🎥' },
  { id: 'sdg', label: 'SDG', icon: '📰' },
];

function CheckBox({ done, color }: { done: boolean; color: string }) {
  const s = useSharedValue(done ? 1 : 0);
  useEffect(() => {
    s.value = done ? withSequence(withTiming(0.2, { duration: 60 }), withSpring(1, { damping: 4, stiffness: 220 })) : withTiming(0, { duration: 150 });
  }, [done]);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }], opacity: s.value }));
  return (
    <View style={{ width: 46, height: 46, borderRadius: 23, borderWidth: 4, borderColor: done ? color : '#D9D2EE', alignItems: 'center', justifyContent: 'center', backgroundColor: done ? color : '#fff' }}>
      <Animated.Text style={[{ color: '#fff', fontSize: 26, fontFamily: fonts.display, marginTop: -2 }, a]}>✓</Animated.Text>
    </View>
  );
}

function StoryTab({ id, onDone }: { id: HeroId; onDone: () => void }) {
  const hero = heroById(id);
  const [i, setI] = useState(0);
  const last = i === hero.story.length - 1;
  const sad = i >= 1 && i <= 2;
  return (
    <View style={{ padding: 18 }}>
      <View style={{ alignItems: 'center' }}>
        <Character id={id} size={150} mood={sad ? 'sad' : last ? 'cheer' : 'happy'} />
      </View>
      <Animated.View key={i} entering={FadeInRight.springify().damping(14)} style={{ backgroundColor: '#fff', borderRadius: 28, padding: 20, minHeight: 150, justifyContent: 'center', ...shadow }}>
        <T style={{ fontSize: 19, lineHeight: 28, fontFamily: fonts.bodyBold, color: sad ? '#B23A48' : colors.ink }}>{hero.story[i]}</T>
      </Animated.View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14 }}>
        {hero.story.map((_, k) => (
          <View key={k} style={{ width: k === i ? 26 : 10, height: 10, borderRadius: 5, backgroundColor: k <= i ? hero.colors[1] : '#00000020' }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        {i > 0 && <Button label="Back" onPress={() => setI(i - 1)} color="#fff" dark="#E0D6B8" style={{ width: 110 }} />}
        <Button label={last ? 'Start my mission!' : 'Next'} color={hero.colors[1]} dark={hero.dark} onPress={() => (last ? onDone() : setI(i + 1))} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

function HabitsTab({ id, goStory }: { id: HeroId; goStory: () => void }) {
  const hero = heroById(id);
  const { done, toggleHabit, count } = useGame();
  const n = count(id);
  return (
    <View style={{ padding: 18, gap: 12 }}>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <T v="h3">Progress — {n} / 5 Habits</T>
          <T v="small">{n >= 5 ? 'Done!' : `${5 - n} to go`}</T>
        </View>
        <View style={{ marginTop: 10 }}>
          <Bar value={n / 5} color={hero.colors[1]} track={hero.soft} height={18} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 14 }}>
          {TIERS.map((t) => (
            <View key={t.id} style={{ alignItems: 'center' }}>
              <HeroBadge heroId={id} tier={t.id} size={64} earned={n >= t.need} />
              <T v="small" style={{ fontFamily: fonts.bodyBold }}>{t.emoji} {t.need} habits</T>
            </View>
          ))}
        </View>
      </Card>

      {hero.habits.map((h, i) => {
        const isDone = !!done[h.id];
        return (
          <Animated.View key={h.id} entering={FadeInDown.delay(i * 90).springify().damping(13)} layout={LinearTransition.springify()}>
            <Bouncy
              onPress={() => {
                Haptics.impactAsync(isDone ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
                toggleHabit(id, h.id);
              }}
              style={{ backgroundColor: isDone ? hero.soft : '#fff', borderRadius: radius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 3, borderColor: isDone ? hero.colors[1] : 'transparent', ...shadow }}
            >
              <CheckBox done={isDone} color={hero.colors[1]} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.display, fontSize: 16, color: hero.dark }}>{i + 1}. {h.tag}</Text>
                <T style={{ fontFamily: fonts.bodyBold }}>{h.text}</T>
              </View>
            </Bouncy>
          </Animated.View>
        );
      })}
      <Bouncy onPress={goStory} style={{ alignItems: 'center', padding: 8 }}>
        <T v="label" style={{ color: hero.dark }}>📖 Read {hero.name}’s story again</T>
      </Bouncy>
    </View>
  );
}

function FactsTab({ id }: { id: HeroId }) {
  const hero = heroById(id);
  const all = [...hero.facts.map((f) => ({ f, sad: false })), ...hero.sadFacts.map((f) => ({ f, sad: true }))];
  const [i, setI] = useState(0);
  const cur = all[i];
  const firstSad = all.findIndex((x) => x.sad);
  return (
    <View style={{ padding: 18 }}>
      {i === firstSad && (
        <Animated.View entering={ZoomIn.springify()} style={{ alignSelf: 'center', backgroundColor: '#FFE1E5', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 8 }}>
          <Text style={{ fontFamily: fonts.display, color: '#B23A48', fontSize: 18 }}>But sadly… 😢</Text>
        </Animated.View>
      )}
      <View style={{ alignItems: 'center' }}>
        <Character id={id} size={110} mood={cur.sad ? 'sad' : 'happy'} />
      </View>
      <Animated.View key={i} entering={FadeInRight.springify().damping(14)} exiting={FadeOutLeft} style={{ backgroundColor: cur.sad ? '#FFF0F1' : '#fff', borderRadius: 28, padding: 22, minHeight: 190, justifyContent: 'center', borderWidth: 3, borderColor: cur.sad ? '#FFC2CA' : hero.colors[0], ...shadow }}>
        <Text style={{ fontFamily: fonts.display, color: cur.sad ? '#B23A48' : hero.dark, fontSize: 18 }}>{cur.sad ? '💔 Sad fact' : '💡 Did you know?'}</Text>
        <T style={{ fontSize: 18, lineHeight: 27, marginTop: 6, fontFamily: fonts.bodyBold }}>{cur.f}</T>
      </Animated.View>
      <T v="small" style={{ textAlign: 'center', marginTop: 10 }}>{i + 1} of {all.length}</T>
      <View style={{ marginTop: 6 }}>
        <Bar value={(i + 1) / all.length} color={hero.colors[1]} track={hero.soft} />
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        <Button label="◀" onPress={() => setI(Math.max(0, i - 1))} color="#fff" dark="#E0D6B8" disabled={i === 0} style={{ width: 90 }} />
        <Button label={i === all.length - 1 ? 'Again!' : 'Next fact'} onPress={() => setI((i + 1) % all.length)} color={hero.colors[1]} dark={hero.dark} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

function SdgTab({ id }: { id: HeroId }) {
  const hero = heroById(id);
  return (
    <View style={{ padding: 18, gap: 12 }}>
      <T v="small">Read these UN articles to learn more. They open in your browser.</T>
      {hero.sdg.map((a, i) => (
        <Animated.View key={a.title} entering={FadeInDown.delay(i * 100).springify()}>
          <Bouncy onPress={() => WebBrowser.openBrowserAsync(a.url)} style={{ backgroundColor: '#fff', borderRadius: radius.md, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, ...shadow }}>
            <Text style={{ fontSize: 30 }}>📰</Text>
            <T style={{ flex: 1, fontFamily: fonts.bodyBold }}>{a.title}</T>
            <Text style={{ fontSize: 20, color: hero.dark }}>↗</Text>
          </Bouncy>
        </Animated.View>
      ))}
    </View>
  );
}

function VideosTab({ id }: { id: HeroId }) {
  const hero = heroById(id);
  return (
    <View style={{ padding: 18, alignItems: 'center' }}>
      <Pulse>
        <Character id={id} size={130} mood="cheer" />
      </Pulse>
      <Card style={{ marginTop: 12, alignItems: 'center' }}>
        <T v="h3">🎬 {hero.name} videos are coming!</T>
        <T style={{ textAlign: 'center', marginTop: 4 }}>Mehr is making fun videos for every Hero. Check back soon!</T>
      </Card>
    </View>
  );
}

export default function HeroScreen() {
  const { id } = useLocalSearchParams<{ id: HeroId }>();
  const hero = heroById(id);
  const { count, isComplete, isUnlocked } = useGame();
  const [tab, setTab] = useState<TabId>('story');
  const startOnHabits = count(id) > 0;
  useEffect(() => {
    if (startOnHabits) setTab('habits');
  }, []);
  useEffect(() => {
    if (!isUnlocked(id)) router.back();
  }, [id]);
  useTimeTracker(tab === 'habits' ? 'habits' : (tab === 'videos' ? 'video' : tab) as any, hero.id);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient colors={hero.colors} style={{ paddingBottom: 18, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }}>
        <SafeAreaView edges={['top']}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingTop: 4, alignItems: 'center' }}>
            <Bouncy onPress={() => router.back()} style={{ backgroundColor: '#ffffff40', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Text style={{ fontFamily: fonts.bodyBold, color: '#fff' }}>← Back</Text>
            </Bouncy>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 4 }}>
            <Character id={id} size={96} cape={isComplete(id)} mood="cheer" />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={{ fontFamily: fonts.display, fontSize: 34, color: '#fff', lineHeight: 38 }}>{hero.hindi}</Text>
              <Text style={{ fontFamily: fonts.displayMed, fontSize: 18, color: '#ffffffe8' }}>{hero.element} · {hero.name}</Text>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: '#FFF3B0' }}>{hero.heroTitle} · {hero.hindiTitle}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 14, gap: 8 }}>
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <Bouncy key={t.id} onPress={() => setTab(t.id)} style={{ flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 99, backgroundColor: active ? hero.colors[1] : '#fff', ...shadow, shadowOpacity: active ? 0.2 : 0.06 }}>
                <Text style={{ fontSize: 16 }}>{t.icon}</Text>
                <Text style={{ fontFamily: fonts.bodyBold, color: active ? '#fff' : colors.ink }}>{t.label}</Text>
              </Bouncy>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Animated.View key={tab} entering={FadeIn.duration(250)}>
          {tab === 'story' && <StoryTab id={id} onDone={() => setTab('habits')} />}
          {tab === 'habits' && <HabitsTab id={id} goStory={() => setTab('story')} />}
          {tab === 'facts' && <FactsTab id={id} />}
          {tab === 'videos' && <VideosTab id={id} />}
          {tab === 'sdg' && <SdgTab id={id} />}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
