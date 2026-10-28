# Dailwind Studio

Website, research tools and text-preparation workspaces by **Arslan Tahir**.

- Website: https://dailwind.com
- Contact: arslan@dailwind.com
- Last updated: 28 October 2026

This README describes the latest website update packages. Features become live on your GitHub Pages website after you upload their files and successfully deploy them.

## Website sections

- **Studio:** LinguaX Arc promotion, looping silent video, phone screenshot slideshow and founder introduction.
- **LinguaX Arc:** a separate showcase for **LinguaX Arc: Corpus Toolkit**, Android version 6.
- **Toolkits:** six separate browser workspaces, listed below.
- **Articles:** research, reviews and creative writing with individual reading pages.
- **Arslan Tahir:** portfolio and supplied academic information.
- **Contact, Privacy and Terms.**

The studio logo stays at the top-left on desktop pages, with space between the brand and navigation. The social preview image uses the Dailwind **D** logo.

## Toolkits

| Workspace | URL | Main features |
| --- | --- | --- |
| Corpus Toolkit | `/corpus-toolkit/` | KWIC, dispersion, frequencies, n-grams, collocations, keywords, statistics, charts, annotated-data analysis and rule-based English grammar review |
| Stylistic Toolkit | `/stylistic-toolkit/` | Evidence-based foregrounding candidates across eight linguistic levels, reference comparison, notes and exports |
| Corpus Cleaner | `/corpus-cleaner/` | Books, theses, articles, newspapers and OCR presets; keyword removal; case sensitivity; damage cleanup; previews and audit |
| File Converter | `/file-converter/` | Extract selectable PDF/DOCX text; export TXT or text-only Word; batch ZIP |
| Corpus Merger | `/corpus-merger/` | Reorder/select files, choose separators and merge text; optional exact paragraph deduplication |
| English OCR | `/english-ocr/` | Printed English recognition from scanned PDFs/images; enhancement, page ranges, editable results and exports |

Workspaces fill the browser area without an outer simulated desktop frame. Corpus and Stylistic Toolkit retain desktop **Auto-hide / Always show** dock controls. The preparation tools have their own focused interfaces.

### Advanced Corpus Cleaner

- Presets for gentle cleaning, books, papers, journal articles, newspapers, theses, OCR text and poetry.
- Remove custom keywords or phrases, **one entry per line**.
- **Case sensitive: On/Off** applies to keyword removal and literal find/replace.
- Choose whole-word/phrase matching or substring matching; optionally remove entire matching lines.
- Up to 200 entries, each up to 200 characters.
- Optional cleanup for references, citations, repeated page edges, page numbers, contents entries, numbered headings, bylines, wrapped prose and repeated words.
- Optional repairs for known broken punctuation encodings, ligatures/long s, soft hyphens, invisible controls and placeholder boxes.
- Before/after previews, individual/batch downloads, duplicate reports and cleaning-audit JSON.

Rules are explicit heuristics. Review changes before research use. Removing digits, punctuation, headings or private-use font codes can remove meaningful material. Missing letters and unknown font mappings are not reconstructed.

### English OCR

- **Printed English only**, using the Latin alphabet.
- Local Tesseract.js 7.0.0, LSTM core and bundled English best-int model.
- PDF, PNG, JPEG and WebP sources.
- Grayscale/contrast, Otsu or adaptive thresholding, optional isolated-dot removal, rotation, fine rotation and margin cropping.
- Editable page text and engine confidence scores. Scores are **not verified accuracy percentages**.
- Combined TXT, text-only Word, separate-page ZIP and page-report JSON exports.
- Stop preserves completed pages for download. Previously reviewed edits can be replaced when rerunning their pages.
- A professional paid OCR-services advertisement links to an email enquiry; it sends no message automatically.

Limits: PDFs up to **100 MB / 2,000 pages**, images up to **40 MB / 40 megapixels**, and **50 pages per run**. Use page ranges for large books. Rendered images are capped to manage browser memory. Difficult print, handwriting, faded scans, tables and unusual historical typefaces require careful review or specialist work.

## Privacy and storage

Document processing runs in the visitor's browser. Files are not uploaded to an OCR or corpus-processing server. Code, fonts and the OCR model load from the website; initial use requires access to these assets. This is not an installed offline PWA.

- Preparation desks and OCR are session-only: download results before refreshing or leaving.
- Corpus Toolkit offers optional **Remember workspace** browser storage and workspace backups.
- Browser storage is not a cloud backup and may be cleared by the device.
- To analyze cleaned/OCR text, download it, then import it into Corpus Toolkit.
- Word exports contain text and paragraphs, not original page layouts, images or tables.

