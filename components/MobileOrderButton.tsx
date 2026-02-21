import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function MobileOrderButton() {
    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden animate-slide-up">
            <div
                className="p-2.5 rounded-2xl flex items-center justify-between border border-[#2A2A2A]/60"
                style={{
                    background: 'rgba(26, 26, 26, 0.92)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.5)',
                }}
            >
                <div className="flex items-center gap-3 ml-2.5">
                    <div className="w-9 h-9 bg-brand/15 rounded-lg flex items-center justify-center">
                        <ShoppingBag size={16} className="text-brand" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#6B6B6B] text-[10px] font-bold uppercase tracking-wider">
                            Your Cart
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-white font-bold text-base">₹0</span>
                            <span className="text-[#3A3A3A] text-xs">· 0 items</span>
                        </div>
                    </div>
                </div>

                <button className="bg-brand hover:bg-brand-light text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 active:scale-95 transition-all shadow-[0_4px_20px_rgba(255,107,0,0.3)]">
                    View Cart
                    <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
}
