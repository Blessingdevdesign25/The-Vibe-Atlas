import { useState, useCallback, useRef } from 'react';
import type { Mood, VibeImage } from '../types/index';
import { buildImageUrl } from '../utils/buildImageUrl';

export const useVibeImages = () => {
  const [images, setImages] = useState<VibeImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const currentMoodRef = useRef<Mood | null>(null);

  const fetchImages = useCallback(async (mood: Mood) => {
    // Dedup logic: Don't fetch if already fetching the same mood
    if (loading && currentMoodRef.current === mood) return;

    setLoading(true);
    setError(null);
    currentMoodRef.current = mood;

    try {
      // Simulate network delay for premium feel (skeletons)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newImages: VibeImage[] = Array.from({ length: 5 }).map((_, i) => ({
        id: `${mood}-${i}-${Date.now()}`,
        url: buildImageUrl(mood, i),
        alt: `${mood} aesthetic image ${i + 1}`,
        mood,
      }));

      // Pre-load images to ensure they show up together smoothly
      await Promise.all(
        newImages.map(
          (img) =>
            new Promise((resolve, reject) => {
              const image = new Image();
              image.src = img.url;
              image.onload = resolve;
              image.onerror = reject;
            })
        )
      );

      setImages(newImages);
    } catch (err) {
      setError('Failed to pull the vibes. The web is a bit shy today.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { images, loading, error, fetchImages };
};
