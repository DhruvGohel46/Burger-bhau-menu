// Burger Bhau MenuSite - Auto-documented file
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Outfit, Kalam } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-jakarta',
    display: 'swap',
});

const outfit = Outfit({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-outfit',
    display: 'swap',
});

const kalam = Kalam({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-kalam',
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
    metadataBase: new URL('https://burger-bhau-menu.netlify.app'),
    title: 'Burger Bhau (Kothariya) | Premium Fast Food Menu',
    description: 'Order handcrafted burgers, pizzas, and more from Burger Bhau (Kothariya). Fresh, delicious, and premium fast food in Rajkot.',
    applicationName: 'Burger Bhau (Kothariya)',
    keywords: ['burger', 'fast food', 'pizza', 'sandwich', 'Burger Bhau', 'food delivery', 'burger bhau menu', 'burger bhau', 'Rajkot', 'burger bhau rajkot', 'kothariya', 'Rolex road', 'burger bhau kothariya', 'burger bhau rolex road', 'burger bhau kothariya road', 'burger bhau rolex road rajkot', 'burger bhau saibaba circle', 'burger bhau saibaba circle rajkot', 'burger bhau saibaba circle kothariya', 'burger bhau saibaba circle kothariya road', 'burger bhau saibaba circle kothariya road rajkot', 'burger bhau saibaba circle kothariya road rajkot'],
    manifest: '/site.webmanifest',
    icons: {
        icon: [
            { url: '/favicon.ico', type: 'image/x-icon' },
        ],
        apple: '/favicon.ico',
    },
    openGraph: {
        title: 'Burger Bhau (Kothariya) – Premium Handcrafted Fast Food',
        description: 'Order handcrafted burgers, pizzas, and more from Burger Bhau (Kothariya).',
        siteName: 'Burger Bhau',
        url: 'https://burgerbhau.netlify.app',
        images: [
            {
                url: '/BURGER-BHAU-logo.webp',
                width: 800,
                height: 800,
                alt: 'Burger Bhau Logo',
            },
        ],
        type: 'website',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${jakarta.variable} ${outfit.variable} ${kalam.variable} dark`}>
            <body>
                {children}
            </body>
        </html>
    );
}
