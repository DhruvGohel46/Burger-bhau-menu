export interface Flavor {
    name: string;
    price: number;
}

export interface CategoryData {
    title: string;
    flavors: Flavor[];
}

export const menuData: Record<string, CategoryData> = {
    burger: {
        title: "Burger",
        flavors: [
            { name: "Classic Beef", price: 199 },
            { name: "Cheese Burst", price: 229 },
            { name: "Smoky BBQ", price: 249 },
        ],
    },
    special_burger: {
        title: "Special Burger",
        flavors: [
            { name: "Monster Double", price: 349 },
            { name: "Spicy Ghost Pepper", price: 299 },
        ]
    },
    pizza: {
        title: "Pizza",
        flavors: [
            { name: "Margherita", price: 299 },
            { name: "Farmhouse", price: 349 },
            { name: "Pepperoni", price: 399 },
        ],
    },
    garlic_bread: {
        title: "Garlic Bread",
        flavors: [
            { name: "Classic Cheese", price: 149 },
            { name: "Spicy Supreme", price: 179 },
        ],
    },
    sandwich: {
        title: "Sandwich",
        flavors: [
            { name: "Club Sandwich", price: 199 },
            { name: "Grilled Veg", price: 149 },
        ],
    },
    french_fries: {
        title: "French Fries",
        flavors: [
            { name: "Salted", price: 99 },
            { name: "Peri Peri", price: 129 },
            { name: "Cheesy Loaded", price: 179 },
        ],
    },
    swaminarayan: {
        title: "Swaminarayan",
        flavors: [
            { name: "Jain Burger", price: 189 },
            { name: "No Onion/Garlic Pizza", price: 289 },
        ],
    }
};
