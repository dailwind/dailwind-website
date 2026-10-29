# Dailwind Studio

Website, research tools and text-preparation workspaces by **Arslan Tahir**.

- Website: https://dailwind.com
- Contact: arslan@dailwind.com
- Last updated: 30 October 2026
- Update package: **v8.4** (apply after v8.3.1)

This README describes the latest website update packages. Features become live on your GitHub Pages website after you upload their files and successfully deploy them.

## v8.4 — website email signup with Supabase

Apply **Dailwind-Update-v8.4.zip after v8.3.1**. This is a changed/new-files website patch. The separate **PMC-Private-Server-v0.2.zip** is a private application package; keep it outside your public website/GitHub directory. Preserve its existing runtime/input folders and keys when upgrading v0.1.

- New public account route: **`/pmc/account/`**, linked from PMC. Create account with name, optional institute and email; existing users select Sign in. Google sign-in has been replaced by a typed email verification code in the new server.
- Supabase Auth verifies email; a RLS-protected `pmc_profiles` table stores each user's own name/institute. No corpus content is sent to Supabase by this implementation. Other local toolkits remain usable without an account.
- A personal profile can be created/loaded/edited from the website without deploying Python. The actual private corpus, access quotas and saved research queries still require the separate server.
- Account tokens stay in tab memory; no access/refresh token is stored in localStorage or a URL. Refreshing asks for a new email code; saved profiles remain. Once the separate private service is connected, a top-level HTTPS POST exchanges the verified identity for a short-lived HttpOnly research session.
- Profile/client metadata cannot grant paid access. The private server validates the session with your Supabase project, checks email confirmation, enforces its own local role and encrypts its profile cache/saved queries. Old v0.1 login sessions are revoked during the auth upgrade; corpus data is preserved. Old Google and new email identities are not automatically merged.
- Publishable-key-only configuration checks and restricted account-page CSP allow the required Supabase connection and the fixed PMC handoff, while other pages retain their prior restrictions. Updated privacy/terms describe optional account data and separate private sessions.
- **Activation is still required:** no Supabase Project URL/key or mail provider was supplied. The current page therefore clearly says signup is being prepared, with sending disabled. Real registration becomes available after you create/configure your own Supabase project and deploy the public config. Real email delivery, SQL/RLS execution and production private-server integration have not been exercised in a live project.

Read **SUPABASE-SETUP-GUIDE.md** for the numbered English/Roman Urdu setup. The SQL and email template are in the private-server ZIP's `supabase/` folder. Fill only **Project URL + `sb_publishable_...` key** in `assets/pmc-auth-config.js`. Never put secret/service-role keys, database passwords or SMTP passwords into that file or GitHub. Leave `researchOrigin` empty until the HTTPS private service at `pmc.dailwind.com` is ready.

**SMTP matters:** Supabase's default sender is limited to eligible project-team addresses with very low testing limits. A public signup service needs custom SMTP/domain verification. Email sender costs/limits belong to the selected provider; this update does not purchase or activate a plan.

Use the supplied **Publish Dailwind GitHub Actions** workflow after editing config; it validates config and refreshes script integrity hashes. Include the updated `publishing/security.py` and `publishing/site-files.json`. Bypassing that staging step can leave old hashes that block an edited config script.

Validation uses synthetic/mocked auth requests for OTP, profiles, rejected secrets, private identity exchange, origin/CSRF checks, access isolation and expiry. Live account activation still needs your own project; the guide includes the final signup/profile test. No real verification emails were sent during development.

## v8.3.1 — supplied logo and Muhammad Aqeel poem

Apply **Dailwind-Update-v8.3.1.zip after v8.3**. This is a changed/new-files patch, not a full website. Upload the extracted contents into the website repository root and replace matching paths. Preserve all unchanged assets and tools. The v8.3 private PMC server package is unchanged and is not included again.

