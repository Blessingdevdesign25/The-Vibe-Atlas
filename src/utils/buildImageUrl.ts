import type { Mood } from '../types/index';

const moodKeywords: Record<Mood, string[]> = {
  calm: ['nature', 'minimal', 'sea', 'clouds', 'zen'],
  loud: ['neon', 'glitch', 'vibrant', 'abstract', 'maximalist'],
  warm: ['sunset', 'golden', 'autumn', 'fire', 'cozy'],
  lonely: ['empty', 'fog', 'solitude', 'rain', 'void'],
  bright: ['sun', 'vivid', 'daylight', 'yellow', 'high-key'],
};

export const buildImageUrl = (mood: Mood, index: number): string => {
  const keywords = moodKeywords[mood];
  const keyword = keywords[index % keywords.length];
  // Using LoremFlickr for reliable keyword-based random images
  // Adding a timestamp and index to the URL to ensure uniqueness and prevent caching issues
  const randomSeed = Math.floor(Math.random() * 1000) + index;
  return `https://loremflickr.com/800/800/${keyword}?lock=${randomSeed}`;
};
