import Image from 'next/image';
import { Heart, ShieldCheck, Zap } from 'lucide-react';

export default function About() {
    return (
        <section id="about" className="py-24 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Image Side */}
                    <div className="lg:w-1/2 relative">
                        <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                            <Image
                                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop"
                                alt="Our Kitchen"
                                width={640}
                                height={500}
                                className="w-full object-cover"
                                style={{ height: '500px' }}
                            />
                            <div
                                className="absolute inset-0"
                                style={{ backgroundColor: 'rgba(255, 107, 0, 0.1)', mixBlendMode: 'multiply' }}
                            />
                        </div>
                        {/* Decorative */}
                        <div
                            className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20 blur-2xl"
                            style={{ backgroundColor: 'var(--primary)' }}
                        />
                        {/* Floating Badge */}
                        <div className="absolute bottom-10 -right-8 bg-white p-6 rounded-3xl shadow-2xl z-20 max-w-[200px] hidden md:block">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <ShieldCheck size={24} />
                                </div>
                                <span className="font-bold text-gray-800">100% Fresh</span>
                            </div>
                            <p className="text-gray-500 text-sm">
                                Quality ingredients sourced daily.
                            </p>
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="lg:w-1/2">
                        <span
                            className="font-bold tracking-widest uppercase text-sm"
                            style={{ color: 'var(--primary)' }}
                        >
                            Our Story
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900 leading-[1.2]">
                            Passion for Food, <br />
                            <span style={{ color: 'var(--primary)' }}>Service with Heart</span>
                        </h2>
                        <p className="mt-8 text-gray-600 text-lg leading-relaxed">
                            Founded in 2015, Burger Bhau started with a simple mission: to
                            serve the most delicious, handcrafted burgers in town using only
                            the finest ingredients. Our journey began in a small local kitchen
                            and has grown into a community favorite.
                        </p>
                        <p className="mt-4 text-gray-600 text-lg leading-relaxed">
                            We believe that fast food doesn&apos;t have to mean low quality.
                            That&apos;s why every patty is pressed by hand, every sauce is made
                            in-house, and every meal is served with a smile.
                        </p>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: '#ffedd5', color: 'var(--primary)' }}
                                >
                                    <Heart size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Made with Love</h4>
                                    <p className="text-gray-500 text-sm">
                                        Authentic recipes passed down through generations.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: '#ffedd5', color: 'var(--primary)' }}
                                >
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Fast Delivery</h4>
                                    <p className="text-gray-500 text-sm">
                                        Your hunger won&apos;t have to wait long with us.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
