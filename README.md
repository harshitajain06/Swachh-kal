# Swachh Kal — आज आपका कल है

Expo (SDK 58) + Expo Router + Reanimated 4 + Clerk auth, with an Express API on MongoDB Atlas (`server/`).

## Run it

1. **Clerk**: create an app at clerk.com, enable *Email* and *Google*. Copy the publishable + secret keys.
2. **Atlas**: Connect → Drivers → copy the connection string. Allow your IP under Network Access.
3. API:
   ```bash
   cd server && cp .env.example .env   # fill MONGODB_URI, CLERK_*  keys
   npm start
   ```
4. App:
   ```bash
   cp .env.example .env                # EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY, EXPO_PUBLIC_API_URL
   npx expo start
   ```
   On a real phone set `EXPO_PUBLIC_API_URL` to your computer's LAN IP (not localhost).
   Google sign-in and push notifications need a development build (`npx expo run:ios|android`), not Expo Go.

## Where the spec items live

| Spec item | Where |
|---|---|
| Country/city, I am a…, gender | `src/app/onboarding.tsx` |
| About the app, logo | `src/app/about.tsx` |
| Pledge + hand + trophy | `src/app/pledge.tsx`, `src/components/CelebrationHost.tsx` |
| 4 animated heroes, badges | `src/components/Character.tsx`, `Badge.tsx` |
| Bronze/Silver/Gold, 4 circles, golden badge | `src/lib/game.tsx`, `(tabs)/badges.tsx` |
| Unlock messages, transitions | `src/data/content.ts` (`MESSAGES`, `TRANSITIONS`) |
| Booklet, how-it-works, 365-day pledge + certificate | `(tabs)/learn.tsx`, `rewards.tsx`, `certificate.tsx` |
| Morning/evening check-in | `checkin.tsx` |
| In-app review | `review.tsx` (shown after Gold / hero complete / superhero) |
| Push notifications | `src/lib/notifications.ts`, `server/src/push.js` |
| Time-spent tracking | `src/lib/engagement.ts` → `/api/engagement` |
| Deleted / inactive users, admin access | `server/src/index.js` `/api/admin/*` (set `ADMIN_USER_IDS`) |

## Open items to confirm with the client
- Character PNGs (Vayu/Tarun/Dharti/Jal), logo and level badge images weren't in the folder, so heroes are drawn in SVG. Drop in the PNGs via `HERO_IMAGES` in `Character.tsx`.
- SDG article URLs in `content.ts` are placeholders — the doc only lists titles.
- 365-day pledge daily content is still to be drafted (spec says so).
- "Swachh Hero" name: the spec asks to check an alternative name.
- Apps can't see uninstalls directly. We infer them from Expo push receipts (`DeviceNotRegistered`); "downloaded, never signed up" comes from the anonymous `/api/device` ping.
