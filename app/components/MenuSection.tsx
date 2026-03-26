"use client";

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

export default function MenuSection({
    category,
    items,
}: {
    category: MenuCategory;
    items: MenuItem[];
}) {
    return (
        <section
            id={`section-${category.id}`}
            className={styles.section}
        >
            {/* Section Title */}
            <div className={styles.titleRow}>
                <h2 className={styles.title}>
                    <span aria-hidden="true" style={{ marginRight: 10 }}>
                        <FontAwesomeIcon icon={categoryIcon(category.icon)} width={18} height={18} />
                    </span>
                    {category.name}
                </h2>
                <div className={styles.rule} />
            </div>

            {/* Menu Cards Stack */}
            <div className={styles.list}>
                {items.map((item) => (
                    <MenuCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}
