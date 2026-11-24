/**
 * Action Hub content. The calendar, videos, podcasts and clubs are filled in by the Swachh Kal team:
 * add entries below and they appear in the app. Empty lists show a friendly "coming soon" card.
 */
export type RequestKind = 'blue-bin' | 'dustbin' | 'leaking-tap' | 'tree-guard' | 'other';

export const REQUEST_KINDS: { id: RequestKind; label: string; emoji: string }[] = [
  { id: 'blue-bin', label: 'Blue bin (dry waste)', emoji: '🟦' },
  { id: 'dustbin', label: 'A dustbin', emoji: '🗑️' },
  { id: 'leaking-tap', label: 'Fix a leaking tap', emoji: '🚰' },
  { id: 'tree-guard', label: 'Protect a tree or plant', emoji: '🌳' },
  { id: 'other', label: 'Something else', emoji: '✨' },
];

export interface HubEvent {
  /** ISO date, e.g. '2026-12-05'. */
  date: string;
  title: string;
  where: string;
  url?: string;
}
export interface HubMedia {
  title: string;
  by: string;
  url: string;
}
export interface HubClub {
  name: string;
  about: string;
  url: string;
}

/** Delhi Government / MCD drives, e.g. plantation drives. Add real, confirmed dates only. */
export const ACTION_CALENDAR: HubEvent[] = [];

/** Expert-led videos on waste cycles and resource management. */
export const PRO_VIDEOS: HubMedia[] = [];

/** Master-class podcasts with professionals. */
export const PODCASTS: HubMedia[] = [];

export const CLUBS: HubClub[] = [
  { name: 'Delhi Greens', about: 'Find out how to get involved in greening Delhi.', url: 'https://delhigreens.org/get-involved/' },
];
