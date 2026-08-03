import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://burgerbhau.netlify.app';
    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/gallery`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/checkout`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/register`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/orders`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/profile`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];
}
