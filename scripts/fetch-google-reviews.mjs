#!/usr/bin/env node

/**
 * Burger Bhau - Google Business Profile Weekly Reviews Sync
 * 
 * Fetches verified customer reviews directly from the Google Business Profile API.
 * Keeps only reviews with:
 *  - 4 or 5 star ratings
 *  - Written text description >= 40 characters
 *  - Strips Google auto-translations and preserves original text
 *  - Maximum age <= 24 months
 *  - Top 6 newest reviews
 * 
 * Saves result to public/data/reviews.json for zero-latency static visitor loading.
 * Never exposes secrets to client; runs server-side / via GitHub Actions once a week.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const REVIEWS_FILE_PATH = path.join(ROOT_DIR, 'public', 'data', 'reviews.json');
const LOG_FILE_PATH = path.join(ROOT_DIR, 'reviews-fetch.log');

// Rating map for Google My Business v4 API responses
const RATING_MAP = {
  FIVE: 5,
  FOUR: 4,
  THREE: 3,
  TWO: 2,
  ONE: 1,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
  '1': 1,
};

function logMessage(level, message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [${level}] ${message}\n`;
  console.log(line.trim());
  try {
    fs.appendFileSync(LOG_FILE_PATH, line);
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
}

/**
 * Strips Google auto-translation wrappers and extracts original customer feedback
 */
function extractOriginalComment(rawComment) {
  if (!rawComment) return '';
  const text = String(rawComment);

  // If Google provided "(Translated by Google) ... (Original) ..."
  if (text.includes('(Original)')) {
    const parts = text.split(/\(Original\)/i);
    if (parts.length > 1 && parts[1].trim()) {
      return parts[1].trim();
    }
  }

  // Remove standalone translation tag if present
  return text.replace(/\(Translated by Google\)/gi, '').trim();
}

/**
 * Parses environment variables or .env.local file if present
 */
function loadEnv() {
  const envPath = path.join(ROOT_DIR, '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx > 0) {
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    });
  }
}

