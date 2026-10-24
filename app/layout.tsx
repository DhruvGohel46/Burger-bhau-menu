// Burger Bhau MenuSite - Root layout with theme support and SEO
import type { Metadata, Viewport } from 'next';
import { Lora, Inter, Outfit } from 'next/font/google';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';

config.autoAddCss = false;

const lora = Lora({
    subsets: ['latin'],
    weight: ['500', '600', '700'],
    variable: '--font-newsreader',
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-inter',
    display: 'swap',
});

const outfit = Outfit({
    subsets: ['latin'],
    weight: ['700', '800'],
    variable: '--font-outfit',
    display: 'swap',
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#F0E8C7',
    viewportFit: 'cover',
};

export const metadata: Metadata = {
    metadataBase: new URL('https://burgerbhau.netlify.app'),
    title: 'Burger Bhau (Kothariya) | Premium Fast Food Menu',
    description: 'Order handcrafted burgers, pizzas, and more from Burger Bhau (Kothariya). Fresh, delicious, and premium fast food in Rajkot.',
    applicationName: 'Burger Bhau (Kothariya)',
    keywords: ['burger bhau', 'burger bhau rajkot', 'burger bhau kothariya', 'best burgers rajkot', 'fast food rajkot', 'pizza rajkot', 'sandwich rajkot'],
    manifest: '/site.webmanifest',
    icons: {
        icon: [
            { url: '/favicon.ico', type: 'image/x-icon' },
        ],
        apple: '/favicon.ico',
    },
    alternates: {
        canonical: '/',
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
    twitter: {
        card: 'summary_large_image',
        title: 'Burger Bhau (Kothariya) – Premium Fast Food',
        description: 'Order handcrafted burgers, pizzas, and more from Burger Bhau (Kothariya).',
        images: ['/BURGER-BHAU-logo.webp'],
    },
};

// Inline script to set light theme and protect against Webpack HMR / React removeChild race conditions
const themeScript = `
(function(){
  try {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('bb-theme', 'light');
  } catch(e) {}

  if (typeof window !== 'undefined' && typeof Node !== 'undefined') {
    var origRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function(child) {
      if (!child) return null;
      if (child.parentNode !== this) {
        if (child.parentNode) {
          return child.parentNode.removeChild(child);
        }
        return child;
      }
      return origRemoveChild.apply(this, arguments);
    };

    var origInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function(newNode, refNode) {
      if (refNode && refNode.parentNode !== this) {
        if (refNode.parentNode) {
          return refNode.parentNode.insertBefore(newNode, refNode);
        }
        return this.appendChild(newNode);
      }
      return origInsertBefore.apply(this, arguments);
    };
  }
})();
`;

import AuthProvider from '@/app/components/AuthProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${lora.variable} ${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{ __html: themeScript }}
                />
            </head>
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
