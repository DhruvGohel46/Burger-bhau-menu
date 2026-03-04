"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { menuData } from "@/data/menuData";

interface FlavorPanelProps {
    category: string | null;
    onClose: () => void;
}

export default function FlavorPanel({ category, onClose }: FlavorPanelProps) {
    const data = category ? menuData[category] : null;

    return (
        <AnimatePresence>
            {category && data && (
                <motion.div
                    key="flavor-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-50 min-h-screen flex items-center justify-center p-4 md:p-6"
                >
                    {/* Dark overlay behind panel */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" onClick={onClose} />

                    {/* Background Fix: Premium Haunted Menu Slab */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 15 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-[440px] px-8 py-12 flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar bg-linear-to-b from-[#0d0f14] via-[#11131a] to-[#090b0f] rounded-xl border border-red-500/15 shadow-[0_0_40px_rgba(255,0,0,0.08)]"
                    >
                        {/* Subtle grain texture overlay */}
                        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay rounded-xl pointer-events-none" />

                        {/* Subtle radial highlight behind content to reduce flat blackness */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none rounded-xl" />

                        {/* Improved Close Button: Circular outline with blood glow on hover */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full border border-gray-600/30 text-gray-500 hover:text-red-500 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all duration-300 z-20"
                            aria-label="Close panel"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col items-center mb-10 w-full relative z-10">
                            {/* Typography Hierarchy Level 1: Subtitle */}
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.8 }}
                                className="text-[9px] text-gray-400/80 tracking-[0.3em] uppercase mb-4"
                            >
                                Forbidden Selection
                            </motion.span>

                            {/* Typography Hierarchy Level 2: Heading Fix */}
                            <motion.h2
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="text-3xl md:text-4xl font-gothic tracking-widest text-transparent bg-clip-text bg-linear-to-b from-[#ff3b3b] via-[#b31217] to-[#73050a] uppercase text-center drop-shadow-[0_0_8px_rgba(179,18,23,0.3)]"
                            >
                                {data.title}
                            </motion.h2>

                            {/* Thin subtle divider line */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="w-16 h-px bg-[#b31217]/40 mt-6 shadow-[0_0_5px_rgba(179,18,23,0.5)]"
                            />
                        </div>

                        {/* Card Redesign: Fine-Dining Dotted Leader Lines */}
                        <div className="flex-1 flex flex-col space-y-6 relative z-10 px-2 mt-2 cursor-default">
                            {data.flavors.map((flavor, index) => (
                                <motion.div
                                    key={flavor.name}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                    className="flex items-center justify-between w-full group transition-transform duration-300 hover:scale-[1.02]"
                                >
                                    {/* Typography Hierarchy Level 3: Elegant Serif Item Names (Title Case looks elegant with Gothic font) */}
                                    <h3 className="text-lg tracking-wide text-gray-200 group-hover:text-white font-gothic transition-colors capitalize">
                                        {flavor.name.toLowerCase()}
                                    </h3>

                                    {/* Dotted Leader Line */}
                                    <div className="grow mx-4 relative overflow-hidden h-4">
                                        <div className="absolute top-1/2 w-full border-b-2 border-dotted border-gray-600/30 group-hover:border-[#b31217]/40 transition-colors duration-300 transform -translate-y-1/2" />
                                    </div>

                                    {/* Price Right Aligned */}
                                    <span className="text-base text-amber-500/90 group-hover:text-amber-400 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] font-medium font-mono transition-all duration-300 shrink-0">
                                        ₹{flavor.price}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Elegantly Minimal Footer */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 1 }}
                            className="mt-14 text-center text-gray-500/40 text-[9px] uppercase tracking-widest relative z-10 font-sans"
                        >
                            Since 2026
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
