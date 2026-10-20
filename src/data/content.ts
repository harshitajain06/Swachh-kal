import { Block, DOC } from './docContent';

export type HeroId = 'vayu' | 'tarun' | 'dharti' | 'jal';
export type Tier = 'bronze' | 'silver' | 'gold';

export interface Habit {
  id: string;
  tag: string; // Be Watchful ...
  text: string;
}

export interface Hero {
  id: HeroId;
  name: string;
  hindi: string;
  element: string;
  heroTitle: string; // Hawa Hero ...
  hindiTitle: string;
  emoji: string;
  colors: [string, string]; // gradient
  dark: string;
  soft: string;
  storyTitle: string;
  story: string[];
  habits: Habit[];
  tierMessages: Record<Tier, string>;
  facts: string[];
  sadFacts: string[];
  sdg: { title: string; url: string }[];
  goal: string;
  /** From the client's doc */
  fullStoryTitle: string;
  fullStory: string[];
  completeMessage: string;
  microHabits: Habit[];
  quickFacts: string[];
  explainer: Block[];
}

type Enriched = 'fullStoryTitle' | 'fullStory' | 'completeMessage' | 'microHabits' | 'quickFacts' | 'explainer';
const BASE_HEROES: Omit<Hero, Enriched>[] = [
  {
    id: 'vayu',
    name: 'Vayu',
    hindi: 'वायु',
    element: 'Air',
    heroTitle: 'Hawa Hero',
    hindiTitle: 'हवा हीरो',
    emoji: '💨',
    colors: ['#4FD8FF', '#2BA8F5'],
    dark: '#0E7FC4',
    soft: '#DDF5FF',
    goal: 'Protect Vayu',
    storyTitle: 'Meet Vayu',
    story: [
      'It’s me… Vayu. I am the air all around you.',
      'But something is wrong… I can’t breathe. Smoke from cars, burning trash, dust, and factory fumes are making me weak and polluted.',
      '“Why can’t I breathe properly?”',
      'I bring oxygen to your lungs. When I am clean, you breathe better and stay healthy.',
      'Just when I was losing hope, Hawa Hero came to my rescue! He taught people to reduce pollution, stop burning waste, and make cleaner choices.',
      'Now, together, we can help Vayu breathe again.',
    ],
    habits: [
      { id: 'vayu-1', tag: 'Be Watchful', text: 'See trash burning? Tell an adult and help stop the smoke.' },
      { id: 'vayu-2', tag: 'Be Conscious', text: 'Going nearby? Walk or share a ride to reduce pollution.' },
      { id: 'vayu-3', tag: 'Be Aware', text: 'During celebrations, skip firecrackers and stay away from smoke.' },
      { id: 'vayu-4', tag: 'Be Helpful', text: 'See dust rising? Sprinkle water with an adult to settle it.' },
      { id: 'vayu-5', tag: 'Be Prompt', text: 'In a parked vehicle with the engine on? Ask to switch it off.' },
    ],
    tierMessages: {
      bronze: 'Great start! You helped Vayu!',
      silver: 'Wow! Vayu is happier because of you!',
      gold: 'You did it! You’re a Vayu Protector!',
    },
    facts: [
      'Did you know you breathe in about 11,000 liters of air every single day? That is more air than all the water inside a massive swimming pool!',
      'When children breathe me in fresh and pure, I can make their lungs up to 10% to 15% stronger than if they were breathing in dirty, smoky air!',
      'I love seeing your classroom full of happy friends! When the air is clean, 20% to 30% fewer children fall sick.',
      'I am a true life-giver! Keeping me clean can actually give people living in heavily polluted areas up to 2 extra years or more.',
      'I am your study buddy! When the air is clean, your brain works better and students can score up to 6% higher on their tests!',
    ],
    sadFacts: [
      'I am fighting a really big battle right now. Many beautiful Indian cities have pollution levels that are 5 to 10 times higher than what the World Health Organization says is safe!',
      'It is a global emergency for my cloud kingdom. About 93% of all children across the planet have to breathe in dirty, polluted air every single day.',
      'When I am forced to carry bad chemicals, it hurts my breathing tubes. Children who breathe my polluted air face up to a 40% higher risk of getting asthma.',
      'In the most heavily polluted parts of India, poor air quality behaves like a sneak thief, stealing up to 5 years of life away from the people living there.',
      'When I get filled with dark, heavy smoke, it forces me to trap extra heat around the Earth like a giant, suffocating winter blanket, making your summer days way too hot!',
    ],
    sdg: [
      { title: '10 Things You Should Know About Air Pollution', url: 'https://www.unep.org/news-and-stories/story/10-things-you-should-know-about-air-pollution' },
      { title: 'International Day of Clean Air', url: 'https://www.un.org/en/observances/clean-air-day' },
      { title: 'Strengthening Capacities for Air Quality Management in India', url: 'https://www.unep.org/' },
    ],
  },
  {
    id: 'tarun',
    name: 'Tarun',
    hindi: 'तरुण',
    element: 'Trees',
    heroTitle: 'Pedh Rakshak',
    hindiTitle: 'पेड़ रक्षक',
    emoji: '🌳',
    colors: ['#7BE05A', '#2FBF4B'],
    dark: '#1B8A32',
    soft: '#E3F9D9',
    goal: 'Protect Tarun',
    storyTitle: 'Meet Tarun',
    story: [
      'Hi… I am Tarun. I am a young tree. I want to grow big, give you shade, and help keep the air clean.',
      'But something is wrong… I feel scared. Concrete, dust, pollution, and cutting down trees are making it difficult for my roots to grow.',
      '“Why can’t I grow?”',
      'I give you shade, clean air, and a cooler place to live.',
      'Just when I needed help, Pedh Rakshak came to my rescue! He taught people to protect trees, care for their roots, and give them space to grow.',
      'Now, I can grow strong and help our future grow too.',
    ],
    habits: [
      { id: 'tarun-1', tag: 'Be Watchful', text: 'See a small plant? Protect it with stones so no one steps on it.' },
      { id: 'tarun-2', tag: 'Be Conscious', text: 'Have leftover water? Pour it onto plants, not the ground.' },
      { id: 'tarun-3', tag: 'Be Aware', text: 'Spot waste near plants? Remove it to help them grow.' },
      { id: 'tarun-4', tag: 'Be Prompt', text: 'See a bent plant? Gently fix it and press the soil firm.' },
      { id: 'tarun-5', tag: 'Be Helpful', text: 'Use a bottle or container to grow your own plant.' },
    ],
    tierMessages: {
      bronze: 'Great start! You helped Tarun grow!',
      silver: 'Awesome! Tarun is growing stronger with you!',
      gold: 'You did it! You’re a Pedh Rakshak!',
    },
    facts: [
      'Just one large tree like me can create enough fresh oxygen every single day to support 2 humans so you can breathe easily!',
      'I am a natural, giant air conditioner! Neighborhoods packed with my leafy tree friends can be 2°C to 5°C cooler than hot, concrete places without any trees.',
      'I love snacking on greenhouse gases, locking away roughly 20 to 22 kg of bad carbon dioxide inside my wooden trunk every single year!',
      'I am a real-life rainmaker! My leaves release water vapor into the air to create rain clouds.',
      'I run the biggest, busiest neighborhood in the world! My forest kingdoms are the safe, happy homes for about 80% of all the animals and plants that live on land.',
    ],
    sadFacts: [
      'I am losing my family at a scary speed. Around 10 million hectares of forest are completely wiped out every single year across the world.',
      'That destruction is so incredibly fast that it equals losing about 27 whole football fields of trees every single minute!',
      'The planet’s shifting climate is playing tricks on nature, making dangerous forest fire seasons last about 2 months longer in several regions.',
      'Gassy pollution and dark smoke from cars and factories choke my system, damaging my green leaves and slowing down tree growth by up to 10%!',
      '80% of land animals live in trees. When trees are cut down, millions of animals lose their homes.',
    ],
    sdg: [
      { title: 'Inside the Global Effort to Save the World’s Forests', url: 'https://www.unep.org/news-and-stories/story/inside-global-effort-save-worlds-forests' },
      { title: 'Forests: A Natural Solution to Climate Change', url: 'https://www.un.org/en/climatechange/science/climate-issues/forests' },
      { title: 'State of the World’s Forests', url: 'https://www.fao.org/state-of-forests/en/' },
      { title: 'Goal 15 — Life on Land', url: 'https://sdgs.un.org/goals/goal15' },
    ],
  },
  {
    id: 'dharti',
    name: 'Dharti',
    hindi: 'धरती',
    element: 'Earth',
    heroTitle: 'Kachra Fighter',
    hindiTitle: 'कचरा फाइटर',
    emoji: '🌍',
    colors: ['#FFB547', '#FF8A1F'],
    dark: '#C25E00',
    soft: '#FFEACC',
    goal: 'Protect Dharti',
    storyTitle: 'Meet Dharti',
    story: [
      'It’s me… Dharti. I am the land beneath your feet. I give you food, homes, and a place to live.',
      'But something is very wrong… I am in pain. Plastic bags, bottles, wrappers, and waste are covering me.',
      'Plastic can break into tiny pieces called microplastics and stay in my soil for years.',
      '“Why is this happening to me?”',
      'Just when I thought I would be buried under waste, Kachra Fighter came to my rescue! He taught people to reduce waste, reuse what they can, and keep waste away from my soil.',
      'I take care of you. Now, together, let’s take care of Dharti.',
    ],
    habits: [
      { id: 'dharti-1', tag: 'Be Watchful', text: 'No dustbin nearby? Keep waste with you until you find one.' },
      { id: 'dharti-2', tag: 'Be Conscious', text: 'Carry your own spoon or tiffin, avoid disposables.' },
      { id: 'dharti-3', tag: 'Be Aware', text: 'Going shopping? Carry a cloth bag, skip plastic bags.' },
      { id: 'dharti-4', tag: 'Be Helpful', text: 'Spot litter? Pick up one piece and put it in a bin.' },
      { id: 'dharti-5', tag: 'Be Prompt', text: 'See mixed waste? Separate it before throwing.' },
    ],
    tierMessages: {
      bronze: 'Great start! You helped Dharti stay clean!',
      silver: 'Super work! You’re becoming a Kachra Fighter!',
      gold: 'Mission complete! You’re a Kachra Fighter!',
    },
    facts: [
      'I am the world’s greatest chef! Did you know that about 95% of all the delicious food you eat comes directly from my soil?',
      'I am full of billions of tiny natural underground helpers like worms and fungi who spend all day breaking down dead leaves and turning them into rich food for plants.',
      'I act like a giant, magical sponge! Healthy soil can hold up to 20 times its own weight in water, saving it deep underground so plants can easily survive hot, dry days.',
      'By practicing the 3 Rs — Reduce, Reuse, and Recycle — we can save millions of tons of garbage as the world currently creates over 2 billion tons of waste annually!',
      'I act like a warm, soft blanket that holds plant roots tightly in place, shielding them from extra heat, strong winds, and damage so they can stay upright and steady.',
    ],
    sadFacts: [
      'Humans produce a mind-blowing 353 million tons of plastic waste every single year, that is like filling thousands of garbage trucks to the brim every single day!',
      'Out of all that mountain of trash, a tiny 9% of plastic waste is actually recycled, while the rest is just burned, dumped, or left behind to choke the environment.',
      'Around 8 to 11 million tons of plastic leak into our beautiful oceans every single year, turning into dangerous traps that hurt fish, turtles, and seabirds.',
      'If we stand by and do nothing, plastic waste could skyrocket to about 1 billion tons per year by 2060, which is almost 3 times more than the amount we make today!',
      'Deep down where it is dark and quiet, scientists have found about 14 million tons of plastic sitting at the very bottom of the ocean.',
    ],
    sdg: [
      { title: 'Everything You Should Know About Microplastics', url: 'https://www.unep.org/plastic-pollution' },
      { title: 'Everything You Need to Know About Plastic Pollution', url: 'https://www.unep.org/plastic-pollution' },
      { title: 'How Data Is Helping Cities Counter Plastic Pollution', url: 'https://www.worldbank.org/en/publication/what-a-waste' },
      { title: 'The Waste Crisis: Accelerating National to Local Policy Action', url: 'https://www.unep.org/' },
    ],
  },
  {
    id: 'jal',
    name: 'Jal',
    hindi: 'जल',
    element: 'Water',
    heroTitle: 'Paani Protector',
    hindiTitle: 'पानी प्रोटेक्टर',
    emoji: '💧',
    colors: ['#6B8CFF', '#3A5BFF'],
    dark: '#2338C9',
    soft: '#E1E8FF',
    goal: 'Protect Jal',
    storyTitle: 'Meet Jal',
    story: [
      'Hi… I am Jal. I am water. I can be a raindrop, a river, a lake, or the water you drink every day.',
      'But something is very wrong… You can’t recognise me anymore. Waste, chemicals, oil, sewage, and plastic are making me dirty and toxic.',
      'I give life to people, animals, and plants. But when I become polluted, I can make them sick too.',
      'Just when I needed help, Paani Protector came to my rescue! He taught people to keep waste and chemicals out of my waters and use water wisely.',
      'Now, together, we can keep every drop of Jal clean.',
    ],
    habits: [
      { id: 'jal-1', tag: 'Be Watchful', text: 'Turn off taps tightly, no drops should fall.' },
      { id: 'jal-2', tag: 'Be Conscious', text: 'See a leaking tap? Inform an adult immediately.' },
      { id: 'jal-3', tag: 'Be Aware', text: 'Never throw waste, soap, plastic or oil into water.' },
      { id: 'jal-4', tag: 'Be Prompt', text: 'While brushing or washing, open taps only when needed.' },
      { id: 'jal-5', tag: 'Be Helpful', text: 'Reuse leftover water for plants or cleaning.' },
    ],
    tierMessages: {
      bronze: 'Great start! You helped Jal save water!',
      silver: 'Splash-tastic! Jal is smiling because of you!',
      gold: 'You did it! You’re a Paani Protector!',
    },
    facts: [
      'I am the biggest part of you! Did you know that about 60% of the entire human body is made up of water?',
      'I am a real-life doctor! Having access to safe drinking water can prevent many dangerous sicknesses and save millions of lives every single year.',
      'I am the ultimate farmer! Around 70% of all the Earth’s fresh water is used to water crops and grow the delicious food you eat every day.',
      'I run a massive underwater world! Millions of fish, birds, and aquatic animals rely completely on clean water habitats to swim, fly, and live happily.',
      'I am your body’s personal transport system, helping you digest your food and stay perfectly cool in the summer.',
    ],
    sadFacts: [
      'I am missing from so many homes right now — around 2 billion people across the world don’t have access to safe drinking water where they live.',
      'When my water gets dirty and contaminated, it spreads terrible diseases like cholera and diarrhea, which sadly leads to over 1 million deaths every year.',
      'A giant mountain of trash crashes into my waves all the time, as about 11 million tons of plastic leak straight into our global oceans every single year.',
      'Harsh chemicals and garbage dumped into rivers steal away the oxygen hidden in the water, making it impossible for fish and other underwater animals to breathe.',
      'The global water crisis is growing fast. Today, about 2.2 billion people around the world lack safely managed drinking water at home.',
    ],
    sdg: [
      { title: 'Global Water Shortages Are Looming', url: 'https://www.unwater.org/water-facts' },
      { title: '3 Billion People at Risk Due to Scarce Water-Quality Data', url: 'https://www.unep.org/' },
      { title: 'Countries Hunt for Novel Sources of Water', url: 'https://www.unwater.org/' },
      { title: 'Goal 6 — Clean Water and Sanitation', url: 'https://sdgs.un.org/goals/goal6' },
    ],
  },
];

