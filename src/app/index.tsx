import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Character } from '../components/Character';
import { Screen, T } from '../components/UI';
import { useGame } from '../lib/game';

export default function Gate() {
  const { isLoaded, isSignedIn } = useAuth();
  const { ready, profile, pledgedAt } = useGame();

  if (!isLoaded || (isSignedIn && !ready)) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Character id="vayu" size={140} />
          <T v="h3" style={{ marginTop: 12 }}>Loading your Hero world…</T>
        </View>
      </Screen>
    );
  }
  if (!isSignedIn) return <Redirect href="/sign-in" />;
  if (!profile) return <Redirect href="/onboarding" />;
  if (!pledgedAt) return <Redirect href="/about" />;
  return <Redirect href="/(tabs)" />;
}
