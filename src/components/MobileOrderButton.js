import React from 'react';
import { ShoppingBag } from 'lucide-react';

const MobileOrderButton = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-[60] animate-slide-up"
            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem', zIndex: 60 }}>
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 p-2 rounded-[28px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex items-center justify-between"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '8px',
                    borderRadius: '28px',
                    boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                <div className="flex flex-col ml-6" style={{ display: 'flex', flexDirection: 'column', marginLeft: '1.5rem' }}>
                    <span className="text-gray-500 text-xs font-medium uppercase tracking-wider" style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Order</span>
                    <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="text-xl font-bold text-gray-900" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>$0.00</span>
                        <span className="text-gray-400 text-xs" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>(0 items)</span>
                    </div>
                </div>

                <button className="bg-[#FF6B00] text-white px-8 py-4 rounded-[22px] font-bold flex items-center gap-3 shadow-lg transition-all min-h-[48px]"
                    style={{
                        backgroundColor: '#FF6B00',
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '22px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        minHeight: '48px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(255, 107, 0, 0.3)'
                    }}>
                    <ShoppingBag size={20} />
                    Order Now
                </button>
            </div>
        </div>
    );
};

export default MobileOrderButton;
