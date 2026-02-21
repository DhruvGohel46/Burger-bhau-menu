import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import '../theme/index.css';
import './Home.css';

const Home: React.FC = () => {
  const { scrollY } = useScroll();
  
  const blur = useTransform(scrollY, [0, 300], [10, 0]);
  const scale = useTransform(scrollY, [0, 300], [1.1, 1]);
  const eyeX = useTransform(scrollY, [0, 300], [0, 5]);
  const eyeY = useTransform(scrollY, [0, 300], [0, 3]);

  return (
    <div className="home creepy-cursor">
      <div className="horror-bg"></div>
      <div className="noise-overlay"></div>
      <Header />
      
      <section className="hero">
        <motion.div 
          className="hero-visual"
          style={{ 
            filter: `blur(${blur.get()}px)`,
            scale: scale.get()
          }}
        >
          <div className="horror-figure shadow-creep">
            <motion.div
              className="eyes flicker"
              style={{
                x: eyeX,
                y: eyeY
              }}
            >
              <div className="eye pulse-horror"></div>
              <div className="eye pulse-horror"></div>
            </motion.div>
            <div className="shadow"></div>
          </div>
        </motion.div>

        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="glitch"
            data-text="Burger Bhau"
          >
            Burger Bhau
          </motion.h1>
          
          <motion.p
            className="tagline text-distort"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            Scan if you dare. Taste if you survive.
          </motion.p>

          <motion.div
            className="cta-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <Link to="/menu" className="btn btn-primary hover-horror blood-drip">
              Enter the Menu
            </Link>
            <Link to="/secret" className="btn btn-secondary hover-horror">
              Discover the Secret
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      <section className="mystery-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>What Awaits You</h2>
            <p>
              Behind these doors lie flavors that defy explanation. 
              Each bite tells a story written in spice and shadow.
            </p>
          </motion.div>

          <div className="mystery-grid">
            {[
              { title: "Forbidden Flavors", description: "Taste profiles that shouldn't exist" },
              { title: "Dark Recipes", description: "Secrets passed through generations" },
              { title: "Cursed Ingredients", description: "Freshness that haunts your memory" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="mystery-card hover-horror shadow-creep"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <h3 className="text-distort">{item.title}</h3>
                <p>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
