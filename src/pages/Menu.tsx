import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuData, categories, Category } from '../data/menu';
import Header from '../components/layout/Header';
import MenuCard from '../components/menu/MenuCard';
import '../theme/index.css';
import './Menu.css';

const Menu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const filteredItems = selectedCategory === 'all' 
    ? menuData 
    : menuData.filter(item => item.category === selectedCategory);

  return (
    <div className="menu-page creepy-cursor">
      <div className="horror-bg"></div>
      <div className="noise-overlay"></div>
      <Header />
      
      <section className="menu-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="glitch" data-text="The Menu of Secrets">The Menu of Secrets</h1>
            <p className="text-distort">
              Each item holds a story. Each flavor reveals a truth. 
              Hover to discover what awaits.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="category-filter">
        <div className="container">
          <div className="filter-buttons">
            <motion.button
              className={`filter-btn hover-horror ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All Items
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`filter-btn hover-horror ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
          
          {selectedCategory !== 'all' && (
            <motion.div
              className="category-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={selectedCategory}
            >
              {categories.find(c => c.id === selectedCategory)?.description}
            </motion.div>
          )}
        </div>
      </section>

      <section className="menu-grid">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              className="grid"
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <MenuCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          
          {filteredItems.length === 0 && (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>No items found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu;
