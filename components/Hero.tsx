import { ArrowRight, Play } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
    return (
        <section
            id="home"
            className="relative flex items-center overflow-hidden"
            style={{ height: '100vh', minHeight: '600px' }}
        >
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2072&auto=format&fit=crop"
                    alt="Delicious Burger"
                    fill
                    priority
                    className="object-cover"
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                    }}
                />
            </div>

            <div className="container relative z-10 px-4">
                <div className="max-w-2xl text-white">
                    <span
                        className="inline-block py-1 px-4 text-white rounded-full text-sm font-bold mb-6 tracking-wide uppercase"
                        style={{ backgroundColor: 'var(--primary)' }}
                    >
                        New Seasonal Menu
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1]">
                        Delicious Fast Food, <br />
                        <span style={{ color: 'var(--primary)' }}>Made Fresh</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-lg">
                        Experience the ultimate taste of our handcrafted burgers and crispy
                        sides. Delivered hot and fresh to your doorstep.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <a
                            href="#menu"
                            className="flex items-center gap-2 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:-translate-y-1 transition-all"
                            style={{ backgroundColor: 'var(--primary)', minWidth: '200px', height: '56px' }}
                        >
                            View Our Menu
                            <ArrowRight size={20} />
                        </a>
                        <a
                            href="#contact"
                            className="flex items-center gap-2 text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg backdrop-blur-md hover:bg-white/20 transition-all"
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)', minWidth: '180px', height: '56px' }}
                        >
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: 'var(--primary)' }}
                            >
                                <Play size={16} fill="white" />
                            </div>
                            Order Now
                        </a>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-16 flex items-center gap-8 md:gap-12">
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold">15+</span>
                            <span className="text-gray-400 text-sm">Burger Variety</span>
                        </div>
                        <div className="w-[1px] h-10 bg-white/20" />
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold">20k+</span>
                            <span className="text-gray-400 text-sm">Happy Clients</span>
                        </div>
                        <div className="w-[1px] h-10 bg-white/20" />
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold">4.9</span>
                            <span className="text-gray-400 text-sm">Star Ratings</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
