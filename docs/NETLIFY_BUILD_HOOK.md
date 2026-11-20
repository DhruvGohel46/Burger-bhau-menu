# Netlify Build Hook Setup & Rebuild Automation

This document explains how to set up and configure automated builds for **Burger Bhau Kothariya** (`burgerbhaukothariya.in`) when menu items or prices change in Supabase.

---

## 1. Security Architecture
To keep the static HTML fully up to date while maintaining high performance and security:
- Next.js exports static HTML (`output: 'export'`) containing the entire menu in pre-rendered markup.
- Netlify Build Hook URLs contain private webhook tokens. They **must never** be prefixed with `NEXT_PUBLIC_` or exposed in client-side JavaScript bundles.
- Site rebuilds can be triggered securely via the serverless function `netlify/functions/trigger-rebuild.ts`, which reads `process.env.NETLIFY_BUILD_HOOK_URL` in a secure Node environment.

---

## 2. Setting Up a Build Hook in Netlify
1. Log in to the [Netlify App Dashboard](https://app.netlify.com).
2. Navigate to your site: **Burger Bhau Kothariya**.
3. Go to **Site configuration** > **Build & deploy** > **Continuous deployment**.
4. Scroll down to the **Build hooks** section and click **Add build hook**.
5. Configure the hook:
   - **Build hook name**: `Supabase Menu Rebuild` (or `Manual Rebuild Hook`)
   - **Branch to build**: `main`
6. Click **Save**. Netlify will generate a unique URL:
   ```
   https://api.netlify.com/build_hooks/674...
   ```
7. Copy this URL.

---

## 3. Configuring the Environment Variable in Netlify
1. Go to **Site configuration** > **Environment variables**.
2. Click **Add a variable** > **Add a single variable**.
3. Set:
   - **Key**: `NETLIFY_BUILD_HOOK_URL`
   - **Value**: `https://api.netlify.com/build_hooks/<your-token>`
   - **Scopes**: Builds, Functions, Post-processing.
4. Save the variable.

---

## 4. Automating with Supabase Database Webhooks (Recommended)
Whenever categories or products change in your Supabase database, Supabase can ping Netlify automatically:
1. In the [Supabase Dashboard](https://supabase.com/dashboard), navigate to **Database** > **Webhooks**.
2. Click **Create a new hook**.
3. Set:
   - **Name**: `Trigger Netlify Menu Rebuild`
   - **Table**: `products` (and create a second hook for `categories`)
   - **Events**: `INSERT`, `UPDATE`, `DELETE`
   - **Type of Webhook**: `HTTP Request`
   - **HTTP Method**: `POST`
   - **URL**: Your Netlify Build Hook URL (`https://api.netlify.com/build_hooks/...`)
4. Click **Create webhook**.

---

## 5. Triggering Rebuilds via Serverless Function
If triggering a rebuild from an admin dashboard or internal script:
- Make a `POST` request to:
  ```http
  POST /.netlify/functions/trigger-rebuild
  ```
- Or call `triggerNetlifyBuildHook()` in `lib/netlify.ts`.