- Replaced the earlier colour galaxy artwork with the supplied **black-and-white D / DAILWIND.COM logo**. The compact header size is retained; footer, corpus-workspace brand icon, favicon/touch icon and logo-only social previews use the new supplied artwork.
- Social metadata uses a fresh **`assets/dailwind-preview-v831.png`** URL to help chat apps refresh their cached previews.
- Added **I TOLD YOU IN THE START** by **Muhammad Aqeel** to Articles, category **Poetry**. The English poem's wording, punctuation, line breaks and stanza labels are reproduced as supplied. A short professional biography identifies the poet and his PhD affiliation. The source document's personal contact list and full CV are not published.
- Publication metadata is dated **30 October 2026**. The uploaded source filename includes 27 October; no unsupported composition-date claim is added.
- Article source for future edits: `articles/uploads/i-told-you-in-the-start.md` and matching `.json`. The existing publisher automatically rebuilds its reading page, catalogue and sitemap.
- Existing tool settings, private PMC integration, data protection and account-setup requirements remain as described below.

## v8.3 — what changed

**Apply only `Dailwind-Update-v8.3.zip` to the website after v8.2.** Extract its contents into the repository root, replace matching files and preserve every unchanged folder. No deletion or full-site replacement is needed. The separate **`PMC-Private-Server-v0.1.zip` belongs on your computer/private server, not in GitHub Pages**.

- Ten workspaces now use **Dailwind** branding. Existing URLs, engine identifiers, browser saves and backup formats stay compatible. The Android app remains **LinguaX Arc: Corpus Toolkit**.
- The Toolkits hub has four categories: **Analyze language / Prepare text / PDF & images / Catalogue & report**.
- A central task finder ranks tools from English, Roman Urdu and common Hindi/Urdu task words. Try “remove references from my thesis”, “pdf ko chota karna hai”, “MAT division by zero”, “scanned book to text” or “metadata in Excel”. This is local keyword/intent matching, not an AI model or arbitrary-language understanding; unsupported tasks get a clear no-match state. Visitors can also browse categories.
- Home monitor now runs a lightweight shuffled **ten-workspace feature tour**, with previous/next, direct slide selection and pause. It stops offscreen/when the tab is hidden, respects reduced motion, and follows the existing footer media toggle. The slides are labelled illustrations, not fabricated analysis results. The founder picture and “person behind” section are retained.
- Every workspace has a **Start here** guide, three concrete steps, links that find/highlight the appropriate control and a **Use recommended settings** button. Defaults are a starting point, never “perfect” AI settings. They preserve file selections, typed text and the chosen tool/mode. They never run a job or download automatically. The cleaner inspects a small local text sample and applies only safe invisible-noise cleanup; reference, number and punctuation removal remain opt-in. Tool-specific feedback explains all applied settings and limitations.
- Corpus Cleaner has separate word chips and sentence/phrase inputs, clear case/whole-word explanations and advanced rules collapsed initially. Case ON/OFF applies to both lists and find/replace. A sentence is matched literally, including its punctuation and spaces; one sentence/phrase per line. Sentence matching does not infer paraphrases or join sentences split over PDF line breaks. Your original files remain unchanged.
- PMC now includes the supplied project description and credits: project leads **Dr. Muhammad Afzaal & Dr. Adnan Tahir**, technical developer **Arslan Tahir**. “Hundreds of millions” is explicitly a project-team report, not the size of the sample or an independently audited count. The real collection remains coming soon.
- The supplied galaxy D is compact in the studio header/footer. The logo-only social preview uses a new `assets/dailwind-preview-v83.png` URL to help refresh stale chat-app previews. Third-party caches can still take time to update.
- Muhammad Aqeel's subsequently supplied poem is published in v8.3.1; see that update note above.

### PMC: the private collection is a separate deployment

The public website contains only the existing original synthetic demonstration. **Do not put your real TXT files into `assets`, `pmc`, `articles/uploads`, the website patch or a public GitHub repository.** Browser-delivered encryption keys cannot prevent a visitor from extracting browser-delivered data.

