// Burger Bhau MenuSite - Root layout with theme support and SEO
import type { Metadata, Viewport } from 'next';
import { Lora, Inter } from 'next/font/google';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';
import { SITE_URL } from '@/lib/siteConfig';

config.autoAddCss = false;

const lora = Lora({
    subsets: ['latin'],
    weight: ['500', '600'],
    variable: '--font-newsreader',
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: '--font-inter',
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
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Burger Bhau (Kothariya, Rajkot) | Fresh Burgers, Pizza & Fast Food',
        template: '%s | Burger Bhau (Kothariya)',
    },
    description: 'Visit Burger Bhau Besides Axis Bank, Surbhi Possible 3, Rolex Road, Kothariya, Rajkot. Made fresh when you order: handcrafted burgers, cheese burst pizzas, loaded fries and grilled sandwiches.',
    applicationName: 'Burger Bhau (Kothariya)',
    keywords: ['burger bhau', 'burger bhau rajkot', 'burger bhau kothariya', 'burger bhau rolex road', 'burger bhau surbhi possible', 'best burgers rajkot', 'fast food rajkot', 'pizza rajkot', 'sandwich rajkot', 'pure veg burgers rajkot'],
    manifest: '/site.webmanifest',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    other: {
        'ai-content-declaration': '100% Pure Vegetarian Restaurant in Rajkot, Gujarat',
    },
    icons: {
        icon: [
            { url: '/favicon.ico', type: 'image/x-icon' },
        ],
        apple: '/favicon.ico',
    },
    openGraph: {
        siteName: 'Burger Bhau',
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
import AnalyticsScript from '@/app/components/AnalyticsScript';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${lora.variable} ${inter.variable}`} suppressHydrationWarning>
            <head>
                <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM Context Summary" />
                <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="Full LLM Knowledge Catalog" />
                <script
                    dangerouslySetInnerHTML={{ __html: themeScript }}
                />
            </head>
            <body>
                <AnalyticsScript />
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
