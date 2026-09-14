# dailwind.com

Website for Dailwind Studio™. Static HTML and CSS — no build step, no framework, no dependencies.

## Design

Liquid glass: translucent panels with real backdrop blur, layered over a slow-moving colour field. Browsers without `backdrop-filter` fall back to solid panels automatically, so the site stays readable everywhere.

## Files

| File | Page |
|---|---|
| `index.html` | Home |
| `linguax-arc.html` | LinguaX Arc product page |
| `about.html` | About the studio |
| `privacy.html` | Privacy policy (linked from Google Play) |
| `style.css` | All styling |
| `CNAME` | Custom domain for GitHub Pages |

## To edit

Open any `.html` file in a text editor. Text sits between the tags. Save, upload to GitHub, and the live site updates within about a minute.

To change the colours, edit the `:root` block at the top of `style.css` — every colour on the site comes from there.

## Before going live

- [ ] Replace the two `href="#"` links in `linguax-arc.html` with your real Play Store and GitHub URLs
- [ ] Replace `10.5281/zenodo.XXXXXXX` in the citation block with your real DOI
- [ ] Set the email address if `hello@dailwindstudio.com` is not what you use
- [ ] Confirm `CNAME` holds your domain (one line, no `https://`)

© 2026 Dailwind Studio
