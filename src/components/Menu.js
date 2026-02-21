import React from 'react';
import MenuCard from './MenuCard';

const menuItems = [
    {
        id: 1,
        name: "Classic Supreme Burger",
        price: 12.99,
        description: "Double beef patty with melted cheddar, fresh lettuce, tomatoes, and our secret sauce.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998&auto=format&fit=crop",
        rating: 4.8
    },
    {
        id: 2,
        name: "Spicy Zinger Chicken",
        price: 10.99,
        description: "Crispy fried chicken breast with spicy mayo and tangy pickles on a toasted bun.",
        image: "https://images.unsplash.com/photo-1508736793122-f516e3ba5555?q=80&w=2000&auto=format&fit=crop",
        rating: 4.7
    },
    {
        id: 3,
        name: "Margherita Fresh Pizza",
        price: 14.99,
        description: "Hand-tossed crust topped with premium mozzarella, basil leaves, and balsamic glaze.",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2070&auto=format&fit=crop",
        rating: 4.9
    },
    {
        id: 4,
        name: "Loaded Peri Peri Fries",
        price: 6.99,
        description: "Golden fries tossed in peri-peri seasoning, topped with cheese sauce and jalapeños.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1974&auto=format&fit=crop",
        rating: 4.6
    },
    {
        id: 5,
        name: "BBQ Smokehouse Burger",
        price: 13.99,
        description: "Beef patty with crispy onion rings, smoked bacon, and rich BBQ hickory sauce.",
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f1?q=80&w=2071&auto=format&fit=crop",
        rating: 4.8
    },
    {
        id: 6,
        name: "Creamy Mushroom Pizza",
        price: 15.99,
        description: "White sauce pizza with button mushrooms, truffle oil, and fresh parmesan cheese.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
        rating: 4.7
    }
];

const Menu = () => {
    return (
        <section id="menu" className="py-20" style={{ paddingTop: '5rem', paddingBottom: '5rem', backgroundColor: 'rgba(249, 250, 251, 0.3)' }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span className="text-[#FF6B00] font-bold tracking-widest uppercase text-sm" style={{ color: '#FF6B00', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.875rem' }}>Our Signature</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900" style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#111827' }}>Explore Our <span className="text-[#FF6B00]" style={{ color: '#FF6B00' }}>Menu</span></h2>
                    <div className="w-20 h-1.5 bg-[#FF6B00] mx-auto mt-4 rounded-full" style={{ width: '5rem', height: '0.375rem', backgroundColor: '#FF6B00', margin: '1rem auto 0', borderRadius: '9999px' }}></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10" style={{ display: 'grid', gap: '2.5rem' }}>
                    {menuItems.map((item) => (
                        <MenuCard key={item.id} item={item} />
                    ))}
                </div>

                <div className="mt-16 text-center" style={{ marginTop: '4rem', textAlign: 'center' }}>
                    <button className="inline-flex items-center gap-2 text-gray-900 font-bold hover:text-[#FF6B00] transition-colors group" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#111827' }}>
                        View All Menu Items
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-all" style={{ width: '32px', height: '32px', borderRadius: '9999px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            →
                        </div>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Menu;