The separate PMC server package includes a `private-input/` folder, importer, encrypted text chunks, keyed search index, preview/full collection policies, bounded concordance/collocates/distribution, server-side Google sign-in integration, saved queries and account quotas. It has no real corpus or secrets in it. See that package's README for local setup, safe backups, production deployment and operator limits.

**Older v8.3 setup note (superseded by v8.4):** private HTTPS hosting, provider configuration and your permitted corpus files are required for real corpus access. The Google setup described in older notes below is superseded by v8.4 Supabase email signup. The source integration was tested with synthetic local sessions; a real Google callback and large-corpus performance were not tested. The package has manual paid-role assignment, not a working billing/subscription checkout. Apple sign-in is not included.

After the real service has been deployed and verified, set `researchOrigin` in the website's `assets/pmc-access-config.js` to its HTTPS origin. The PMC page then shows an entry link to that independent research workspace. It remains empty by default so visitors are not sent to a nonexistent login.

This architecture reduces unauthorized bulk access, but no service is impossible to hack, and visible excerpts can still be copied. Do not rely on disabled right-click, browser obfuscation or static encrypted bundles as corpus protection.

### v8.3 validation

- Local finder queries, no-match behavior, case/word boundaries and comma-containing sentence removal tested.
- Ten workspace guide/brand references checked; saved engine/storage IDs left unchanged.
- Browser checks: cleaner word/sentence removal and audit; task recommendation; recommended-settings buttons in all ten workspaces; responsive hub, cleaner and PMC at 375px (no document overflow); home monitor tour and controls.
- Existing MAT/Python parity, corpus/sample checks, website link/meta checks, CSP/script integrity checks and public export checks run.
- Private PMC synthetic tests: auth/CSRF/origin rejection, preview/full isolation, private-path rejection, encrypted data at rest, boundary-phrase deduplication, quotas, per-account saved searches, logout and fail-closed production settings.
- No user corpus, live Google credentials, production load test or independent penetration test was available. Native Python MAT GUI is unchanged from v8.2.

## Website sections

**PMC:** Coming Soon medical-corpus project and clearly labelled original sample analyzer.

- **Home:** LinguaX Arc promotion, looping silent video, phone screenshot slideshow and founder introduction.
- **App:** a separate showcase for **LinguaX Arc: Corpus Toolkit**, Android version 6.
- **Toolkits:** ten separate browser workspaces, listed below.
- **Articles:** research, reviews and creative writing with individual reading pages.
- **About:** Arslan Tahir’s portfolio and supplied academic information.
- **Contact, Privacy and Terms.**

The studio logo stays at the top-left on desktop pages, with space between the brand and navigation. The header/footer and social preview use your supplied galaxy **D / DAILWIND.COM** logo, optimized for display. The favicon and touch icon use the same artwork. Link-preview services may retain an older cached image.

## Dailwind Toolkits

Navigation is organized as **Home / App / Toolkits / PMC / Articles / About / Contact**. Existing page URLs and saved workspace identifiers remain unchanged. The Android product remains **LinguaX Arc: Corpus Toolkit**.

| Workspace | URL | Main features |
| --- | --- | --- |
| Dailwind Corpus Toolkit | `/corpus-toolkit/` | KWIC, dispersion, frequencies, n-grams, collocations, keywords, statistics, charts, annotated-data analysis and rule-based English grammar review |
| Dailwind Stylistic Toolkit | `/stylistic-toolkit/` | Evidence-based foregrounding candidates across eight linguistic levels, reference comparison, notes and exports |
| Dailwind Corpus Cleaner | `/corpus-cleaner/` | Books, theses, articles, newspapers and OCR presets; keyword removal; case sensitivity; damage cleanup; previews and audit |
| Dailwind File Converter | `/file-converter/` | Extract selectable PDF/DOCX text; export TXT or text-only Word; batch ZIP |
| Dailwind Corpus Merger | `/corpus-merger/` | Reorder/select files, choose separators and merge text; optional exact paragraph deduplication |
| Dailwind English OCR | `/english-ocr/` | Printed English recognition from scanned PDFs/images; enhancement, page ranges, editable results and exports |

