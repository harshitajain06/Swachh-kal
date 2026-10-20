import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { HeroId } from '../data/content';
import { Celebration, useGame } from '../lib/game';

/** Developer-only: plays a celebration on cue (used to record demo videos). e.g. swachhkal://demo?c=tier&h=vayu&t=gold */
export default function Demo() {
  const { c, h, t, ms } = useLocalSearchParams<{ c?: string; h?: HeroId; t?: 'bronze' | 'silver' | 'gold'; ms?: string }>();
  const { showCelebration, dismissCelebration } = useGame();

  useEffect(() => {
    if (!__DEV__) {
      router.replace('/');
      return;
    }
    const hero = (h ?? 'vayu') as HeroId;
    const map: Record<string, Celebration> = {
      pledge: { kind: 'pledge' },
      tier: { kind: 'tier', heroId: hero, tier: t ?? 'bronze' },
      hero: { kind: 'hero-complete', heroId: hero },
      super: { kind: 'superhero' },
    };
    const ev = map[c ?? 'pledge'];
    showCelebration(ev);
    const timer = setTimeout(() => {
      dismissCelebration();
      router.back();
    }, Number(ms) || 6500);
    return () => clearTimeout(timer);
  }, []);

  return <View style={{ flex: 1, backgroundColor: '#FFF4D6' }} />;
}