async function main() {
  loadEnv();

  logMessage('INFO', 'Starting Google Business Profile reviews sync...');

  // Configuration settings (can be overridden by environment variables)
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
  const ACCOUNT_ID = process.env.GOOGLE_ACCOUNT_ID;
  const LOCATION_ID = process.env.GOOGLE_LOCATION_ID;

  const MIN_RATING = parseInt(process.env.GOOGLE_REVIEWS_MIN_RATING || '4', 10);
  const MIN_COMMENT_LENGTH = parseInt(process.env.GOOGLE_REVIEWS_MIN_LENGTH || '40', 10);
  const MAX_AGE_MONTHS = parseInt(process.env.GOOGLE_REVIEWS_MAX_AGE_MONTHS || '24', 10);
  const MAX_DISPLAY = parseInt(process.env.GOOGLE_REVIEWS_MAX_DISPLAY || '6', 10);

  // Check required credentials
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    logMessage(
      'ERROR',
      'Missing required Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN). ' +
      'Please run "node scripts/google-oauth-setup.mjs" to complete Google Business Profile setup.'
    );
    // Keep existing reviews.json intact
    process.exit(1);
  }

  try {
    // Step 1: Exchange Refresh Token for Access Token
    logMessage('INFO', 'Refreshing OAuth access token with Google...');
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      if (tokenData.error === 'invalid_grant') {
        logMessage(
          'CRITICAL',
          'Google OAuth refresh token has expired or been revoked. ' +
          'Action Required: Re-run "node scripts/google-oauth-setup.mjs" to authorize your Google account again.'
        );
      } else {
        logMessage('ERROR', `Failed to obtain access token from Google: ${JSON.stringify(tokenData)}`);
      }
      process.exit(1);
    }

    const accessToken = tokenData.access_token;
    logMessage('INFO', 'Successfully authenticated with Google OAuth.');

    // Step 2: Resolve Account ID
    let targetAccountId = ACCOUNT_ID;
    if (!targetAccountId) {
      logMessage('INFO', 'Discovering Google Business Account ID...');
      const accountsRes = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const accountsData = await accountsRes.json();
      if (!accountsRes.ok || !accountsData.accounts || accountsData.accounts.length === 0) {
        throw new Error(`Unable to list Google Business accounts: ${JSON.stringify(accountsData)}`);
      }
      targetAccountId = accountsData.accounts[0].name.replace('accounts/', '');
      logMessage('INFO', `Discovered Account ID: ${targetAccountId}`);
    }

    // Step 3: Resolve Location ID
    let targetLocationId = LOCATION_ID;
    if (!targetLocationId) {
      logMessage('INFO', 'Discovering Location ID for Burger Bhau...');
      const locRes = await fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${targetAccountId}/locations?readMask=name,title,storeCode`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const locData = await locRes.json();
      if (!locRes.ok || !locData.locations || locData.locations.length === 0) {
        throw new Error(`Unable to find locations in account: ${JSON.stringify(locData)}`);
      }
      // Pick location matching Burger Bhau or the first location
      const matched = locData.locations.find((l) =>
        (l.title || '').toLowerCase().includes('burger bhau')
      ) || locData.locations[0];

      targetLocationId = matched.name.replace(`accounts/${targetAccountId}/locations/`, '').replace('locations/', '');
      logMessage('INFO', `Discovered Location ID: ${targetLocationId} (${matched.title || 'Store'})`);
    }

    // Step 4: Fetch all reviews using pagination
    logMessage('INFO', 'Fetching reviews from Google My Business v4 API...');
    let allRawReviews = [];
    let nextPageToken = null;
    let pageCount = 0;
    let averageRating = 5.0;
    let totalReviewCount = 0;

    do {
      pageCount++;
      const url = new URL(
        `https://mybusiness.googleapis.com/v4/accounts/${targetAccountId}/locations/${targetLocationId}/reviews`
      );
      url.searchParams.set('pageSize', '50');
      if (nextPageToken) {
        url.searchParams.set('pageToken', nextPageToken);
      }

      const revRes = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const revData = await revRes.json();

      if (!revRes.ok) {
        throw new Error(`Reviews API error on page ${pageCount}: ${JSON.stringify(revData)}`);
      }

      if (revData.averageRating) {
        averageRating = Number(revData.averageRating);
      }
      if (revData.totalReviewCount) {
        totalReviewCount = Number(revData.totalReviewCount);
      }

      if (Array.isArray(revData.reviews)) {
        allRawReviews.push(...revData.reviews);
      }

      nextPageToken = revData.nextPageToken || null;
    } while (nextPageToken);

    logMessage('INFO', `Retrieved ${allRawReviews.length} total reviews from Google.`);

    if (totalReviewCount === 0 && allRawReviews.length > 0) {
      totalReviewCount = allRawReviews.length;
    }

    // Step 5: Apply Selection Rules
    const cutoffDate = MAX_AGE_MONTHS > 0
      ? new Date(Date.now() - MAX_AGE_MONTHS * 30.44 * 24 * 60 * 60 * 1000)
      : null;

    const filteredReviews = [];

    for (const r of allRawReviews) {
      const starNumber = RATING_MAP[r.starRating] || 0;
      // Rule 1: 4 or 5 stars only
      if (starNumber < MIN_RATING) continue;

      // Rule 2: Must have a written comment
      const originalComment = extractOriginalComment(r.comment);
      if (!originalComment || originalComment.length < MIN_COMMENT_LENGTH) continue;

      // Rule 3: Check age cutoff
      const createTime = r.createTime || r.updateTime || new Date().toISOString();
      if (cutoffDate && new Date(createTime) < cutoffDate) continue;

      filteredReviews.push({
        id: r.reviewId || `rev-${Math.random().toString(36).substring(2, 9)}`,
        reviewer_name: r.reviewer?.displayName || 'Google User',
        reviewer_photo_url: r.reviewer?.profilePhotoUrl || null,
        rating: starNumber,
        text: originalComment,
        create_time: createTime,
        review_url: r.reviewUrl || `https://www.google.com/maps/place/Burger+Bhau/@22.2458884,70.798263,14z`,
      });
    }

    // Sort newest first
    filteredReviews.sort((a, b) => new Date(b.create_time).getTime() - new Date(a.create_time).getTime());

    // Take top max reviews
    const finalReviews = filteredReviews.slice(0, MAX_DISPLAY);

    // Compute average if not provided by Google
    if (filteredReviews.length > 0 && averageRating === 5.0 && allRawReviews.length > 0) {
      const sum = allRawReviews.reduce((acc, cur) => acc + (RATING_MAP[cur.starRating] || 5), 0);
      averageRating = Math.round((sum / allRawReviews.length) * 10) / 10;
    }

    // Step 6: Construct and write output
    const outputPayload = {
      average_rating: averageRating,
      total_reviews: totalReviewCount,
      last_fetched: new Date().toISOString(),
      is_placeholder: false,
      reviews: finalReviews,
    };

    // Ensure parent directory exists
    const dir = path.dirname(REVIEWS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(REVIEWS_FILE_PATH, JSON.stringify(outputPayload, null, 2), 'utf8');

    logMessage(
      'INFO',
      `Success: Saved ${finalReviews.length} verified reviews (avg: ${averageRating}, total: ${totalReviewCount}) to ${REVIEWS_FILE_PATH}`
    );
  } catch (err) {
    logMessage('ERROR', `Google reviews fetch failed: ${err.message}`);
    // DO NOT OVERWRITE reviews.json: Preserve last good state
    process.exit(1);
  }
}

main();
