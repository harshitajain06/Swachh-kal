import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBookletState } from '../lib/booklet';
import { colors, fonts, shadow } from '../theme';
import { Bar } from './UI';

/** Top-of-screen banner showing booklet download progress and completion. */
export function BookletBanner() {
  const { status, progress } = useBookletState();
  const insets = useSafeAreaInsets();
  if (status === 'idle') return null;
  const done = status === 'done';
  const failed = status === 'error';
  const title = failed ? '⚠️ Could not download the booklet' : done ? '✅ Booklet downloaded!' : `⬇️ Downloading booklet… ${Math.round(progress * 100)}%`;
  return (
    <Animated.View
      entering={FadeInUp.springify()}
      exiting={FadeOutUp}
      pointerEvents="none"
      style={{ position: 'absolute', top: insets.top + 6, left: 16, right: 16, backgroundColor: '#fff', borderRadius: 18, padding: 14, zIndex: 100, ...shadow }}
    >
      <Text style={{ fontFamily: fonts.display, fontSize: 16, color: failed ? '#C0392B' : done ? '#1E8E3E' : colors.ink }}>{title}</Text>
      {!failed && (
        <View style={{ marginTop: 8 }}>
          <Bar value={progress} color={done ? '#1E8E3E' : colors.brand} height={10} />
        </View>
      )}
    </Animated.View>
  );
}
