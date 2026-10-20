import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth, useUser } from '@clerk/clerk-expo';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { HEROES, HERO_ORDER, HeroId, TIERS, Tier, heroById } from '../data/content';
import { api, platformName, setTokenGetter } from './api';
import { notifyNow } from './notifications';
import { dayKey, streakFrom } from './dates';

export interface Profile {
  name: string;
  age?: number;
  country: string;
  city: string;
  role: string;
  gender: string;
}

export interface CheckIn {
  morningCommitted?: boolean;
  eveningSaved?: boolean;
  eveningCompleted?: string[];
}

interface Persisted {
  profile: Profile | null;
  pledgedAt: string | null;
  done: Record<string, string>; // habitId -> ISO
  checkins: Record<string, CheckIn>;
  reviewed: boolean;
  superheroAt: string | null;
  pledge365Start: string | null;
  seenIntro: boolean;
  consentAt: string | null;
  quizBest: Record<string, number>; // heroId -> best correct answers
}

const EMPTY: Persisted = {
  profile: null,
  pledgedAt: null,
  done: {},
  checkins: {},
  reviewed: false,
  superheroAt: null,
  pledge365Start: null,
  seenIntro: false,
  consentAt: null,
  quizBest: {},
};

export type Celebration =
  | { kind: 'tier'; heroId: HeroId; tier: Tier }
  | { kind: 'hero-complete'; heroId: HeroId }
  | { kind: 'superhero' }
  | { kind: 'pledge' };

interface Ctx extends Persisted {
  ready: boolean;
  celebration: Celebration | null;
  dismissCelebration: () => void;
  showCelebration: (c: Celebration) => void;
  askReview: boolean;
  dismissReview: () => void;
  saveProfile: (p: Profile) => Promise<void>;
  takePledge: () => Promise<void>;
  toggleHabit: (heroId: HeroId, habitId: string) => void;
  saveCheckin: (patch: CheckIn) => Promise<void>;
  markReviewed: (r: { heroRating: number; journeyRating: number; enjoyed: string[] }) => Promise<void>;
  startPledge365: () => Promise<void>;
  acceptConsent: (guardian: boolean) => Promise<void>;
  saveQuiz: (heroId: HeroId, correct: number) => void;
  deleteMyData: () => Promise<void>;
  count: (heroId: HeroId) => number;
  tierOf: (heroId: HeroId) => Tier | null;
  isUnlocked: (heroId: HeroId) => boolean;
  isComplete: (heroId: HeroId) => boolean;
  allComplete: boolean;
  totalDone: number;
  streak: number;
  nextHero: HeroId | null;
  todayMicro: string[];
  toggleMicro: (id: string) => void;
  points: number;
}

