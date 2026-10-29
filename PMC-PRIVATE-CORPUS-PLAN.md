# PMC research access — launch boundary

The v8.2 release adds a Coming Soon project page and a working **original synthetic demonstration**. It does not host, import, index, secure or serve the actual Pakistan Medical Corpus. The real source files were not supplied. Current demo counts are computed from 12 short, original demonstration texts, not claimed PMC statistics.

## Keep the source private

Do not put PMC TXT/PDFs in the public GitHub repository, assets, article uploads, a downloadable ZIP, a JavaScript bundle or the PMC page folder. A static GitHub Pages site cannot keep any corpus delivered to the browser confidential. Disabling right-click, hiding download buttons or minifying JavaScript does not protect it. If source files were previously made public, removing the current file alone does not remove repository history or cached copies.

For now, keep the master text, provenance and backups in your existing private storage. There is deliberately **no drop-files-here folder** in this public update. Do not use `articles/uploads/` for PMC documents.

## The future service

1. Confirm inventory, source metadata, access permissions and any sensitive material before indexing.
2. Build the corpus/index in private server-side storage with no public object URLs or directory listing.
3. Run query validation, authentication/authorization, quotas and rate limits on the server. Never trust a hidden UI button as an authorization check.
4. Return only bounded concordance excerpts, aggregate frequencies/collocations and document metadata permitted by the access policy. No raw-document or whole-corpus endpoint. Do not put full text in API responses, hidden HTML, source maps or public caches.
5. Bound rows, context width, pagination, repeated-query extraction and broad queries. Record operational/security events without logging full sensitive source text. Support a revocation and update process.
6. Test access-denied paths, query limits, accidental full-text leakage, cache behavior, missing authorization and scraping risk before announcing access.
7. Publish real corpus totals, source descriptions, citation instructions and terms only after review. The existing project page must keep its sample label until a real backend is connected.

Access checks and limited outputs can reduce bulk extraction; they cannot guarantee that visible results will never be copied or gradually reconstructed. Decide the tradeoff between useful research context and extraction risk before launch. This update implements no login or paid service and creates no hosting bill.

## Current project URLs

- Public route after your GitHub update: `/pmc/`
- New cleaner: `/mat-cleaner/`
- Existing tools and saved workspaces keep their URLs and storage formats.
