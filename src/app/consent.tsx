import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Character } from '../components/Character';
import { Bouncy, Button, Card, Screen, T } from '../components/UI';
import { PRIVACY_FULL, PRIVACY_SUMMARY } from '../data/privacy';
import { useGame } from '../lib/game';
import { colors, fonts, radius } from '../theme';

export default function Consent() {
  const { view } = useLocalSearchParams<{ view?: string }>();
  const readOnly = view === '1';
  const { acceptConsent, profile } = useGame();
  const child = (profile?.age ?? 0) > 0 && (profile?.age ?? 99) < 18;
  const [agree, setAgree] = useState(false);
  const [full, setFull] = useState(readOnly);

  return (
    <Screen gradient={['#E6DDFF', '#FFF4D6']}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 230 }}>
          {readOnly && (
            <Bouncy onPress={() => router.back()} style={{ alignSelf: 'flex-start' }}>
              <T v="label" style={{ color: colors.brand }}>← Back</T>
            </Bouncy>
          )}
          <View style={{ alignItems: 'center' }}>
            <Animated.View entering={ZoomIn.springify().damping(8)}>
              <Character id="dharti" size={110} />
            </Animated.View>
            <Text style={{ fontFamily: fonts.display, fontSize: 28, color: colors.ink, textAlign: 'center' }}>{readOnly ? 'Privacy notice' : 'A quick grown-up check'}</Text>
            {!readOnly && (
              <T style={{ textAlign: 'center' }}>
                {child ? 'Please hand this phone to a parent or guardian.' : 'Please read how Swachh Kal looks after your information.'}
              </T>
            )}
          </View>

          <View style={{ gap: 10, marginTop: 16 }}>
            {PRIVACY_SUMMARY.map((p, i) => (
              <Card key={p.title} delay={150 + i * 90} style={{ flexDirection: 'row', gap: 12, padding: 14 }}>
                <Text style={{ fontSize: 28 }}>{p.icon}</Text>
                <View style={{ flex: 1 }}>
                  <T v="label" style={{ fontSize: 16 }}>{p.title}</T>
                  <T v="small" style={{ color: colors.ink, fontSize: 14, lineHeight: 20 }}>{p.text}</T>
                </View>
              </Card>
            ))}
          </View>

          {!readOnly && (
            <Bouncy onPress={() => setFull(!full)} style={{ paddingVertical: 12 }}>
              <T v="label" style={{ color: colors.brand, textAlign: 'center' }}>{full ? 'Hide' : 'Read'} the full privacy notice</T>
            </Bouncy>
          )}
          {full && (
            <Animated.View entering={FadeInDown} style={{ backgroundColor: '#fff', borderRadius: radius.md, padding: 16, gap: 10 }}>
              {PRIVACY_FULL.map((t, i) => (
                <T key={i} v="small" style={{ color: colors.ink, fontSize: 14, lineHeight: 21 }}>{t}</T>
              ))}
            </Animated.View>
          )}
        </ScrollView>

        {!readOnly && (
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, gap: 12, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, backgroundColor: '#FFF4D6', borderTopLeftRadius: 30, borderTopRightRadius: 30, shadowColor: '#2B2350', shadowOpacity: 0.15, shadowRadius: 12, elevation: 10 }}>
            <Bouncy onPress={() => setAgree(!agree)} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.md, padding: 14, borderWidth: 3, borderColor: agree ? colors.brand : colors.line }}>
              <Text style={{ fontSize: 28 }}>{agree ? '✅' : '⬜'}</Text>
              <T style={{ flex: 1, fontFamily: fonts.bodyBold, fontSize: 14, lineHeight: 19 }}>
                {child ? 'I am a parent or guardian and I agree to this privacy notice for my child.' : 'I have read and agree to this privacy notice.'}
              </T>
            </Bouncy>
            <Button
              label="I agree"
              disabled={!agree}
              onPress={async () => {
                await acceptConsent(child);
                router.replace('/about');
              }}
            />
          </View>
        )}
      </SafeAreaView>
    </Screen>
  );
}
