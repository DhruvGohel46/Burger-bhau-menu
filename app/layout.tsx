import type { Metadata } from 'next';
import { Inter, Cinzel_Decorative } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const gothic = Cinzel_Decorative({
    subsets: ['latin'],
    weight: ['400', '700', '900'],
    variable: '--font-gothic',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Burger Bhau — Fresh Handcrafted Burgers & Fast Food',
    description:
        'Order delicious handcrafted burgers, pizzas, sandwiches, and more from Burger Bhau. Fresh ingredients, fast delivery, amazing taste.',
    keywords: ['burger', 'fast food', 'pizza', 'sandwich', 'Burger Bhau', 'food delivery'],
    openGraph: {
        title: 'Burger Bhau — Fresh Handcrafted Burgers',
        description: 'Handcrafted burgers, crispy fries, fresh pizzas. Order now!',
        type: 'website',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${gothic.variable} dark`}>
            <body className="antialiased">{children}</body>
        </html>
    );
}
