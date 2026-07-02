import { useState, useRef, useCallback, useEffect } from 'react';
import type { ExecutiveVoice } from '@/data/academyData';
import { supabase } from '@/integrations/supabase/client';

async function getAuthToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string);
}



interface UseElevenLabsTTSOptions {
  voice?: ExecutiveVoice;
  brand?: string;
  onEnd?: () => void;
}

// In-memory cache so the same text isn't re-fetched during the session
const audioCache = new Map<string, string>();

// Global audio element — survives component unmounts / navigation
let globalAudio: HTMLAudioElement | null = null;
let globalAudioKey: string | null = null;

export function useElevenLabsTTS({ voice, brand, onEnd }: UseElevenLabsTTSOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(() => {
    // Restore playing state if global audio is already running for this voice
    const key = `${voice || 'default'}::${brand || ''}`;
    return globalAudio !== null && globalAudioKey === key && !globalAudio.paused;
  });
  const [error, setError] = useState<string | null>(null);
  const fetchAbortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const instanceKeyRef = useRef(`${voice || 'default'}::${brand || ''}`);

  // Sync playing state with global audio on mount & via timeupdate
  useEffect(() => {
    const key = instanceKeyRef.current;
    if (globalAudio && globalAudioKey === key) {
      setPlaying(!globalAudio.paused);

      const handlePlay = () => setPlaying(true);
      const handlePause = () => setPlaying(false);
      const handleEnded = () => {
        setPlaying(false);
        onEnd?.();
      };

      globalAudio.addEventListener('play', handlePlay);
      globalAudio.addEventListener('pause', handlePause);
      globalAudio.addEventListener('ended', handleEnded);

      return () => {
        if (globalAudio) {
          globalAudio.removeEventListener('play', handlePlay);
          globalAudio.removeEventListener('pause', handlePause);
          globalAudio.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [onEnd]);

  const stop = useCallback(() => {
    requestIdRef.current += 1;
    fetchAbortRef.current?.abort();
    fetchAbortRef.current = null;
    if (globalAudio && globalAudioKey === instanceKeyRef.current) {
      globalAudio.pause();
      globalAudio.currentTime = 0;
      globalAudio = null;
      globalAudioKey = null;
    }
    setLoading(false);
    setPlaying(false);
  }, []);

  const pause = useCallback(() => {
    if (globalAudio && globalAudioKey === instanceKeyRef.current) {
      globalAudio.pause();
    }
    setPlaying(false);
  }, []);

  const resume = useCallback(() => {
    if (globalAudio && globalAudioKey === instanceKeyRef.current && globalAudio.src) {
      globalAudio.play().catch(() => {});
      setPlaying(true);
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    // Stop any currently playing audio
    if (globalAudio) {
      globalAudio.pause();
      globalAudio.currentTime = 0;
    }

    setError(null);
    const requestId = ++requestIdRef.current;
    const cacheKey = `${voice || 'default'}::${text.slice(0, 200)}`;
    let audioUrl = audioCache.get(cacheKey);

    if (!audioUrl) {
      const abortController = new AbortController();
      fetchAbortRef.current = abortController;
      setLoading(true);

      const maxAttempts = 3;
      let lastErr: unknown = null;
      try {
        const accessToken = await getAuthToken();
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ text, voice: voice || 'default', brand: brand || undefined }),
                signal: abortController.signal,
              }
            );


            if (!response.ok) {
              const errData = await response.json().catch(() => ({ error: 'TTS request failed' }));
              throw new Error(errData.error || `TTS failed: ${response.status}`);
            }

            const blob = await response.blob();
            if (!blob.size) throw new Error('Empty audio response');
            audioUrl = URL.createObjectURL(blob);
            audioCache.set(cacheKey, audioUrl);
            lastErr = null;
            break;
          } catch (e) {
            if (e instanceof DOMException && e.name === 'AbortError') throw e;
            lastErr = e;
            if (requestIdRef.current !== requestId) throw e;
            if (attempt < maxAttempts) {
              await new Promise(r => setTimeout(r, 400 * attempt));
            }
          }
        }
        if (lastErr) throw lastErr;
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        const msg = e instanceof Error ? e.message : 'TTS failed';
        setError(msg);
        console.error('ElevenLabs TTS error:', msg);
        return;
      } finally {
        if (fetchAbortRef.current === abortController) fetchAbortRef.current = null;
        if (requestIdRef.current === requestId) setLoading(false);
      }
    }

    if (!audioUrl || requestIdRef.current !== requestId) return;

    const audio = new Audio(audioUrl);
    globalAudio = audio;
    globalAudioKey = instanceKeyRef.current;

    audio.onended = () => {
      setPlaying(false);
      onEnd?.();
    };
    audio.onerror = () => {
      setPlaying(false);
      setError('Audio playback failed');
    };

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setError('Audio playback blocked by browser');
    }
  }, [voice, brand, onEnd]);

  const setMuted = useCallback((muted: boolean) => {
    if (globalAudio && globalAudioKey === instanceKeyRef.current) {
      globalAudio.muted = muted;
    }
  }, []);

  const seek = useCallback((fraction: number) => {
    if (globalAudio && globalAudioKey === instanceKeyRef.current && globalAudio.duration) {
      globalAudio.currentTime = fraction * globalAudio.duration;
    }
  }, []);

  const getCurrentTime = useCallback((): number => {
    if (globalAudio && globalAudioKey === instanceKeyRef.current) {
      return globalAudio.currentTime;
    }
    return 0;
  }, []);

  const getDuration = useCallback((): number => {
    if (globalAudio && globalAudioKey === instanceKeyRef.current && globalAudio.duration && isFinite(globalAudio.duration)) {
      return globalAudio.duration;
    }
    return 0;
  }, []);

  const preload = useCallback(async (texts: string[]) => {
    const accessToken = await getAuthToken();
    const fetchOne = async (text: string) => {
      const cacheKey = `${voice || 'default'}::${text.slice(0, 200)}`;
      if (audioCache.has(cacheKey)) return;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ text, voice: voice || 'default', brand: brand || undefined }),
            }
          );

          if (!response.ok) throw new Error(`Preload failed: ${response.status}`);
          const blob = await response.blob();
          if (!blob.size) throw new Error('Empty audio');
          audioCache.set(cacheKey, URL.createObjectURL(blob));
          return;
        } catch (err) {
          if (attempt === 3) console.warn('Preload exhausted retries:', err);
          else await new Promise(r => setTimeout(r, 400 * attempt));
        }
      }
    };
    // Fire all in parallel; ignore individual failures (speak() will retry on demand).
    await Promise.allSettled(texts.map(fetchOne));
  }, [voice, brand]);

  return { speak, stop, pause, resume, setMuted, seek, getCurrentTime, getDuration, preload, loading, playing, error };
}
