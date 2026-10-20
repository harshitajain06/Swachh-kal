import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Character } from '../../components/Character';
import { Bouncy, Button, Card, Screen, T } from '../../components/UI';
import { HERO_ORDER, ROLES, TIERS } from '../../data/content';
import { dayKey } from '../../lib/dates';
import { api } from '../../lib/api';
import { useGame } from '../../lib/game';
import { colors, fonts, radius } from '../../theme';

function Stat({ icon, value, label, delay }: { icon: string; value: string | number; label: string; delay: number }) {
  return (
    <Animated.View entering={ZoomIn.delay(delay).springify().damping(8)} style={{ flex: 1, backgroundColor: '#fff', borderRadius: radius.md, padding: 12, alignItems: 'center' }}>
      <Text style={{ fontSize: 26 }}>{icon}</Text>
      <Text style={{ fontFamily: fonts.display, fontSize: 24, color: colors.ink }}>{value}</Text>
      <T v="small">{label}</T>
    </Animated.View>
  );
}

export default function Profile() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { profile, totalDone, streak, count, checkins, reviewed, points, deleteMyData } = useGame();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    api('/api/admin/summary').then((d) => setIsAdmin(!!d));
  }, []);
  const badges = HERO_ORDER.reduce((a, id) => a + TIERS.filter((t) => count(id) >= t.need).length, 0);
  const role = ROLES.find((r) => r.id === profile?.role);
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const c = checkins[dayKey(d)];
    return { label: 'SMTWTFS'[d.getDay()], ok: !!(c?.morningCommitted || c?.eveningSaved || (c?.eveningCompleted?.length ?? 0) > 0) };
  });
  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center', marginTop: 4 }}>
            <Character id="tarun" size={110} mood="cheer" />
            <T v="h2">{profile?.name || user?.firstName || 'Hero'}</T>
            <T v="small">{role ? `${role.emoji} ${role.label}` : ''}{profile?.city ? ` · ${profile.city}, ${profile.country}` : ''}</T>
            <T v="small">{user?.primaryEmailAddress?.emailAddress}</T>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <Stat icon="✅" value={totalDone} label="Habits" delay={0} />
            <Stat icon="🔥" value={streak} label="Streak" delay={120} />
            <Stat icon="🏅" value={badges} label="Badges" delay={240} />
            <Stat icon="⭐" value={points} label="Points" delay={360} />
          </View>
          <Card style={{ marginTop: 14 }} delay={300}>
            <T v="h3">Check-in history</T>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              {days.map((d, i) => (
                <View key={i} style={{ alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: d.ok ? colors.mint : '#EEE8F7', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18 }}>{d.ok ? '⭐' : ''}</Text>
                  </View>
                  <T v="small">{d.label}</T>
                </View>
              ))}
            </View>
          </Card>
          <View style={{ gap: 10, marginTop: 14 }}>
            <Button label="Daily check-in" icon="⏰" onPress={() => router.push('/checkin')} color={colors.pink} dark="#C93A80" />
            {!reviewed && <Button label="Rate Swachh Kal" icon="⭐" onPress={() => router.push('/review')} color="#FFB300" dark="#C98300" />}
            <Button label="Privacy notice" icon="🔒" onPress={() => router.push('/consent?view=1')} color="#fff" dark="#E0D6B8" />
            {isAdmin && <Button label="Team dashboard" icon="📊" onPress={() => router.push('/admin')} color={colors.brand} dark={colors.brandDark} />}
            <Button
              label="Delete my data" icon="🗑️"
              onPress={() =>
                Alert.alert('Delete everything?', 'A grown-up should do this. Your account, badges and progress will be erased and cannot be brought back.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: async () => { await deleteMyData(); try { await signOut(); } catch {} router.replace('/'); } },
                ])
              }
              color="#fff" dark="#E0D6B8"
            />
            <Button
              label="Sign out"
              onPress={() =>
                Alert.alert('Sign out?', 'Your progress is saved.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Sign out', style: 'destructive', onPress: async () => { await signOut(); router.replace('/'); } },
                ])
              }
              color="#fff"
              dark="#E0D6B8"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