// Merge in the long-form content from the client's Google Doc.
export const HEROES: Hero[] = BASE_HEROES.map((h) => {
  const d = DOC[h.id];
  return {
    ...h,
    fullStoryTitle: d.storyTitle,
    fullStory: d.storyLines,
    completeMessage: d.completeMessage,
    microHabits: d.microHabits.map((text, i) => ({ id: `${h.id}-m${i + 1}`, tag: `Habit ${i + 1}`, text })),
    quickFacts: d.quickFacts,
    explainer: d.explainer,
    sdg: d.articles,
  };
});

export const HERO_ORDER: HeroId[] = ['vayu', 'tarun', 'dharti', 'jal'];
export const heroById = (id: HeroId) => HEROES.find((h) => h.id === id)!;

export const TIERS: { id: Tier; label: string; need: number; emoji: string; color: string }[] = [
  { id: 'bronze', label: 'Bronze', need: 2, emoji: '🥉', color: '#D98A4A' },
  { id: 'silver', label: 'Silver', need: 4, emoji: '🥈', color: '#AEB8C8' },
  { id: 'gold', label: 'Gold', need: 5, emoji: '🥇', color: '#FFC107' },
];

export const ROLES = [
  { id: 'student', label: 'Student', emoji: '🎒' },
  { id: 'teacher', label: 'Teacher', emoji: '🍎' },
  { id: 'parent', label: 'Parent', emoji: '👨‍👩‍👧' },
  { id: 'professional', label: 'Working Professional', emoji: '💼' },
  { id: 'housekeeper', label: 'Housekeeper / Domestic Worker', emoji: '🏠' },
  { id: 'government', label: 'Government / Public Sector Worker', emoji: '🏛️' },
  { id: 'retired', label: 'Retired', emoji: '🌅' },
  { id: 'other', label: 'Other', emoji: '✨' },
];

