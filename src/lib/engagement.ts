import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { api } from './api';

/** Tracks seconds spent while a content section is on screen and the app is foregrounded. */
export function useTimeTracker(kind: 'story' | 'facts' | 'video' | 'sdg' | 'habits' | 'booklet', refId: string, active = true) {
  const start = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const begin = () => (start.current = Date.now());
    const flush = () => {
      if (start.current == null) return;
      const seconds = (Date.now() - start.current) / 1000;
      start.current = null;
      if (seconds >= 3) api('/api/engagement', 'POST', { kind, refId, seconds });
    };
    begin();
    const sub = AppState.addEventListener('change', (s) => (s === 'active' ? begin() : flush()));
    return () => {
      sub.remove();
      flush();
    };
  }, [kind, refId, active]);
}
