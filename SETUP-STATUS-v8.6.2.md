# Dailwind setup status — 31 October 2026

## Completed on the live services

- Repaired and published the website's script integrity metadata without removing integrity protection.
- Restored the pinned GitHub Actions publishing workflow and switched Pages to GitHub Actions. HTTPS remains enabled.
- Restored the security contact file and missing source files for Muhammad Aqeel's poem; all five articles are preserved during builds.
- Removed the retired public MAT engine files and Python download from the current repository/site. Historical copies cannot be recalled.
- Verified the configured Supabase Project URL and enabled publishable key against the connected project. No frontend secret/service-role key was added.
- Confirmed the owner's chosen verified account, assigned operator access and saved its profile.
- Uploaded both verified MAT activation files to the private bucket. Their byte lengths and MIME types match the supplied files; anonymous private/public download paths are denied.
- Reviewed own-profile RLS, private-schema table grants, approval/payment/expiry checks and Storage policies.
- Revoked unnecessary client execution of the internal RLS event-trigger helper and added the import-owner foreign-key index.
- Verified Site URL/redirect points to the HTTPS account page, email confirmation is enabled, anonymous sign-ins are disabled and Email is the enabled provider.

## Validation completed

123 staged script integrity checks; script/style/image paths; five-article preservation; no publishing sources or retired MAT assets in the public artifact. The live management page loads its signup/sign-in form. Real PostgreSQL role tests deny anonymous/non-admin/direct-private-table/unpaid/expired access and accept paid access in a rolled-back fixture. The owner role is active. HTTP checks deny anonymous profile reads and private asset access. No test entitlements were left behind.

## Remaining blocker

Custom SMTP is absent. The live sign-in test returned HTTP 429 / `over_email_send_rate_limit`; the Supabase dashboard says custom SMTP is required before editing email template bodies. Public email delivery, numeric-code emails and a complete approved browser preparation/download flow remain unverified. The administrator email still needs a successful live sign-in after email delivery is configured. Follow EMAIL-SETUP-NEXT.md. No email provider account, subscription, DNS changes or secret keys were created.

The PMC preview currently contains no documents; import only corpus material you are entitled to share. No source corpus was supplied or imported during this repair. MAT itself was not executed; this website prepares files, it does not perform MAT analysis.

## Reviewed advisory exceptions

Private tables intentionally have RLS enabled with no reader policies and no client table grants. They are reached through narrowly granted, authenticated functions with explicit verified-user/operator checks. These functions intentionally use SECURITY DEFINER and a hardened search_path. The advisor still reports those designs for review; blanket client grants/policies were not added to silence the notices.

- RLS policy notice: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy
- Privileged function notice: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- Leaked-password protection notice: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection — the website uses email codes; no plan upgrade or password-policy change was made.

Visible excerpts and delivered browser code can be copied. This repair is access control and tested configuration, not an impossible-to-hack guarantee.