| Dailwind PDF Tools | `/pdf-tools/` | Split PDFs into a chosen number of parts, pages per part or custom ranges; structural optimization or scan compression; numbered PDFs and ZIP |

| Dailwind Metadata Studio | `/metadata-studio/` | Bulk corpus catalogues; 28 genre labels; editable source fields, custom columns, counts, charts and XLSX / CSV / JSON |
| Dailwind Image Studio | `/image-tools/` | PDF pages to numbered image ZIPs; images to one PDF; resize/compress JPEG, PNG or WebP |

| Dailwind MAT Cleaner | `/mat-cleaner/` | Plain-text preparation, already-tagged syntax/baseline preflight, review isolation, audits and Python desktop download |

Workspaces fill the browser area without an outer simulated desktop frame. Corpus and Stylistic Toolkit retain desktop **Auto-hide / Always show** dock controls. The preparation tools have their own focused interfaces.

### Advanced Corpus Cleaner

- Presets for gentle cleaning, books, papers, journal articles, newspapers, theses, OCR text and poetry.
- Add removal words as chips using **commas or Enter**; remove an item from the list with ×.
- Put full sentences/phrases in the **separate sentence box, one per line**. Commas inside sentences are preserved.
- **Case sensitive: On/Off** applies to keyword removal and literal find/replace.
- Choose whole-word/phrase matching or substring matching; optionally remove entire matching lines.
- Up to 200 total removal entries: words ≤200 characters and sentences ≤1,000 characters.
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
- A professional paid OCR-services advertisement highlights **Sindhi, Balochi, Pashto, Urdu, Punjabi, Saraiki and other regional languages**, alongside English. These are separately assessed paid services, not additional languages in the free English browser recognizer. The email enquiry sends no message automatically.

Limits: PDFs up to **500 MB desktop / 80 MB mobile or low-memory**, **20,000 source pages**; images up to **40 MB / 40 megapixels**. The former 50-page batch stop is removed. The whole selected range runs sequentially; Stop preserves completed pages and Continue remaining pages starts after the last retained page. This continues the current tab session, not a saved cross-device job. Long scan recognition can take hours. Download completed results before leaving. Text retention is capped at 100 million characters desktop / 20 million mobile. Rendered images are capped to manage browser memory. Difficult print, handwriting, faded scans, tables and unusual historical typefaces require careful review or specialist work.

### Dailwind PDF Tools

- Open a PDF locally or try the bundled 24-page sample.
- Divide by **number of parts**, **pages per part**, or ordered, non-overlapping **custom page ranges**. A first/last page range can restrict the source selection.
- A 1,000-page book divided into 20 parts produces 50 pages per part. Uneven totals are balanced; the last pages-per-part chunk may be shorter. Equal page counts do not imply equal file sizes.
- Output names include the source name, part number and source page range, such as `Book-Part-01-pages-1-50.pdf`.
- Download individual PDFs or an all-parts ZIP. Stop preserves completed results.
- **Keep page content / optimize structure** uses PDF object streams. Already optimized PDFs may not become smaller; the original is offered when structural rewriting does not reduce its size.
- **Smaller scan / image-based PDF** provides resolution and JPEG-quality controls. It requires explicit acknowledgment: output pages become images, losing searchable text, links, annotations and interactive forms. Review small text after compression. No fixed compression percentage is promised.
- Splitting can affect document-level bookmarks, forms and signatures. Keep the original document.
- Password-protected/encrypted PDFs are not supported. Session-only results must be downloaded before leaving.

Limits: desktop input up to **500 MB**, mobile/low-memory input up to **80 MB**, **20,000 pages** and **2,000 parts**, subject to available device memory. Generated output is capped at 700 MB desktop / 150 MB mobile. All-parts ZIP creation is capped at 250 MB desktop / 60 MB mobile; individual PDFs remain downloadable. Very large scans may require smaller source files. PDF processing runs in a browser worker; scan rendering proceeds one page at a time.

