import { useCallback } from 'react';

export const useEmotionDetection = () => {
  const detectEmotions = useCallback(async (video: HTMLVideoElement | null) => {
    // The actual emotion detection is now handled by the Python backend
    return null;
  }, []);

  return { detectEmotions, isModelLoading: false };
};