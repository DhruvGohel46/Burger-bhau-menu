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
            className="absolute z-10 w-24 h-16 md:w-40 md:h-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none flex items-center justify-center group"
            style={{ top, left }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`View ${label}`}
        >
            {/* Invisible interactive zone - fully transparent, no text, no glowing dots */}
            <div className="absolute inset-0 bg-transparent" />
        </motion.button>
    );
}
