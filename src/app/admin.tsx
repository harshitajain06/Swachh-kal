import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bouncy, Card, Screen, T } from '../components/UI';
import { api } from '../lib/api';
import { colors, fonts } from '../theme';

const TILES: { key: string; label: string; icon: string; hint: string }[] = [
  { key: 'installsRecorded', label: 'Installs recorded', icon: '📲', hint: 'Anonymous app opens' },
  { key: 'downloadedNeverSignedUp', label: 'Never signed up', icon: '👻', hint: 'Downloaded but no account' },
  { key: 'signedUpUsers', label: 'Signed-up users', icon: '🧒', hint: 'Accounts created' },
  { key: 'consented', label: 'Consent given', icon: '✅', hint: 'Privacy notice accepted' },
  { key: 'suspectedUninstalls', label: 'Likely uninstalled', icon: '🗑️', hint: 'Push token stopped working' },
  { key: 'inactive3Days', label: 'Inactive 3+ days', icon: '😴', hint: 'Not opened in 3 days' },
  { key: 'inactive7Days', label: 'Inactive 7+ days', icon: '💤', hint: 'Not opened in 7 days' },
  { key: 'superheroes', label: 'Superheroes', icon: '🦸', hint: 'Finished all 4 heroes' },
];

export default function Admin() {
  const [data, setData] = useState<any>(null);
  const [denied, setDenied] = useState(false);
  useEffect(() => {
    api('/api/admin/summary').then((d) => (d ? setData(d) : setDenied(true)));
  }, []);
  return (
    <Screen gradient={['#E6DDFF', '#FFF4D6']}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
          <Bouncy onPress={() => router.back()} style={{ alignSelf: 'flex-start' }}>
            <T v="label" style={{ color: colors.brand }}>← Back</T>
          </Bouncy>
          <T v="title">Team dashboard</T>
          <T v="small">Totals only — no child’s personal details are shown here.</T>
          {denied && (
            <Card style={{ marginTop: 16 }}>
              <T>This area is only for the Swachh Kal team.</T>
            </Card>
          )}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
            {data &&
              TILES.map((t, i) => (
                <Animated.View key={t.key} entering={ZoomIn.delay(i * 70).springify()} style={{ width: '47.5%', backgroundColor: '#fff', borderRadius: 24, padding: 14 }}>
                  <Text style={{ fontSize: 26 }}>{t.icon}</Text>
                  <Text style={{ fontFamily: fonts.display, fontSize: 32, color: colors.ink }}>{data[t.key] ?? 0}</Text>
                  <T v="label" style={{ fontSize: 14 }}>{t.label}</T>
                  <T v="small">{t.hint}</T>
                </Animated.View>
              ))}
          </View>
          {data?.reviews?.n ? (
            <Card style={{ marginTop: 14 }}>
              <T v="h3">⭐ App reviews</T>
              <T>{(data.reviews.avg ?? 0).toFixed(1)} average from {data.reviews.n} children</T>
            </Card>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
