// Burger Bhau - Dynamic Menu Data Service (Supabase Powered)

import { supabase } from "@/lib/supabase";
import menuData from "./menu.json";

export type MenuVariant = {
    id: string;
    label: string;
    price: number;
};

export type MenuExtra = {
    id: string;
    name: string;
    price: number;
};

export type MenuItem = {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    price?: number;
    variants?: MenuVariant[];
    is_veg?: boolean;
    is_popular?: boolean;
    is_bestseller?: boolean;
    is_recommended?: boolean;
    is_new?: boolean;
    rating?: number;
};

export type MenuCategory = {
    id: string;
    name: string;
    icon: string;
};

function slugifyCategory(name: string) {
    return name
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

// Fallback initial categories
export const categories: MenuCategory[] = menuData.categories.map((name) => ({
    id: slugifyCategory(name),
    name,
    icon: slugifyCategory(name),
}));

// Fallback initial menu items
export const menuItems: MenuItem[] = menuData.items as MenuItem[];

// Export extras
export const extras: MenuExtra[] = ((menuData as unknown as { extras?: MenuExtra[] }).extras ?? []);

// Fetch categories from Supabase
export async function getDynamicCategories(): Promise<MenuCategory[]> {
    try {
        const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
        if (data && data.length > 0) {
            return data.map((c) => ({
                id: c.id || slugifyCategory(c.name),
                name: c.name,
                icon: c.icon || slugifyCategory(c.name),
            }));
        }
    } catch (err) {
        console.error("Error fetching dynamic categories:", err);
    }
    return categories;
}

// Fetch items from Supabase
export async function getDynamicMenuItems(): Promise<MenuItem[]> {
    try {
        const { data, error } = await supabase.from("products").select("*");
        if (data && data.length > 0) {
            return data.map((p) => ({
                id: p.id,
                name: p.name,
                category: p.category,
                description: p.description || "",
                image: p.image,
                price: p.price,
                variants: p.variants || [],
                is_veg: p.is_veg ?? true,
                is_popular: p.is_popular ?? false,
                is_bestseller: p.is_bestseller ?? false,
                is_recommended: p.is_recommended ?? false,
                is_new: p.is_new ?? false,
                rating: p.rating || 4.8,
            }));
        }
    } catch (err) {
        console.error("Error fetching dynamic menu items:", err);
    }
    return menuItems;
}
