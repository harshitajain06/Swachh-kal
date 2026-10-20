import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Character } from '../components/Character';
import { Ring } from '../components/Ring';
import { Bouncy, Button, Card, Screen, T } from '../components/UI';
import { PLEDGE_365, PLEDGE_TEXT } from '../data/content';
import { useGame } from '../lib/game';
import { colors, fonts } from '../theme';

const certHtml = (name: string) => `
<html><body style="font-family:Helvetica;text-align:center;padding:60px;background:#FFF4D6">
<div style="border:12px double #7C4DFF;border-radius:24px;padding:60px;background:#fff">
<div style="font-size:64px">🌍🏆🌱</div>
<h1 style="color:#7C4DFF;font-size:56px;margin:10px">Swachh Kal</h1>
<h2 style="color:#FF5CA8">आज आपका कल है</h2>
<p style="font-size:22px">This certificate is proudly presented to</p>
<h1 style="font-size:54px;margin:10px">${name}</h1>
<p style="font-size:22px">for completing the <b>365-Day Swachh Pledge</b></p>
<p style="font-size:20px;font-style:italic">“${PLEDGE_TEXT}”</p>
<p style="margin-top:40px;font-size:16px">Founded by Mehr Dhawan · Swachh Kal</p>
</div></body></html>`;

export default function Certificate() {
  const { profile, pledge365Start, startPledge365 } = useGame();
  const days = pledge365Start ? Math.min(365, Math.floor((Date.now() - new Date(pledge365Start).getTime()) / 86400000) + 1) : 0;
  const complete = days >= 365;

  const download = async () => {
    const { uri } = await Print.printToFileAsync({ html: certHtml(profile?.name || 'Swachh Hero') });
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Swachh Kal Certificate' });
  };

  return (
    <Screen gradient={['#FFF4D6', '#FFD9F0']}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60, alignItems: 'center' }}>
          <Bouncy onPress={() => router.back()} style={{ alignSelf: 'flex-start' }}>
            <T v="label" style={{ color: colors.brand }}>← Back</T>
          </Bouncy>
          <Text style={{ fontFamily: fonts.display, fontSize: 32, color: colors.brand, textAlign: 'center', marginTop: 8 }}>{PLEDGE_365.title}</Text>
          <T v="h3" style={{ textAlign: 'center' }}>{PLEDGE_365.intro}</T>

          <View style={{ marginVertical: 20 }}>
            <Ring size={200} stroke={18} value={days / 365} color={colors.brand} track="#ffffffa0">
              <Character id="tarun" size={110} mood="cheer" />
              <Text style={{ position: 'absolute', bottom: 28, fontFamily: fonts.display, fontSize: 18, color: colors.ink }}>{days}/365</Text>
            </Ring>
          </View>

          <Card style={{ width: '100%', gap: 8 }} delay={200}>
            {PLEDGE_365.months.map((m, i) => (
              <Animated.View key={i} entering={FadeInDown.delay(300 + i * 100)}>
                <T style={{ fontFamily: fonts.bodyBold }}>{m}</T>
              </Animated.View>
            ))}
            <T v="small">Daily prompts for all 365 days are coming soon.</T>
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
