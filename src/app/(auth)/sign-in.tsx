import { useSignIn, useSignUp, useSSO } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Character } from '../../components/Character';
import { Bouncy, Button, Screen, T } from '../../components/UI';
import { HERO_ORDER } from '../../data/content';
import { colors, fonts, radius } from '../../theme';

WebBrowser.maybeCompleteAuthSession();

type Mode = 'in' | 'up' | 'verify';

export default function SignInScreen() {
  const { startSSOFlow } = useSSO();
  const { signIn, setActive: setActiveIn, isLoaded: inLoaded } = useSignIn();
  const { signUp, setActive: setActiveUp, isLoaded: upLoaded } = useSignUp();
  const [mode, setMode] = useState<Mode>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const fail = (e: any) => setErr(e?.errors?.[0]?.longMessage || e?.errors?.[0]?.message || 'Oops! Something went wrong. Try again.');
  const done = () => router.replace('/');

  const google = async () => {
    setErr('');
    setBusy(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: 'oauth_google', redirectUrl: AuthSession.makeRedirectUri() });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        done();
      }
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    setErr('');
    setBusy(true);
    try {
      if (mode === 'in') {
        if (!inLoaded) return;
        const r = await signIn.create({ identifier: email.trim(), password });
        if (r.status === 'complete') {
          await setActiveIn({ session: r.createdSessionId });
          done();
        } else setErr('Additional verification needed. Please use Google sign-in.');
      } else if (mode === 'up') {
        if (!upLoaded) return;
        await signUp.create({ emailAddress: email.trim(), password });
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setMode('verify');
      } else {
        if (!upLoaded) return;
        const r = await signUp.attemptEmailAddressVerification({ code: code.trim() });
        if (r.status === 'complete') {
          await setActiveUp({ session: r.createdSessionId });
          done();
        } else setErr('That code did not work.');
      }
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  const input = {
    backgroundColor: '#fff',
    borderRadius: radius.md,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    color: colors.ink,
    borderWidth: 3,
    borderColor: colors.line,
  } as const;

  return (
    <Screen gradient={['#FFF4D6', '#FFD9F0']}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }} keyboardShouldPersistTaps="handled">
            <View style={{ flexDirection: 'row', marginTop: 8, height: 120, alignItems: 'flex-end' }}>
              {HERO_ORDER.map((id, i) => (
                <Animated.View key={id} entering={ZoomIn.delay(i * 150).springify().damping(7)} style={{ marginHorizontal: -8, marginBottom: i % 2 ? 0 : 14 }}>
                  <Character id={id} size={92} />
                </Animated.View>
              ))}
            </View>
            <Animated.View entering={FadeInUp.delay(500)} style={{ alignItems: 'center', marginTop: 8 }}>
              <Text style={{ fontFamily: fonts.display, fontSize: 46, color: colors.brand, lineHeight: 52 }}>Swachh Kal</Text>
              <T v="h3" style={{ color: colors.pink }}>आज आपका कल है</T>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(700)} style={{ width: '100%', marginTop: 24, gap: 14 }}>
              {mode !== 'verify' ? (
                <>
                  <Button label="Continue with Google" icon="🚀" onPress={google} disabled={busy} color="#FF5CA8" dark="#C93A80" />
                  <T v="small" style={{ textAlign: 'center' }}>— or use your email —</T>
                  <TextInput style={input} placeholder="Email" placeholderTextColor="#A9A2C4" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
                  <TextInput style={input} placeholder="Password" placeholderTextColor="#A9A2C4" secureTextEntry value={password} onChangeText={setPassword} />
                </>
              ) : (
                <>
                  <T v="h3" style={{ textAlign: 'center' }}>Check your email ✉️</T>
                  <T style={{ textAlign: 'center' }}>We sent a 6-digit code to {email}</T>
                  <TextInput style={[input, { textAlign: 'center', letterSpacing: 8, fontSize: 26 }]} placeholder="······" keyboardType="number-pad" maxLength={6} value={code} onChangeText={setCode} />
                </>
              )}
              {err ? <Animated.Text entering={FadeInDown} style={{ color: '#D32F2F', fontFamily: fonts.bodyBold, textAlign: 'center' }}>{err}</Animated.Text> : null}
              <Button label={mode === 'in' ? 'Let’s go!' : mode === 'up' ? 'Create my account' : 'Verify'} onPress={submit} disabled={busy || (mode !== 'verify' && (!email || !password))} />
              {mode !== 'verify' && (
                <Bouncy onPress={() => setMode(mode === 'in' ? 'up' : 'in')}>
                  <T v="label" style={{ textAlign: 'center', color: colors.brand, paddingVertical: 8 }}>
                    {mode === 'in' ? 'New here? Create an account' : 'Already a Hero? Sign in'}
                  </T>
                </Bouncy>
              )}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Screen>
  );
}
