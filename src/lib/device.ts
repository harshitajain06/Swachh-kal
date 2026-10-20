import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, platformName } from './api';

/** Anonymous install ping so we can count "downloaded but never signed up" users. No personal data. */
export async function registerDevice() {
  try {
    let id = await AsyncStorage.getItem('sk:deviceId');
    if (!id) {
      id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      await AsyncStorage.setItem('sk:deviceId', id);
    }
    await api('/api/device', 'POST', { deviceId: id, platform: platformName });
  } catch {}
}