### Dailwind Metadata Studio

1. Choose a collection name, default genre and optional source details, then add your files together.
2. Supported inputs: TXT/TEXT, Markdown, CSV, SRT/VTT subtitles, DOCX, selectable-text PDF and CoNLL files as raw text. For CoNLL-U linguistic token counts, use Corpus Toolkit instead. CSV is measured as raw text, not as a structured data table. Scans need OCR first.
3. Choose among research articles, theses, fiction/nonfiction books, chapters, news/newspapers, poetry, stories, plays, scripts, speeches, interviews, conversations, essays, blogs, web/social corpora, letters/diaries, legal/historical text, YouTube/movie/TV/drama subtitles and other or mixed corpora.
4. Every file has an editable title, corpus, genre/subgenre, author, year, source/book/channel, publication, URL, language, region, rights, DOI, ISBN, volume/issue, chapter/episode, source page range, keywords and notes. Use **Edit details** to change a specific record. Defaults can fill blanks across included records; overwrite is an explicit option.
5. Add up to 20 custom fields, with optional default values and per-file edits. Choose an output preset or individual columns. Include/exclude files, search records and filter by genre.
6. Counts include word tokens, within-file unique words, type/token ratio, hapax, sentence estimates, paragraphs, nonempty lines, Unicode characters, numeric/punctuation characters and an illustrative 200-wpm reading time. SRT/VTT timing and markup can be excluded; cue counts, duration span and word/minute estimates are available.
7. Choose case-sensitive unique-word counts, number-only token inclusion, UTF-8/UTF-16 or Windows-1252 text decoding, filename/first-line suggested titles, and optional SHA-256 source fingerprints (HTTPS required).
8. Charts show word totals by genre and the largest texts. Summary totals count successful included files; error rows retain an explanation with counts blank.
9. **Excel (.xlsx)** has Summary, Files, Genres and Methods sheets, styled headers, frozen first rows, numeric count cells and text-only metadata cells. CSV has a UTF-8 BOM, quoted values and formula-injection protection. JSON exports the chosen fields and settings. These exports are catalogues, not restorable source-text workspaces.

Limits: **2,000 records**, up to **250 MB / 100 million characters per file desktop**, or **60 MB / 20 million characters mobile/low-memory**. Selectable PDF extraction supports 10,000 pages. Files are read one at a time; raw source text is discarded after measurement. Unique-vocabulary tracking stops at 1 million distinct tokens per file; unique/TTR/hapax are then blank, with a warning. Device RAM and browser resources can reduce practical capacity.

Suggested titles are not verified publication metadata. Authors, provenance, genre, language and publication dates are user supplied. Local file modification dates are not publication dates. Sentence counts are punctuation estimates; Unicode word-token rules can differ from Word and do not segment unspaced languages linguistically. Corpus totals do not claim a combined unique vocabulary. Counting-method details are recorded per file because different import batches may use different options.

### Dailwind Image Studio

- **PDF → image ZIPs:** choose first/last page, JPEG/PNG/WebP, 96/150/200/300 DPI, quality and pages per ZIP part. Export names contain source page numbers. The complete selected range runs sequentially; ZIPs rotate by page count or size instead of stopping at 50 pages.
- **Images → one PDF:** add still JPEG/PNG/WebP files, move them up/down or remove them, choose image-sized/A4/Letter paper, automatic/portrait/landscape orientation and margins. Keep original JPEG/PNG data when possible or use resize/compression settings. EXIF-oriented JPEGs are rendered when necessary. The PDF is image-only without recognized text.
- **Compress images:** choose JPEG/WebP/PNG, quality, maximum edge and scale. Individual images and numbered ZIP batches are offered. The output-size change is displayed; smaller output is not guaranteed. JPEG uses a white background. PNG is lossless at the chosen dimensions; JPEG/WebP can lose detail. Browser exports do not preserve original EXIF metadata or an archival master.
- Stop preserves completed downloads. Incomplete image-to-PDF jobs need a smaller/repeated run. **Release downloaded results** frees retained outputs after you have saved them. Source files remain available for another run.

