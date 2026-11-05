# Finish Dailwind verification emails

Everything here is managed online. No local server or Python is needed.

## What remains

The live website now loads its Supabase configuration correctly. Your confirmed owner account has administrator access, and the two MAT activation files are in private Storage. The remaining blocker is email delivery: custom SMTP is not configured, and the live login test returned `over_email_send_rate_limit`. Supabase's test sender is unsuitable for public signup. Numeric verification-code templates also need to be configured after SMTP is enabled.

## Simple option: an email provider with SMTP

Resend is one option with a documented Supabase SMTP integration and a free plan listed when checked on 31 October 2026. Review the provider's current limits and terms before creating your own account; no provider account or subscription was created for you.

- Official setup: https://resend.com/docs/send-with-supabase-smtp
- Plans: https://resend.com/pricing

1. Create your provider account yourself.
2. Add and verify your sending domain. Add only the DNS records the provider specifies. Do not remove your website CNAME/A records or existing mailbox MX records.
3. In Supabase, open **Authentication → Emails → SMTP Settings**. Enter the sender address/name and SMTP settings supplied by the provider. Enter the password/API key directly there; never put it in chat, GitHub, website JavaScript or a public ZIP.
4. Enable custom SMTP only after the provider details and domain verification are ready. Keep **Confirm email** on. Do not raise limits simply to bypass the default sender's restrictions.
5. Under **Authentication → Emails → Templates**, configure **Confirm sign up** and **Magic link or OTP** to show a numeric code, using the template below. Use the subject **Your Dailwind verification code**. Keep the `{{ .Token }}` placeholder exactly as written. The current website expects a typed code; the default link-only email is not enough.
6. Test an existing-user sign-in at https://dailwind.com/manage/. Enter the newest numeric code into that same tab. Confirm the administrator panel appears. Then test a separate newly registered address, its profile and access request before opening public signup widely.
7. For MAT, confirm private files load for an approved account. For PMC, import your permitted preview TXT files in the admin panel; the current collection is empty. Payment is agreed manually, followed by your approval and expiry selection.

## Numeric-code email body

```html
<!doctype html><html lang="en"><body style="margin:0;background:#f5f5f7;font-family:Arial,sans-serif;color:#1d1d1f"><main style="max-width:480px;margin:40px auto;padding:32px;background:white;border-radius:20px"><p>DAILWIND STUDIO</p><h1>Your verification code</h1><p>Enter this code in the Dailwind website tab where you requested it.</p><p style="font-size:34px;font-weight:bold;letter-spacing:6px">{{ .Token }}</p><p>If you did not request this code, you can ignore this email. Never share your code.</p></main></body></html>
```

The website uses tab-memory-only sessions, so refreshing or changing pages requires a new login. A longer-lived cross-page login is a separate feature, not part of this repair. Do not paste an email-link token into chat or remove script integrity attributes to make configuration changes work; the restored GitHub Actions workflow handles integrity on deployment.
