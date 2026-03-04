"use client";

import { motion } from "framer-motion";

interface MapHotspotProps {
    id: string;
    top: string;
    left: string;
    onClick: () => void;
}

export default function MapHotspot({ id, top, left, onClick }: MapHotspotProps) {
    const label = id.replace('_', ' ');

    return (
        <motion.button
            onClick={onClick}
            className="absolute z-10 w-16 h-16 md:w-24 md:h-24 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer focus:outline-none flex items-center justify-center group"
            style={{ top, left }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`View ${label}`}
        >
            {/* Invisible interactive zone with hover glow pulse */}
            <div className="absolute inset-0 rounded-full border border-red-500/0 group-hover:border-red-500/40 transition-colors duration-500 bg-black/0 group-hover:bg-red-900/10" />

            {/* Center glowing dot */}
            <motion.div
                className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-600/70 shadow-[0_0_15px_8px_rgba(220,38,38,0.4)]"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Label on Hover */}
            <div className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white/90 text-xs md:text-sm font-semibold tracking-[0.15em] uppercase whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {label}
            </div>
        </motion.button>
    );
}
