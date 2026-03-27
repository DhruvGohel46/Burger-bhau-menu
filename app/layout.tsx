// Burger Bhau MenuSite - Auto-documented file
import type { Metadata, Viewport } from 'next';
import { Poppins, Bebas_Neue, Gochi_Hand } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-poppins',
    display: 'swap',
});

const bebas = Bebas_Neue({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-bebas',
    display: 'swap',
});

const gochi = Gochi_Hand({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-gochi',
    display: 'swap',
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#0f0f0f',
    viewportFit: 'cover',
};

export const metadata: Metadata = {
    title: 'Burger Bhau',
    description: 'Build your order, show the cashier, and enjoy handcrafted burgers, pizzas, and more from Burger Bhau.',
    keywords: ['burger', 'fast food', 'pizza', 'sandwich', 'Burger Bhau', 'food delivery', 'burger bhau menu', 'burger bhau', 'Rajkot', 'burger bhau rajkot', 'kothariya', 'Rolex road', 'burger bhau kothariya', 'burger bhau rolex road', 'burger bhau kothariya road', 'burger bhau rolex road rajkot', 'burger bhau saibaba circle', 'burger bhau saibaba circle rajkot', 'burger bhau saibaba circle kothariya', 'burger bhau saibaba circle kothariya road', 'burger bhau saibaba circle kothariya road rajkot', 'burger bhau saibaba circle kothariya road rajkot'],
    openGraph: {
        title: 'Burger Bhau',
        description: 'Premium fast food. Handcrafted burgers, crispy fries, fresh pizzas.',
        type: 'website',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${poppins.variable} ${bebas.variable} ${gochi.variable} dark`}>
            <body>
                {children}
            </body>
        </html>
    );
}
