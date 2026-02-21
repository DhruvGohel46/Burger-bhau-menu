import Image from 'next/image';
import { Tag, Clock } from 'lucide-react';

const offers = [
    {
        id: 1,
        title: 'Double Deal Combo',
        discount: '20% OFF',
        description: '2 Signature Burgers + 2 Large Fries + 2 Soft Drinks.',
        image:
            'https://images.unsplash.com/photo-1547584370-2cc98b8b8dc8?q=80&w=2071&auto=format&fit=crop',
        color: '#FF6B00',
    },
    {
        id: 2,
        title: 'Family Party Box',
        discount: 'SAVE ₹150',
        description: '3 Mixed Pizzas + 10 Garlic Breads + Cold Drinks.',
        image:
            'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
        color: '#1A1A1A',
    },
];

export default function Offers() {
    return (
        <section id="offers" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-xl">
                        <span
                            className="font-bold tracking-widest uppercase text-sm"
                            style={{ color: 'var(--primary)' }}
                        >
                            Today&apos;s Deals
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900">
                            Special <span style={{ color: 'var(--primary)' }}>Offers</span> For You
                        </h2>
                        <p className="text-gray-500 mt-4 text-lg">
                            Delicious food at unbeatable prices. Grab these limited-time deals
                            before they&apos;re gone!
                        </p>
                    </div>
                    <div
                        className="hidden md:flex items-center gap-2 font-bold border-b-2 pb-1 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                    >
                        View All Offers <span>→</span>
                    </div>
                </div>

                {/* Offer Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className="relative overflow-hidden rounded-[32px] group"
                            style={{ height: '400px' }}
                        >
                            <Image
                                src={offer.image}
                                alt={offer.title}
                                fill
                                className="object-cover"
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                                }}
                            />
                            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                                <div
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold text-sm mb-4"
                                    style={{ backgroundColor: offer.color }}
                                >
                                    <Tag size={16} />
                                    {offer.discount}
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                    {offer.title}
                                </h3>
                                <p className="text-gray-300 text-lg md:text-xl max-w-md hidden sm:block">
                                    {offer.description}
                                </p>
                                <div className="mt-8 flex items-center justify-between">
                                    <button className="bg-white text-[#1A1A1A] px-8 py-3 rounded-full font-bold hover:bg-[#FF6B00] hover:text-white transition-all hover:-translate-y-1">
                                        Order Now
                                    </button>
                                    <div className="flex items-center gap-2 text-white/80 text-sm">
                                        <Clock size={16} />
                                        Valid till 10:00 PM
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
