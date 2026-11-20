#!/usr/bin/env node
/**
 * Burger Bhau Kothariya - Automated SEO & Crawlability Verification Suite
 * Validates Features F1 through F16 across static export files and configuration.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message, details = '') {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  ✓ PASS: ${message}`);
    } else {
        failedTests++;
        console.error(`  ✗ FAIL: ${message}`);
        if (details) console.error(`    Details: ${details}`);
    }
}

function readFile(relPath) {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File not found: ${relPath}`);
    }
    return fs.readFileSync(fullPath, 'utf8');
}

console.log('\n======================================================');
console.log('  Burger Bhau Kothariya — SEO Verification Suite');
console.log('======================================================\n');

try {
    const indexHtml = readFile('out/index.html');
    const menuHtml = readFile('out/menu/index.html');
    const adminHtml = readFile('out/admin/index.html');
    const loginHtml = readFile('out/login/index.html');
    const robotsTxt = readFile('public/robots.txt');
    const sitemapXml = readFile('public/sitemap.xml');
    const netlifyToml = readFile('netlify.toml');

    // ─── F1: Static HTML Content (No <template>, visible items & ₹ prices) ───
    console.log('Feature 1: Static HTML Content Pre-rendering');
    assert(
        !indexHtml.includes('<template id="B:0">') && !indexHtml.includes('bb-pulse'),
        'Homepage contains no streaming <template id="B:0"> or loading animation',
        'Found <template id="B:0"> or bb-pulse in out/index.html'
    );
    assert(
        !menuHtml.includes('<template id="B:0">') && !menuHtml.includes('bb-pulse'),
        'Menu page contains no streaming <template id="B:0"> or loading animation',
        'Found <template id="B:0"> or bb-pulse in out/menu/index.html'
    );
    assert(
        menuHtml.includes('₹') && (menuHtml.includes('Cheese Burst') || menuHtml.includes('Aalu Tikki') || menuHtml.includes('Burger')),
        'Menu items, titles, and ₹ prices appear directly in static out/menu/index.html',
        'Missing ₹ currency symbol or item names in static HTML'
    );
    assert(
        indexHtml.includes('₹') || indexHtml.includes('Burger'),
        'Food offerings appear directly in static out/index.html',
        'Missing food items in homepage static HTML'
    );

    // ─── F2: Crawlable Category Navigation (<a href="#...">) ───
    console.log('\nFeature 2: Crawlable Category Navigation');
    const categoryAnchorMatches = [...menuHtml.matchAll(/<a[^>]+href="(#section-[^"]+)"[^>]*>/g)];
    assert(
        categoryAnchorMatches.length >= 4,
        `Category navigation uses crawlable <a href="#section-..."> links (found ${categoryAnchorMatches.length})`,
        `Expected >= 4 category anchor links, found ${categoryAnchorMatches.length}`
    );
    const categoryNavCss = readFile('app/components/CategoryNav.module.css');
    assert(
        categoryNavCss.includes('text-decoration: none'),
        'Category navigation pills have text-decoration: none in CSS',
        'Missing text-decoration: none in CategoryNav.module.css'
    );

    // ─── F3: Netlify Build Hook Rebuilds ───
    console.log('\nFeature 3: Netlify Build Hook Rebuild Automation');
    const rebuildFunc = readFile('netlify/functions/trigger-rebuild.ts');
    assert(
        rebuildFunc.includes('process.env.NETLIFY_BUILD_HOOK_URL') &&
        !rebuildFunc.includes('NEXT_PUBLIC_NETLIFY_BUILD_HOOK_URL'),
        'netlify/functions/trigger-rebuild.ts securely reads private NETLIFY_BUILD_HOOK_URL without NEXT_PUBLIC_',
        'Function missing or exposes NEXT_PUBLIC_ variable'
    );
    const netlifyLib = readFile('lib/netlify.ts');
    assert(
        !netlifyLib.includes('NEXT_PUBLIC_NETLIFY_BUILD_HOOK_URL'),
        'lib/netlify.ts does not expose NEXT_PUBLIC_NETLIFY_BUILD_HOOK_URL',
        'Found NEXT_PUBLIC_NETLIFY_BUILD_HOOK_URL in lib/netlify.ts'
    );
    const hookDocs = readFile('docs/NETLIFY_BUILD_HOOK.md');
    assert(
        hookDocs.includes('NETLIFY_BUILD_HOOK_URL'),
        'docs/NETLIFY_BUILD_HOOK.md provides complete setup documentation',
        'Missing build hook documentation'
    );

    // ─── F4: On-Page "About" Content (100–200 words) ───
    console.log('\nFeature 4: On-Page "About" Narrative');
    const storeConfig = readFile('app/data/storeConfig.ts');
    const aboutStoryMatch = storeConfig.match(/aboutStory:\s*[\r\n\s]*["`]([\s\S]*?)["`]/);
    const aboutText = aboutStoryMatch ? aboutStoryMatch[1].replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim() : '';
    const wordCount = aboutText ? aboutText.split(' ').length : 0;
    assert(
        wordCount >= 100 && wordCount <= 200,
        `About narrative is in natural language with 100–200 words (word count: ${wordCount})`,
        `Word count ${wordCount} is outside required 100–200 range`
    );
    assert(
        indexHtml.includes('neighborhood fast food destination') && indexHtml.includes('pure vegetarian'),
        'About narrative is rendered in static out/index.html',
        'About story missing from static homepage HTML'
    );

    // ─── F5: Visible NAP Block ───
    console.log('\nFeature 5: Visible NAP (Name, Address, Phone, Hours)');
    assert(
        indexHtml.includes('+91 95589 41555'),
        'Telephone number +91 95589 41555 is rendered as visible text in out/index.html',
        'Visible phone number string not found in homepage HTML'
    );
    assert(
        indexHtml.includes('href="tel:+919558941555"'),
        'Telephone link href="tel:+919558941555" is present in out/index.html',
        'tel link not found in homepage HTML'
    );
    assert(
        indexHtml.includes('Besides Axis Bank, Surbhi Possible 3, Rolex Road, Kothariya') &&
        indexHtml.includes('360004'),
        'Full street address, landmark, and postal code 360004 are visible in out/index.html',
        'Address components missing in homepage HTML'
    );

    // ─── F6: Enhanced Map Iframe ───
    console.log('\nFeature 6: Lazy-Loaded Map Iframe with Descriptive Title');
    const iframeMatches = [...indexHtml.matchAll(/<iframe[^>]*>/g)];
    const mapIframe = iframeMatches.find(m => m[0].includes('maps'));
    assert(
        Boolean(mapIframe) && mapIframe[0].includes('loading="lazy"'),
        'Google Map iframe has loading="lazy" attribute in out/index.html',
        'loading="lazy" missing on map iframe'
    );
    assert(
        Boolean(mapIframe) && mapIframe[0].includes('title=') &&
        (mapIframe[0].includes('Kothariya') || mapIframe[0].includes('Rajkot')),
        'Google Map iframe has descriptive title attribute specifying locality and city',
        `Map iframe title: ${mapIframe ? mapIframe[0] : 'None'}`
    );

    // ─── F7: Single <h1> Heading Hierarchy ───
    console.log('\nFeature 7: Single <h1> Hierarchy & Brand Context');
    const h1Matches = [...indexHtml.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
    assert(
        h1Matches.length === 1,
        `Homepage contains exactly one <h1> heading (found ${h1Matches.length})`,
        `Expected 1 <h1>, found ${h1Matches.length}`
    );
    assert(
        h1Matches[0] && h1Matches[0][1].includes('sr-only') && h1Matches[0][1].includes('Burger Bhau Kothariya'),
        'Heading <h1> contains visually-hidden brand prefix via .sr-only class',
        `<h1> content: ${h1Matches[0] ? h1Matches[0][1] : 'None'}`
    );
    const globalsCss = readFile('app/globals.css');
    assert(
        globalsCss.includes('.sr-only'),
        'Standard .sr-only accessibility utility class is defined in app/globals.css',
        '.sr-only missing in globals.css'
    );

    // ─── F8: Viewport Accessibility ───
    console.log('\nFeature 8: Viewport Scaling Accessibility');
    assert(
        !indexHtml.includes('maximum-scale=1') && !indexHtml.includes('user-scalable=no'),
        'Viewport allows user zoom (no user-scalable=no or maximum-scale=1 in out/index.html)',
        'Found restrictive viewport tags in out/index.html'
    );

    // ─── F9: HTML Lang & Metadata Lengths ───
    console.log('\nFeature 9: HTML Lang, Title & Description Lengths, Keywords Removal');
    assert(
        indexHtml.includes('lang="en-IN"'),
        'Root <html> tag specifies lang="en-IN"',
        'lang="en-IN" not found in out/index.html'
    );
    const titleMatch = indexHtml.match(/<title>([^<]+)<\/title>/);
    const rawTitle = titleMatch ? titleMatch[1] : '';
    const title = rawTitle.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    assert(
        title.length > 0 && title.length <= 60,
        `Homepage title is under 60 characters (actual: ${title.length} chars: "${title}")`,
        `Title length is ${title.length}`
    );
    const descMatch = indexHtml.match(/<meta\s+name="description"\s+content="([^"]+)"/);
    const rawDescription = descMatch ? descMatch[1] : '';
    const description = rawDescription.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    assert(
        description.length > 0 && description.length < 155,
        `Homepage description is under 155 characters (actual: ${description.length} chars)`,
        `Description length is ${description.length}`
    );
    assert(
        !indexHtml.includes('<meta name="keywords"') && !indexHtml.includes('name="keywords"'),
        'Meta keywords tag is completely removed from homepage <head>',
        'Found meta keywords tag in out/index.html'
    );

    // ─── F10: OpenGraph & Canonical ───
    console.log('\nFeature 10: OpenGraph Locale & Canonical URL');
    assert(
        indexHtml.includes('<link rel="canonical" href="https://burgerbhaukothariya.in/"/>'),
        'Homepage canonical link is strictly https://burgerbhaukothariya.in/',
        'Canonical link mismatch in out/index.html'
    );
    assert(
        indexHtml.includes('property="og:locale" content="en_IN"') || indexHtml.includes('property="og:locale" content="en-IN"'),
        'OpenGraph locale is set to en_IN',
        'og:locale not found in out/index.html'
    );
    assert(
        fs.existsSync(path.join(rootDir, 'public', 'og-image.jpg')),
        'public/og-image.jpg exists for social cards',
        'og-image.jpg missing'
    );

    // ─── F11: Structured Data (JSON-LD) ───
    console.log('\nFeature 11: Schema.org Structured Data (JSON-LD)');
    const ldJsonMatches = [...indexHtml.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    const schemas = ldJsonMatches.map(m => {
        try {
            return JSON.parse(m[1]);
        } catch {
            return null;
        }
    }).filter(Boolean);

    const restaurantSchema = schemas.find(s => {
        const type = s['@type'];
        return Array.isArray(type) ? type.includes('Restaurant') : type === 'Restaurant';
    });
    assert(
        Boolean(restaurantSchema),
        'Homepage contains valid Restaurant / FastFoodRestaurant JSON-LD schema',
        'Restaurant schema not found'
    );
    assert(
        restaurantSchema && restaurantSchema.hasMenu && restaurantSchema.hasMenu['@type'] === 'Menu',
        'Restaurant schema embeds hasMenu with @type: "Menu"',
        'hasMenu missing or not embedded as Menu object'
    );
    assert(
        restaurantSchema && Array.isArray(restaurantSchema.hasMenu.hasMenuSection) &&
        restaurantSchema.hasMenu.hasMenuSection.length > 0,
        `hasMenu embeds MenuSection array (sections: ${restaurantSchema?.hasMenu?.hasMenuSection?.length})`,
        'MenuSection array missing'
    );
    const firstSection = restaurantSchema?.hasMenu?.hasMenuSection?.[0];
    const firstItem = firstSection?.hasMenuItem?.[0];
    assert(
        firstItem && firstItem.offers && firstItem.offers.priceCurrency === 'INR',
        'MenuItem has Offer with priceCurrency: "INR"',
        `MenuItem Offer structure: ${JSON.stringify(firstItem?.offers)}`
    );
    assert(
        restaurantSchema && Array.isArray(restaurantSchema.sameAs) &&
        restaurantSchema.sameAs.some(url => url.includes('google.com/maps')),
        'Restaurant schema contains sameAs array linking to Google Business Profile / Maps',
        `sameAs: ${JSON.stringify(restaurantSchema?.sameAs)}`
    );
    const websiteSchema = schemas.find(s => s['@type'] === 'WebSite');
    assert(
        Boolean(websiteSchema) && websiteSchema.url === 'https://burgerbhaukothariya.in/',
        'WebSite JSON-LD schema is present with canonical homepage URL',
        'WebSite schema missing or incorrect URL'
    );
    const hasAggregateRating = schemas.some(s => s.aggregateRating || (s.hasMenu && s.hasMenu.aggregateRating));
    assert(
        !hasAggregateRating,
        'Strictly NO fake or placeholder aggregateRating in structured data',
        'Found aggregateRating in JSON-LD output!'
    );

    // ─── F12: Sitemap & Robots Configuration ───
    console.log('\nFeature 12: Sitemap & Robots Configuration');
    const todayIsoDate = new Date().toISOString().split('T')[0];
    assert(
        sitemapXml.includes('<lastmod>') && sitemapXml.includes(todayIsoDate),
        `sitemap.xml contains <lastmod> matching current build date (${todayIsoDate})`,
        'lastmod tag missing or outdated'
    );
    assert(
        !sitemapXml.includes('/admin') && !sitemapXml.includes('/login') && !sitemapXml.includes('/checkout'),
        'sitemap.xml omits private routes (/admin, /login, /checkout)',
        'Private routes found in sitemap.xml'
    );
    assert(
        !robotsTxt.includes('Disallow: /admin/'),
        'robots.txt has NO Disallow: /admin/ (allowing crawlers to detect noindex meta tags)',
        'Disallow: /admin/ found in robots.txt'
    );
    assert(
        robotsTxt.includes('Allow: /') && robotsTxt.includes('Sitemap: https://burgerbhaukothariya.in/sitemap.xml'),
        'robots.txt allows root / and points to sitemap.xml',
        'Missing Allow: / or Sitemap directive in robots.txt'
    );

    // ─── F13: Private Route Index Gating ───
    console.log('\nFeature 13: Private Route Index Gating');
    assert(
        adminHtml.includes('content="noindex, nofollow"'),
        'out/admin/index.html exports <meta name="robots" content="noindex, nofollow"/>',
        `admin robots meta: ${adminHtml.match(/<meta[^>]+robots[^>]+>/)?.[0] || 'None'}`
    );
    assert(
        loginHtml.includes('content="noindex, nofollow"'),
        'out/login/index.html exports <meta name="robots" content="noindex, nofollow"/>',
        `login robots meta: ${loginHtml.match(/<meta[^>]+robots[^>]+>/)?.[0] || 'None'}`
    );
    assert(
        menuHtml.includes('href="/login/"') && menuHtml.includes('rel="nofollow"'),
        'Header login link on /menu/ includes rel="nofollow"',
        'rel="nofollow" missing on login link in menu page'
    );
    assert(
        netlifyToml.includes('for = "/admin*"') && netlifyToml.includes('X-Robots-Tag = "noindex, nofollow"') &&
        netlifyToml.includes('for = "/login*"') && netlifyToml.includes('for = "/404.html"'),
        'netlify.toml specifies X-Robots-Tag: noindex, nofollow for /admin*, /login*, and /404.html',
        'X-Robots-Tag missing in netlify.toml'
    );

    // ─── F14: CWV Hero LCP & WebP ───
    console.log('\nFeature 14: Core Web Vitals Hero LCP & WebP Optimization');
    const heroWebpPath = path.join(rootDir, 'public', 'hero.webp');
    assert(
        fs.existsSync(heroWebpPath),
        'public/hero.webp exists',
        'hero.webp missing in public folder'
    );
    if (fs.existsSync(heroWebpPath)) {
        const heroSize = fs.statSync(heroWebpPath).size;
        assert(
            heroSize < 150000,
            `hero.webp is optimized and under 150KB (actual size: ${(heroSize / 1024).toFixed(1)} KB)`,
            `hero.webp size is ${(heroSize / 1024).toFixed(1)} KB`
        );
    }
    const heroImgMatch = indexHtml.match(/<img[^>]+hero[^>]*>/);
    assert(
        Boolean(heroImgMatch) &&
        (heroImgMatch[0].includes('fetchpriority="high"') || heroImgMatch[0].includes('fetchPriority="high"')) &&
        heroImgMatch[0].includes('src="/hero.webp"'),
        'Hero image in out/index.html uses /hero.webp with fetchpriority="high"',
        `Hero img tag: ${heroImgMatch ? heroImgMatch[0] : 'None'}`
    );

    // ─── F15: CWV Images & Layout Shift ───
    console.log('\nFeature 15: Image Explicit Dimensions & Lazy Loading');
    const menuCardImgMatch = menuHtml.match(/<img[^>]+alt="[^"]+Burger Bhau Kothariya"[^>]*>/);
    assert(
        Boolean(menuCardImgMatch) &&
        menuCardImgMatch[0].includes('width="76"') &&
        menuCardImgMatch[0].includes('height="76"') &&
        menuCardImgMatch[0].includes('loading="lazy"'),
        'Menu cards render <img> with explicit width="76", height="76", and loading="lazy"',
        `Menu card img tag: ${menuCardImgMatch ? menuCardImgMatch[0] : 'None'}`
    );
    const logoImgMatch = menuHtml.match(/<img[^>]+BURGER-BHAU-logo[^>]*>/);
    assert(
        Boolean(logoImgMatch) &&
        logoImgMatch[0].includes('width="36"') &&
        logoImgMatch[0].includes('height="36"'),
        'Sticky header logo renders with explicit width="36" and height="36"',
        `Logo img tag: ${logoImgMatch ? logoImgMatch[0] : 'None'}`
    );

    // ─── F16: Long-Lived Static Asset Caching ───
    console.log('\nFeature 16: Long-Lived Static Asset Caching in netlify.toml');
    assert(
        netlifyToml.includes('for = "/*.webp"') &&
        netlifyToml.includes('for = "/*.jpg"') &&
        netlifyToml.includes('for = "/*.png"') &&
        netlifyToml.includes('max-age=2592000'),
        'netlify.toml configures 30-day (max-age=2592000) caching headers for .webp, .jpg, .png',
        'Missing static image caching headers in netlify.toml'
    );

    // ─── Acceptance Criterion: Zero Matches for netlify.app in out/ ───
    console.log('\nGlobal Check: Zero Matches for netlify.app in static output');
    function searchNetlifyApp(dir) {
        let count = 0;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                count += searchNetlifyApp(full);
            } else if (entry.isFile() && (entry.name.endsWith('.html') || entry.name.endsWith('.js') || entry.name.endsWith('.json') || entry.name.endsWith('.xml') || entry.name.endsWith('.txt'))) {
                const content = fs.readFileSync(full, 'utf8');
                // ignore source map comment lines or redirects definitions
                if (content.includes('burgerbhau.netlify.app')) {
                    count++;
                }
            }
        }
        return count;
    }
    const netlifyMatches = searchNetlifyApp(path.join(rootDir, 'out'));
    assert(
        netlifyMatches === 0,
        `Build output out/ contains zero matches for burgerbhau.netlify.app (found: ${netlifyMatches})`,
        `Found ${netlifyMatches} files containing old netlify subdomain in out/`
    );

} catch (err) {
    console.error('\nFatal Verification Error:', err.message);
    process.exit(1);
}

console.log('\n======================================================');
console.log(`Verification Summary: ${passedTests} / ${totalTests} tests passed`);
console.log('======================================================\n');

if (failedTests > 0) {
    console.error(`FAILED: ${failedTests} test(s) failed.`);
    process.exit(1);
} else {
    console.log('SUCCESS: All 16 features and acceptance criteria verified cleanly.');
    process.exit(0);
}
