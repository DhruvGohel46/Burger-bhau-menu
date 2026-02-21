import React, { useState } from 'react';

const categories = [
    { id: 'burger', name: 'Burgers', icon: '🍔' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'fries', name: 'Fries', icon: '🍟' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' },
    { id: 'sandwich', name: 'Sandwich', icon: '🥪' },
    { id: 'dessert', name: 'Desserts', icon: '🍦' },
];

const Categories = () => {
    const [active, setActive] = useState('burger');

    return (
        <div className="bg-white py-6 sticky z-30 shadow-sm border-b border-gray-100 overflow-hidden"
            style={{ backgroundColor: '#ffffff', paddingTop: '1.5rem', paddingBottom: '1.5rem', position: 'sticky', top: '60px', zIndex: 30, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderBottom: '1px solid #f3f4f6' }}>
            <div className="container mx-auto px-4">
                <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar pb-2 pt-1"
                    style={{ display: 'flex', alignItems: 'center', gap: '16px', overflowX: 'auto', paddingBottom: '8px', paddingTop: '4px' }}>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActive(cat.id)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap border-2 min-h-[48px]`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 24px',
                                borderRadius: '9999px',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                border: '2px solid',
                                minHeight: '48px',
                                backgroundColor: active === cat.id ? '#FF6B00' : '#f9fafb',
                                borderColor: active === cat.id ? '#FF6B00' : '#f3f4f6',
                                color: active === cat.id ? '#ffffff' : '#4b5563',
                                boxShadow: active === cat.id ? '0 10px 15px -3px rgba(255, 107, 0, 0.2)' : 'none'
                            }}
                        >
                            <span style={{ fontSize: '1.25rem' }}>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;
