# Google Reviews Section: Add-on Prompt for Coding Agent

Nov 18, 2026 · @Karam

This add-on adds a customer reviews section to the Burger Bhau site, filled from my own Google Business Profile once a week and stored for later use. Copy everything below the line and give it to your coding agent after the main redesign and the distance card.

---

## Goal

Add a **Customer Reviews** section to the Burger Bhau site that shows real Google reviews of my Kothariya store, only reviews with **4 or 5 stars and a written description**. The reviews must come directly from Google Maps (my verified Google Business Profile), but they must be fetched **only once a week** by a scheduled server job and saved. Visitors only read the saved file, so no visitor click ever calls Google or touches my API key.

First read the existing project, the redesign, the config file and the hosting setup. Give me a short plan, then implement, then give me a change report.

## Hard constraints

1. **Visitors must never trigger a Google API call.** The browser only loads a static, saved reviews file.
2. **Secrets stay on the server.** OAuth client secret, refresh token and any API keys live only in server environment variables. Never in the browser, never in the repository, never in logs. Add them to the ignore list.
3. **Only real reviews.** Never invent, edit or rewrite review text or ratings. Showing a review shortened with a "Read more" is fine, changing its words is not.
4. **No offers or claims** are added along with the reviews. This is a franchise store.
5. The section must not slow down the first screen or break the page if reviews are missing.

## How it works

1. A scheduled job runs once a week on the server.
2. It signs in to my Google Business Profile with a saved refresh token, reads all reviews of my store location, and keeps only the ones that pass the selection rules below.
3. It saves the result as a small file, `reviews.json`, together with the average rating, total review count and the date it was last fetched.
4. The site loads `reviews.json` like any other static file and shows the section after the first screen has loaded.
5. If a weekly run fails, the last good `reviews.json` stays in place and the failure is recorded so I can see it.

## Phase 1: build the section with hand-picked reviews first

Google must approve API access before the job can work, and that takes time. So build in this order, and make Phase 1 fully usable on its own:

- Create `reviews.json` by hand with a few sample entries in the same format the job will later write: reviewer name, star rating, review text, date, and the link to the reviews. Mark the samples clearly as **placeholders** so they are never shown to real visitors by accident. I will replace them with real reviews I choose.
- Build the full reviews section reading from this file.
- Later, the weekly job (Phase 2) simply overwrites the same file. The section must need no design or code change when that happens.

## Phase 2: weekly job using the Google Business Profile API

The job uses the Google Business Profile API with OAuth. Reviews are served by the Google My Business API (v4); accounts and locations are on the newer v1 APIs. Check the current Google documentation before you write the code, because versions change.

### What I will do myself (list these clearly in your change report)

1. Create a Google Cloud project and submit Google's Business Profile API access request using the Google account that owns my verified listing. Approval can take up to about two weeks.
2. Enable the required APIs after approval and create an OAuth client ID.
3. Do the one-time sign-in so the server gets a refresh token. Give me a simple script or page for this, with step-by-step instructions I can follow.
4. Put the secrets into the server environment.

### What you build

- A server-side job that gets an access token from the saved refresh token, finds my account and the Kothariya location, and reads all reviews (up to 50 per page, follow the page token until finished).
- Selection rules, all editable in the config file:
  - Star rating of 4 or 5 only.
  - The review must have a written comment. Ratings with no text are skipped.
  - Minimum comment length (default 40 characters).
  - Maximum age in months (default 24, 0 means no limit).
  - Show newest first, at most 6 reviews in the section (default).
- If a comment contains a Google auto-translation marker such as "(Translated by Google)" together with an "(Original)" text, keep the original text, not the translation.
- Save `reviews.json` with: average rating, total review count, last fetched date, and the selected reviews. Merge nothing from the placeholder samples once real data arrives.
- Schedule it once a week using whatever scheduler fits the existing hosting (for example Vercel Cron, GitHub Actions or a scheduled function). Investigate the deployment, choose the simplest option, and tell me what you chose and why.
- **Failure handling:** keep the last good file, write the error to a log, and make it easy for me to notice. If the refresh token has expired or been revoked, say so clearly in the log so I know to sign in again.
- A **refresh now** option for me only, protected by a secret, so I can update the reviews sooner than the weekly run. It must not be reachable by visitors.

## The section on the site

- Heading such as "What our customers say", placed below the highlights and above the Find us section.
- At the top: the average rating with stars and the total review count (from `reviews.json`).
- Review cards: stars, reviewer name, review text (long ones cut with a "Read more"), and the month and year. Show the reviewer's name as Google provides it.
- A clear "Google" credit on the section, and two links: **See all reviews on Google Maps** and **Write a review** (using my Google Maps place link from the config file).
- On mobile, show the cards as a horizontal swipe row, or stacked, whichever is cleaner and fast.
- Load it after the first screen. While loading, hold the same space with a soft skeleton so nothing jumps.
- If `reviews.json` is missing, empty, or only contains placeholders, hide the whole section quietly. Never show an empty box.

## Speed

- `reviews.json` must stay tiny (a few KB). Cache it with sensible headers.
- No call to Google from the page, ever.
- Keep the Lighthouse mobile score at 90 or higher.

## Editable settings

Add to the existing config file: Google Maps place link, review link, minimum stars, minimum comment length, maximum age in months, maximum reviews shown, section heading text, and the schedule day and time of the weekly job.

## What I want back

1. A short plan before you start.
2. The implementation, with Phase 1 working first.
3. A change report listing every file changed, what each change does, and where the secrets must go.
4. Step-by-step instructions for my one-time Google setup and sign-in.
5. A short test list: how to test the section with placeholder data, with real data, with an empty file, and with a failed weekly run.
