import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInRight, FadeOutLeft, LinearTransition, ZoomIn, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeroBadge } from '../../components/Badge';
import { Character } from '../../components/Character';
import { Smoke } from '../../components/Smoke';
import { Bar, Bouncy, Button, Card, Pulse, T } from '../../components/UI';
import { Image } from 'expo-image';
import { HERO_SCENE } from '../../data/art';
import { BOOKLET_URL, HeroId, TIERS, heroById } from '../../data/content';
import { useTimeTracker } from '../../lib/engagement';
import { useGame } from '../../lib/game';
import { STAGE_LABEL, SMOG, colors, fonts, mix, radius, shadow, stageOf } from '../../theme';

const W = Dimensions.get('window').width;

type TabId = 'story' | 'habits' | 'facts' | 'explore' | 'videos' | 'sdg';
const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'story', label: 'Story', icon: '📖' },
  { id: 'habits', label: 'Habits', icon: '✅' },
  { id: 'facts', label: 'Facts', icon: '💡' },
  { id: 'explore', label: 'Explore', icon: '🔎' },
  { id: 'videos', label: 'Videos', icon: '🎥' },
  { id: 'sdg', label: 'SDG', icon: '📰' },
];

function CheckBox({ done, color, size = 46 }: { done: boolean; color: string; size?: number }) {
  const s = useSharedValue(done ? 1 : 0);
  useEffect(() => {
    s.value = done ? withSequence(withTiming(0.2, { duration: 60 }), withSpring(1, { damping: 4, stiffness: 220 })) : withTiming(0, { duration: 150 });
  }, [done]);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }], opacity: s.value }));
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 4, borderColor: done ? color : '#D9D2EE', alignItems: 'center', justifyContent: 'center', backgroundColor: done ? color : '#fff' }}>
      <Animated.Text style={[{ color: '#fff', fontSize: size * 0.56, fontFamily: fonts.display, marginTop: -2 }, a]}>✓</Animated.Text>
    </View>
  );
}

/** Groups the doc's short story lines into readable pages. */
function paginate(lines: string[]): string[] {
  const pages: string[] = [];
  let acc: string[] = [];
  const len = () => acc.join(' ').length;
  for (const l of lines) {
    acc.push(l);
    if (len() >= 130) {
      pages.push(acc.join('\n'));
      acc = [];
    }
  }
  if (acc.length) {
    if (pages.length && len() < 50) pages[pages.length - 1] += '\n' + acc.join('\n');
    else pages.push(acc.join('\n'));
  }
  return pages;
}