const GameCtx = createContext<Ctx | null>(null);
export const useGame = () => {
  const c = useContext(GameCtx);
  if (!c) throw new Error('useGame outside provider');
  return c;
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();
  const [state, setState] = useState<Persisted>(EMPTY);
  const [ready, setReady] = useState(false);
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const [askReview, setAskReview] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    setTokenGetter(() => getToken());
  }, [getToken]);

  // Load local cache, then reconcile with server (server wins for completed habits / profile).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isSignedIn || !userId) {
        setState(EMPTY);
        setReady(true);
        return;
      }
      setReady(false);
      let local = EMPTY;
      try {
        const raw = await AsyncStorage.getItem(`sk:${userId}`);
        if (raw) local = { ...EMPTY, ...JSON.parse(raw) };
      } catch {}
      if (!cancelled) setState(local);

      const me = await api<any>('/api/me');
      if (me && !cancelled) {
        const done: Record<string, string> = { ...local.done };
        (me.completedHabits || []).forEach((h: any) => (done[h.habitId] = h.at));
        const checkins: Record<string, CheckIn> = { ...local.checkins };
        (me.checkins || []).forEach((c: any) => {
          checkins[c.date] = { ...checkins[c.date], morningCommitted: c.morningCommitted, eveningSaved: c.eveningSaved, eveningCompleted: c.eveningCompleted };
        });
        const profile: Profile | null = me.role
          ? { name: me.name || user?.firstName || '', age: me.age, country: me.country || '', city: me.city || '', role: me.role, gender: me.gender || '' }
          : local.profile;
        setState({
          ...local,
          profile,
          done,
          checkins,
          pledgedAt: me.pledgedAt || local.pledgedAt,
          consentAt: me.consentAt || local.consentAt,
          reviewed: !!me.review?.at || local.reviewed,
          superheroAt: me.superheroAt || local.superheroAt,
          pledge365Start: me.pledge365Start || local.pledge365Start,
        });
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, userId]);

  useEffect(() => {
    if (!ready || !userId) return;
    AsyncStorage.setItem(`sk:${userId}`, JSON.stringify(state)).catch(() => {});
  }, [state, ready, userId]);

  const patch = useCallback((p: Partial<Persisted>) => setState((s) => ({ ...s, ...p })), []);

  const count = useCallback(
    (heroId: HeroId) => heroById(heroId).habits.filter((h) => state.done[h.id]).length,
    [state.done],
  );
  const tierOf = useCallback(
    (heroId: HeroId): Tier | null => {
      const n = count(heroId);
      const t = [...TIERS].reverse().find((x) => n >= x.need);
      return t ? t.id : null;
    },
    [count],
  );
  const isComplete = useCallback((heroId: HeroId) => count(heroId) >= 5, [count]);
  const isUnlocked = useCallback(
    (heroId: HeroId) => {
      const i = HERO_ORDER.indexOf(heroId);
      return i === 0 || isComplete(HERO_ORDER[i - 1]);
    },
    [isComplete],
  );
  const allComplete = HERO_ORDER.every(isComplete);
  const totalDone = Object.keys(state.done).length;
  const nextHero = HERO_ORDER.find((h) => !isComplete(h)) ?? null;

  const activeDays = useMemo(() => {
    const days = Object.values(state.done).map((iso) => dayKey(new Date(iso)));
    Object.entries(state.checkins).forEach(([d, c]) => (c.morningCommitted || c.eveningSaved || (c.eveningCompleted?.length ?? 0) > 0) && days.push(d));
    return days;
  }, [state.done, state.checkins]);
  const streak = streakFrom(activeDays);

  const todayMicro = state.checkins[dayKey()]?.eveningCompleted ?? [];

  // AWorld-style points: actions, daily micro-habits, tier badges and the final superhero badge.
  const points = useMemo(() => {
    const micro = Object.values(state.checkins).reduce((a, c) => a + (c.eveningCompleted?.length ?? 0), 0);
    const tiers = HEROES.reduce((a, h) => a + TIERS.filter((t) => h.habits.filter((x) => state.done[x.id]).length >= t.need).length, 0);
    const quiz = Object.values(state.quizBest).reduce((a, n) => a + n * 15, 0);
    return totalDone * 20 + micro * 10 + tiers * 50 + quiz + (state.superheroAt ? 500 : 0);
  }, [state.done, state.checkins, state.superheroAt, state.quizBest, totalDone]);

  const saveProfile = useCallback(async (p: Profile) => {
    patch({ profile: p });
    await api('/api/me', 'PUT', { ...p, platform: platformName });
  }, [patch]);

  const takePledge = useCallback(async () => {
    patch({ pledgedAt: new Date().toISOString() });
    setCelebration({ kind: 'pledge' });
    await api('/api/pledge', 'POST');
  }, [patch]);

  const toggleHabit = useCallback((heroId: HeroId, habitId: string) => {
    const s = stateRef.current;
    const hero = heroById(heroId);
    const wasDone = !!s.done[habitId];
    const done = { ...s.done };
    if (wasDone) delete done[habitId];
    else done[habitId] = new Date().toISOString();

    const before = hero.habits.filter((h) => s.done[h.id]).length;
    const after = hero.habits.filter((h) => done[h.id]).length;
    const nowAll = HERO_ORDER.every((id) => heroById(id).habits.every((h) => done[h.id]));
    const becameSuper = !wasDone && nowAll && !s.superheroAt;
    const ns = { ...s, done, superheroAt: becameSuper ? new Date().toISOString() : s.superheroAt };
    stateRef.current = ns; // synchronous so several toggles in one tick compose
    setState(ns);
    api('/api/habits', 'POST', { habitId, done: !wasDone, superhero: becameSuper });

    if (wasDone) return;
    const crossed = TIERS.find((t) => before < t.need && after >= t.need);
    if (becameSuper) {
      notifyNow('🦸 NEW BADGE EARNED!', 'You are a Swachh Kal Superhero!');
      setCelebration({ kind: 'superhero' });
      setAskReview(!s.reviewed);
    } else if (after === 5) {
      notifyNow('🏆 HERO UNLOCKED!', `${hero.completeMessage}`);
      setCelebration({ kind: 'hero-complete', heroId });
      setAskReview(!s.reviewed);
    } else if (crossed) {
      notifyNow('🏅 NEW BADGE EARNED!', hero.tierMessages[crossed.id]);
      setCelebration({ kind: 'tier', heroId, tier: crossed.id });
    }
  }, []);

  const saveCheckin = useCallback(async (p: CheckIn) => {
    const key = dayKey();
    setState((s) => ({ ...s, checkins: { ...s.checkins, [key]: { ...s.checkins[key], ...p } } }));
    await api('/api/checkins', 'POST', { date: key, ...p });
  }, []);

  const toggleMicro = useCallback((id: string) => {
    const key = dayKey();
    const cur = stateRef.current.checkins[key]?.eveningCompleted ?? [];
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    const ns = { ...stateRef.current, checkins: { ...stateRef.current.checkins, [key]: { ...stateRef.current.checkins[key], eveningCompleted: next } } };
    stateRef.current = ns;
    setState(ns);
    api('/api/checkins', 'POST', { date: key, eveningCompleted: next });
  }, []);

  const acceptConsent = useCallback(async (guardian: boolean) => {
    patch({ consentAt: new Date().toISOString() });
    await api('/api/consent', 'POST', { version: '1', guardian });
  }, [patch]);

  const saveQuiz = useCallback((heroId: HeroId, correct: number) => {
    setState((s) => ({ ...s, quizBest: { ...s.quizBest, [heroId]: Math.max(s.quizBest[heroId] ?? 0, correct) } }));
  }, []);

  const deleteMyData = useCallback(async () => {
    await api('/api/me', 'DELETE');
    if (userId) await AsyncStorage.removeItem(`sk:${userId}`).catch(() => {});
    setState(EMPTY);
  }, [userId]);

  const markReviewed = useCallback(async (r: { heroRating: number; journeyRating: number; enjoyed: string[] }) => {
    patch({ reviewed: true });
    setAskReview(false);
    await api('/api/review', 'POST', r);
  }, [patch]);

  const startPledge365 = useCallback(async () => {
    patch({ pledge365Start: new Date().toISOString() });
    await api('/api/pledge365', 'POST');
  }, [patch]);

  const value: Ctx = {
    ...state,
    ready,
    celebration,
    dismissCelebration: () => setCelebration(null),
    showCelebration: setCelebration,
    askReview,
    dismissReview: () => setAskReview(false),
    saveProfile,
    takePledge,
    toggleHabit,
    saveCheckin,
    markReviewed,
    startPledge365,
    acceptConsent,
    saveQuiz,
    deleteMyData,
    count,
    tierOf,
    isUnlocked,
    isComplete,
    allComplete,
    totalDone,
    streak,
    nextHero,
    todayMicro,
    toggleMicro,
    points,
  };
  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export { HEROES };
