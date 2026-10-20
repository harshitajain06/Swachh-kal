import Constants from 'expo-constants';
import { Platform } from 'react-native';

const BASE: string =
  process.env.EXPO_PUBLIC_API_URL || (Constants.expoConfig?.extra as any)?.apiUrl || 'http://localhost:4000';

type TokenGetter = () => Promise<string | null>;
let getToken: TokenGetter = async () => null;
export const setTokenGetter = (fn: TokenGetter) => {
  getToken = fn;
};

/** Best-effort request. The app works offline-first; failures are swallowed so kids never see an error. */
export async function api<T = any>(path: string, method = 'GET', body?: unknown): Promise<T | null> {
  try {
    const token = await getToken();
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const platformName = Platform.OS;
