import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <section
            id="home"
            className="relative min-h-screen flex items-end pb-24 md:items-center md:pb-0 overflow-hidden"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2072&auto=format&fit=crop"
                    alt="Delicious Burger"
                    fill
                    priority
                    className="object-cover scale-105"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-[#0B0B0B]/30" />
                <div className="absolute inset-0 bg-linear-to-r from-[#0B0B0B]/80 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-6xl px-5 w-full">
                <div className="max-w-lg">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand/10 border border-brand/25 rounded-full mb-7 animate-fade-up">
                        <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                        <span className="text-brand text-xs font-semibold tracking-wide uppercase">
                            Now Serving
                        </span>
                    </div>

                    {/* Heading */}
                    <h1
                        className="text-[3.25rem] md:text-7xl font-bold text-white leading-[1.05] tracking-tight animate-fade-up"
                        style={{ animationDelay: '100ms' }}
                    >
                        Fresh. Hot.
                        <br />
                        <span className="text-brand">Irresistible.</span>
                    </h1>

                    {/* Description */}
                    <p
                        className="mt-5 text-[#A0A0A0] text-base md:text-lg max-w-sm leading-relaxed animate-fade-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        Handcrafted burgers, crispy fries, and more. Made with love, served
                        fresh — every single time.
                    </p>

                    {/* CTA */}
                    <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
                        <a
                            href="#menu"
                            className="mt-8 inline-flex items-center gap-2.5 text-white px-8 py-4 rounded-full font-bold text-base shadow-[0_8px_32px_rgba(255,107,0,0.35)] hover:shadow-[0_12px_40px_rgba(255,107,0,0.5)] active:scale-[0.97] transition-all duration-300"
                            style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)' }}
                        >
                            View Menu
                            <ArrowRight size={18} />
                        </a>
                    </div>

                    {/* Quick Stats */}
                    <div
                        className="mt-14 flex items-center gap-8 animate-fade-up"
                        style={{ animationDelay: '400ms' }}
                    >
                        {[
                            { value: '15+', label: 'Varieties' },
                            { value: '20k+', label: 'Happy Customers' },
                            { value: '4.9', label: 'Rating' },
                        ].map((stat, i) => (
                            <div key={stat.label} className="flex items-center gap-8">
                                <div className="flex flex-col">
                                    <span className="text-white text-2xl md:text-3xl font-bold">
                                        {stat.value}
                                    </span>
                                    <span className="text-[#6B6B6B] text-xs font-medium uppercase tracking-wider">
                                        {stat.label}
                                    </span>
                                </div>
                                {i < 2 && <div className="w-px h-8 bg-[#2A2A2A]" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
