# Etsy Digital Download Portal

A single-page, multi-product download delivery system for Etsy digital sellers.
Customers click a button in your Welcome PDF, land on this page, enter their
email, and instantly get a Download Now button — while their email, product,
date/time, and marketing opt-in are logged to a Google Sheet.

No backend server required — only **GitHub Pages** (hosting) and
**Google Apps Script** (data capture).

---

## 1. Folder Structure

```
etsy-portal/
├── index.html                       ← the ONE page for every product
├── style.css                        ← all styling
├── script.js                        ← product catalog + form logic
├── Code.gs                          ← Google Apps Script backend
├── GOOGLE_SHEETS_SETUP_GUIDE.md
├── GITHUB_PAGES_DEPLOYMENT_GUIDE.md
├── README.md                        ← this file
└── assets/
    ├── logo.png                     ← your shop logo
    └── products/
        ├── shopify.jpg
        ├── canva.jpg
        ├── capcut.jpg
        └── (add more product images here)
```

---

## 2. How the Multi-Product System Works

Everything is driven by **one URL parameter**: `?product=KEY`

```
yoursite.github.io/etsy-portal/?product=shopify
yoursite.github.io/etsy-portal/?product=canva
yoursite.github.io/etsy-portal/?product=capcut
```

`script.js` contains a single `PRODUCTS` object that maps each key to its
title, image, and Google Drive download link. `index.html` never changes —
the JavaScript reads the URL and fills in the right content automatically.

---

## 3. How to Add a New Product (no HTML editing)

1. **Add the product image** to `assets/products/`, e.g. `notion.jpg`.
   - Recommended size: **1200×750px** (or similar 16:10 ratio), JPG or WebP,
     under 300KB for fast loading.
2. **Get your Google Drive download link:**
   - Upload the product files to a Google Drive folder.
   - Right-click the folder → **Share → General access → Anyone with the link**.
   - Copy the link.
3. **Open `script.js`** and add a new entry to the `PRODUCTS` object:
   ```js
   notion: {
     title: "Notion Productivity Dashboard",
     image: "assets/products/notion.jpg",
     downloadUrl: "https://drive.google.com/drive/folders/XXXXXXXXXXXX"
   },
   ```
4. **Save and upload/commit** the updated `script.js` and new image to GitHub.
5. Your new product is now live at `?product=notion` — instantly, with zero
   HTML changes.

That's the entire process for unlimited products.

---

## 4. Where Things Go

| What | Where |
|---|---|
| Shop logo | `assets/logo.png` (transparent PNG recommended, ~400×100px) |
| Product photos | `assets/products/yourproduct.jpg` |
| Google Drive download links | Inside `script.js`, in each product's `downloadUrl` field |
| Google Apps Script URL | Top of `script.js`, the `APPS_SCRIPT_URL` constant |

---

## 5. Full Installation — Start to Finish

### A. Set up the Google Sheet + Apps Script
Follow **`GOOGLE_SHEETS_SETUP_GUIDE.md`** in full. At the end you'll have a
Web App URL like `https://script.google.com/macros/s/AKfycb.../exec`.

### B. Configure the website
1. Open `script.js`.
2. Paste your Apps Script URL into `APPS_SCRIPT_URL`.
3. Replace the placeholder entries in `PRODUCTS` with your real products
   (titles, image paths, Drive links) — or keep `shopify` / `canva` / `capcut`
   as a starting template and edit from there.
4. Replace `assets/logo.png` with your real logo (same filename, or update
   the `src` in `index.html`'s `<img id="logo">` tag if you rename it).
5. Replace the placeholder images in `assets/products/` with real product photos.

### C. Deploy to GitHub Pages
Follow **`GITHUB_PAGES_DEPLOYMENT_GUIDE.md`** in full. At the end you'll have
a live URL like `https://yourname.github.io/etsy-download-portal/`.

### D. Update your Etsy Welcome PDF
Set the **"Access Your Files"** button link to your live URL + the matching
`?product=` parameter for that listing, e.g.:
```
https://yourname.github.io/etsy-download-portal/?product=shopify
```

### E. Test the full flow
1. Open the live link in an incognito window.
2. Enter a test email, optionally check the marketing checkbox, click
   **Access My Files**.
3. Confirm the success state appears with a working **Download Now** button.
4. Confirm a new row appeared in your Google Sheet.

You're live. 🎉

---

## 6. Design Notes
- Built mobile-first; the card layout scales cleanly from 360px phones up to
  desktop.
- Uses system-safe Google Fonts (`Fraunces` for headings, `Inter` for body)
  loaded via CDN — no build step needed.
- Respects `prefers-reduced-motion` and has visible keyboard focus states for
  accessibility.
- All animation is intentionally restrained — a single signature "seal" reveal
  on the success state, rather than scattered effects.

## 7. Notes on Privacy & Email Capture
- Consent checkbox is **optional** and unchecked by default, as required.
- Both "Yes" and "No" consent values are logged either way, so you maintain a
  compliant record of who opted in vs. who didn't.
- Consider adding a one-line privacy note/link if you plan to send marketing
  emails (a starting line is already included under the form).
