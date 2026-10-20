import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { HEROES, HeroId } from '../data/content';
import { api } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Registers for remote push (server-driven reminders) and sets the two fixed daily local check-in alarms. */
export async function setupNotifications(unlocked: HeroId[] = ['vayu']) {
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
    await scheduleFacts(unlocked);

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

/** Immediate celebration notification for a milestone (doc: "User reaches milestone → immediate celebration notification"). */
export async function notifyNow(title: string, body: string) {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return;
    await Notifications.scheduleNotificationAsync({ content: { title, body, data: { screen: 'home' } }, trigger: null });
  } catch {}
}