Limits: PDF **500 MB desktop / 80 MB mobile or low-memory**, up to **20,000 pages**. Up to **2,000 images**, **150 MB each / 750 MB combined desktop**, or **40 MB each / 150 MB combined mobile**. Decoded source images are limited to 80 megapixels desktop / 24 megapixels mobile; output canvases to 16 / 4 megapixels and 8,192 pixels per axis. ZIP batches rotate at 120 MB desktop / 30 MB mobile. Session outputs are capped at 700 MB desktop / 150 MB mobile, including individual and ZIP outputs. For larger work, download/release results and continue with later page ranges or another image batch. Actual capacity depends on RAM, scan complexity and browser support. Keep the tab open and review a sample first.

### Larger local workspaces

Preparation tools and Corpus Toolkit now share a device-aware capacity profile:

| Capacity | Desktop | Mobile / low-memory |
| --- | --- | --- |
| Source file bytes | 250 MB | 60 MB |
| Files per preparation workspace or corpus bucket | 500 | 250 |
| Characters per file | 50 million | 10 million |
| Characters across a workspace | 100 million | 20 million |
| Indexed Corpus Toolkit tokens (target + reference) | 3 million | 1 million |
| Selectable PDF pages for text extraction | 10,000 | 10,000 |

DOCX expansion remains bounded at 100 MB to avoid decompression bombs. Stylistic Toolkit has a separate desktop budget of 5 million characters / 750,000 words / 100,000 nonempty lines per text, or 2 million / 300,000 / 40,000 mobile. It retains at most 5,000 findings and paginates close reading by 1,000 lines. Larger input limits do not remove algorithmic scope limits or guarantee that every device can handle the ceiling. Existing saved workspace identifiers and backup formats remain unchanged.

## v8.2 — MAT preparation, PMC preview and galaxy identity

### Dailwind MAT Cleaner (web)

- Use **Plain text → prepare, then tag in MAT** for untagged `.txt` files. Apply selected control, whitespace, soft-hyphen and punctuation transformations. Optional ligature/long-s expansion, line-end dehyphenation and OCR placeholder removal are raw-mode-only and require review.
- Use **Already MAT-tagged → preflight for counting** for final MAT output. It normalizes selected Unicode whitespace into ASCII token separators (when spacing normalization is enabled), preserves annotation spelling, checks `word_TAG` syntax and filename conventions, counts the examined counter's baseline, and flags empty/zero-token, malformed and `ST_` intermediate files.
- The source screenshot's `count_only.pl line 100` corresponds in the examined official source to average word length divided by counted tokens. A zero baseline is consistent with this error. The actual failing file and installed build were not supplied, so this is not a confirmed diagnosis of that file.
- Prepared raw text is exported under `ready-for-tagging/`; it still needs MAT **Tag** or **Tag and Analyze**. Preflight-passed tagged files go under `count-input/`; ambiguous/blocked copies go under `review/`. JSON audits and instructions stay outside the MAT input folders. Never select the entire output root in MAT counting.
- Download full TXT, a structured ZIP or the audit. UTF-8 without BOM output; strict UTF-8/UTF-16 source detection or explicit Windows-1252. No silent encoding replacement.
- The TTR value is a warning threshold, not a setting sent to MAT. Default 400; consult the official manual before changing the actual MAT TTR setting. Short texts are flagged, never padded.
- This independently written utility is not the MAT tagger, does not create linguistic tags, and cannot guarantee every feature/dimension/Z-score calculation or repair a MAT/Java/Stanford installation. It does not invent words or remove valid function words/numbers to change results.
- Device limits follow the existing text-workspace profile. Structured ZIP export is capped at 60 MB desktop / 15 MB mobile; use individual downloads or smaller groups for larger results. All document processing is local.

