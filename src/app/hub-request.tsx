import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bouncy, Button, Card, Screen, T } from '../components/UI';
import { REQUEST_KINDS, RequestKind } from '../data/hub';
import { api } from '../lib/api';
import { colors, fonts, radius } from '../theme';

interface Mine {
  _id: string;
  kind: RequestKind;
  locality: string;
  status: 'new' | 'forwarded' | 'done';
}
const STATUS = { new: '🕒 Received', forwarded: '📨 Passed on', done: '✅ Done' };

export default function HubRequest() {
  const [kind, setKind] = useState<RequestKind | null>(null);
  const [locality, setLocality] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [mine, setMine] = useState<Mine[]>([]);

  const load = () => api<Mine[]>('/api/hub/requests/mine').then((r) => r && setMine(r));
  useEffect(() => {
    load();
  }, []);

  const input = { backgroundColor: '#fff', borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12, fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink, borderWidth: 3, borderColor: colors.line } as const;
  const chip = (active: boolean) => ({ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 99, backgroundColor: active ? colors.brand : '#fff', borderWidth: 3, borderColor: active ? colors.brandDark : colors.line });

  const send = async () => {
    if (!kind || !locality.trim()) return;
    setBusy(true);
    const r = await api('/api/hub/requests', 'POST', { kind, locality: locality.trim(), note: note.trim() });
    setBusy(false);
    if (r) {
      Alert.alert('Request sent! 🌱', 'The Swachh Kal team has received it. Thank you for caring about your neighbourhood!');
      setKind(null);
      setLocality('');
      setNote('');
      load();
    } else {
      Alert.alert('Could not send', 'Please check your internet and try again. You can send up to 5 requests a day.');
    }
  };

  return (
    <Screen gradient={['#FFF4D6', '#E3F9D9']}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 12 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Bouncy onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))} style={{ alignSelf: 'flex-start' }}>
            <T v="label" style={{ color: colors.brand }}>← Back</T>
          </Bouncy>
          <T v="title">Request a resource</T>
          <T v="small">Ask a grown-up before you send. Please don’t type your full name, phone number or home address.</T>

          <T v="h3">What do you need?</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {REQUEST_KINDS.map((k) => (
              <Bouncy key={k.id} onPress={() => setKind(k.id)} style={chip(kind === k.id)}>
                <Text style={{ fontFamily: fonts.bodyBold, color: kind === k.id ? '#fff' : colors.ink }}>
                  {k.emoji} {k.label}
                </Text>
              </Bouncy>
            ))}
          </View>

          <T v="h3">Where? (colony, block or school)</T>
          <TextInput style={input} placeholder="e.g. Block B, Green Park Colony" placeholderTextColor="#A9A2C4" maxLength={80} value={locality} onChangeText={setLocality} />

          <T v="h3">Anything else we should know? (optional)</T>
          <TextInput style={[input, { minHeight: 90, textAlignVertical: 'top' }]} placeholder="e.g. No dustbin for the whole street" placeholderTextColor="#A9A2C4" multiline maxLength={300} value={note} onChangeText={setNote} />

          <Button label={busy ? 'Sending…' : 'Send request'} icon="📨" onPress={send} disabled={busy || !kind || !locality.trim()} style={{ marginTop: 6 }} />

          {mine.length ? (
            <Card style={{ marginTop: 8, gap: 6 }}>
              <T v="h3">Your requests</T>
              {mine.map((m) => (
                <View key={m._id} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                  <T style={{ flex: 1 }}>
                    {REQUEST_KINDS.find((k) => k.id === m.kind)?.emoji} {m.locality}
                  </T>
                  <T v="small">{STATUS[m.status]}</T>
                </View>
              ))}
            </Card>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