function StoryTab({ id, onDone }: { id: HeroId; onDone: () => void }) {
  const hero = heroById(id);
  const pages = useMemo(
    () => [...hero.story.map((t) => ({ chap: `Meet ${hero.name}`, text: t, sad: false })), ...paginate(hero.fullStory).map((t) => ({ chap: hero.fullStoryTitle, text: t, sad: false }))],
    [id],
  );
  const meetCount = hero.story.length;
  const [i, setI] = useState(0);
  const last = i === pages.length - 1;
  const inMeet = i < meetCount;
  const full = i - meetCount;
  const fullTotal = pages.length - meetCount;
  const sad = inMeet ? i >= 1 && i <= 2 : full / fullTotal < 0.3;
  const mood = last ? 'cheer' : sad ? 'sad' : 'happy';
  return (
    <View style={{ padding: 18 }}>
      <View style={{ alignItems: 'center' }}>
        {sad ? (
          <Animated.View key={'pic' + id} entering={ZoomIn.springify().damping(12)} style={{ width: '100%', height: 230, borderRadius: 28, overflow: 'hidden', marginBottom: 12, backgroundColor: '#fff', ...shadow }}>
            <Image source={HERO_SCENE[id]} style={{ width: '100%', height: '100%' }} contentFit="cover" contentPosition="center" />
          </Animated.View>
        ) : (
          <Character id={id} size={140} mood={mood} />
        )}
      </View>
      <View style={{ alignSelf: 'center', backgroundColor: hero.soft, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20, marginBottom: 8 }}>
        <Text style={{ fontFamily: fonts.bodyBold, color: hero.dark, fontSize: 13 }}>{pages[i].chap}</Text>
      </View>
      <Animated.View key={i} entering={FadeInRight.springify().damping(14)} style={{ backgroundColor: '#fff', borderRadius: 28, padding: 20, minHeight: 150, justifyContent: 'center', ...shadow }}>
        <T style={{ fontSize: 18, lineHeight: 28, fontFamily: fonts.bodyBold, color: sad ? '#B23A48' : colors.ink }}>{pages[i].text}</T>
      </Animated.View>
      <T v="small" style={{ textAlign: 'center', marginTop: 10 }}>{i + 1} / {pages.length}</T>
      <Bar value={(i + 1) / pages.length} color={hero.colors[1]} track={hero.soft} />
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        {i > 0 && <Button label="Back" onPress={() => setI(i - 1)} color="#fff" dark="#E0D6B8" style={{ width: 110 }} />}
        <Button label={last ? 'Start my mission!' : 'Next'} color={hero.colors[1]} dark={hero.dark} onPress={() => (last ? onDone() : setI(i + 1))} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

function HabitsTab({ id, goStory }: { id: HeroId; goStory: () => void }) {
  const hero = heroById(id);
  const { done, toggleHabit, count, todayMicro, toggleMicro } = useGame();
  const n = count(id);
  const microDone = hero.microHabits.filter((h) => todayMicro.includes(h.id)).length;
  return (
    <View style={{ padding: 18, gap: 12 }}>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <T v="h3">Hero Actions — {n} / 5</T>
          <T v="small">{n >= 5 ? 'Done!' : `${5 - n} to go`}</T>
        </View>
        <View style={{ marginTop: 10 }}>
          <Bar value={n / 5} color={hero.colors[1]} track={hero.soft} height={18} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 14 }}>
          {TIERS.map((t) => (
            <View key={t.id} style={{ alignItems: 'center' }}>
              <HeroBadge heroId={id} tier={t.id} size={64} earned={n >= t.need} />
              <T v="small" style={{ fontFamily: fonts.bodyBold }}>{t.emoji} {t.need} actions</T>
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

      <Card delay={300} style={{ marginTop: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <T v="h3">🗓️ Today’s micro-habits</T>
          <Text style={{ fontFamily: fonts.display, color: hero.dark, fontSize: 18 }}>{microDone}/10</Text>
        </View>
        <T v="small" style={{ marginBottom: 8 }}>Tick what you did today. +10 points each. Resets every day!</T>
        <View style={{ gap: 8 }}>
          {hero.microHabits.map((h) => {
            const on = todayMicro.includes(h.id);
            return (
              <Bouncy key={h.id} onPress={() => toggleMicro(h.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: on ? hero.soft : '#F8F4E8', borderRadius: 18, padding: 10 }}>
                <CheckBox done={on} color={hero.colors[1]} size={32} />
                <T style={{ flex: 1, fontFamily: on ? fonts.bodyBold : fonts.body, fontSize: 15, lineHeight: 20 }}>{h.text}</T>
              </Bouncy>
            );
          })}
        </View>
      </Card>

      <Bouncy onPress={() => router.push(`/quiz?id=${id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: hero.colors[1], borderRadius: radius.lg, padding: 16, ...shadow }}>
        <Text style={{ fontSize: 36 }}>🎯</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.display, color: '#fff', fontSize: 20 }}>Sort-it quiz!</Text>
          <Text style={{ fontFamily: fonts.bodyBold, color: '#ffffffd8', fontSize: 13 }}>+15 points for every right answer</Text>
        </View>
        <Text style={{ fontSize: 22, color: '#fff' }}>▶</Text>
      </Bouncy>
      <Bouncy onPress={goStory} style={{ alignItems: 'center', padding: 8 }}>
        <T v="label" style={{ color: hero.dark }}>📖 Read {hero.name}’s story again</T>
      </Bouncy>
    </View>
  );
}

function FactsTab({ id }: { id: HeroId }) {
  const hero = heroById(id);
  const all = [
    ...hero.facts.map((f) => ({ f, kind: 'fact' as const })),
    ...hero.sadFacts.map((f) => ({ f, kind: 'sad' as const })),
    ...hero.quickFacts.map((f) => ({ f, kind: 'quick' as const })),
  ];
  const [i, setI] = useState(0);
  const cur = all[i];
  const firstSad = all.findIndex((x) => x.kind === 'sad');
  const firstQuick = all.findIndex((x) => x.kind === 'quick');
  const sad = cur.kind === 'sad';
  return (
    <View style={{ padding: 18 }}>
      {i === firstSad && (
        <Animated.View entering={ZoomIn.springify()} style={{ alignSelf: 'center', backgroundColor: '#FFE1E5', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 8 }}>
          <Text style={{ fontFamily: fonts.display, color: '#B23A48', fontSize: 18 }}>But sadly… 😢</Text>
        </Animated.View>
      )}
      {i === firstQuick && (
        <Animated.View entering={ZoomIn.springify()} style={{ alignSelf: 'center', backgroundColor: hero.soft, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 8 }}>
          <Text style={{ fontFamily: fonts.display, color: hero.dark, fontSize: 18 }}>⚡ Quick facts</Text>
        </Animated.View>
      )}
      <View style={{ alignItems: 'center' }}>
        <Character id={id} size={110} mood={sad ? 'sad' : 'happy'} />
      </View>
      <Animated.View key={i} entering={FadeInRight.springify().damping(14)} exiting={FadeOutLeft} style={{ backgroundColor: sad ? '#FFF0F1' : '#fff', borderRadius: 28, padding: 22, minHeight: 190, justifyContent: 'center', borderWidth: 3, borderColor: sad ? '#FFC2CA' : hero.colors[0], ...shadow }}>
        <Text style={{ fontFamily: fonts.display, color: sad ? '#B23A48' : hero.dark, fontSize: 18 }}>{sad ? '💔 Sad fact' : cur.kind === 'quick' ? '⚡ Quick fact' : '💡 Did you know?'}</Text>
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

const BIN: Record<string, { bg: string; emoji: string }> = {
  green: { bg: '#2FBF4B', emoji: '🟢' },
  blue: { bg: '#3A7BFF', emoji: '🔵' },
  red: { bg: '#E5484D', emoji: '🔴' },
  black: { bg: '#3B3B4F', emoji: '⚫' },
};

function ExploreTab({ id }: { id: HeroId }) {
  const hero = heroById(id);
  const [steps, setSteps] = useState<Record<number, boolean>>({});
  let stepNo = 0;
  return (
    <View style={{ padding: 18, gap: 10 }}>
      {hero.explainer.map((b, idx) => {
        const delay = Math.min(idx, 10) * 50;
        switch (b.k) {
          case 'h1':
            return (
              <Animated.View key={idx} entering={FadeInDown.delay(delay)}>
                <Text style={{ fontFamily: fonts.display, fontSize: 28, lineHeight: 34, color: hero.dark }}>{b.t}</Text>
              </Animated.View>
            );
          case 'h2':
            return (
              <Animated.View key={idx} entering={FadeInDown.delay(delay)} style={{ alignSelf: 'flex-start', backgroundColor: hero.soft, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 14, marginTop: 8 }}>
                <Text style={{ fontFamily: fonts.display, fontSize: 18, color: hero.dark }}>{b.t}</Text>
              </Animated.View>
            );
          case 'p':
            return (
              <Animated.View key={idx} entering={FadeInDown.delay(delay)}>
                <T style={{ fontSize: 16, lineHeight: 24 }}>{b.t}</T>
              </Animated.View>
            );
          case 'b':
            return (
              <Animated.View key={idx} entering={FadeInDown.delay(delay)} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 16, padding: 12 }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: hero.colors[1], marginTop: 7 }} />
                <T style={{ flex: 1, fontFamily: fonts.bodyBold, fontSize: 15 }}>{b.t}</T>
              </Animated.View>
            );
          case 'note':
            return (
              <Animated.View key={idx} entering={FadeInDown.delay(delay)} style={{ backgroundColor: '#FFF3C4', borderRadius: 20, padding: 14, flexDirection: 'row', gap: 10 }}>
                <Text style={{ fontSize: 26 }}>📞</Text>
                <T style={{ flex: 1, fontFamily: fonts.bodyBold }}>{b.t}</T>
              </Animated.View>
            );
          case 'bin': {
            const c = BIN[b.color] ?? BIN.blue;
            return (
              <Animated.View key={idx} entering={FadeInDown.delay(delay).springify()} style={{ backgroundColor: c.bg, borderRadius: 24, padding: 16, ...shadow }}>
                <Text style={{ fontFamily: fonts.display, fontSize: 22, color: '#fff' }}>🗑️ {b.color.toUpperCase()} BIN · {b.title}</Text>
                <View style={{ backgroundColor: '#ffffff30', borderRadius: 16, padding: 10, marginTop: 8, gap: 2 }}>
                  {b.items.map((x) => (
                    <Text key={x} style={{ fontFamily: fonts.bodyBold, color: '#fff', fontSize: 15 }}>• {x}</Text>
                  ))}
                </View>
                {b.notes.map((x) => (
                  <Text key={x} style={{ fontFamily: fonts.body, color: '#ffffffee', marginTop: 6 }}>{x}</Text>
                ))}
              </Animated.View>
            );
          }
          case 'herb':
            return (
              <Animated.View key={idx} entering={FadeInDown.delay(delay)} style={{ marginTop: 10 }}>
                <Text style={{ fontFamily: fonts.display, fontSize: 24, color: hero.dark }}>🌿 {b.t}</Text>
              </Animated.View>
            );
          case 'step': {
            const n = ++stepNo;
            const on = !!steps[n];
            return (
              <Animated.View key={idx} entering={FadeInDown.delay(delay)}>
                <Bouncy onPress={() => setSteps((s) => ({ ...s, [n]: !s[n] }))} style={{ flexDirection: 'row', gap: 12, backgroundColor: on ? hero.soft : '#fff', borderRadius: 20, padding: 14, borderWidth: 3, borderColor: on ? hero.colors[1] : 'transparent' }}>
                  <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: hero.colors[1], alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontFamily: fonts.display, fontSize: 20 }}>{on ? '✓' : n}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fonts.display, fontSize: 17, color: hero.dark }}>{b.title}</Text>
                    <T style={{ fontSize: 15, lineHeight: 22 }}>{b.t}</T>
                  </View>
                </Bouncy>
              </Animated.View>
            );
          }
        }
      })}
      <Bouncy onPress={() => router.push(`/quiz?id=${id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: hero.colors[1], borderRadius: radius.lg, padding: 16, marginTop: 8 }}>
        <Text style={{ fontSize: 32 }}>🎯</Text>
        <Text style={{ flex: 1, fontFamily: fonts.display, color: '#fff', fontSize: 19 }}>Test yourself: Sort-it quiz!</Text>
      </Bouncy>
      <Button label="Read more in the booklet" icon="📘" onPress={() => WebBrowser.openBrowserAsync(BOOKLET_URL)} color={hero.colors[1]} dark={hero.dark} style={{ marginTop: 14 }} />
    </View>
  );
}

function SdgTab({ id }: { id: HeroId }) {
  const hero = heroById(id);
  return (
    <View style={{ padding: 18, gap: 12 }}>
      <T v="small">Read these articles to learn more. They open in your browser.</T>
      {hero.sdg.map((a, i) => (
        <Animated.View key={a.url} entering={FadeInDown.delay(i * 100).springify()}>
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
        <T v="h3">🎬 Mehr’s {hero.name} video is coming!</T>
        <T style={{ textAlign: 'center', marginTop: 4 }}>Mehr is making a video for every Hero. Check back soon!</T>
      </Card>
    </View>
  );
}

export default function HeroScreen() {
  const { id, tab: tabParam } = useLocalSearchParams<{ id: HeroId; tab?: TabId }>();
  const hero = heroById(id);
  const { count, isComplete, isUnlocked } = useGame();
  const [tab, setTab] = useState<TabId>('story');
  const n = count(id);
  const stage = stageOf(n);
  const t = n / 5;
  const grad: [string, string] = [mix(SMOG[0], hero.colors[0], t), mix(SMOG[1], hero.colors[1], t)];

  useEffect(() => {
    if (tabParam && TABS.some((x) => x.id === tabParam)) setTab(tabParam);
    else if (n > 0) setTab('habits');
  }, [tabParam]);
  useEffect(() => {
    if (!isUnlocked(id)) router.back();
  }, [id]);
  useTimeTracker(tab === 'habits' ? 'habits' : tab === 'videos' ? 'video' : tab === 'explore' ? 'facts' : tab, hero.id);

  return (
    <View style={{ flex: 1, backgroundColor: mix('#E8E8EC', colors.bg, t) }}>
      <LinearGradient colors={grad} style={{ paddingBottom: 14, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, overflow: 'hidden' }}>
        <Smoke amount={1 - t} width={W} height={260} />
        <SafeAreaView edges={['top']}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingTop: 4, alignItems: 'center' }}>
            <Bouncy onPress={() => router.back()} style={{ backgroundColor: '#ffffff40', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Text style={{ fontFamily: fonts.bodyBold, color: '#fff' }}>← Back</Text>
            </Bouncy>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 4 }}>
            <Character id={id} size={96} cape={isComplete(id)} mood={stage === 1 ? 'sad' : stage === 2 ? 'happy' : 'cheer'} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={{ fontFamily: fonts.display, fontSize: 34, color: '#fff', lineHeight: 38 }}>{hero.hindi}</Text>
              <Text style={{ fontFamily: fonts.displayMed, fontSize: 18, color: '#ffffffe8' }}>{hero.element} · {hero.name}</Text>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: '#FFF3B0' }}>{hero.heroTitle} · {hero.hindiTitle}</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {[1, 2, 3].map((s) => (
                <View key={s} style={{ flex: 1, height: 10, borderRadius: 6, backgroundColor: s <= stage ? '#fff' : '#ffffff55' }} />
              ))}
            </View>
            <Text style={{ fontFamily: fonts.bodyBold, color: '#fff', fontSize: 12, marginTop: 4 }}>Stage {stage} of 3 · {STAGE_LABEL[stage]}</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 14, gap: 8 }}>
          {TABS.map((x) => {
            const active = x.id === tab;
            return (
              <Bouncy key={x.id} onPress={() => setTab(x.id)} style={{ flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 99, backgroundColor: active ? hero.colors[1] : '#fff', ...shadow, shadowOpacity: active ? 0.2 : 0.06 }}>
                <Text style={{ fontSize: 16 }}>{x.icon}</Text>
                <Text style={{ fontFamily: fonts.bodyBold, color: active ? '#fff' : colors.ink }}>{x.label}</Text>
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
          {tab === 'explore' && <ExploreTab id={id} />}
          {tab === 'videos' && <VideosTab id={id} />}
          {tab === 'sdg' && <SdgTab id={id} />}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
