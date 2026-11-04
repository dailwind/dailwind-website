# Dailwind App Store (/apps/)

The page `apps/index.html` is generated. Do not edit it by hand.

1. Edit `publishing/apps.json` (one object per app, shown in file order).
2. Run `python3 publishing/build_apps.py` and commit everything under `apps/` too.
   (`publishing/tests/test_apps_page.py` fails if the page is out of date.)

Fields:
- `name` (required) – app name.
- `status` (required) – `live` (shown under "Available now") or `coming-soon` (shown under "Coming soon", with a Coming Soon label).
- `category` (optional) – grey subtitle under the name, e.g. `Files & storage · Android`.
- `description` (required) – one or two short sentences. Plain text.
- `icon` (optional) – site path to a square image, e.g. `assets/apps/my-app-icon-v1-256.webp` (256 px). Without it, the card shows the app's initials.
- `icon2x` (optional) – 512 px version for high-density screens.
- `playStoreUrl` (optional) – full `https://play.google.com/...` link. Live apps without it show a disabled "Play Store link coming soon" button.
- `learnMoreUrl` (optional) – site path for the card's "Learn more" link, e.g. `linguax-arc/`, or `apps/<slug>/` for a generated detail page.
- `slug` (optional) – generates a detail page at `apps/<slug>/` (icon, name, description, Play button, back link). Also add the page's title/description to `PAGES` in `publishing/discovery.py`.
- `details` (optional) – list of paragraphs for the detail page.
- `features` (optional) – list of short feature bullets for the detail page.
- `detailsSource` (optional, not shown) – note where the facts came from (e.g. the Play listing).

Icons: convert to WebP, e.g. with Pillow, 256 and 512 px, versioned filename under `assets/apps/`.

Keep descriptions factual: copy facts from the app's Google Play listing; do not invent features.
Cards animate in via `assets/apps-motion.js` + `assets/apps.css` (disabled for reduced motion).
Layout check (needs Playwright): `python3 publishing/tests/test_apps_layout.py` after `prepare_pages.py`, or pass a base URL such as `https://dailwind.com/`.
