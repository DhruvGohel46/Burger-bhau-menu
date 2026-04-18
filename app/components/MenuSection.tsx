"use client";

import { motion, type Variants } from "framer-motion";
import MenuCard from "./MenuCard";
import type { MenuCategory, MenuItem } from "@/app/data/menu";
import styles from "./MenuSection.module.css";
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

const sectionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.1,
        },
    },
};

export default function MenuSection({
    category,
    items,
    index = 0,
}: {
    category: MenuCategory;
    items: MenuItem[];
    index?: number;
}) {
    return (
        <section
            id={`section-${category.id}`}
            className={styles.section}
        >
            {/* Section Title */}
            <motion.div
                className={styles.titleRow}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
            >
                <h2 className={styles.title}>
                    <span aria-hidden="true" className={styles.titleIcon}>
                        <FontAwesomeIcon icon={categoryIcon(category.icon)} width={18} height={18} />
                    </span>
                    {category.name}
                </h2>
                <div className={styles.rule} />
            </motion.div>

            {/* Menu Cards Stack */}
            <motion.div
                className={styles.list}
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
            >
                {items.map((item) => (
                    <MenuCard key={item.id} item={item} />
                ))}
            </motion.div>
        </section>
    );
}
