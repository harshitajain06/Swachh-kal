import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bouncy, Button, Card, Screen, T } from '../components/UI';
import { api } from '../lib/api';
import { useGame } from '../lib/game';
import { colors, fonts, radius } from '../theme';

interface Board {
  minGroup: number;
  board: { rank: number; school: string; members: number; perChild: number }[];
  mine: { school: string; rank: number | null; members: number } | null;
}

const MEDAL = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const { profile, saveProfile } = useGame();
  const [data, setData] = useState<Board | null | undefined>(undefined);
  const [school, setSchool] = useState('');

  const load = () => api<Board>('/api/leaderboard').then(setData);
  useEffect(() => {
    load();
  }, [profile?.school]);

  const saveSchool = async () => {
    if (!profile || !school.trim()) return;
    await saveProfile({ ...profile, school: school.trim() });
    setSchool('');
  };

  return (
    <Screen gradient={['#FFF4D6', '#FFE9A8']}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 12 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Bouncy onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))} style={{ alignSelf: 'flex-start' }}>
            <T v="label" style={{ color: colors.brand }}>← Back</T>
          </Bouncy>
          <T v="title">School leaderboard 🏆</T>
          <T v="small">Schools are ranked by habits done per child. We only show school names, never children’s names, and a school appears once {data?.minGroup ?? 5} or more Heroes have joined it.</T>

          {!profile?.school ? (
            <Card style={{ gap: 8 }}>
              <T v="h3">Add your school or group</T>
              <TextInput
                style={{ backgroundColor: '#fff', borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12, fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink, borderWidth: 3, borderColor: colors.line }}
                placeholder="School or group name"
                placeholderTextColor="#A9A2C4"
                maxLength={60}
                value={school}
                onChangeText={setSchool}
              />
              <Button label="Save" icon="✅" onPress={saveSchool} disabled={!school.trim()} />
            </Card>
          ) : data?.mine ? (
            <Card>
              <T v="h3">{data.mine.school}</T>
              <T>
                {data.mine.rank
                  ? `Your school is #${data.mine.rank}! 🎉`
                  : `${data.mine.members} Hero${data.mine.members === 1 ? '' : 'es'} so far. Invite classmates: ${Math.max(0, (data.minGroup ?? 5) - data.mine.members)} more to appear on the board.`}
              </T>
            </Card>
          ) : null}

          {data === undefined ? (
            <ActivityIndicator color={colors.brand} style={{ marginTop: 20 }} />
          ) : data === null ? (
            <T v="small">Could not load the leaderboard. Please check your internet and try again.</T>
          ) : data.board.length ? (
            <Card style={{ gap: 4 }}>
              {data.board.map((r) => (
                <View key={r.rank} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
                  <Text style={{ width: 36, fontSize: 24, textAlign: 'center' }}>{MEDAL[r.rank - 1] ?? r.rank}</Text>
                  <View style={{ flex: 1 }}>
                    <T style={{ fontFamily: fonts.bodyBold }}>{r.school}</T>
                    <T v="small">{r.members} Heroes</T>
                  </View>
                  <T style={{ fontFamily: fonts.bodyBold, color: colors.brand }}>{r.perChild} habits each</T>
                </View>
              ))}
            </Card>
          ) : (
            <Card>
              <T>No school is on the board yet. Be the first: ask your classmates to add your school when they sign up!</T>
            </Card>
          )}
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
