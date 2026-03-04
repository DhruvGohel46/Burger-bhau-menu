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
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.8 }}
                    className="absolute top-0 right-0 z-50 w-full h-full md:w-[450px] lg:w-[500px] bg-black/85 backdrop-blur-2xl border-l border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-y-auto"
                >
                    <div className="p-8 md:p-12 min-h-full flex flex-col relative">
                        {/* Ambient Background Noise/Texture */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

                        <div className="flex justify-between items-center mb-12 relative z-10">
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                                className="text-3xl md:text-5xl font-serif tracking-widest text-red-50 font-bold drop-shadow-[0_5px_15px_rgba(220,38,38,0.3)] uppercase"
                            >
                                {data.title}
                            </motion.h2>
                            <motion.button
                                onClick={onClose}
                                className="p-3 fixed md:static top-6 right-6 z-50 rounded-full text-white/50 hover:text-red-500 bg-black/50 md:bg-white/5 md:hover:bg-white/10 transition-colors border border-white/10 hover:border-red-500/30 backdrop-blur-md"
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Close panel"
                            >
                                <X className="w-5 h-5 md:w-6 md:h-6" />
                            </motion.button>
                        </div>

                        <div className="flex-1 flex flex-col gap-5 relative z-10 mt-4 md:mt-0">
                            {data.flavors.map((flavor, index) => (
                                <motion.div
                                    key={flavor.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    className="p-5 md:p-6 rounded-xl bg-linear-to-r from-white/3 to-transparent border border-white/5 hover:border-red-500/20 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                                        <h3 className="text-xl md:text-2xl font-light text-white/80 tracking-wide group-hover:text-red-100 transition-colors duration-300">
                                            {flavor.name}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="h-px w-8 bg-white/10 group-hover:bg-red-500/30 transition-colors duration-300 hidden md:block" />
                                            <span className="text-lg md:text-xl text-amber-500/60 font-medium font-mono tracking-wider group-hover:text-amber-400 transition-colors duration-300">
                                                ₹{flavor.price}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="mt-16 mb-4 text-center text-red-500/20 text-xs md:text-sm tracking-[0.3em] uppercase font-serif"
                        >
                            Choose your fate
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
