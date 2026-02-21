import React from 'react';
import { Tag, Clock } from 'lucide-react';

const offers = [
    {
        id: 1,
        title: "Double Deal Combo",
        discount: "20% OFF",
        description: "2 Signature Burgers + 2 Large Fries + 2 Soft Drinks.",
        image: "https://images.unsplash.com/photo-1547584370-2cc98b8b8dc8?q=80&w=2071&auto=format&fit=crop",
        color: "#FF6B00"
    },
    {
        id: 2,
        title: "Family Party Box",
        discount: "SAVE $15",
        description: "3 Mixed Pizzas + 10 Chicken Wings + 1.5L Coke.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
        color: "#1A1A1A"
    }
];

const Offers = () => {
    return (
        <section id="offers" className="py-20 bg-white" style={{ paddingTop: '5rem', paddingBottom: '5rem', backgroundColor: '#ffffff' }}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', gap: '1.5rem' }}>
                    <div style={{ maxWidth: '36rem' }}>
                        <span className="text-[#FF6B00] font-bold tracking-widest uppercase text-sm" style={{ color: '#FF6B00', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.875rem' }}>Today's Deals</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900" style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#111827' }}>Special <span className="text-[#FF6B00]" style={{ color: '#FF6B00' }}>Offers</span> For You</h2>
                        <p className="text-gray-500 mt-4 text-lg" style={{ color: '#6b7280', marginTop: '1rem', fontSize: '1.125rem' }}>Delicious food at unbeatable prices. Grab these limited-time deals before they're gone!</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-[#FF6B00] font-bold border-b-2 border-[#FF6B00] pb-1 cursor-pointer hover:opacity-80 transition-opacity" style={{ color: '#FF6B00', fontWeight: 700, borderBottom: '2px solid #FF6B00', paddingBottom: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        View All Offers
                        <span>→</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ display: 'grid', gap: '2rem' }}>
                    {offers.map((offer) => (
                        <div key={offer.id} className="relative overflow-hidden rounded-[32px] group" style={{ position: 'relative', overflow: 'hidden', borderRadius: '32px', height: '400px' }}>
                            <img
                                src={offer.image}
                                alt={offer.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div className="absolute inset-0" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }}></div>

                            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full" style={{ position: 'absolute', bottom: 0, left: 0, padding: '3rem', width: '100%' }}>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold text-sm mb-4"
                                    style={{ backgroundColor: offer.color, display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', color: 'white', fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    <Tag size={16} />
                                    {offer.discount}
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontSize: '2.25rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>{offer.title}</h3>
                                <p className="text-gray-300 text-lg md:text-xl max-w-md hidden sm:block" style={{ color: '#d1d5db', fontSize: '1.125rem', maxWidth: '28rem' }}>{offer.description}</p>

                                <div className="mt-8 flex items-center justify-between" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <button className="bg-white text-[#1A1A1A] px-8 py-3 rounded-full font-bold hover:bg-[#FF6B00] hover:text-white transition-all transform hover:-translate-y-1"
                                        style={{ backgroundColor: 'white', color: '#1A1A1A', padding: '12px 32px', borderRadius: '9999px', fontWeight: 700 }}>
                                        Order Now
                                    </button>
                                    <div className="flex items-center gap-2 text-white/80 text-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
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
};

export default Offers;
