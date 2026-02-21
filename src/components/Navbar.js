import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'all 0.3s ease' }}>
      <div className="container mx-auto px-4 flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center" style={{ width: '40px', height: '40px', backgroundColor: '#FF6B00', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <span className={`font-bold text-xl ${scrolled ? 'text-[#1A1A1A]' : 'text-white'}`} style={{ fontWeight: 700, fontSize: '1.25rem' }}>
            Burger <span className="text-[#FF6B00]">Bhau</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8" style={{ gap: '32px', alignItems: 'center' }}>
          {['Home', 'Menu', 'Offers', 'About', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '')}`}
              className={`font-medium hover:text-[#FF6B00] transition-colors ${scrolled ? 'text-[#1A1A1A]' : 'text-white'
                }`}
              style={{ fontWeight: 500 }}
            >
              {item}
            </a>
          ))}
          <button className="w-10 h-10 relative flex items-center justify-center bg-gray-100 rounded-full text-[#1A1A1A]" style={{ width: '40px', height: '40px', borderRadius: '9999px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 bg-[#FF6B00] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center" style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#FF6B00', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              0
            </span>
          </button>
        </div>

        {/* Mobile Icons */}
        <div className="flex md:hidden items-center space-x-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className={`p-2 rounded-full ${scrolled ? 'bg-gray-100 text-[#1A1A1A]' : 'bg-white/20 text-white'}`} style={{ padding: '8px', borderRadius: '9999px' }}>
            <ShoppingBag size={20} />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-lg ${scrolled ? 'text-[#1A1A1A]' : 'text-white'}`}
            style={{ padding: '8px' }}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-40 transition-transform duration-500 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`} style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'white',
          zIndex: 40,
          display: isOpen ? 'block' : 'none',
          transition: 'transform 0.5s ease'
        }}>
        <div className="flex flex-col items-center justify-center h-full space-y-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '32px' }}>
          {['Home', 'Menu', 'Offers', 'About', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '')}`}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold text-[#1A1A1A] hover:text-[#FF6B00]"
              style={{ fontSize: '24px', fontWeight: 700 }}
            >
              {item}
            </a>
          ))}
          <button
            onClick={() => setIsOpen(false)}
            className="bg-[#FF6B00] text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
            style={{ backgroundColor: '#FF6B00', color: 'white', padding: '12px 32px', borderRadius: '9999px', fontWeight: 700, fontSize: '1.125rem' }}
          >
            Order Now
          </button>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-[#1A1A1A]"
          style={{ position: 'absolute', top: '24px', right: '24px' }}
        >
          <X size={32} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
