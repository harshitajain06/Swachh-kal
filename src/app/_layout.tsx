import { Baloo2_600SemiBold, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_800ExtraBold, useFonts } from '@expo-google-fonts/nunito';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import * as Notifications from 'expo-notifications';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CelebrationHost } from '../components/CelebrationHost';
import { registerDevice } from '../lib/device';
import { GameProvider } from '../lib/game';
import { colors } from '../theme';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

export default function RootLayout() {
  const [loaded] = useFonts({ Baloo2_600SemiBold, Baloo2_800ExtraBold, Nunito_400Regular, Nunito_600SemiBold, Nunito_800ExtraBold });

  useEffect(() => {
    registerDevice();
  }, []);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((r) => {
      const screen = (r.notification.request.content.data as any)?.screen;
      if (screen === 'checkin') router.push('/checkin');
    });
    return () => sub.remove();
  }, []);

  if (!loaded) return null;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GameProvider>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }}>
              <Stack.Screen name="checkin" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="review" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="hero/[id]" options={{ animation: 'fade_from_bottom' }} />
            </Stack>
            <CelebrationHost />
          </GameProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
