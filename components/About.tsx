import Image from 'next/image';
import { ShieldCheck, Flame, Truck } from 'lucide-react';

const features = [
    { icon: <Flame size={22} />, title: 'Made Fresh', desc: 'Every order cooked when you place it.' },
    { icon: <ShieldCheck size={22} />, title: '100% Quality', desc: 'Premium ingredients, always.' },
    { icon: <Truck size={22} />, title: 'Fast Delivery', desc: 'Hot food at your door, quick.' },
];

export default function About() {
    return (
        <section id="about" className="py-16 md:py-24 bg-[#0B0B0B]">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Image */}
                    <div className="lg:w-1/2 relative w-full">
                        <div className="relative rounded-3xl overflow-hidden border border-[#2A2A2A]">
                            <Image
                                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop"
                                alt="Our Kitchen"
                                width={640}
                                height={440}
                                className="w-full object-cover"
                                style={{ height: '440px' }}
                            />
                            <div className="absolute inset-0 bg-brand/5" />
                        </div>
                        {/* Badge */}
                        <div className="absolute -bottom-4 -right-4 bg-[#1A1A1A] border border-[#2A2A2A] p-4 rounded-2xl shadow-2xl hidden md:flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand/15 rounded-full flex items-center justify-center text-brand">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <span className="text-white font-bold text-sm block">Since 2015</span>
                                <span className="text-[#6B6B6B] text-xs">Trusted by thousands</span>
                            </div>
                        </div>
                    </div>

                    {/* Text */}
                    <div className="lg:w-1/2">
                        <span className="text-brand text-xs font-bold uppercase tracking-[0.15em]">Our Story</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 leading-tight">
                            Passion for Food,<br />
                            <span className="text-brand">Heart in Every Bite</span>
                        </h2>
                        <p className="mt-6 text-[#A0A0A0] text-base leading-relaxed">
                            Burger Bhau started with a simple idea: serve the most delicious handcrafted burgers
                            using the finest ingredients. From a small kitchen to a community favorite, we&apos;ve
                            kept the flame alive since 2015.
                        </p>
                        <p className="mt-3 text-[#6B6B6B] text-base leading-relaxed">
                            Every patty is pressed by hand, every sauce is made in-house, and every meal is served
                            with a smile. Because fast food doesn&apos;t mean low quality.
                        </p>

                        {/* Feature cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10">
                            {features.map((f) => (
                                <div key={f.title} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center hover:border-brand/30 transition-colors">
                                    <div className="w-10 h-10 mx-auto bg-brand/10 rounded-lg flex items-center justify-center text-brand mb-3">
                                        {f.icon}
                                    </div>
                                    <h4 className="text-white font-bold text-sm">{f.title}</h4>
                                    <p className="text-[#6B6B6B] text-xs mt-1">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
