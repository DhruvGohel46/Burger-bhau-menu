import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Menu from './components/Menu';
import Offers from './components/Offers';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MobileOrderButton from './components/MobileOrderButton';

function App() {
  return (
    <div className="App selection:bg-[#FF6B00] selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        <Hero />
        <Categories />
        <div className="container mx-auto">
          <Menu />
          <Offers />
          <About />
          <Contact />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile-only Sticky CTA */}
      <MobileOrderButton />
    </div>
  );
}

export default App;
