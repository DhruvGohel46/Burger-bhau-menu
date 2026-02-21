'use client';

import { allCategories } from '@/data/menu';

interface CategoriesProps {
    activeCategory: string;
    onCategoryChange: (id: string) => void;
}

export default function Categories({ activeCategory, onCategoryChange }: CategoriesProps) {
    return (
        <div
            className="bg-white py-4 sticky top-[60px] z-30 shadow-sm border-b border-gray-100"
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                    {allCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.id)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all whitespace-nowrap border-2 min-h-[44px]"
                            style={{
                                backgroundColor: activeCategory === cat.id ? 'var(--primary)' : '#f9fafb',
                                borderColor: activeCategory === cat.id ? 'var(--primary)' : '#f3f4f6',
                                color: activeCategory === cat.id ? '#ffffff' : '#4b5563',
                                boxShadow:
                                    activeCategory === cat.id
                                        ? '0 8px 15px -3px rgba(255, 107, 0, 0.2)'
                                        : 'none',
                            }}
                        >
                            <span className="text-lg">{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
