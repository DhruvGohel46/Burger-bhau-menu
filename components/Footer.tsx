'use client';

import { Facebook, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react';

const footerLinks = ['Home', 'Menu', 'Offers', 'About', 'Contact'];
const socials = [Facebook, Instagram, Twitter, Youtube];

export default function Footer() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer className="bg-[#0B0B0B] border-t border-[#1A1A1A] pt-16 pb-8">
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
                    {/* Brand */}
                    <div className="flex flex-col gap-5 lg:col-span-1">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center shadow-[0_0_16px_rgba(255,107,0,0.25)]">
                                <span className="text-white font-bold text-lg">B</span>
                            </div>
                            <span className="text-white font-bold text-lg">
                                Burger <span className="text-brand">Bhau</span>
                            </span>
                        </div>
                        <p className="text-[#6B6B6B] text-sm leading-relaxed">
                            Handcrafted burgers and premium fast food since 2015. Quality you
                            can taste.
                        </p>
                        <div className="flex items-center gap-3">
                            {socials.map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-9 h-9 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full flex items-center justify-center text-[#6B6B6B] hover:bg-brand hover:border-brand hover:text-white transition-all duration-200"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">
                            Quick Links
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {footerLinks.map((item) => (
                                <li key={item}>
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        className="text-[#6B6B6B] text-sm hover:text-brand transition-colors"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">
                            Hours
                        </h4>
                        <ul className="flex flex-col gap-3 text-sm">
                            <li className="flex justify-between text-[#6B6B6B]">
                                <span>Mon – Fri</span>
                                <span className="text-white">10 AM – 11 PM</span>
                            </li>
                            <li className="flex justify-between text-[#6B6B6B]">
                                <span>Saturday</span>
                                <span className="text-white">11 AM – 12 PM</span>
                            </li>
                            <li className="flex justify-between text-[#6B6B6B]">
                                <span>Sunday</span>
                                <span className="text-brand">Closed</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">
                            Newsletter
                        </h4>
                        <p className="text-[#6B6B6B] text-sm mb-4">Get the latest offers.</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white text-sm p-3.5 pr-12 rounded-xl outline-none focus:border-brand/50 transition-colors placeholder:text-[#3A3A3A]"
                            />
                            <button className="absolute right-1.5 top-1.5 w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white hover:bg-brand-light transition-colors">
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-6 border-t border-[#1A1A1A] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#3A3A3A] text-xs">
                        © 2025 Burger Bhau. All rights reserved. Built by{' '}
                        <span className="text-[#6B6B6B]">Dhruv</span>
                    </p>
                    <button
                        onClick={scrollToTop}
                        className="w-9 h-9 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full flex items-center justify-center text-[#6B6B6B] hover:bg-brand hover:border-brand hover:text-white active:scale-95 transition-all"
                    >
                        <ArrowUp size={16} />
                    </button>
                </div>
            </div>
        </footer>
    );
}
