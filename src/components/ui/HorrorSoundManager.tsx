import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHorrorSound, horrorSounds } from '../../hooks/useHorrorSound';

interface HorrorSoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playSound: (soundType: keyof typeof horrorSounds) => void;
  setMasterVolume: (volume: number) => void;
}

const HorrorSoundContext = createContext<HorrorSoundContextType | undefined>(undefined);

export const useHorrorSoundManager = () => {
  const context = useContext(HorrorSoundContext);
  if (!context) {
    throw new Error('useHorrorSoundManager must be used within HorrorSoundProvider');
  }
  return context;
};

interface HorrorSoundProviderProps {
  children: React.ReactNode;
}

export const HorrorSoundProvider: React.FC<HorrorSoundProviderProps> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [masterVolume, setMasterVolumeState] = useState(0.3);
  
  // Ambient sound that plays continuously when enabled
  const ambientSound = useHorrorSound(horrorSounds.ambient, {
    volume: masterVolume * 0.2,
    loop: true,
    autoplay: false
  });

  // Individual sound effects
  const whisperSound = useHorrorSound(horrorSounds.whisper, {
    volume: masterVolume * 0.4,
    loop: false
  });

  const creakSound = useHorrorSound(horrorSounds.creak, {
    volume: masterVolume * 0.5,
    loop: false
  });

  const glitchSound = useHorrorSound(horrorSounds.glitch, {
    volume: masterVolume * 0.3,
    loop: false
  });

  useEffect(() => {
    if (isSoundEnabled) {
      ambientSound.play();
    } else {
      ambientSound.pause();
    }
  }, [isSoundEnabled, ambientSound]);

  useEffect(() => {
    ambientSound.setVolume(masterVolume * 0.2);
    whisperSound.setVolume(masterVolume * 0.4);
    creakSound.setVolume(masterVolume * 0.5);
    glitchSound.setVolume(masterVolume * 0.3);
  }, [masterVolume, ambientSound, whisperSound, creakSound, glitchSound]);

  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };

  const playSound = (soundType: keyof typeof horrorSounds) => {
    if (!isSoundEnabled) return;

    switch (soundType) {
      case 'whisper':
        whisperSound.play();
        break;
      case 'creak':
        creakSound.play();
        break;
      case 'glitch':
        glitchSound.play();
        break;
      default:
        break;
    }
  };

  const setMasterVolume = (volume: number) => {
    setMasterVolumeState(Math.max(0, Math.min(1, volume)));
  };

  return (
    <HorrorSoundContext.Provider value={{
      isSoundEnabled,
      toggleSound,
      playSound,
      setMasterVolume
    }}>
      {children}
    </HorrorSoundContext.Provider>
  );
};