Optional analytics remain unconfigured unless the owner supplies a measurement ID and the visitor gives consent. The contact form prepares an email in the visitor's mail application; there is no account/password system.

## Update the website on GitHub

1. Extract the update ZIP on your computer.
2. Open the existing website repository root—the folder containing the homepage `index.html`.
3. Upload the extracted files and folders, preserving their paths. Replace matching files.
4. **Do not delete existing files or folders. Do not upload the ZIP itself.** Update ZIPs contain changed/new files, not the full website.
5. Include `publishing/`, `.github/workflows/` and `.well-known/` when supplied. Show hidden folders if your file manager hides them.
6. Commit changes and wait for the **Publish Dailwind** workflow to succeed.
7. Refresh the website. Link-preview services may retain an older cached image.

For the initial workflow setup, use **Settings → Pages → Source → GitHub Actions**. Preserve the working custom domain and DNS configuration. Verify **Enforce HTTPS** in Pages settings.

**OCR needs the complete `toolkit/ocr/` folder.** Keep `toolkit/lib/` too: it contains the PDF and Word readers. Uploading only the OCR HTML page will not install its engine/model.

## Publish or update articles

Put source files in **`articles/uploads/`**:

- `.pdf`: publish the original PDF with a reading/download page.
- `.md`: UTF-8 Markdown for an article readable directly on the website.
- `.txt`: UTF-8 plain text, with blank lines between paragraphs.

Use an optional same-name JSON file for metadata:

```json
{
  "title": "Your Article Title",
  "author": "Author Name",
  "date": "2026-10-28",
  "category": "Research",
  "summary": "A short description of the article."
}
```

Example: `your-article.md` and `your-article.json`. Templates and detailed instructions are in `publishing/ARTICLES-GUIDE.txt`.

Commit the source files. The workflow regenerates the article list, reading pages and sitemap. Do not manually edit `articles/read/` or `articles/catalog.json`. Replacing the same source filename preserves its generated reading URL. Remove the source and optional metadata file to remove an article on the next deployment.

Word files must first be exported to PDF or converted to Markdown/TXT. Raw HTML is escaped. Poetry can use consecutive `> ` lines; `---` creates a scene break. Translation metadata supports `original_title`, `original_author` and `translation_note`.

Publish only material you have permission to share. Article files and repository content may be public. Security-update publishing limits are 50 MB per PDF, 5 MB per text article and 1 MB per metadata JSON; smaller PDFs are preferable for readers.

## Replace the promotional video

Use these exact paths:

- `assets/videos/linguax-ad.mp4`
- `assets/videos/linguax-ad-poster.webp`

Use a landscape 16:9 H.264 MP4 with fast-start metadata. The current video is silent, autoplaying and looping, with no playback overlays. Browsers or power-saving settings can restrict autoplay. The footer provides a global automatic-media pause/resume control. Phone screenshots cycle automatically.

## Security

The latest security update includes page Content Security Policies, initial-script integrity hashes, safe article rendering, publishing path/symlink/private-file checks, bounded inputs, CSV formula-injection protections and pinned GitHub Actions with no persisted checkout credential.

The publishing workflow reapplies page policies and recomputes script integrity hashes. If you change JavaScript files, deploy through this workflow so matching HTML hashes are regenerated. Local source builders also apply the hardening step.

**No website can be guaranteed impossible to hack.** These safeguards do not replace maintenance, account protection or host configuration. Targeted advisory checks are not a complete audit of every dependency or proof against undisclosed vulnerabilities.

Owner actions:

- Enable passkeys/two-factor authentication on GitHub and domain/DNS accounts.
- Review collaborators, tokens and installed apps; protect the main branch where available.
- Enable HTTPS and retain repository backups.
- Never commit passwords, private keys or privileged cloud credentials.
- Configure HTTP-only security headers through a supporting host/CDN. GitHub Pages does not apply the `_headers` format; a CSP meta tag cannot enforce `frame-ancestors`.

The security-update ZIP includes `SECURITY-REVIEW-AND-UPLOAD.txt` with the completed checks, their limits and remaining owner setup. A successful GitHub Pages deployment is separate from any private preview publication.

## Validation and limitations

Source checks cover internal links, labels, metadata, article sanitization, workers, corpus/stylistic algorithms, cleaning rules, image preprocessing, export safeguards, publishing boundaries and script integrity. Browser checks exercised Cleaner and real OCR under the page security policy. Desktop Chrome and narrow browser layouts were tested; this is not certification for every browser or physical phone.

## Credits

PDF.js, Mammoth and Tesseract components retain their bundled licenses/notices. OCR credits are in `toolkit/ocr/THIRD-PARTY-NOTICES.txt`. Article authors retain their authorship and receive individual bylines. Third-party component licenses do not determine ownership of submitted articles or corpora.
