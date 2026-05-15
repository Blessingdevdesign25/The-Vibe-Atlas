export type Mood = 'calm' | 'loud' | 'warm' | 'lonely' | 'bright';

export interface VibeImage {
  id: string;
  url: string;
  alt: string;
  mood: Mood;
}
