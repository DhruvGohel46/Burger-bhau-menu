'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Menu as MenuIcon, X } from 'lucide-react';

const navLinks = ['Home', 'Menu', 'Offers', 'About', 'Contact'];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
            style={{
                background: scrolled ? 'rgba(11, 11, 11, 0.85)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(42, 42, 42, 0.6)' : '1px solid transparent',
            }}
        >
            <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <a href="#home" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.3)] group-hover:shadow-[0_0_28px_rgba(255,107,0,0.5)] transition-shadow duration-300">
                        <span className="text-white font-bold text-lg">B</span>
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">
                        Burger <span className="text-brand">Bhau</span>
                    </span>
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-[#A0A0A0] text-sm font-medium hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand after:transition-all after:duration-300 hover:after:w-full"
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-2.5">
                    <button className="relative w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#A0A0A0] hover:text-white hover:border-[#3A3A3A] transition-all duration-200">
                        <ShoppingBag size={18} />
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand text-[10px] font-bold rounded-full flex items-center justify-center text-white animate-pulse-glow">
                            0
                        </span>
                    </button>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#A0A0A0] hover:text-white transition-colors"
                    >
                        {mobileOpen ? <X size={18} /> : <MenuIcon size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                style={{ background: 'rgba(11, 11, 11, 0.97)', backdropFilter: 'blur(24px)' }}
            >
                <div className="flex flex-col items-center justify-center h-full gap-8">
                    {navLinks.map((item, i) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            onClick={() => setMobileOpen(false)}
                            className="text-3xl font-bold text-white hover:text-brand transition-colors"
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            {item}
                        </a>
                    ))}
                    <a
                        href="#menu"
                        onClick={() => setMobileOpen(false)}
                        className="mt-4 bg-brand text-white px-10 py-4 rounded-full font-bold text-lg shadow-[0_8px_32px_rgba(255,107,0,0.35)] active:scale-95 transition-transform"
                    >
                        Order Now
                    </a>
                </div>
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-white"
                >
                    <X size={20} />
                </button>
            </div>
        </nav>
    );
}
