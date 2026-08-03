"use client";

import { motion } from "framer-motion";
import { categories } from "@/app/data/menu";
import { useEffect, useRef, useState } from "react";
import styles from "./CategoryNav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBurger,
    faPizzaSlice,
    faBreadSlice,
    faBoxOpen,
    faUtensils,
} from "@fortawesome/free-solid-svg-icons";

function categoryIcon(iconKey: string) {
    switch (iconKey) {
        case "burger":
            return faBurger;
        case "pizza":
            return faPizzaSlice;
        case "garlic-bread":
            return faBreadSlice;
        case "sandwich":
            return faUtensils;
        case "french-fries":
            return faBoxOpen;
        case "dips":
            return faUtensils;
        default:
            return faUtensils;
    }
}

export default function CategoryNav() {
    const [activeCategory, setActiveCategory] = useState(categories[0].id);
    const scrollRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    // Scroll spy: highlight category based on viewport position
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 140; // offset for sticky header + category bar

            for (let i = categories.length - 1; i >= 0; i--) {
                const section = document.getElementById(`section-${categories[i].id}`);
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveCategory(categories[i].id);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Auto-scroll the chip bar to keep active category visible
    useEffect(() => {
        const activeButton = buttonRefs.current[activeCategory];
        if (activeButton && scrollRef.current) {
            const container = scrollRef.current;
            const buttonLeft = activeButton.offsetLeft;
            const buttonWidth = activeButton.offsetWidth;
            const containerWidth = container.offsetWidth;
            const scrollLeft = buttonLeft - containerWidth / 2 + buttonWidth / 2;
            container.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
    }, [activeCategory]);

    const scrollToCategory = (id: string) => {
        const element = document.getElementById(`section-${id}`);
        if (element) {
            const yOffset = -120; // height of header + category bar
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
            setActiveCategory(id);
        }
    };

    return (
        <div className={styles.wrap}>
            <div
                ref={scrollRef}
                className={styles.scroller}
            >
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            ref={(el) => { buttonRefs.current[cat.id] = el; }}
                            onClick={() => scrollToCategory(cat.id)}
                            className={`${styles.pill} ${isActive ? styles.pillActive : ""}`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeCategoryPill"
                                    className={styles.activeBg}
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}
                            <span className={styles.icon} aria-hidden="true">
                                <FontAwesomeIcon icon={categoryIcon(cat.icon)} width={14} height={14} />
                            </span>
                            {cat.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
