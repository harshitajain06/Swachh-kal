import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Character } from '../components/Character';
import { Bouncy, Button, Card, Screen, T } from '../components/UI';
import { HERO_ORDER, heroById } from '../data/content';
import { CertKind, certTitle, shareCertificate } from '../lib/certificates';
import { useGame } from '../lib/game';
import { colors, fonts } from '../theme';

const DAY = 86400000;

export default function Certificates() {
  const { profile, done, count, isComplete, superheroAt, pledge365Start } = useGame();
  const [busy, setBusy] = useState<string | null>(null);

  const name = profile?.name || 'Swachh Hero';
  const pledgeDays = pledge365Start ? Math.floor((Date.now() - new Date(pledge365Start).getTime()) / DAY) + 1 : 0;

  const items: { id: string; cert: CertKind; sub: string; completedAt: string | null; hero?: (typeof HERO_ORDER)[number] }[] = [
    ...HERO_ORDER.map((id) => {
      const h = heroById(id);
      const when = isComplete(id) ? h.habits.map((x) => done[x.id]).filter(Boolean).sort().pop()! : null;
      return { id, cert: { kind: 'hero', heroId: id } as CertKind, sub: when ? h.heroTitle : `${count(id)}/5 habits done`, completedAt: when, hero: id };
    }),
    { id: 'superhero', cert: { kind: 'superhero' }, sub: superheroAt ? 'All 4 Hero missions' : 'Finish all 4 Heroes', completedAt: superheroAt },
    {
      id: 'pledge365',
      cert: { kind: 'pledge365' },
      sub: pledgeDays >= 365 ? '365 days complete' : pledge365Start ? `Day ${pledgeDays} of 365` : 'Start the 365-Day Pledge',
      completedAt: pledge365Start && pledgeDays >= 365 ? new Date(new Date(pledge365Start).getTime() + 365 * DAY).toISOString() : null,
    },
  ];

  const download = async (it: (typeof items)[number]) => {
    if (!it.completedAt) return;
    setBusy(it.id);
    try {
      await shareCertificate({ cert: it.cert, name, completedAt: it.completedAt });
    } catch {
      Alert.alert('Oops', 'We could not create the certificate. Please try again.');
    }
    setBusy(null);
  };

  return (
    <Screen gradient={['#FFF4D6', '#FFD9F0']}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          <Bouncy onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))} style={{ alignSelf: 'flex-start' }}>
            <T v="label" style={{ color: colors.brand }}>← Back</T>
          </Bouncy>
          <T v="title" style={{ marginTop: 8 }}>My certificates</T>
          <T v="small">Finish a stage to unlock its certificate.</T>
          <View style={{ gap: 12, marginTop: 14 }}>
            {items.map((it) => (
              <Card key={it.id} style={{ opacity: it.completedAt ? 1 : 0.7 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  {it.hero ? <Character id={it.hero} size={56} still /> : <Text style={{ fontSize: 44 }}>{it.id === 'superhero' ? '🦸' : '📜'}</Text>}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fonts.display, fontSize: 18, color: colors.ink }}>{certTitle(it.cert)}</Text>
                    <T v="small">{it.completedAt ? `✅ ${it.sub}` : `🔒 ${it.sub}`}</T>
                  </View>
                </View>
                {it.completedAt ? (
                  <Button label={busy === it.id ? 'Preparing…' : 'Download certificate'} icon="📜" disabled={busy !== null} onPress={() => download(it)} color={colors.mint} dark="#12A072" style={{ marginTop: 12 }} />
                ) : it.id === 'pledge365' ? (
                  <Button label="Open the pledge" icon="🚀" onPress={() => router.push('/certificate')} color="#fff" dark="#E0D6B8" style={{ marginTop: 12 }} />
                ) : null}
              </Card>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
