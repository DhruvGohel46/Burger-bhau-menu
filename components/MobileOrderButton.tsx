import { ShoppingBag } from 'lucide-react';

export default function MobileOrderButton() {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-[60] animate-slide-up">
            <div
                className="p-2 rounded-[28px] flex items-center justify-between"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
                }}
            >
                <div className="flex flex-col ml-6">
                    <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                        Your Order
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">₹0.00</span>
                        <span className="text-gray-400 text-xs">(0 items)</span>
                    </div>
                </div>

                <button
                    className="text-white px-8 py-4 rounded-[22px] font-bold flex items-center gap-3 shadow-lg min-h-[48px]"
                    style={{
                        backgroundColor: 'var(--primary)',
                        boxShadow: '0 10px 15px -3px rgba(255, 107, 0, 0.3)',
                    }}
                >
                    <ShoppingBag size={20} />
                    Order Now
                </button>
            </div>
        </div>
    );
}
