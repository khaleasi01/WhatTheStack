# WhatTheStack — Chrome Extension (MV3)

Detect a website’s **tech stack** (frameworks, CMS, analytics, CDN) and **basic security headers** (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy). Export a JSON report.

## Features
- 🔍 Tech detection from DOM signatures (React, Vue, Angular, jQuery; WordPress/Shopify/Wix; GA/GTM/Hotjar; Cloudflare/Akamai/Fastly)
- 🛡️ Security header checks (CSP, HSTS, XFO, XCTO, Referrer-Policy) + shows Server / X-Powered-By
- 📦 Clean popup UI with quick badges and lists
- 💾 Copy JSON report
- ⚙️ Options to allowlist/exclude domains

## Permissions Explained
- `activeTab`/`scripting`: run content detection in the current page
- `storage`: save settings and per-origin reports
- `webRequest`/`webRequestBlocking`: read response headers for the active tab (needed for security header checks)
- `cookies`: reserved for future enhancements (cookie flags checks)

## Install (Developer Mode)
1. Clone/download this folder
2. Go to `chrome://extensions`
3. Enable **Developer mode** (top-right)
4. Click **Load unpacked** and select the project folder

## Usage
- Open any website → click the extension icon → see detected tech + security headers
- Click **Copy JSON** to copy the full report
- Use **Options** to limit scans to certain domains

## Roadmap (nice-to-haves)
- Check cookie flags (`Secure`, `HttpOnly`, `SameSite`) via `chrome.cookies`
- Mixed content detection
- Per-tab panel with history
- Export to file (JSON)

## Privacy
- No data leaves your browser. All processing happens locally.

## Publishing to Chrome Web Store
1. Create a developer account at Chrome Web Store
2. Package: Ensure icons are present; bump version in `manifest.json`
3. Use **Package** in the dashboard and upload the folder as a zip
4. Fill listing: screenshots, description, permissions rationale
