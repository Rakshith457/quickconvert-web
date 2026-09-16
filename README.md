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



