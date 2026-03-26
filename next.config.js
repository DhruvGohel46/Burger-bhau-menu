// Burger Bhau MenuSite - Next.js configuration for static export and unoptimized images.
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    trailingSlash: true,
};

module.exports = nextConfig;
