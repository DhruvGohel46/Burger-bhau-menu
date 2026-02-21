import { useEffect, useRef, useState } from 'react';

interface HorrorSoundOptions {
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
}

export const useHorrorSound = (soundPath: string, options: HorrorSoundOptions = {}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const {
    volume = 0.3,
    loop = true,
    autoplay = false
  } = options;

  useEffect(() => {
    // Create audio element
    const audio = new Audio(soundPath);
    audio.volume = volume;
    audio.loop = loop;
    
    const handleCanPlay = () => {
      setIsLoaded(true);
      if (autoplay) {
        audio.play().catch(err => {
          console.log('Autoplay prevented:', err);
        });
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [soundPath, volume, loop, autoplay]);

  const play = () => {
    if (audioRef.current && isLoaded) {
      audioRef.current.play().catch(err => {
        console.log('Play failed:', err);
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  };

  return {
    isPlaying,
    isLoaded,
    play,
    pause,
    stop,
    setVolume
  };
};

// Pre-defined horror sound effects
export const horrorSounds = {
  ambient: '/sounds/ambient-horror.mp3',
  whisper: '/sounds/whisper.mp3',
  creak: '/sounds/door-creak.mp3',
  heartbeat: '/sounds/heartbeat.mp3',
  static: '/sounds/static.mp3',
  glitch: '/sounds/glitch.mp3'
} as const;
