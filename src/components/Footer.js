import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-[#1A1A1A] text-white pt-20 pb-10 overflow-hidden relative" style={{ backgroundColor: '#1A1A1A', color: '#ffffff', paddingTop: '5rem', paddingBottom: '2.5rem', overflow: 'hidden', position: 'relative' }}>
            <div className="container mx-auto px-4 relative z-10" style={{ position: 'relative', zIndex: 10 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16" style={{ display: 'grid', gap: '3rem', marginBottom: '4rem' }}>
                    {/* Brand Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="w-12 h-12 bg-[#FF6B00] rounded-xl flex items-center justify-center" style={{ width: '48px', height: '48px', backgroundColor: '#FF6B00', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="text-white font-bold text-2xl">B</span>
                            </div>
                            <span className="font-bold text-2xl" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Burger <span className="text-[#FF6B00]" style={{ color: '#FF6B00' }}>Bhau</span></span>
                        </div>
                        <p className="text-gray-400 leading-relaxed" style={{ color: '#9ca3af', lineHeight: 1.625 }}>
                            Bringing you the finest handcrafted burgers and premium fast food experience since 2015. Quality ingredients, authentic taste.
                        </p>
                        <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                                <a key={index} href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#FF6B00] hover:border-[#FF6B00] transition-all"
                                    style={{ width: '40px', height: '40px', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-bold mb-8 relative inline-block" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem', position: 'relative', display: 'inline-block' }}>
                            Quick Links
                            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-[#FF6B00] rounded-full" style={{ position: 'absolute', bottom: '-8px', left: 0, width: '3rem', height: '4px', backgroundColor: '#FF6B00', borderRadius: '9999px' }}></div>
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#9ca3af' }}>
                            {['Home', 'Menu', 'Special Offers', 'About Us', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href={`#${item.toLowerCase().replace(' ', '')}`} className="transition-colors" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        › {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <h4 className="text-xl font-bold mb-8 relative inline-block" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem', position: 'relative', display: 'inline-block' }}>
                            Opening Hours
                            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-[#FF6B00] rounded-full" style={{ position: 'absolute', bottom: '-8px', left: 0, width: '3rem', height: '4px', backgroundColor: '#FF6B00', borderRadius: '9999px' }}></div>
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#9ca3af' }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Monday - Friday</span>
                                <span style={{ color: 'white' }}>10 AM - 11 PM</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Saturday</span>
                                <span style={{ color: 'white' }}>11 AM - 12 PM</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Sunday</span>
                                <span style={{ color: '#FF6B00' }}>Closed</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-xl font-bold mb-8 relative inline-block" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem', position: 'relative', display: 'inline-block' }}>
                            Newsletter
                            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-[#FF6B00] rounded-full" style={{ position: 'absolute', bottom: '-8px', left: 0, width: '3rem', height: '4px', backgroundColor: '#FF6B00', borderRadius: '9999px' }}></div>
                        </h4>
                        <p className="text-gray-400 mb-6" style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>Subscribe to get latest offers and updates.</p>
                        <div className="relative" style={{ position: 'relative' }}>
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none"
                                style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '1rem', color: 'white' }}
                            />
                            <button className="absolute right-2 top-2 bg-[#FF6B00] w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ position: 'absolute', right: '8px', top: '8px', backgroundColor: '#FF6B00', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                →
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6"
                    style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                    <p className="text-gray-500 text-sm" style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        © 2025 Burger Bhau. All Rights Reserved. Designed by <span className="text-white font-medium" style={{ color: 'white', fontWeight: 500 }}>Dhruv</span>
                    </p>
                    <button
                        onClick={scrollToTop}
                        className="w-12 h-12 bg-[#FF6B00] text-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:-translate-y-1"
                        style={{ width: '48px', height: '48px', backgroundColor: '#FF6B00', color: 'white', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
                    >
                        <ArrowUp size={24} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
