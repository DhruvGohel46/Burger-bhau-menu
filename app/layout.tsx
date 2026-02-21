import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-poppins',
});

export const metadata: Metadata = {
    title: 'Burger Bhau — Fresh Handcrafted Burgers & Fast Food',
    description:
        'Order delicious handcrafted burgers, pizzas, sandwiches, and more from Burger Bhau. Fresh ingredients, fast delivery, and amazing taste.',
    keywords: ['burger', 'fast food', 'pizza', 'sandwich', 'Burger Bhau', 'food delivery'],
    openGraph: {
        title: 'Burger Bhau — Fresh Handcrafted Burgers & Fast Food',
        description: 'Order delicious handcrafted burgers, pizzas, sandwiches, and more from Burger Bhau.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={poppins.variable}>
            <body>{children}</body>
        </html>
    );
}
