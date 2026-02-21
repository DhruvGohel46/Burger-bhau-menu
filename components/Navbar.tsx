'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';

const navLinks = ['Home', 'Menu', 'Offers', 'About', 'Contact'];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: 'var(--primary)' }}
                    >
                        <span className="text-white font-bold text-xl">B</span>
                    </div>
                    <span
                        className={`font-bold text-xl ${scrolled ? 'text-[#1A1A1A]' : 'text-white'}`}
                    >
                        Burger <span style={{ color: 'var(--primary)' }}>Bhau</span>
                    </span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className={`font-medium hover:text-[#FF6B00] transition-colors ${scrolled ? 'text-[#1A1A1A]' : 'text-white'
                                }`}
                        >
                            {item}
                        </a>
                    ))}
                    <button
                        className="w-10 h-10 relative flex items-center justify-center bg-gray-100 rounded-full text-[#1A1A1A]"
                    >
                        <ShoppingBag size={20} />
                        <span
                            className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: 'var(--primary)' }}
                        >
                            0
                        </span>
                    </button>
                </div>

                {/* Mobile Icons */}
                <div className="flex md:hidden items-center gap-4">
                    <button
                        className={`p-2 rounded-full ${scrolled ? 'bg-gray-100 text-[#1A1A1A]' : 'bg-white/20 text-white'
                            }`}
                    >
                        <ShoppingBag size={20} />
                    </button>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`p-2 rounded-lg ${scrolled ? 'text-[#1A1A1A]' : 'text-white'}`}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-white z-40 transition-transform duration-500 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{ display: isOpen ? 'block' : 'none' }}
            >
                <div className="flex flex-col items-center justify-center h-full gap-8">
                    {navLinks.map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            onClick={() => setIsOpen(false)}
                            className="text-2xl font-bold text-[#1A1A1A] hover:text-[#FF6B00]"
                        >
                            {item}
                        </a>
                    ))}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg"
                        style={{ backgroundColor: 'var(--primary)' }}
                    >
                        Order Now
                    </button>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 text-[#1A1A1A]"
                >
                    <X size={32} />
                </button>
            </div>
        </nav>
    );
}
