'use client';

import { allCategories } from '@/data/menu';

interface CategoriesProps {
    activeCategory: string;
    onCategoryChange: (id: string) => void;
}

export default function Categories({ activeCategory, onCategoryChange }: CategoriesProps) {
    return (
        <div
            className="sticky top-16 z-30 py-3.5 border-b border-[#2A2A2A]/60"
            style={{
                background: 'rgba(11, 11, 11, 0.9)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
            }}
        >
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
                    {allCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 active:scale-95 shrink-0 ${activeCategory === cat.id
                                    ? 'bg-brand text-white shadow-[0_4px_20px_rgba(255,107,0,0.3)]'
                                    : 'bg-[#1A1A1A] text-[#A0A0A0] border border-[#2A2A2A] hover:bg-[#222] hover:text-white'
                                }`}
                        >
                            <span className="text-base">{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
