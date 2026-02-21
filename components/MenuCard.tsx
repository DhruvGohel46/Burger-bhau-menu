'use client';

import { Plus } from 'lucide-react';
import { MenuItem } from '@/data/menu';

interface MenuCardProps {
    item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
    const hasDualPrice = typeof item.price === 'object';

    return (
        <div
            className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-500 group border border-gray-100 flex flex-col h-full"
        >
            <div className="p-5 flex flex-col flex-grow">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            {item.isVegetarian && (
                                <div
                                    className="w-4 h-4 border-2 border-green-600 flex items-center justify-center"
                                    style={{ borderRadius: '2px' }}
                                >
                                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                                </div>
                            )}
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                                {item.category.replace(/-/g, ' ')}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg md:text-xl text-gray-900 leading-tight group-hover:text-[#FF6B00] transition-colors">
                            {item.name}
                        </h3>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">
                    {item.description}
                </p>

                {/* Price & CTA */}
                <div className="mt-auto space-y-4">
                    {hasDualPrice ? (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 p-3 rounded-2xl flex flex-col items-center justify-center border border-gray-100">
                                <span className="text-[10px] text-gray-400 font-medium uppercase">Plain</span>
                                <span className="text-[#1A1A1A] font-bold text-lg">
                                    ₹{(item.price as { withoutCheese: number; withCheese: number }).withoutCheese}
                                </span>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-2xl flex flex-col items-center justify-center border border-orange-100">
                                <span className="text-[10px] text-orange-400 font-medium uppercase">Cheese</span>
                                <span className="text-[#FF6B00] font-bold text-lg">
                                    ₹{(item.price as { withoutCheese: number; withCheese: number }).withCheese}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                            <span className="text-gray-500 font-medium">Price</span>
                            <span className="text-[#FF6B00] font-bold text-xl">₹{item.price as number}</span>
                        </div>
                    )}

                    <button
                        className="w-full text-white py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-200"
                        style={{ backgroundColor: 'var(--secondary)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--secondary)')}
                    >
                        <Plus size={18} />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