export const GENDERS = [
  { id: 'girl', label: 'Girl / Woman', emoji: '👧' },
  { id: 'boy', label: 'Boy / Man', emoji: '👦' },
  { id: 'other', label: 'Other', emoji: '🌈' },
  { id: 'skip', label: 'Prefer not to say', emoji: '🤐' },
];

export const BOOKLET_URL = 'https://drive.google.com/file/d/1LZGynVx23psHWs-rRPPx1Dkpby4BtCm0/view?usp=sharing';

export const BOOKLET_INSIDE = [
  { heroId: 'vayu' as HeroId, text: 'Learn about air pollution through facts and Hawa Hero Actions.' },
  { heroId: 'tarun' as HeroId, text: 'Discover biodiversity, explore a mini herb garden, and take Pedh Rakshak Actions.' },
  { heroId: 'dharti' as HeroId, text: 'Understand waste, take on Kachra Fighter Actions, and learn the MCD 4-Bin System.' },
  { heroId: 'jal' as HeroId, text: 'Explore water conservation through facts and Paani Protector Actions.' },
];

export const ABOUT_TEXT = [
  'Swachh Kal – Aaj Aapka Kal Hai, founded by Mehr Dhawan, is a student-driven sustainability initiative built on a simple idea: awareness alone doesn’t drive change; decision-making and habit formation do.',
  'As part of Swachh Kal, Mehr developed the Swachh Kal App, a behavioral-science-based platform designed for children in Delhi NCR. The app is structured around four pillars: Vayu (Air), Tarun (Trees & Biodiversity), Dharti (Waste Management), and Jal (Water Conservation).',
  'Rather than simply providing information, the app uses gamification, micro-habits, and rewards to translate environmental awareness into action. Users engage with four characters, explore real-world facts and dilemmas, and access SDG-linked articles across each theme, while completing small, achievable habits that reinforce sustainable behaviors.',
  'Drawing on behavioral science principles such as habit stacking, positive reinforcement, and incremental goal-setting, Swachh Kal makes sustainability interactive, helping children move from knowing about environmental problems to building sustainable choices into everyday life.',
];

