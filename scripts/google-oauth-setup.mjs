#!/usr/bin/env node

/**
 * Burger Bhau - Google OAuth 2.0 Refresh Token Setup Utility
 * 
 * Guides the store owner through generating a permanent Google Refresh Token
 * to authorize weekly Google Business Profile reviews synchronization.
 * 
 * Usage:
 *   node scripts/google-oauth-setup.mjs
 */

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log('\n======================================================');
  console.log(' Burger Bhau — Google Business Profile OAuth 2.0 Setup');
  console.log('======================================================\n');
  console.log('This utility helps you generate a Google OAuth Refresh Token so');
  console.log('the automated weekly job can fetch your real customer reviews.\n');

  const clientId = (process.env.GOOGLE_CLIENT_ID || await ask('Enter your Google Client ID: ')).trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || await ask('Enter your Google Client Secret: ')).trim();

  if (!clientId || !clientSecret) {
    console.error('\nError: Both Client ID and Client Secret are required.');
    process.exit(1);
  }

  // Using standard out-of-band / localhost redirect for desktop/server CLI apps
  const redirectUri = 'https://oauth.pstmn.io/v1/callback'; // Or http://localhost:8080 or urn:ietf:wg:oauth:2.0:oob

  const scope = encodeURIComponent('https://www.googleapis.com/auth/business.manage');
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `redirect_uri=${encodeURIComponent('https://developers.google.com/oauthplayground')}&` +
    `response_type=code&` +
    `scope=${scope}&` +
    `access_type=offline&` +
    `prompt=consent`;

  console.log('\n------------------------------------------------------');
  console.log('STEP 1: Open the following URL in your web browser:');
  console.log('------------------------------------------------------\n');
  console.log(authUrl);
  console.log('\n(Sign in with the Google Account that owns your verified Burger Bhau listing)');
  console.log('Grant permission, and copy the authorization code.\n');

  console.log('------------------------------------------------------');
  console.log('STEP 2: Alternative using Google OAuth Playground:');
  console.log('------------------------------------------------------');
  console.log('1. Go to https://developers.google.com/oauthplayground');
  console.log('2. Click the gear icon (top right), check "Use your own OAuth credentials"');
  console.log('3. Enter your OAuth Client ID and Secret');
  console.log('4. In Step 1 on the left, put scope: https://www.googleapis.com/auth/business.manage');
  console.log('5. Authorize API and copy the Refresh Token generated in Step 2!\n');

  const authCode = (await ask('If using direct authorization, enter the authorization code here (or press Enter to exit): ')).trim();

  if (!authCode) {
    console.log('\nExiting. You can re-run this anytime.\n');
    rl.close();
    return;
  }

  console.log('\nExchanging authorization code for refresh token with Google...');

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: authCode,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: 'https://developers.google.com/oauthplayground',
        grant_type: 'authorization_code',
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.refresh_token) {
      console.error('\nExchange failed:', data);
      console.log('\nTip: Try the Google OAuth Playground method outlined in STEP 2 above for zero hassle.');
    } else {
      console.log('\n======================================================');
      console.log(' SUCCESS! YOUR GOOGLE REFRESH TOKEN IS:');
      console.log('======================================================\n');
      console.log(data.refresh_token);
      console.log('\nAdd this to your environment variables / GitHub Repository Secrets:');
      console.log('GOOGLE_REFRESH_TOKEN=' + data.refresh_token);
      console.log('GOOGLE_CLIENT_ID=' + clientId);
      console.log('GOOGLE_CLIENT_SECRET=' + clientSecret);
      console.log('======================================================\n');
    }
  } catch (err) {
    console.error('\nNetwork error during token exchange:', err.message);
  }

  rl.close();
}

main();
