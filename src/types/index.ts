export const MOODS = ['calm', 'loud', 'warm', 'lonely', 'bright'] as const;
export type Mood = (typeof MOODS)[number];

export interface VibeImage {
  id: string;
  url: string;
  alt: string;
  mood: Mood;
}
