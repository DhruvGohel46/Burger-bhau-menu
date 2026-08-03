const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local if present locally
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const val = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
            if (!process.env[key.trim()]) {
                process.env[key.trim()] = val;
            }
        }
    });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

async function generateDynamicSitemap() {
    console.log('Generating dynamic Google Image Sitemap...');
    let galleryImages = [];

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        try {
            const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            const { data, error } = await supabase
                .from('gallery_images')
                .select('*')
                .order('display_order', { ascending: true });

            if (!error && data) {
                galleryImages = data;
            }
        } catch (err) {
            console.error('Sitemap fetch error:', err);
        }
    }

    const imageBlocks = galleryImages.map((img) => {
        const fullUrl = img.public_url.startsWith('http')
            ? img.public_url
            : `https://burgerbhau.netlify.app${img.public_url}`;

        return `    <image:image>
      <image:loc>${escapeXml(fullUrl)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.alt_text || img.caption || img.title)}</image:caption>
    </image:image>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://burgerbhau.netlify.app/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://burgerbhau.netlify.app/gallery</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
${imageBlocks ? imageBlocks + '\n' : ''}  </url>
  <url>
    <loc>https://burgerbhau.netlify.app/checkout</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://burgerbhau.netlify.app/login</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://burgerbhau.netlify.app/register</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://burgerbhau.netlify.app/orders</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://burgerbhau.netlify.app/profile</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
`;

    const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, xml, 'utf8');
    console.log(`Dynamic Google Image Sitemap generated successfully at public/sitemap.xml (${galleryImages.length} images).`);
}

generateDynamicSitemap().catch(console.error);
