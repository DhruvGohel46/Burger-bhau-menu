import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MenuItem } from '../../data/menu';
import './MenuCard.css';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <motion.div
      className="menu-card hover-horror shadow-creep"
      whileHover={{ 
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsRevealed(true)}
      onHoverEnd={() => setIsRevealed(false)}
      onTouchStart={() => setIsRevealed(true)}
      onTouchEnd={() => setIsRevealed(false)}
    >
      <div className="card-header">
        <h3 className="text-distort">{item.name}</h3>
        <span className="price flicker">₹{item.price}</span>
      </div>
      
      <motion.div
        className="taste-description"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isRevealed ? 'auto' : 0,
          opacity: isRevealed ? 1 : 0
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <p className="text-distort">{item.description}</p>
      </motion.div>
      
      <div className="card-footer">
        <span className="category">{item.category}</span>
        <motion.div
          className="reveal-hint"
          animate={{ opacity: isRevealed ? 0 : 1 }}
        >
          Hover to reveal
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MenuCard;
