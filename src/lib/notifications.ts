import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
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
export async function setupNotifications() {
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
