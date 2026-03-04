"use client";

import { motion, AnimatePresence } from "framer-motion";

interface OverlayProps {
    isVisible: boolean;
    onClick: () => void;
}

export default function Overlay({ isVisible, onClick }: OverlayProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={onClick}
                    aria-hidden="true"
                />
            )}
        </AnimatePresence>
    );
}
