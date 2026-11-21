// Burger Bhau MenuSite - Next.js configuration for static export and unoptimized images.
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
    },
    trailingSlash: true,
    experimental: {
        optimizePackageImports: [
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/free-brands-svg-icons',
            '@fortawesome/react-fontawesome',
            'framer-motion',
            'zustand',
        ],
    },
};

module.exports = nextConfig;
