export const colors = {
  bg: '#FFF4D6',
  card: '#FFFFFF',
  ink: '#2B2350',
  inkSoft: '#6B6490',
  brand: '#7C4DFF',
  brandDark: '#5B2FE0',
  pink: '#FF5CA8',
  sun: '#FFC93C',
  mint: '#2ED9A0',
  white: '#FFFFFF',
  line: '#EFE6C9',
  bronze: '#D98A4A',
  silver: '#AEB8C8',
  gold: '#FFC107',
};

export const fonts = {
  display: 'Baloo2_800ExtraBold',
  displayMed: 'Baloo2_600SemiBold',
  body: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_800ExtraBold',
  bodyReg: 'Nunito_400Regular',
};

export const radius = { sm: 14, md: 22, lg: 30, pill: 999 };

export const shadow = {
  shadowColor: '#2B2350',
  shadowOpacity: 0.16,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 8 },
  elevation: 6,
};

/** Linear blend of two #rrggbb colours (t=0 -> a, t=1 -> b). */
export function mix(a: string, b: string, t: number): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [ar, ag, ab] = p(a);
  const [br, bg, bb] = p(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * Math.max(0, Math.min(1, t)));
  return `#${[c(ar, br), c(ag, bg), c(ab, bb)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** "Smog" grey a theme starts in, before the child helps the hero. */
export const SMOG: [string, string] = ['#B3B8BE', '#868D95'];

/** Stage 1 smoky (0-1 actions) -> Stage 2 clearing (2-4) -> Stage 3 clean (5). */
export const stageOf = (actions: number): 1 | 2 | 3 => (actions >= 5 ? 3 : actions >= 2 ? 2 : 1);
export const STAGE_LABEL = { 1: 'Smoky', 2: 'Clearing', 3: 'Clean & colourful!' } as const;
