'use client';

import { useMemo } from 'react';
import MenuCard from './MenuCard';
import { menuData, allCategories } from '@/data/menu';

interface MenuProps {
    activeCategory: string;
}

export default function Menu({ activeCategory }: MenuProps) {
    const filteredItems = useMemo(() => {
        if (activeCategory === 'swaminarayan') {
            return menuData.filter((item) => item.category.startsWith('swaminarayan'));
        }
        return menuData.filter((item) => item.category === activeCategory);
    }, [activeCategory]);

    const activeCategoryData = useMemo(
        () => allCategories.find((cat) => cat.id === activeCategory),
        [activeCategory]
    );

    return (
        <section id="menu" className="py-12 md:py-20" style={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span
                        className="font-bold tracking-widest uppercase text-xs md:text-sm"
                        style={{ color: 'var(--primary)' }}
                    >
                        Fresh &amp; Fast
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold mt-3 text-gray-900">
                        Taste the <span style={{ color: 'var(--primary)' }}>Burger Bhau</span> Magic
                    </h2>
                    <div
                        className="w-16 h-1.5 mx-auto mt-5 rounded-full"
                        style={{ backgroundColor: 'var(--primary)' }}
                    />
                </div>

                {/* Category Title & Items */}
                <div className="mt-12">
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-2xl font-bold text-gray-900">
                            {activeCategoryData?.name}
                        </h3>
                        <div className="h-px bg-gray-200 flex-grow" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredItems.map((item) => (
                            <MenuCard key={item.id} item={item} />
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="py-20 text-center text-gray-400">
                            No items found in this category.
                        </div>
                    )}
                </div>

                {/* CTA Banner */}
                <div
                    className="mt-16 rounded-[32px] p-8 md:p-12 text-center text-white relative overflow-hidden"
                    style={{ backgroundColor: 'var(--secondary)' }}
                >
                    <div className="relative z-10">
                        <h4 className="text-2xl md:text-3xl font-bold mb-4">Hungry for more?</h4>
                        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                            Visit us for our exclusive offline specials and seasonal treats!
                        </p>
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:brightness-110"
                            style={{ backgroundColor: 'var(--primary)' }}
                        >
                            Order Now
                        </a>
                    </div>
                    <div
                        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32"
                        style={{ backgroundColor: 'rgba(255, 107, 0, 0.1)' }}
                    />
                </div>
            </div>
        </section>
    );
}
