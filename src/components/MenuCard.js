import React from 'react';
import { Plus, Star } from 'lucide-react';

const MenuCard = ({ item }) => {
    return (
        <div className="bg-white rounded-[24px] overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 group border border-gray-100"
            style={{ backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', transition: 'all 0.3s ease', border: '1px solid #f3f4f6' }}>
            <div className="relative h-48 md:h-56 overflow-hidden" style={{ position: 'relative', height: '14rem', overflow: 'hidden' }}>
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm"
                    style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', padding: '4px 12px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} style={{ color: '#eab308', fill: '#eab308' }} />
                    <span className="text-sm font-bold text-gray-800" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1f2937' }}>{item.rating}</span>
                </div>
            </div>

            <div className="p-5 flex flex-col" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                <div className="flex justify-between items-start mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 className="font-bold text-lg md:text-xl text-gray-900 leading-tight group-hover:text-[#FF6B00] transition-colors"
                        style={{ fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.25, color: '#111827' }}>
                        {item.name}
                    </h3>
                    <span className="text-[#FF6B00] font-bold text-xl" style={{ color: '#FF6B00', fontWeight: 700, fontSize: '1.25rem' }}>
                        ${item.price}
                    </span>
                </div>

                <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-2" style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem', flexGrow: 1 }}>
                    {item.description}
                </p>

                <button className="w-full bg-gray-50 hover:bg-[#FF6B00] text-[#1A1A1A] hover:text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group/btn min-h-[48px]"
                    style={{ width: '100%', backgroundColor: '#f9fafb', color: '#1A1A1A', padding: '12px', borderRadius: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', minHeight: '48px' }}>
                    <Plus size={20} />
                    Add to Order
                </button>
            </div>
        </div>
    );
};

export default MenuCard;
