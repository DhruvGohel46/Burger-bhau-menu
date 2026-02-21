'use client';

import { Facebook, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer
            className="text-white pt-20 pb-10 overflow-hidden relative"
            style={{ backgroundColor: 'var(--secondary)' }}
        >
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: 'var(--primary)' }}
                            >
                                <span className="text-white font-bold text-2xl">B</span>
                            </div>
                            <span className="font-bold text-2xl">
                                Burger{' '}
                                <span style={{ color: 'var(--primary)' }}>Bhau</span>
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            Bringing you the finest handcrafted burgers and premium fast food
                            experience since 2015. Quality ingredients, authentic taste.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-[#FF6B00] hover:border-[#FF6B00] transition-all"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-bold mb-8 relative inline-block">
                            Quick Links
                            <div
                                className="absolute -bottom-2 left-0 w-12 h-1 rounded-full"
                                style={{ backgroundColor: 'var(--primary)' }}
                            />
                        </h4>
                        <ul className="flex flex-col gap-4 text-gray-400" style={{ listStyle: 'none' }}>
                            {['Home', 'Menu', 'Special Offers', 'About Us', 'Contact'].map(
                                (item) => (
                                    <li key={item}>
                                        <a
                                            href={`#${item.toLowerCase().replace(' ', '')}`}
                                            className="flex items-center gap-2 hover:text-white transition-colors"
                                        >
                                            › {item}
                                        </a>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="text-xl font-bold mb-8 relative inline-block">
                            Opening Hours
                            <div
                                className="absolute -bottom-2 left-0 w-12 h-1 rounded-full"
                                style={{ backgroundColor: 'var(--primary)' }}
                            />
                        </h4>
                        <ul className="flex flex-col gap-4 text-gray-400" style={{ listStyle: 'none' }}>
                            <li className="flex justify-between">
                                <span>Monday - Friday</span>
                                <span className="text-white">10 AM - 11 PM</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Saturday</span>
                                <span className="text-white">11 AM - 12 PM</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Sunday</span>
                                <span style={{ color: 'var(--primary)' }}>Closed</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-xl font-bold mb-8 relative inline-block">
                            Newsletter
                            <div
                                className="absolute -bottom-2 left-0 w-12 h-1 rounded-full"
                                style={{ backgroundColor: 'var(--primary)' }}
                            />
                        </h4>
                        <p className="text-gray-400 mb-6">
                            Subscribe to get latest offers and updates.
                        </p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full p-4 rounded-2xl outline-none text-white"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                            />
                            <button
                                className="absolute right-2 top-2 w-10 h-10 rounded-xl flex items-center justify-center text-white"
                                style={{ backgroundColor: 'var(--primary)' }}
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-sm">
                        © 2025 Burger Bhau. All Rights Reserved. Designed by{' '}
                        <span className="text-white font-medium">Dhruv</span>
                    </p>
                    <button
                        onClick={scrollToTop}
                        className="w-12 h-12 text-white rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-all"
                        style={{ backgroundColor: 'var(--primary)' }}
                    >
                        <ArrowUp size={24} />
                    </button>
                </div>
            </div>
        </footer>
    );
}
