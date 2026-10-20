import { HeroId } from './content';

export interface Bucket {
  id: string;
  label: string;
  sub?: string;
  color: string;
  emoji: string;
}
export interface QuizDef {
  title: string;
  question: string;
  buckets: Bucket[];
  items: { text: string; bucket: string }[];
}

/** "Sort it!" quizzes. Every item comes from the lists in the client's doc (bins, indoor/outdoor air, flood causes, tree facts). */
export const QUIZ: Record<HeroId, QuizDef> = {
  dharti: {
    title: 'Which bin?',
    question: 'Which bin does this go in?',
    buckets: [
      { id: 'green', label: 'Green bin', sub: 'Wet waste', color: '#2FBF4B', emoji: '🟢' },
      { id: 'blue', label: 'Blue bin', sub: 'Dry waste', color: '#3A7BFF', emoji: '🔵' },
      { id: 'red', label: 'Red bin', sub: 'Sanitary', color: '#E5484D', emoji: '🔴' },
      { id: 'black', label: 'Black bin', sub: 'Hazardous', color: '#3B3B4F', emoji: '⚫' },
    ],
    items: [
      { text: 'Food scraps', bucket: 'green' },
      { text: 'Vegetable and fruit peels', bucket: 'green' },
      { text: 'Flowers', bucket: 'green' },
      { text: 'Paper and cardboard', bucket: 'blue' },
      { text: 'Plastic bottles and wrappers', bucket: 'blue' },
      { text: 'Metal and glass', bucket: 'blue' },
      { text: 'Used tissues', bucket: 'red' },
      { text: 'Sanitary waste', bucket: 'red' },
      { text: 'Batteries', bucket: 'black' },
      { text: 'Expired medicines', bucket: 'black' },
      { text: 'Bulbs and tube lights', bucket: 'black' },
    ],
  },
  vayu: {
    title: 'Indoor or outdoor?',
    question: 'Where does this pollute the air?',
    buckets: [
      { id: 'indoor', label: 'Indoor air', sub: 'Inside our homes', color: '#FF9F1C', emoji: '🏠' },
      { id: 'outdoor', label: 'Outdoor air', sub: 'Outside', color: '#2BA8F5', emoji: '🌆' },
    ],
    items: [
      { text: 'Closed spaces with no fresh air', bucket: 'indoor' },
      { text: 'Smoke from incense, sprays, or cooking', bucket: 'indoor' },
      { text: 'Dust and poor ventilation', bucket: 'indoor' },
      { text: 'Vehicle smoke', bucket: 'outdoor' },
      { text: 'Burning waste', bucket: 'outdoor' },
      { text: 'Firecrackers', bucket: 'outdoor' },
      { text: 'Dust and construction', bucket: 'outdoor' },
    ],
  },
  jal: {
    title: 'Flood cause or flood fix?',
    question: 'Does this cause floods, or help stop them?',
    buckets: [
      { id: 'cause', label: 'Causes floods', sub: 'Oh no!', color: '#E5484D', emoji: '🌊' },
      { id: 'help', label: 'Helps stop floods', sub: 'Yay!', color: '#2FBF4B', emoji: '💪' },
    ],
    items: [
      { text: 'Plastic and waste blocking the drains', bucket: 'cause' },
      { text: 'Too much concrete on roads and buildings', bucket: 'cause' },
      { text: 'Fewer trees to soak up water', bucket: 'cause' },
      { text: 'Litter and garbage blocking water paths', bucket: 'cause' },
      { text: 'Not throwing waste on roads or into drains', bucket: 'help' },
      { text: 'Disposing of garbage properly', bucket: 'help' },
      { text: 'Keeping surroundings clean so water can flow freely', bucket: 'help' },
    ],
  },
  tarun: {
    title: 'Trees: give or do?',
    question: 'Is this what trees give us, or what we can do for trees?',
    buckets: [
      { id: 'give', label: 'Trees give us', sub: 'Their gifts', color: '#2FBF4B', emoji: '🎁' },
      { id: 'do', label: 'We can do', sub: 'Our action', color: '#7C4DFF', emoji: '🙌' },
    ],
    items: [
      { text: 'Help clean the air', bucket: 'give' },
      { text: 'Keep the surroundings cool', bucket: 'give' },
      { text: 'Provide homes for birds and animals', bucket: 'give' },
      { text: 'Take care of plants and trees around us', bucket: 'do' },
      { text: 'Do not damage or pluck plants unnecessarily', bucket: 'do' },
      { text: 'Use paper carefully and avoid waste', bucket: 'do' },
      { text: 'Encourage others to protect and grow trees', bucket: 'do' },
    ],
  },
};
