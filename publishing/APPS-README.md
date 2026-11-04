# Dailwind App Store (/apps/)

The page `apps/index.html` is generated. Do not edit it by hand.

1. Edit `publishing/apps.json` (one object per app, shown in file order).
2. Run `python3 publishing/build_apps.py` and commit `apps/index.html` too.
   (`publishing/tests/test_apps_page.py` fails if the page is out of date.)

Fields:
- `name` (required) – app name.
- `status` (required) – `live` (shown under "Available now") or `coming-soon` (shown under "Coming soon", with a Coming Soon label).
- `description` (required) – one or two short sentences. Plain text.
- `icon` (optional) – site path to a square image, e.g. `assets/apps/my-app-icon-v1-256.webp` (256 px). Without it, the card shows the app's initials.
- `icon2x` (optional) – 512 px version for high-density screens.
- `playStoreUrl` (optional) – full `https://play.google.com/...` link. Live apps without it show a disabled "Play Store link coming soon" button.
- `learnMoreUrl` (optional) – site path such as `linguax-arc/` for an on-site details page.

Icons: convert to WebP, e.g. with Pillow, 256 and 512 px, versioned filename under `assets/apps/`.
