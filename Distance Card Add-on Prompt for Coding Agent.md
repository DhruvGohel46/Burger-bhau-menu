# Distance Card: Add-on Prompt for Coding Agent

Nov 18, 2026 · @Karam

This add-on gives the Burger Bhau site a live card that tells each visitor how far they are from the Kothariya store, with a friendly Gujarati-flavoured line that changes from visit to visit. Copy everything below the line and give it to your coding agent after the main redesign.

---

## Goal

Add a **distance card** to the home page of the Burger Bhau menu site. When a visitor allows location access, the card shows how far they are from my store, for example "You are just 200 meters away", with a short, warm line that makes them want to walk or ride over. The site should feel alive, as if someone from the shop is sitting beside the visitor and inviting them.

First read the existing project and the redesign you already made, reuse its config file and design style, then give me a short plan, then implement, then give me a change report.

## Hard constraints

1. I run a franchise. **Do not add any offer, discount, freebie, combo or price.** The card only invites people to visit.
2. **No false claims.** Never write lines like "we are making your burger now" or "only 2 seats left". Lines may only invite, welcome or say how close the visitor is.
3. **Privacy first.** The visitor's location must be calculated only on their own phone. Never send it to my server, never store it, never put it in analytics or logs.
4. No annoying behaviour: no full-screen popups, no repeating alerts, no sound.
5. Do not slow the site down and do not break the existing page.

## How it works (everything on the visitor's phone)

1. The site loads normally. The distance card appears as a placeholder straight away (see Card states).
2. After the first paint, check whether location permission is already granted (Permissions API). If yes, read the position automatically. If not, show a small friendly button on the card: **Allow location to see how close you are**. Ask the browser for permission only when the visitor taps it, so there is no surprise popup.
3. Calculate the straight-line distance (Haversine formula) between the visitor and the store coordinates stored in the config file.
4. Find the distance band, pick one line from that band, fill in the distance and walking time, and show it.
5. While the card is open, keep the distance number updated as the visitor moves (watchPosition), but only change the line when the visitor moves into a different band.

All of this is plain JavaScript in the browser. There must be no server call for the distance, the band or the line. Geolocation needs HTTPS, so confirm the site is served over HTTPS.

## Card states

The card must never look empty and must never make the page jump.

| State | What the card shows |
| --- | --- |
| Loading | Same size as the final card. A soft shimmer skeleton, or the line "Checking how close you are to Burger Bhau..." with a small pin icon. |
| Waiting for permission | A friendly line and the button "Allow location to see how close you are". |
| Within 2 km | The distance, a line from the matching band, and a **Get Directions** button. |
| Over 2 km, permission denied, location unavailable, or poor accuracy (over 300 m) | A soft fallback line from the Fallback lines list below, with the **Get Directions** button. The card stays, it never disappears. |

Reserve a fixed height for the card from the first paint so nothing shifts when it fills in. Place it right under the hero and the open or closed status, above the highlights.

## Distance and walking time format

- Under 1 km: show meters, rounded to the nearest 10 ("120 meters").
- From 1 km: show kilometres with one decimal ("1.4 km").
- `{distance}` in a line is replaced by that text.
- `{walk}` is replaced by the walking time, for example "3 minutes", calculated at about 80 meters per minute and rounded up. It is used only in lines for distances under 500 meters.

## Distance bands

| Band | From | To | Lines |
| --- | --- | --- | --- |
| 1 | 0 m | 100 m | 10 |
| 2 | 100 m | 200 m | 10 |
| 3 | 200 m | 300 m | 10 |
| 4 | 300 m | 400 m | 10 |
| 5 | 400 m | 500 m | 10 |
| 6 | 500 m | 1 km | 10 |
| 7 | 1 km | 1.5 km | 10 |
| 8 | 1.5 km | 2 km | 10 |

## Shuffle rules

- Pick a random line from the visitor's band each time they open the site.
- Remember the last line shown on that phone (browser storage on the device only) and never show the same line twice in a row.
- Do not reshuffle while the visitor is looking at the card, unless they cross into a new band.
- Keep all lines in one small editable file (for example `distance-lines.json`) with one list per band, so I can edit them without touching the code. Total size should stay under 10 KB.

## Lines for each band

The lines mix simple English with a Gujarati flavour, like a friendly shopkeeper from the neighbourhood. Keep them exactly as written, they are meant to be edited by me later.

### Band 1: 0 to 100 m

- Aavo ne! You are just {distance} away, almost at our door.
- Kem cho! Burger Bhau is right next to you, only {distance} away.
- Bas {distance}, ane tame pahonchi gaya. Come on in!
- You are so close, {distance} only. Chalo, walk in and say hello.
- Arre wah, {distance} away! Our door is waiting for you.
- Just a few steps, {distance}. Aavo, majja avshe!
- Look around, Burger Bhau is just {distance} from you.
- {distance} only, that is about a minute away. Aavo ne!
- You found us! Only {distance} to go.
- Bas have {distance} baki chhe. Chalo, come over!

### Band 2: 100 to 200 m

- Aavo ne, just {distance} away. A short walk and you are here.
- Kem cho! Only {distance} to Burger Bhau, about {walk} on foot.
- Bas {distance} door chho. Chalo, come meet us.
- You are very close, {distance} only. Aavo, majja avshe!
- {walk} of walking and you are at our counter, only {distance} to go.
- Nearby already! Burger Bhau is {distance} from you.
- Just round the corner, {distance} away. Aavo ne!
- {distance} only. Come on, walk over and see us.
- Tame najik chho, only {distance}. Come say hello!
- A few steps more, {distance} left. We would love to see you.

