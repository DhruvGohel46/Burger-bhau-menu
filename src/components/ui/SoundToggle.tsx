import React from 'react';
import { motion } from 'framer-motion';
import { useHorrorSoundManager } from './HorrorSoundManager';
import './SoundToggle.css';

const SoundToggle: React.FC = () => {
  const { isSoundEnabled, toggleSound, setMasterVolume } = useHorrorSoundManager();

  return (
    <motion.div
      className="sound-toggle"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className={`sound-btn ${isSoundEnabled ? 'enabled' : 'disabled'}`}
        onClick={toggleSound}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={isSoundEnabled ? 'Disable sound' : 'Enable sound'}
      >
        {isSoundEnabled ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor"/>
            <path d="M19.07 4.93L17.66 6.34C19.11 7.79 20 9.79 20 12C20 14.21 19.11 16.21 17.66 17.66L19.07 19.07C20.88 17.26 22 14.76 22 12C22 9.24 20.88 6.74 19.07 4.93Z" fill="currentColor"/>
            <path d="M15.54 8.46L14.13 9.88C14.68 10.43 15 11.18 15 12C15 12.82 14.68 13.57 14.13 14.12L15.54 15.54C16.47 14.61 17 13.35 17 12C17 10.65 16.47 9.39 15.54 8.46Z" fill="currentColor"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor"/>
            <path d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.03C15.48 15.29 16.5 13.77 16.5 12Z" fill="currentColor"/>
            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )}
      </motion.button>
      
      {isSoundEnabled && (
        <motion.div
          className="volume-control"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            defaultValue="0.3"
            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            className="volume-slider"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default SoundToggle;
