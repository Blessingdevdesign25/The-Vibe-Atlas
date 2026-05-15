import { useState, useCallback, useRef } from 'react';
import type { Mood, VibeImage } from '../types/index';
import { buildImageUrl } from '../utils/buildImageUrl';

export const useVibeImages = () => {
  const [images, setImages] = useState<VibeImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const currentMoodRef = useRef<Mood | null>(null);
  const requestIdRef = useRef<number>(0);

  const fetchImages = useCallback(async (mood: Mood) => {
    // Dedup logic: Don't fetch if already fetching the same mood
    if (loading && currentMoodRef.current === mood) return;

    const requestId = Date.now();
    requestIdRef.current = requestId;

    setLoading(true);
    setError(null);
    currentMoodRef.current = mood;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // If a newer request started while we were waiting, abort this one
      if (requestIdRef.current !== requestId) return;

      const newImages: VibeImage[] = Array.from({ length: 5 }).map((_, i) => ({
        id: `${mood}-${i}-${Date.now()}`,
        url: buildImageUrl(mood, i),
        alt: `${mood} aesthetic image ${i + 1}`,
        mood,
      }));

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

      // Final check before updating state
      if (requestIdRef.current === requestId) {
        setImages(newImages);
      }
    } catch (err) {
      if (requestIdRef.current === requestId) {
        setError('Failed to pull the vibes. The web is a bit shy today.');
      }
      console.error(err);
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [loading]);

  return { images, loading, error, fetchImages };
};