### Offline Python desktop app

The website includes `assets/downloads/Arc-MAT-Cleaner-Python-v1.0.zip`, also supplied separately with this update. Extract the whole package, install **Python 3.10+ with Tkinter**, then use `Start-Windows.bat` or run `python app.py`. macOS/Linux: `python3 app.py`. No pip dependencies, network processing or Windows EXE are included.

The app offers file/folder selection, optional subfolders, raw/tagged workflows, encoding settings, cleaning checkboxes, TTR warnings, progress, Stop, and CSV/JSON audits. Each run creates a fresh dated output folder and writes completed files atomically. Original files are not overwritten. CLI examples and detailed instructions are in the app's own README.

Python core/CLI and cross-language fixture parity were tested, including direct Perl baseline comparison. The native Windows/macOS GUI was not exercised in this environment; its Python source was syntax checked. An end-to-end run of your installed MAT remains unverified.

### Pakistan Medical Corpus (PMC)

The new **PMC** navigation tab opens `/pmc/`: a Coming Soon project page with an original synthetic sample search workspace. Concordance, word frequencies, neighbouring collocate counts, document distribution and text-type filtering work on those sample texts. Counts are calculated from the sample, not claimed as real PMC statistics. The real source corpus is not bundled or connected.

**Do not upload real PMC source texts to GitHub Pages, assets, article uploads or browser JavaScript.** A no-download button does not make browser-delivered data private. Real in-place analysis needs a private server-side index, access policy, bounded result excerpts and query/rate limits. Visible results can still be copied; absolute non-extraction cannot be promised. Keep master texts in your existing private storage until that service is configured. No real corpus ingestion path is included in this update.

The supplied `PMC-PRIVATE-CORPUS-PLAN.md` explains the future launch boundary and preparation steps. No real corpus size, launch date, clinical validity, patient dataset or research access is invented.

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

**v8.2 adds `mat-cleaner/`, `pmc/`, new assets and the Python app ZIP under `assets/downloads/`. Upload the supplied `publishing/site-files.json` so both routes are deployed. Apply after v8.1 and preserve all existing tool engines, OCR models and other assets. This is a changed/new-files patch. The separate Python app ZIP is for your computer; the website patch already includes its downloadable copy.**

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

v8.1 checks cover multilingual metadata, SRT/VTT timings, CSV injection protection, workbook XML/relationships, ZIP CRC/content, page/image geometry, real image-PDF generation, enlarged capacity guards (including real indexing of 1,100,002 tokens and conversion of 75 files), existing preparation/stylistic/PDF engines and page security policies. Browser checks include custom metadata fields, workbook generation, numbered PDF-image ZIPs, a real 3-image PDF, image compression, a real printed-English sample scan and 61-page sequential extraction using embedded PDF text; this last test validates the page flow beyond 50, not recognition accuracy on 61 scans.

Source checks cover internal links, labels, metadata, article sanitization, workers, corpus/stylistic algorithms, cleaning rules, image preprocessing, export safeguards, publishing boundaries and script integrity. Browser checks exercised Cleaner and real OCR under the page security policy. PDF checks generated a real 1,000-page document and verified 20 valid 50-page outputs, structural rewriting, scan-image PDF creation, custom ranges and filenames. Browser checks exercised sample splitting, ZIP creation, scan compression and narrow layouts. Desktop Chrome and narrow browser layouts were tested; this is not certification for every browser or physical phone.

## Credits

PDF.js, pdf-lib 1.17.1 (MIT), Mammoth and Tesseract components retain their bundled licenses/notices. pdf-lib credits are in `toolkit/pdf-lib/`. OCR credits are in `toolkit/ocr/THIRD-PARTY-NOTICES.txt`. Article authors retain their authorship and receive individual bylines. Third-party component licenses do not determine ownership of submitted articles or corpora.