export const PLEDGE_TEXT = 'I pledge to make better choices every day and do my part to keep our world clean, healthy, and green.';

export const MESSAGES = {
  before: ['Something new is coming…', 'A new challenge awaits!', 'Your Hero’s journey continues…', 'Who’s waiting for your help?', 'Ready to discover your next power?'],
  complete: ['BOOM! Mission complete!', 'You did it!', 'Hero level up!', 'Super job, Hero!', 'That was AWESOME!'],
  unlock: ['HERO UNLOCKED!', 'NEW POWER UNLOCKED!', 'NEW CHALLENGE!', 'LEVEL UP!', 'NEW BADGE EARNED!'],
};

export const TRANSITIONS: Record<string, { done: string; next: string }> = {
  vayu: { done: 'You unlocked Tarun! Let’s grow some green magic!', next: 'NEW MISSION UNLOCKED: Help Tarun grow!' },
  tarun: { done: 'TARUN MISSION COMPLETE! You’re on a roll!', next: 'NEW MISSION UNLOCKED: Team Dharti needs you!' },
  dharti: { done: 'DHARTI MISSION COMPLETE! What a Hero!', next: 'NEW LEVEL UNLOCKED: Jal needs your superpowers!' },
  jal: { done: 'JAL MISSION COMPLETE! You did all four!', next: 'You are a Swachh Kal Superhero!' },
};

export const HOW_IT_WORKS = [
  { icon: '✅', text: 'Complete habits to help your Hero.' },
  { icon: '🥉', text: 'Complete 2 habits → Unlock Bronze!' },
  { icon: '🥈', text: 'Complete 4 habits → Unlock Silver!' },
  { icon: '🥇', text: 'Complete all 5 habits → Unlock Gold!' },
  { icon: '🔓', text: 'Finish your Hero mission → Unlock your next Hero!' },
  { icon: '🦸', text: 'Complete all 4 Hero missions → Become a Swachh Kal Superhero!' },
];

export const PLEDGE_365 = {
  title: 'Swachh Kal 365-Day Pledge',
  intro: 'One small habit a day. 365 days. One cleaner tomorrow.',
  // Placeholder cycle — final 365-day content is still to be drafted with the client (see handover notes).
  months: [
    'Month 1 · Notice — spot what hurts our planet',
    'Month 2 · Choose — make the better choice',
    'Month 3 · Share — bring a friend along',
    'Month 4 · Repeat — turn habits into routine',
  ],
};
