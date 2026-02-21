import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SoundToggle from '../ui/SoundToggle';
import { useHorrorSoundManager } from '../ui/HorrorSoundManager';
import './Header.css';

const Header: React.FC = () => {
  const { playSound } = useHorrorSoundManager();

  const handleNavClick = () => {
    playSound('creak');
  };

  return (
    <>
      <motion.header 
        className="header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <nav className="nav">
          <Link to="/" className="logo" onClick={handleNavClick}>
            <motion.span
              className="text-distort"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Burger Bhau
            </motion.span>
          </Link>
          
          <div className="nav-links">
            <Link to="/" onClick={handleNavClick}>
              <motion.span
                className="hover-horror"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Home
              </motion.span>
            </Link>
            <Link to="/menu" onClick={handleNavClick}>
              <motion.span
                className="hover-horror"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Menu
              </motion.span>
            </Link>
            <Link to="/secret" onClick={handleNavClick}>
              <motion.span
                className="hover-horror"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                The Secret
              </motion.span>
            </Link>
          </div>
        </nav>
      </motion.header>
      <SoundToggle />
    </>
  );
};

export default Header;
