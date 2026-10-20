import { HeroId, Tier } from './content';

/** Artwork supplied by the client (Google Doc links). */
export const LOGO = require('../../assets/art/logo.png');

/** The heroes in their "problem" state — used as the story illustrations. */
export const HERO_SCENE: Record<HeroId, any> = {
  vayu: require('../../assets/art/vayu.png'),
  tarun: require('../../assets/art/tarun.png'),
  dharti: require('../../assets/art/dharti.png'),
  jal: require('../../assets/art/jal.png'),
};

/** Level 1/2/3 badges (Bronze/Silver/Gold ladder) and the final Swachh Kal badge. */
export const LEVEL_BADGE: Record<Tier, any> = {
  bronze: require('../../assets/art/level1.jpg'),
  silver: require('../../assets/art/level2.jpg'),
  gold: require('../../assets/art/level3.jpg'),
};
export const ULTIMATE_BADGE = require('../../assets/art/ultimate.jpg');