### Band 3: 200 to 300 m

- Aavo ne, we are only {distance} from you. Easy walk!
- Kem cho! Burger Bhau is {distance} away, about {walk} on foot.
- Bas {distance}, chalo chalta aavo!
- You are close by, {distance} only. Come visit us today.
- {walk} walk and you are here. Only {distance} to go.
- Najik j chho, {distance} away. Aavo ne, majja avshe!
- Just {distance} from your spot to our store. Chalo!
- Not far at all, {distance}. Come over for a visit.
- Small walk, {distance} only. We are waiting for you.
- Tame to bahu najik chho, {distance} only. Come say hi!

### Band 4: 300 to 400 m

- Aavo ne, {distance} away. A pleasant little walk.
- Kem cho! Only {distance} to Burger Bhau, about {walk} on foot.
- Bas {distance} door chho. Chalo, come visit us.
- Close enough to walk, {distance} only. Aavo!
- {walk} walk, {distance} to go. Your trip to Burger Bhau is easy.
- Najik j chhe, {distance}. Come and see us today.
- Just {distance} from you, right here in Kothariya.
- Nearby! {distance} away. Chalo, make it a quick visit.
- Not far, only {distance}. Aavo ne, we are happy to see you.
- {distance} only, tame pahonchi jasho!

### Band 5: 400 to 500 m

- Aavo ne, only {distance} to go. A short walk or ride.
- Kem cho! Burger Bhau is {distance} from you.
- Bas {distance} door chho. Chalo, come visit us today.
- Just about {walk} on foot, {distance} only.
- You are nearby, {distance} away. Aavo ne!
- Najik j chho, {distance}. Come for a visit.
- Half a kilometre or less, {distance} only. Chalo!
- Short trip, {distance}. We are waiting at Kothariya.
- {distance} only from you to us. Aavo, majja avshe!
- Not far at all, {distance}. Come say hello at Burger Bhau.

### Band 6: 500 m to 1 km

- Aavo ne, only {distance} away. A quick ride and you are here.
- Kem cho! Burger Bhau is {distance} from you, just a short ride.
- Bas {distance} door chho. Chalo, come visit us.
- {distance} to our store in Kothariya. Easy trip!
- Not too far, only {distance}. Aavo ne!
- A few minutes by bike, {distance} only.
- Najik chho, {distance} away. Come visit us today.
- Just {distance} from you. Make a small trip to Burger Bhau.
- {distance} only. Chalo, come over and say hello.
- Tame door nathi, only {distance}! Aavo ne.

### Band 7: 1 to 1.5 km

- Aavo ne, we are {distance} from you, a short ride away.
- Kem cho! Burger Bhau Kothariya is only {distance} away.
- Bas {distance}, a quick ride. Chalo, come visit us.
- {distance} to our door. Not far at all!
- A short ride, {distance}. We would love to see you.
- Door nathi, only {distance}. Aavo ne, majja avshe!
- Just {distance} from you. Plan a quick visit today.
- Close enough for a quick trip, {distance} only.
- {distance} away in Kothariya. Chalo, come over!
- Tame najik j chho, {distance}. Come say hello.

### Band 8: 1.5 to 2 km

- Aavo ne, Burger Bhau is {distance} from you. A short ride!
- Kem cho! Only {distance} to us, in Kothariya.
- Bas {distance}, a quick ride. Chalo, visit us today.
- Not far, {distance} only. We are waiting for you.
- {distance} away. A small trip and you are at Burger Bhau.
- Door nathi, only {distance}. Aavo ne!
- Just {distance} from your spot. Come visit us.
- A short ride of {distance}, and we are here.
- Kothariya is calling, only {distance} away. Aavo!
- Tame aavo, we are only {distance} away. Chalo!

### Fallback lines (over 2 km, permission denied, or location unavailable)

These never mention a distance. Pick one at random with the same no-repeat rule.

- Aavo ne, Burger Bhau Kothariya ma tamari raah joi rahyu chhe.
- Kem cho! Come visit us at Burger Bhau, Kothariya.
- Tap Get Directions and chalo, we are waiting for you.
- Burger Bhau Kothariya is open for you. Aavo ne!
- Plan your visit today. Directions are one tap away.

## Speed

- The card's code and the lines file must be tiny and loaded together with the page. No extra network request for them.
- Do not wait for location before showing the menu and buttons. The page is fully usable while the card is still loading.
- Request the position after first paint, with a timeout of about 8 seconds, then fall back gracefully.
- No layout shift when the card fills in, and keep the Lighthouse mobile score at 90 or higher.

## Editable settings

Add these to the existing config file: store latitude and longitude, maximum distance for the card (default 2 km), walking speed (default 80 meters per minute), and the path to the lines file. If the coordinates are not filled in yet, hide the card and tell me in the change report. I will provide them.

## Tracking

If analytics is already set up, record only these events: card shown (with the band number only), permission allowed, permission denied, and Get Directions clicked from the card. Never record coordinates or the exact distance.

## What I want back

1. A short plan before you start.
2. The implementation.
3. A change report listing every file changed, what each change does, and what I still need to provide, mainly the store coordinates.
4. A short test list: how to test each card state on a phone, and how to fake a location for bands 1 to 8 while testing.
