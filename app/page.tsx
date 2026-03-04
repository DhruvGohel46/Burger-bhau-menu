"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import MapHotspot from "@/components/MapHotspot";
import FlavorPanel from "@/components/FlavorPanel";
import Overlay from "@/components/Overlay";

// Using user-provided custom local images for desktop and mobile
const MAP_IMAGE_DESKTOP = "/bigscreen.png";
const MAP_IMAGE_MOBILE = "/smallscreen.png";

export default function InteractiveMap() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Parallax effect variables
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring for parallax
    const springConfig = { damping: 25, stiffness: 70, mass: 1 };
    const parallaxX = useSpring(mouseX, springConfig);
    const parallaxY = useSpring(mouseY, springConfig);

    useEffect(() => {
        setIsMounted(true);
        // Attach mouse move listener to window for parallax
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate from -25 to 25 mapping (-25px shift) depending on center
            const x = (e.clientX / window.innerWidth - 0.5) * -50;
            const y = (e.clientY / window.innerHeight - 0.5) * -50;
            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const handleHotspotClick = (category: string) => {
        setSelectedCategory(category);
    };

    const closePanel = () => {
        setSelectedCategory(null);
    };

    // Prevent hydation mismatch on styled client components
    if (!isMounted) return <div className="min-h-screen bg-black" />;

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#050505] selection:bg-red-900/40 select-none font-inter">

            {/* Immersive Parallax Map Background */}
            <motion.div
                className="absolute inset-[-60px] w-[calc(100%+120px)] h-[calc(100%+120px)] origin-center"
                style={{ x: parallaxX, y: parallaxY }}
                animate={{ scale: selectedCategory ? 1.05 : 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Desktop Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 hidden md:block"
                    style={{
                        backgroundImage: `url(${MAP_IMAGE_DESKTOP})`,
                        filter: selectedCategory ? "contrast(1.3) brightness(0.4) sepia(0.3) hue-rotate(-15deg) blur(2px)" : "contrast(1.2) brightness(0.6) sepia(0.2) hue-rotate(-10deg)"
                    }}
                />

                {/* Mobile Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 block md:hidden"
                    style={{
                        backgroundImage: `url(${MAP_IMAGE_MOBILE})`,
                        filter: selectedCategory ? "contrast(1.3) brightness(0.4) sepia(0.3) hue-rotate(-15deg) blur(2px)" : "contrast(1.2) brightness(0.6) sepia(0.2) hue-rotate(-10deg)"
                    }}
                />

                {/* HELPER: Click anywhere on the map to get percentage coordinates for hotspots */}
                <div
                    className="absolute inset-0 z-0 cursor-crosshair"
                    onClick={(e) => {
                        if (selectedCategory) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        const msg = `New Hotspot -> top: "${y.toFixed(1)}%", left: "${x.toFixed(1)}%"`;
                        console.log(msg);
                        alert(msg + "\n\n(Coordinates logged to browser console!)");
                    }}
                />

                {/* Dark Overlays & Cinematic Vignette */}
                <div
                    className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-1000"
                    style={{ opacity: selectedCategory ? 0.7 : 0.4 }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)] pointer-events-none mix-blend-multiply" />

                {/* Fog Layers */}
                <motion.div
                    className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none"
                />
                <motion.div
                    className="absolute top-0 left-0 w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"
                    animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />

                {/* Hotspots */}
                {/* Burger (top-left) */}
                <MapHotspot id="burger" top="28%" left="22%" onClick={() => handleHotspotClick("burger")} />

                {/* Special Burger (top-center) */}
                <MapHotspot id="special_burger" top="20%" left="50%" onClick={() => handleHotspotClick("special_burger")} />

                {/* Pizza (top-right) */}
                <MapHotspot id="pizza" top="30%" left="78%" onClick={() => handleHotspotClick("pizza")} />

                {/* Garlic Bread (mid-left) */}
                <MapHotspot id="garlic_bread" top="55%" left="18%" onClick={() => handleHotspotClick("garlic_bread")} />

                {/* Sandwich (center) */}
                <MapHotspot id="sandwich" top="50%" left="50%" onClick={() => handleHotspotClick("sandwich")} />

                {/* French Fries (bottom-left) */}
                <MapHotspot id="french_fries" top="75%" left="28%" onClick={() => handleHotspotClick("french_fries")} />

                {/* Swaminarayan (bottom-right) */}
                <MapHotspot id="swaminarayan" top="70%" left="75%" onClick={() => handleHotspotClick("swaminarayan")} />
            </motion.div>

            {/* Global Context Overlay when active */}
            <Overlay isVisible={selectedCategory !== null} onClick={closePanel} />

            {/* Flavor Panel */}
            <FlavorPanel category={selectedCategory} onClose={closePanel} />
        </div>
    );
}
