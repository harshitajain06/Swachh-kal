import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { HEROES, HeroId, heroById } from '../data/content';
import { api } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** What the reminder copy depends on; rebuilt from game state whenever it changes. */
export interface ReminderContext {
  unlocked: HeroId[];
  /** First hero the child has not finished yet (null once every hero is complete). */
  activeHero: HeroId | null;
  /** Habits completed so far for the active hero (0–5). */
  activeHeroDone: number;
  streak: number;
  /** A habit was completed today. */
  habitToday: boolean;
  /** Any activity today (habit or check-in); keeps the streak alive. */
  activeToday: boolean;
}

/** Registers for remote push (server-driven reminders) and rebuilds the local reminder schedule. */
export async function setupNotifications(ctx: ReminderContext = { unlocked: ['vayu'], activeHero: 'vayu', activeHeroDone: 0, streak: 0, habitToday: false, activeToday: false }) {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Hero reminders',
        importance: Notifications.AndroidImportance.HIGH,
        lightColor: '#7C4DFF',
      });
    }
    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') status = (await Notifications.requestPermissionsAsync()).status;
    if (status !== 'granted') return;

    await scheduleDailyCheckins();
    await scheduleFacts(ctx.unlocked);
    await scheduleHabitReminders(ctx);
    await scheduleStreakReminder(ctx);

    const projectId = (Constants.expoConfig?.extra as any)?.eas?.projectId ?? Constants.easConfig?.projectId;
    if (projectId) {
      const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      await api('/api/push-token', 'POST', { token });
    }
  } catch {
    // Push is optional (Expo Go on some platforms, simulators…)
  }
}

async function scheduleDailyCheckins() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: { title: '☀️ Good morning, Hero!', body: 'Ready to make a promise to the planet today?', data: { screen: 'checkin' } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 8, minute: 0 },
  });
  await Notifications.scheduleNotificationAsync({
    content: { title: '🌙 Evening check-in', body: 'How many heroic habits did you do today?', data: { screen: 'checkin' } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 18, minute: 0 },
  });
}

/** One quick fact a day at 1 PM for the next 7 days, rotating through the heroes the child has unlocked (doc: max 1-2 fact notifications/day). */
async function scheduleFacts(unlocked: HeroId[]) {
  const pool = HEROES.filter((h) => unlocked.includes(h.id));
  for (let d = 1; d <= 7; d++) {
    const hero = pool[d % pool.length];
    const fact = hero.quickFacts[(d * 3) % hero.quickFacts.length];
    const when = new Date();
    when.setDate(when.getDate() + d);
    when.setHours(13, 0, 0, 0);
    await Notifications.scheduleNotificationAsync({
      content: { title: `${hero.emoji} Did you know?`, body: fact, data: { screen: 'home' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when },
    });
  }
}

const THEMES: Record<HeroId, string> = { vayu: 'clean-air', tarun: 'plant-care', dharti: 'waste-care', jal: 'water-saving' };

/** The next time the clock hits hour:minute, today if still ahead, otherwise tomorrow. */
function nextAt(hour: number, minute: number, daysAhead = 0) {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  if (daysAhead) d.setDate(d.getDate() + daysAhead);
  else if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
  return d;
}

function at(date: Date) {
  return { type: Notifications.SchedulableTriggerInputTypes.DATE, date } as const;
}

/** a. Daily habit reminder (4 PM, skipped today once a habit is done) and c. incomplete-habit nudge (5:15 PM). */
async function scheduleHabitReminders(ctx: ReminderContext) {
  if (!ctx.activeHero) return;
  const c = reminderContent(ctx);
  for (let d = ctx.habitToday ? 1 : 0; d < 7; d++) {
    const when = nextAt(16, 0, d);
    if (d === 0 && when.getDate() !== new Date().getDate()) continue; // 4 PM already passed today
    await Notifications.scheduleNotificationAsync({ content: c.habit!, trigger: at(when) });
  }
  if (c.incomplete) await Notifications.scheduleNotificationAsync({ content: c.incomplete, trigger: at(nextAt(17, 15)) });
}

/** Copy for each reminder type; null where the child's state means that reminder doesn't apply. */
function reminderContent(ctx: ReminderContext) {
  const hero = ctx.activeHero ? heroById(ctx.activeHero) : null;
  const data = { screen: 'hero', heroId: hero?.id };
  const left = 5 - ctx.activeHeroDone;
  return {
    habit: hero ? { title: `${hero.name} needs you!`, body: `Have you completed your ${THEMES[hero.id]} habit today?`, data } : null,
    incomplete:
      hero && ctx.activeHeroDone > 0 && left > 0
        ? {
            title: `${hero.name} is waiting!`,
            body: left === 1 ? 'You’re just one habit away from completing today’s challenge.' : `You’re just ${left} habits away from completing ${hero.name}’s challenge.`,
            data,
          }
        : null,
    streak: ctx.streak >= 1 ? { title: `${ctx.streak}-day streak!`, body: 'Keep going—you’re one step closer to your next badge!', data: { screen: 'home' } } : null,
  };
}

/** b. Streak reminder at 7:30 PM, only for children who already have a streak to protect. */
async function scheduleStreakReminder(ctx: ReminderContext) {
  const { streak } = reminderContent(ctx);
  if (!streak) return;
  await Notifications.scheduleNotificationAsync({ content: streak, trigger: at(nextAt(19, 30, ctx.activeToday ? 1 : 0)) });
}

/** Immediate celebration notification for a milestone (doc: "User reaches milestone → immediate celebration notification"). */
export async function notifyNow(title: string, body: string) {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;
    await Notifications.scheduleNotificationAsync({ content: { title, body, data: { screen: 'home' } }, trigger: null });
  } catch {}
}

const COME_BACK = { title: 'Your Hero journey is waiting!', body: 'Come back and continue where you left off.', data: { screen: 'home' } };

/** Dev-only: fires every reminder type a few seconds apart, using the child's real state (streak shown as at least 3 if none).
 *  The come-back message normally comes from the server push, so it is included here just to preview it. */
export async function testReminders(ctx: ReminderContext) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;
  const c = reminderContent({ ...ctx, streak: Math.max(ctx.streak, 3), activeHeroDone: Math.max(ctx.activeHeroDone, 4) });
  const list = [c.habit, c.streak, c.incomplete, COME_BACK].filter(Boolean) as NonNullable<typeof c.habit>[];
  for (let i = 0; i < list.length; i++) {
    await Notifications.scheduleNotificationAsync({
      content: list[i],
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5 + i * 6 },
    });
  }
  return true;
}
