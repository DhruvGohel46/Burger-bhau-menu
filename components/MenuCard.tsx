'use client';

import { Plus } from 'lucide-react';
import { MenuItem } from '@/data/menu';

interface MenuCardProps {
    item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
    const hasDualPrice = typeof item.price === 'object';

    return (
        <div className="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-5 flex flex-col h-full group hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_8px_32px_rgba(255,107,0,0.08)] transition-all duration-300">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                {item.isVegetarian && (
                    <div className="w-4 h-4 border-2 border-green-500 rounded-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                )}
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand/60">
                    {item.category.replace(/-/g, ' ')}
                </span>
            </div>

            {/* Name */}
            <h3 className="text-white font-bold text-lg leading-snug mb-1.5 group-hover:text-brand transition-colors duration-200">
                {item.name}
            </h3>

            {/* Description */}
            <p className="text-[#6B6B6B] text-sm mb-5 flex-grow leading-relaxed">
                {item.description}
            </p>

            {/* Price + CTA */}
            <div className="mt-auto space-y-3.5">
                {hasDualPrice ? (
                    <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-3 text-center">
                            <span className="block text-[10px] text-[#6B6B6B] uppercase font-semibold tracking-wider mb-0.5">
                                Plain
                            </span>
                            <span className="text-white font-bold text-lg">
                                ₹{(item.price as { withoutCheese: number; withCheese: number }).withoutCheese}
                            </span>
                        </div>
                        <div className="bg-brand/8 border border-brand/15 rounded-xl p-3 text-center">
                            <span className="block text-[10px] text-brand/60 uppercase font-semibold tracking-wider mb-0.5">
                                Cheese
                            </span>
                            <span className="text-brand font-bold text-lg">
                                ₹{(item.price as { withoutCheese: number; withCheese: number }).withCheese}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 py-3">
                        <span className="text-[#6B6B6B] text-sm font-medium">Price</span>
                        <span className="text-brand font-bold text-xl">₹{item.price as number}</span>
                    </div>
                )}

                <button className="w-full bg-brand hover:bg-brand-light text-white py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-[0_4px_20px_rgba(255,107,0,0.2)] hover:shadow-[0_6px_28px_rgba(255,107,0,0.35)]">
                    <Plus size={16} strokeWidth={2.5} />
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
