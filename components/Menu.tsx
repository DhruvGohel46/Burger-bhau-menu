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

    const categoryData = useMemo(
        () => allCategories.find((c) => c.id === activeCategory),
        [activeCategory]
    );

    return (
        <section id="menu" className="py-12 md:py-20 bg-[#0B0B0B]">
            <div className="mx-auto max-w-6xl px-4">
                {/* Section Header */}
                <div className="mb-10">
                    <span className="text-brand text-xs font-bold uppercase tracking-[0.15em]">
                        Our Menu
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 flex items-center gap-3">
                        <span className="text-3xl">{categoryData?.icon}</span>
                        {categoryData?.name}
                    </h2>
                    <div className="w-12 h-1 bg-brand rounded-full mt-4" />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {filteredItems.map((item) => (
                        <MenuCard key={item.id} item={item} />
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="py-24 text-center">
                        <p className="text-[#6B6B6B] text-lg">No items in this category.</p>
                    </div>
                )}

                {/* CTA Banner */}
                <div className="mt-16 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden border border-[#2A2A2A]" style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #121212 100%)' }}>
                    <div className="relative z-10">
                        <h4 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            Hungry for more? 🔥
                        </h4>
                        <p className="text-[#6B6B6B] mb-8 max-w-md mx-auto">
                            Visit us for exclusive in-store specials and seasonal treats!
                        </p>
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-white px-8 py-4 rounded-full font-bold active:scale-95 transition-all shadow-[0_8px_32px_rgba(255,107,0,0.3)]"
                        >
                            Order Now
                        </a>
                    </div>
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] -mr-32 -mt-32 bg-brand/10" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[80px] -ml-24 -mb-24 bg-brand/5" />
                </div>
            </div>
        </section>
    );
}
