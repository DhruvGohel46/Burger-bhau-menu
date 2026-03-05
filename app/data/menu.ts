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

export const categories: MenuCategory[] = menuData.categories.map((name) => ({
    id: slugifyCategory(name),
    name,
    icon: slugifyCategory(name),
}));

export const menuItems: MenuItem[] = menuData.items as MenuItem[];

export const extras: MenuExtra[] = ((menuData as unknown as { extras?: MenuExtra[] }).extras ?? []);
