// Burger Bhau MenuSite - Root layout with theme support and SEO
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';
import { SITE_URL } from '@/lib/siteConfig';

config.autoAddCss = false;

const lora = localFont({
    src: '../public/fonts/lora-latin.woff2',
    weight: '500 600',
    style: 'normal',
    variable: '--font-newsreader',
    display: 'swap',
});

const inter = localFont({
    src: '../public/fonts/inter-latin.woff2',
    weight: '400 600',
    style: 'normal',
    variable: '--font-inter',
    display: 'swap',
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#F0E8C7',
    viewportFit: 'cover',
};

export const metadata: Metadata = {
    metadataBase: new URL("https://burgerbhaukothariya.in"),
    title: {
        default: 'Burger Bhau Kothariya | Burgers, Pizza & Fast Food in Rajkot',
        template: '%s | Burger Bhau (Kothariya)',
    },
    description: 'Order fresh handcrafted burgers, pizzas and sandwiches from Burger Bhau, Kothariya, Rajkot. See the full menu, prices and call or WhatsApp to order.',
    applicationName: 'Burger Bhau (Kothariya)',
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
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon-48x48.png', sizes: '48x48', type: 'image/png' },
            { url: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
            { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    openGraph: {
        siteName: 'Burger Bhau Kothariya',
        locale: 'en_IN',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Burger Bhau (Kothariya, Rajkot) - Fresh Burgers, Pizza & Fast Food',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/og-image.jpg'],
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
        <html lang="en-IN" className={`${lora.variable} ${inter.variable}`} suppressHydrationWarning>
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
