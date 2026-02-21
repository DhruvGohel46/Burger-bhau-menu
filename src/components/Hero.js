import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
    return (
        <section id="home" className="relative flex items-center overflow-hidden"
            style={{ height: '100vh', minHeight: '600px', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <img
                    src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2072&auto=format&fit=crop"
                    alt="Delicious Burger"
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="absolute inset-0" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)' }}></div>
            </div>

            <div className="container relative z-10 px-4" style={{ position: 'relative', zIndex: 10 }}>
                <div className="max-w-2xl text-white">
                    <span className="inline-block py-1 px-4 bg-[#FF6B00] text-white rounded-full text-sm font-bold mb-6 tracking-wide uppercase animate-fade-in"
                        style={{ display: 'inline-block', padding: '4px 16px', backgroundColor: '#FF6B00', color: 'white', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                        New Seasonal Menu
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1]" style={{ fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                        Delicious Fast Food, <br />
                        <span className="text-[#FF6B00]">Made Fresh</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-lg" style={{ color: '#e5e7eb', marginBottom: '2.5rem', maxWidth: '32rem' }}>
                        Experience the ultimate taste of our handcrafted burgers and crispy sides. Delivered hot and fresh to your doorstep.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center" style={{ display: 'flex', gap: '16px' }}>
                        <button className="bg-[#FF6B00] hover:bg-[#E56000] text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 shadow-xl hover:shadow-[#FF6B00]/40 transition-all transform hover:-translate-y-1 group h-[56px] min-w-[200px]"
                            style={{ backgroundColor: '#FF6B00', color: 'white', padding: '16px 32px', borderRadius: '9999px', fontWeight: 700, fontSize: '1.125rem', height: '56px', minWidth: '200px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            View Our Menu
                            <ArrowRight size={20} />
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all h-[56px] min-w-[180px]"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(12px)', color: 'white', padding: '16px 32px', borderRadius: '9999px', fontWeight: 700, fontSize: '1.125rem', height: '56px', minWidth: '180px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="w-8 h-8 bg-[#FF6B00] rounded-full flex items-center justify-center" style={{ width: '32px', height: '32px', backgroundColor: '#FF6B00', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Play size={16} fill="white" />
                            </div>
                            Order Now
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-16 flex items-center gap-8 md:gap-12" style={{ marginTop: '4rem', display: 'flex', gap: '48px', alignItems: 'center' }}>
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold" style={{ fontSize: '1.875rem', fontWeight: 700 }}>15+</span>
                            <span className="text-gray-400 text-sm" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Burger Variety</span>
                        </div>
                        <div className="w-[1px] h-10 bg-white/20" style={{ width: '1px', height: '40px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold" style={{ fontSize: '1.875rem', fontWeight: 700 }}>20k+</span>
                            <span className="text-gray-400 text-sm" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Happy Clients</span>
                        </div>
                        <div className="w-[1px] h-10 bg-white/20" style={{ width: '1px', height: '40px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold" style={{ fontSize: '1.875rem', fontWeight: 700 }}>4.9</span>
                            <span className="text-gray-400 text-sm" style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Star Ratings</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
