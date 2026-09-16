# QuickConvert

A free, no-signup web app for converting length, weight, temperature, volume, and currency — monetized with ads and a one-time "remove ads" purchase.

## Features
- Length, weight, temperature, and volume conversion (offline, instant)
- Live currency conversion (base: INR) via [open.er-api.com](https://www.exchangerate-api.com/) (free, no API key)
- Google AdSense ad slots (top + mid-page)
- One-time ₹149 "Remove Ads" purchase via Razorpay Payment Links

## Project Structure
```
index.html   Markup, tabs, ad slots, remove-ads CTA
style.css    Styling
script.js    Conversion logic, tab switching, currency API, ad-free unlock
```

## Local Development
Open `index.html` directly in a browser, or serve it locally:
```powershell
npx serve .
```

## Deployment (GitHub Pages)
1. Push this repo to your personal GitHub account.
2. In the repo, go to **Settings → Pages**.
3. Source: `Deploy from a branch` → Branch: `main` → folder `/ (root)` → Save.
4. Site goes live at `https://YOUR_USERNAME.github.io/quickconvert-web/`.

## Monetization Setup

### Google AdSense
1. Sign up at [adsense.google.com](https://adsense.google.com) and get your site approved.
2. Replace all instances of `ca-pub-XXXXXXXXXXXXXXX` in `index.html` with your Publisher ID.
3. Replace the `data-ad-slot` values with your actual ad unit slot IDs.

### Razorpay "Remove Ads" Payment Link
1. Sign up at [razorpay.com](https://razorpay.com) (individual PAN + bank account is enough).
2. Dashboard → **Payment Links** → create a ₹149 one-time link.
3. Replace the placeholder URL in the `removeAdsBtn` link (`index.html`) with your real Razorpay link.

> Note: the "I already paid" unlock is a simple client-side flag (`localStorage`) for now. For production-grade fraud protection, wire up a Razorpay webhook to verify payment server-side before unlocking.

## License
Free to use and modify.
