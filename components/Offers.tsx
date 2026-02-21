import Image from 'next/image';
import { Tag, Clock } from 'lucide-react';

const offers = [
    {
        id: 1,
        title: 'Double Deal Combo',
        discount: '20% OFF',
        description: '2 Signature Burgers + 2 Large Fries + 2 Soft Drinks.',
        image: 'https://images.unsplash.com/photo-1547584370-2cc98b8b8dc8?q=80&w=2071&auto=format&fit=crop',
    },
    {
        id: 2,
        title: 'Family Party Box',
        discount: 'SAVE ₹150',
        description: '3 Mixed Pizzas + 10 Garlic Breads + Cold Drinks.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
    },
];

export default function Offers() {
    return (
        <section id="offers" className="py-16 md:py-24 bg-[#0B0B0B]">
            <div className="mx-auto max-w-6xl px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                    <div>
                        <span className="text-brand text-xs font-bold uppercase tracking-[0.15em]">
                            Today&apos;s Deals
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
                            Special <span className="text-brand">Offers</span>
                        </h2>
                    </div>
                    <span className="text-[#6B6B6B] text-sm font-medium hidden md:block cursor-pointer hover:text-brand transition-colors">
                        View All →
                    </span>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className="relative overflow-hidden rounded-2xl group cursor-pointer"
                            style={{ height: '320px' }}
                        >
                            <Image
                                src={offer.image}
                                alt={offer.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/50 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand text-white text-xs font-bold mb-3">
                                    <Tag size={12} />
                                    {offer.discount}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                                    {offer.title}
                                </h3>
                                <p className="text-[#A0A0A0] text-sm max-w-xs hidden sm:block">
                                    {offer.description}
                                </p>
                                <div className="mt-5 flex items-center justify-between">
                                    <button className="bg-white text-[#0B0B0B] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand hover:text-white active:scale-95 transition-all">
                                        Order Now
                                    </button>
                                    <div className="flex items-center gap-1.5 text-[#6B6B6B] text-xs">
                                        <Clock size={12} />
                                        Till 10 PM
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
