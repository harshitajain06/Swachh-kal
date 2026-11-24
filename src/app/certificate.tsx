import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Character } from '../components/Character';
import { Ring } from '../components/Ring';
import { Bouncy, Button, Card, Screen, T } from '../components/UI';
import { PLEDGE_365, heroById } from '../data/content';
import { PLEDGE_DAYS, PLEDGE_FINALE, PLEDGE_MONTHS, pledgeDay } from '../data/pledge365';
import { shareCertificate } from '../lib/certificates';
import { useGame } from '../lib/game';
import { colors, fonts } from '../theme';

export default function Certificate() {
  const { profile, pledge365Start, startPledge365 } = useGame();
  const days = pledge365Start ? Math.min(PLEDGE_DAYS, Math.floor((Date.now() - new Date(pledge365Start).getTime()) / 86400000) + 1) : 0;
  const complete = days >= PLEDGE_DAYS;
  const [open, setOpen] = useState<number | null>(null);
  const today = days ? pledgeDay(days) : null;

  const download = async () => {
    await shareCertificate({ cert: { kind: 'pledge365' }, name: profile?.name || 'Swachh Hero', completedAt: new Date().toISOString() });
  };

  return (
    <Screen gradient={['#FFF4D6', '#FFD9F0']}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60, alignItems: 'center' }}>
          <Bouncy onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))} style={{ alignSelf: 'flex-start' }}>
            <T v="label" style={{ color: colors.brand }}>← Back</T>
          </Bouncy>
          <Text style={{ fontFamily: fonts.display, fontSize: 32, color: colors.brand, textAlign: 'center', marginTop: 8 }}>{PLEDGE_365.title}</Text>
          <T v="h3" style={{ textAlign: 'center' }}>{PLEDGE_365.intro}</T>

          <View style={{ marginVertical: 20 }}>
            <Ring size={200} stroke={18} value={days / PLEDGE_DAYS} color={colors.brand} track="#ffffffa0">
              <Character id="tarun" size={110} mood="cheer" />
              <Text style={{ position: 'absolute', bottom: 28, fontFamily: fonts.display, fontSize: 18, color: colors.ink }}>{days}/{PLEDGE_DAYS}</Text>
            </Ring>
          </View>

          {today ? (
            <Card style={{ width: '100%', gap: 6 }} delay={200}>
              <T v="label" style={{ color: colors.brand }}>
                Day {today.day} of {PLEDGE_DAYS}
                {today.month ? ` · ${heroById(today.month.hero).emoji} ${today.month.title}` : ' · 🎉 Celebration week'}
              </T>
              <T v="h3">{today.text}</T>
            </Card>
          ) : null}

          <Card style={{ width: '100%', gap: 4, marginTop: 14 }} delay={300}>
            <T v="h3">Your 12-month journey</T>
            {[...PLEDGE_MONTHS.map((m, i) => ({ key: i, title: m.title, sub: `Month ${i + 1} · ${m.round}`, emoji: heroById(m.hero).emoji, days: m.days, from: i * 30 + 1 })), { key: 12, title: 'Celebration week', sub: 'Days 361–365', emoji: '🎉', days: PLEDGE_FINALE, from: 361 }].map((m) => (
              <View key={m.key}>
                <Bouncy onPress={() => setOpen(open === m.key ? null : m.key)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
                  <Text style={{ fontSize: 26 }}>{m.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <T style={{ fontFamily: fonts.bodyBold }}>{m.title}</T>
                    <T v="small">{m.sub}</T>
                  </View>
                  <T style={{ color: colors.brand }}>{open === m.key ? '▲' : '▼'}</T>
                </Bouncy>
                {open === m.key
                  ? m.days.map((text, d) => {
                      const n = m.from + d;
                      const unlocked = n <= days;
                      return (
                        <T key={n} v="small" style={{ paddingVertical: 4, paddingLeft: 36, opacity: unlocked ? 1 : 0.5 }}>
                          {unlocked ? `Day ${n}: ${text}` : `🔒 Day ${n}: unlocks on its day`}
                        </T>
                      );
                    })
                  : null}
              </View>
            ))}
          </Card>

          <View style={{ width: '100%', gap: 12, marginTop: 18 }}>
            {!pledge365Start ? (
              <Button label="Start my 365 days!" icon="🚀" onPress={startPledge365} />
            ) : (
              <Button label={complete ? 'Download my certificate' : 'Preview certificate'} icon="📜" onPress={download} color={complete ? colors.mint : '#fff'} dark={complete ? '#12A072' : '#E0D6B8'} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
