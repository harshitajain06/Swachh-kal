import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bouncy } from '../../components/UI';
import { setupNotifications } from '../../lib/notifications';
import { colors, fonts, shadow } from '../../theme';

const TABS: Record<string, { label: string; icon: string; tint: string }> = {
  index: { label: 'Home', icon: '🏠', tint: '#FF5CA8' },
  badges: { label: 'Badges', icon: '🏆', tint: '#FFB300' },
  learn: { label: 'Learn', icon: '📖', tint: '#2FBF4B' },
  profile: { label: 'Me', icon: '😎', tint: '#7C4DFF' },
};

function TabItem({ name, focused, onPress }: { name: string; focused: boolean; onPress: () => void }) {
  const t = TABS[name];
  const s = useSharedValue(1);
  const y = useSharedValue(0);
  useEffect(() => {
    if (focused) {
      s.value = withSequence(withTiming(0.7, { duration: 90 }), withSpring(1.25, { damping: 4, stiffness: 200 }));
      y.value = withSpring(-6, { damping: 8 });
    } else {
      s.value = withSpring(1);
      y.value = withSpring(0);
    }
  }, [focused]);
  const icon = useAnimatedStyle(() => ({ transform: [{ scale: s.value }, { translateY: y.value }] }));
  return (
    <Bouncy onPress={onPress} style={{ alignItems: 'center', width: 78 }} scaleTo={0.85}>
      <View style={{ width: 52, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? t.tint + '28' : 'transparent' }}>
        <Animated.Text style={[{ fontSize: 26 }, icon]}>{t.icon}</Animated.Text>
      </View>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: focused ? t.tint : colors.inkSoft }}>{t.label}</Text>
    </Bouncy>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    setupNotifications();
  }, []);
  return (
    <Tabs
      screenOptions={{ headerShown: false, animation: 'shift' }}
      tabBar={({ state, navigateToTab }) => (
        <View style={{ position: 'absolute', left: 14, right: 14, bottom: Math.max(insets.bottom, 10), backgroundColor: '#fff', borderRadius: 34, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8, ...shadow }}>
          {state.routes.map((r, i) => (
            <TabItem
              key={r.key}
              name={r.name}
              focused={state.index === i}
              onPress={() => {
                if (state.index !== i) navigateToTab(r.key);
              }}
            />
          ))}
        </View>
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="badges" />
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
