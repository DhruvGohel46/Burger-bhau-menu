import React from 'react';
import { Heart, ShieldCheck, Zap } from 'lucide-react';

const About = () => {
    return (
        <section id="about" className="py-24 bg-gray-50 overflow-hidden" style={{ paddingTop: '6rem', paddingBottom: '6rem', backgroundColor: '#f9fafb', overflow: 'hidden' }}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16" style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
                    <div className="lg:w-1/2 relative" style={{ position: 'relative', width: '100%' }}>
                        <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                            style={{ position: 'relative', zIndex: 10, borderRadius: '40px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                            <img
                                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop"
                                alt="Our Kitchen"
                                className="w-full h-[500px] object-cover"
                                style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                            />
                            <div className="absolute inset-0 bg-[#FF6B00]/10 mix-blend-multiply" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255, 107, 0, 0.1)', mixBlendMode: 'multiply' }}></div>
                        </div>
                        {/* Decorative Elements (Simplified for inline) */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#FF6B00] rounded-full -z-0 opacity-20 blur-2xl"
                            style={{ position: 'absolute', top: '-24px', right: '-24px', width: '8rem', height: '8rem', backgroundColor: '#FF6B00', borderRadius: '9999px', zIndex: 0, opacity: 0.2, filter: 'blur(40px)' }}></div>

                        <div className="absolute bottom-10 -right-8 bg-white p-6 rounded-3xl shadow-2xl z-20 max-w-[200px] hidden md:block"
                            style={{ position: 'absolute', bottom: '2.5rem', right: '-2rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', zIndex: 20, maxWidth: '200px' }}>
                            <div className="flex items-center gap-3 mb-2" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600"
                                    style={{ width: '40px', height: '40px', backgroundColor: '#dcfce7', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                                    <ShieldCheck size={24} />
                                </div>
                                <span className="font-bold text-gray-800" style={{ fontWeight: 700, color: '#1f2937' }}>100% Fresh</span>
                            </div>
                            <p className="text-gray-500 text-sm" style={{ color: '#6b7280', fontSize: '0.875rem' }}>Quality ingredients sourced daily.</p>
                        </div>
                    </div>

                    <div className="lg:w-1/2" style={{ width: '100%' }}>
                        <span className="text-[#FF6B00] font-bold tracking-widest uppercase text-sm" style={{ color: '#FF6B00', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.875rem' }}>Our Story</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900 leading-[1.2]" style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#111827', lineHeight: 1.2 }}>
                            Passion for Food, <br />
                            <span className="text-[#FF6B00]">Service with Heart</span>
                        </h2>
                        <p className="mt-8 text-gray-600 text-lg leading-relaxed" style={{ marginTop: '2rem', color: '#4b5563', fontSize: '1.125rem', lineHeight: 1.625 }}>
                            Founded in 2015, Burger Bhau started with a simple mission: to serve the most delicious, handcrafted burgers in town using only the finest ingredients. Our journey began in a small local kitchen and has grown into a community favorite.
                        </p>
                        <p className="mt-4 text-gray-600 text-lg leading-relaxed" style={{ marginTop: '1rem', color: '#4b5563', fontSize: '1.125rem', lineHeight: 1.625 }}>
                            We believe that fast food doesn't have to mean low quality. That's why every patty is pressed by hand, every sauce is made in-house, and every meal is served with a smile.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12" style={{ display: 'grid', gap: '1.5rem', marginTop: '3rem' }}>
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', borderRadius: '1rem', backgroundColor: 'white', border: '1px solid #f3f4f6' }}>
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-[#FF6B00] shrink-0"
                                    style={{ width: '48px', height: '48px', backgroundColor: '#ffedd5', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B00', flexShrink: 0 }}>
                                    <Heart size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900" style={{ fontWeight: 700, color: '#111827' }}>Made with Love</h4>
                                    <p className="text-gray-500 text-sm" style={{ color: '#6b7280', fontSize: '0.875rem' }}>Authentic recipes passed down through generations.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', borderRadius: '1rem', backgroundColor: 'white', border: '1px solid #f3f4f6' }}>
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-[#FF6B00] shrink-0"
                                    style={{ width: '48px', height: '48px', backgroundColor: '#ffedd5', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B00', flexShrink: 0 }}>
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900" style={{ fontWeight: 700, color: '#111827' }}>Fast Delivery</h4>
                                    <p className="text-gray-500 text-sm" style={{ color: '#6b7280', fontSize: '0.875rem' }}>Your hunger won't have to wait long with us.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
