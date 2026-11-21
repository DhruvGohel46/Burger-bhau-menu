import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Directory to store original master files outside of deployed public/
const ORIGINALS_DIR = path.resolve('src-assets');
if (!fs.existsSync(ORIGINALS_DIR)) {
    fs.mkdirSync(ORIGINALS_DIR, { recursive: true });
}

async function optimizeAll() {
    console.log('--- Starting Image Optimization Pipeline ---');
    let originalTotalSize = 0;
    let newTotalSize = 0;

    // 1. Preserve original hero if not already saved
    const origHeroJpg = path.join(ORIGINALS_DIR, 'hero-master.jpg');
    if (!fs.existsSync(origHeroJpg) && fs.existsSync('public/hero.jpg')) {
        fs.copyFileSync('public/hero.jpg', origHeroJpg);
    }
    const heroSource = fs.existsSync(origHeroJpg) ? origHeroJpg : 'public/hero.jpg';

    // 2. Preserve original logo if not already saved
    const origLogo = path.join(ORIGINALS_DIR, 'logo-master.webp');
    if (!fs.existsSync(origLogo) && fs.existsSync('public/BURGER-BHAU-logo.webp')) {
        fs.copyFileSync('public/BURGER-BHAU-logo.webp', origLogo);
    }
    const logoSource = fs.existsSync(origLogo) ? origLogo : 'public/BURGER-BHAU-logo.webp';

    // 3. Generate Hero Responsive Variants
    console.log('Generating Hero responsive images (AVIF + WebP + JPEG)...');
    const heroSizes = [
        { width: 400, suffix: '-400' },
        { width: 600, suffix: '-600' },
        { width: 800, suffix: '-800' },
        { width: 1200, suffix: '-1200' },
    ];

    for (const size of heroSizes) {
        // WebP
        await sharp(heroSource)
            .resize({ width: size.width, withoutEnlargement: true })
            .webp({ quality: 80, effort: 6 })
            .toFile(`public/hero${size.suffix}.webp`);

        // AVIF
        await sharp(heroSource)
            .resize({ width: size.width, withoutEnlargement: true })
            .avif({ quality: 75, effort: 6 })
            .toFile(`public/hero${size.suffix}.avif`);
    }

    // Default hero.webp (1200px max)
    await sharp(heroSource)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toFile('public/hero.webp');

    // Default hero.jpg (optimized progressive JPEG fallback, ~40KB instead of 1.67MB PNG!)
    await sharp(heroSource)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 78, progressive: true, mozjpeg: true })
        .toFile('public/hero.jpg');

    // 4. Generate Logo Responsive Variants
    console.log('Generating Logo responsive images...');
    const logoSizes = [
        { width: 72, name: 'logo-36' },   // 2x for 36x36
        { width: 96, name: 'logo-48' },   // 2x for 48x48
        { width: 240, name: 'logo-120' }, // 2x for 120px fallback
    ];

    for (const s of logoSizes) {
        await sharp(logoSource)
            .resize({ width: s.width, withoutEnlargement: true })
            .webp({ quality: 80, effort: 6 })
            .toFile(`public/${s.name}.webp`);

        await sharp(logoSource)
            .resize({ width: s.width, withoutEnlargement: true })
            .avif({ quality: 75, effort: 6 })
            .toFile(`public/${s.name}.avif`);
    }

    // Recompress default BURGER-BHAU-logo.webp at quality 80
    await sharp(logoSource)
        .webp({ quality: 80, effort: 6 })
        .toFile('public/BURGER-BHAU-logo.webp');

    // 5. Optimize Icons and PNGs
    console.log('Optimizing PNG icons...');
    const pngIcons = [
        'apple-touch-icon.png',
        'icon-48x48.png',
        'icon-96x96.png',
        'icon-144x144.png',
        'icon-192x192.png',
        'icon-512x512.png',
        'logo-square.png'
    ];

    for (const icon of pngIcons) {
        const filePath = `public/${icon}`;
        if (fs.existsSync(filePath)) {
            const tempOut = `public/_temp_${icon}`;
            await sharp(filePath)
                .png({ compressionLevel: 9, palette: true })
                .toFile(tempOut);
            fs.renameSync(tempOut, filePath);
        }
    }

    // Also create WebP version of logo-square
    if (fs.existsSync('public/logo-square.png')) {
        await sharp('public/logo-square.png')
            .webp({ quality: 80 })
            .toFile('public/logo-square.webp');
    }

    // 6. Optimize og-image.jpg
    if (fs.existsSync('public/og-image.jpg')) {
        const tempOg = 'public/_temp_og.jpg';
        await sharp('public/og-image.jpg')
            .jpeg({ quality: 80, progressive: true, mozjpeg: true })
            .toFile(tempOg);
        fs.renameSync(tempOg, 'public/og-image.jpg');
    }

    console.log('--- Image Optimization Finished ---');
}

optimizeAll().catch(err => {
    console.error('Image optimization failed:', err);
    process.exit(1);
});
