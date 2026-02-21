export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'burger' | 'pizza' | 'sandwich';
  description: string;
}

export const menuData: MenuItem[] = [
  // Regular Burgers
  {
    id: '1',
    name: 'Veg Aloo Tikki',
    price: 30,
    category: 'burger',
    description: 'Crispy outer layer with soft, spiced potato inside. Mild spice, desi masala taste, filling and comforting.'
  },
  {
    id: '2',
    name: 'Veg Aloo Tikki (With Cheese)',
    price: 40,
    category: 'burger',
    description: 'Crispy outer layer with soft, spiced potato inside. Mild spice, desi masala taste, filling and comforting, topped with melted cheese.'
  },
  {
    id: '3',
    name: 'Schezwan',
    price: 30,
    category: 'burger',
    description: 'Schezwan sauce gives sharp chilli heat and slight garlic punch. Spicy with a bold red-chilli aftertaste.'
  },
  {
    id: '4',
    name: 'Schezwan (With Cheese)',
    price: 40,
    category: 'burger',
    description: 'Schezwan sauce gives sharp chilli heat and slight garlic punch. Spicy with a bold red-chilli aftertaste, balanced with melted cheese.'
  },
  {
    id: '5',
    name: 'Customized',
    price: 30,
    category: 'burger',
    description: 'Balanced flavors based on sauce choice. Mild to medium spice depending on mix, smooth and easy to eat.'
  },
  {
    id: '6',
    name: 'Customized (With Cheese)',
    price: 40,
    category: 'burger',
    description: 'Balanced flavors based on sauce choice. Mild to medium spice depending on mix, smooth and easy to eat, topped with melted cheese.'
  },
  {
    id: '7',
    name: 'Garlic',
    price: 30,
    category: 'burger',
    description: 'Strong roasted garlic aroma with buttery notes. Savory, slightly salty, and long-lasting garlic finish.'
  },
  {
    id: '8',
    name: 'Garlic (With Cheese)',
    price: 40,
    category: 'burger',
    description: 'Strong roasted garlic aroma with buttery notes. Savory, slightly salty, and long-lasting garlic finish, enhanced with melted cheese.'
  },
  {
    id: '9',
    name: 'Stuffed',
    price: 30,
    category: 'burger',
    description: 'Extra filling inside the patty. Rich, spicy, and heavy with a slow heat build-up.'
  },
  {
    id: '10',
    name: 'Stuffed (With Cheese)',
    price: 40,
    category: 'burger',
    description: 'Extra filling inside the patty. Rich, spicy, and heavy with a slow heat build-up, topped with melted cheese.'
  },
  {
    id: '11',
    name: 'Mayonnaise',
    price: 30,
    category: 'burger',
    description: 'Creamy and smooth texture. Mild taste with a cool finish that balances spice.'
  },
  {
    id: '12',
    name: 'Mayonnaise (With Cheese)',
    price: 40,
    category: 'burger',
    description: 'Creamy and smooth texture. Mild taste with a cool finish that balances spice, layered with melted cheese.'
  },
  
  // Special Burgers
  {
    id: '13',
    name: 'Peri Peri',
    price: 50,
    category: 'burger',
    description: 'Tangy peri peri masala with lemon sharpness. Starts sour, ends spicy with dry heat.'
  },
  {
    id: '14',
    name: 'Peri Peri (With Cheese)',
    price: 60,
    category: 'burger',
    description: 'Tangy peri peri masala with lemon sharpness. Starts sour, ends spicy with dry heat, balanced with melted cheese.'
  },
  {
    id: '15',
    name: 'Mexican',
    price: 50,
    category: 'burger',
    description: 'Smoky spices, tangy sauce, and herbs. Medium spice with a slightly sour tomato finish.'
  },
  {
    id: '16',
    name: 'Mexican (With Cheese)',
    price: 60,
    category: 'burger',
    description: 'Smoky spices, tangy sauce, and herbs. Medium spice with a slightly sour tomato finish, topped with melted cheese.'
  },
  {
    id: '17',
    name: 'Tandoori',
    price: 50,
    category: 'burger',
    description: 'Warm tandoori masala flavor. Earthy spices with smoky notes and medium heat.'
  },
  {
    id: '18',
    name: 'Tandoori (With Cheese)',
    price: 60,
    category: 'burger',
    description: 'Warm tandoori masala flavor. Earthy spices with smoky notes and medium heat, enhanced with melted cheese.'
  },
  {
    id: '19',
    name: 'Chipotle',
    price: 50,
    category: 'burger',
    description: 'Smoky chilli flavor with mild sweetness. Balanced heat, rich sauce texture.'
  },
  {
    id: '20',
    name: 'Chipotle (With Cheese)',
    price: 60,
    category: 'burger',
    description: 'Smoky chilli flavor with mild sweetness. Balanced heat, rich sauce texture, topped with melted cheese.'
  },
  {
    id: '21',
    name: 'Makhni',
    price: 50,
    category: 'burger',
    description: 'Creamy butter masala taste. Mild spice, smooth texture, rich and comforting.'
  },
  {
    id: '22',
    name: 'Makhni (With Cheese)',
    price: 60,
    category: 'burger',
    description: 'Creamy butter masala taste. Mild spice, smooth texture, rich and comforting, layered with melted cheese.'
  },
  
  // Sandwiches
  {
    id: '23',
    name: 'Cheese Chilly',
    price: 30,
    category: 'sandwich',
    description: 'Cheese melts first, then green chilli hits. Medium spice with warm aftertaste.'
  },
  {
    id: '24',
    name: 'Cheese Schezwan',
    price: 40,
    category: 'sandwich',
    description: 'Spicy schezwan sauce mixed with cheese. Strong chilli flavor with garlic undertone.'
  },
  {
    id: '25',
    name: 'Double Cheese Chilly',
    price: 50,
    category: 'sandwich',
    description: 'Heavy cheese with chilli kick. Creamy at first, spicy later.'
  },
  {
    id: '26',
    name: 'Cheese Corn',
    price: 50,
    category: 'sandwich',
    description: 'Sweet corn balances cheese. Mild, sweet, and smooth with soft texture.'
  },
  {
    id: '27',
    name: 'Cheese Chilly Corn',
    price: 60,
    category: 'sandwich',
    description: 'Sweet corn + chilli spice + cheese. Mixed flavors with medium heat.'
  },
  {
    id: '28',
    name: 'Cheese Garlic',
    price: 50,
    category: 'sandwich',
    description: 'Roasted garlic dominates the bite. Strong aroma, buttery and savory finish.'
  },
  
  // Pizzas
  {
    id: '29',
    name: 'Veg Pizza',
    price: 50,
    category: 'pizza',
    description: 'Fresh vegetables with light seasoning. Mild spice, juicy toppings.'
  },
  {
    id: '30',
    name: 'Double Cheese',
    price: 80,
    category: 'pizza',
    description: 'Extra cheese layer. Thick, creamy, and filling with mild saltiness.'
  },
  {
    id: '31',
    name: '4 Cheesy Pizza',
    price: 100,
    category: 'pizza',
    description: 'Rich blend of cheeses. Heavy, creamy, and indulgent.'
  },
  {
    id: '32',
    name: 'Cheese Corn Pizza',
    price: 100,
    category: 'pizza',
    description: 'Sweet corn with melted cheese. Mild taste, soft and juicy.'
  },
  {
    id: '33',
    name: 'Italian Pizza',
    price: 100,
    category: 'pizza',
    description: 'Herbs and tomato flavors. Light tanginess with mild spice.'
  },
  {
    id: '34',
    name: 'Margherita Pizza',
    price: 80,
    category: 'pizza',
    description: 'Classic cheese and sauce balance. Simple, clean taste.'
  },
  {
    id: '35',
    name: 'Tandoori Paneer',
    price: 150,
    category: 'pizza',
    description: 'Paneer coated in tandoori masala. Smoky, spicy, and rich.'
  },
  {
    id: '36',
    name: 'Makhni Paneer',
    price: 150,
    category: 'pizza',
    description: 'Butter masala flavored paneer. Creamy, mild spice, rich gravy taste.'
  },
  {
    id: '37',
    name: 'Peri Peri Paneer',
    price: 150,
    category: 'pizza',
    description: 'Tangy lemon spice with paneer. Sharp heat and strong aftertaste.'
  },
  {
    id: '38',
    name: 'Cheese Burst',
    price: 150,
    category: 'pizza',
    description: 'Liquid cheese inside the base. Extremely creamy and heavy.'
  },
  {
    id: '39',
    name: '7 Cheesy Pizza',
    price: 200,
    category: 'pizza',
    description: 'Loaded with multiple cheeses. Very rich, thick, and indulgent.'
  },
  
  // Garlic Bread
  {
    id: '40',
    name: 'Cheese Garlic Bread',
    price: 50,
    category: 'sandwich',
    description: 'Crunchy bread with garlic butter and cheese. Strong garlic aroma.'
  },
  {
    id: '41',
    name: '2 Cheese Garlic Bread',
    price: 100,
    category: 'sandwich',
    description: 'Double portion. Extra cheese, heavier and more filling.'
  },
  
  // French Fries
  {
    id: '42',
    name: 'Classic Fries',
    price: 50,
    category: 'sandwich',
    description: 'Crispy outside, fluffy inside. Light salt, clean potato taste.'
  },
  {
    id: '43',
    name: 'Peri Peri Fries',
    price: 60,
    category: 'sandwich',
    description: 'Tangy lemon spice with chilli heat. Dry spicy finish.'
  }
];

export const categories = [
  { id: 'burger', name: 'Burgers', description: 'Handcrafted patties with dark secrets' },
  { id: 'pizza', name: 'Pizza', description: 'Circular mysteries baked to perfection' },
  { id: 'sandwich', name: 'Sandwiches', description: 'Layers of flavor trapped between bread' }
] as const;

export type Category = typeof categories[number]['id'];
