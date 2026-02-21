import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import '../theme/index.css';
import './Secret.css';

const Secret: React.FC = () => {
  return (
    <div className="secret-page">
      <Header />
      
      <section className="secret-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>The Secret</h1>
            <p className="subtitle">Some truths are meant to be shared</p>
          </motion.div>
        </div>
      </section>

      <section className="secret-content">
        <div className="container">
          <motion.div
            className="secret-narrative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Our Beginning</h2>
            <p>
              In the heart of Rajkot, where spices dance in the air and 
              secrets are whispered between generations, Burger Bhau was born. 
              Not as a business, but as a promise—a promise to preserve flavors 
              that time tried to forget.
            </p>
            <p>
              We source our ingredients from local farms where the soil remembers 
              old recipes. Our vegetables are harvested at dawn, when the night 
              still holds its mysteries. Our spices are ground by hands that know 
              the weight of tradition.
            </p>
          </motion.div>

          <motion.div
            className="philosophy-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2>The Philosophy</h2>
            <div className="philosophy-grid">
              {[
                {
                  title: "Freshness That Haunts",
                  description: "Every ingredient arrives daily, as if summoned by the dawn itself."
                },
                {
                  title: "Local Roots, Global Taste",
                  description: "Rajkot's finest produce meets techniques from around the world."
                },
                {
                  title: "No Compromises",
                  description: "We never cut corners. The path to perfection is straight and narrow."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="philosophy-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="franchise-section"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h2>Join the Brotherhood</h2>
            <p>
              Burger Bhau is more than a restaurant—it's a brotherhood of flavor 
              seekers, taste adventurers, and those who understand that great food 
              is never just about hunger. It's about experience, memory, and the 
              stories we tell through our plates.
            </p>
            <p>
              We're carefully selecting partners who share our vision. Those who 
              understand that quality is not an option, but a religion. Those who 
              believe that every customer deserves to taste the difference that 
              passion makes.
            </p>
            
            <div className="cta-section">
              <Link to="/menu" className="btn btn-outline">
                Return to the Menu
              </Link>
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Own the Secret
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="secret-footer">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p>Burger Bhau © 2024</p>
            <p>Born in Rajkot. Shared with the world.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Secret;
