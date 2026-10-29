# Dailwind PMC — Supabase Signup Setup

Updated 30 October 2026 · Website update v8.4 · Private server v0.2

**Code implement ho gaya hai. Live signup tab chalega jab aap apna Supabase project configure karenge.** Is delivery mein koi real Supabase project, email sender, user account ya corpus upload nahi hua. Supabase account aur private research server alag cheezen hain.

## Aapko kya milega

Website page: **`https://dailwind.com/pmc/account/`** after you upload/deploy the website update.

Flow: **Create account → Name + optional Institute + Email → Email code → Profile → Private PMC workspace when connected.** Existing users use Sign in with their email. Google sign-in has been removed from the new private server. The other local Dailwind toolkits do not require signup.

| Service | Kya kaam karega |
| --- | --- |
| GitHub Pages website | Signup interface, profile form, original public PMC sample |
| Supabase Auth + database | Email verification, account identity, own profile record |
| Your private PMC server | Real corpus, encrypted index, access plans, quotas, saved research queries |
| Email provider connected through SMTP | Verification code ki email bhejega |

**Supabase signup/profile ke liye Python server zaroori nahi. Real private corpus ko analyze karne ke liye private server zaroori hai.** Real TXT files ko GitHub, public assets, a public Supabase storage bucket or the profile table mein upload na karein.

## Step 1 — Apna Supabase project banayein

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and create/sign in to your administrator account.
2. Choose **New project**, select your organization, and name it something such as `Dailwind PMC`.
3. Set a strong database password and save it privately. Is password ko website code, GitHub ya chat mein paste nahi karna.
4. Choose an available region and a suitable plan. Dashboard mein current price/limits check karein before accepting anything chargeable.
5. Wait until the project is ready.

Aap admin account ke liye jo supported sign-in use karein, woh visitors ke signup se separate hai. Website visitors Google ke baghair email code se register karenge.

## Step 2 — Project URL aur publishable key copy karein

Project ka **Connect** dialog, or project Settings / API keys, open karein. Copy:

- **Project URL:** `https://your-project-ref.supabase.co`
- **Publishable key:** starts with **`sb_publishable_`**

Use the project URL itself, without `/rest/v1` and without a trailing slash. Custom Supabase domains and legacy `anon` keys are not supported by this particular package; use the current hosted project URL and publishable key.

**Never use `sb_secret_`, `service_role`, the database password or SMTP password in website files.** This implementation does not need those keys. Publishable key browser mein visible hoti hai; data protection ke liye next step ke RLS rules zaroori hain.

## Step 3 — Profile table aur privacy rules activate karein

1. Extract **PMC-Private-Server-v0.2.zip on your computer**, outside your website/GitHub directory.
2. Open `PMC-Private-Server/supabase/setup.sql` in a text editor.
3. Supabase Dashboard → **SQL Editor → New query**.
4. Paste the complete SQL and press **Run**.
5. Table Editor mein **`pmc_profiles`** check karein. **Row Level Security (RLS) must be enabled.**
6. Policies mein own-profile SELECT, INSERT and UPDATE rules honge. Anonymous visitors ko profile access nahi milta.

Yeh SQL aapki profile table banata hai. Ismein sirf account ID, full name, optional institute aur update time hota hai. Email Supabase Auth mein hoti hai. Paid roles, corpus files aur private queries is table mein nahi hote. Har user sirf apni row dekh/edit kar sakta hai. Institute self-reported hai; email verification university affiliation verify nahi karti.

SQL is intended for a new `pmc_profiles` table. If you already have a different table with that exact name or extra access policies, review them before running it; extra pre-existing policies can widen access. RLS should never be switched off to fix a profile error.

## Step 4 — Email login enable rakhein

In **Authentication → Sign In / Providers → Email** (dashboard labels can change):

1. Enable email sign-in and allow new-user signup.
2. Keep email confirmation enabled. Do not bypass email verification.
3. Set an appropriate **Email OTP expiration**, for example **600 seconds**.
4. Keep resend/rate limits active. The page also shows a 60-second resend countdown; the provider enforces the real limits.

No password is collected by this implementation. No Google OAuth client or Google callback is needed.

## Step 5 — Email mein code dikhayein, magic link nahi

Authentication → **Email Templates**:

1. Open **Magic link / OTP**.
2. Paste the HTML in `supabase/email-template.html`.
3. Also use the code template for **Confirm signup**, so first-time and returning users both receive a code.
4. Save the templates.

The essential template variable is:

```html
{{ .Token }}
```

Aapko email mein actual numeric code nazar aana chahiye. The form accepts the code as issued, rather than a login-link URL. Do not insert a fixed sample code into the email template. If the message contains only a clickable login link, recheck the template.

## Step 6 — Public users ke liye custom SMTP connect karein

**Yeh step bohat important hai.** Supabase's built-in email sender is for limited testing, restricts recipients to project-team addresses and currently has a very low limit (documented as two messages per hour). It is not a public production mail sender. Limits can change; check the current dashboard/docs.

In **Authentication → Email / SMTP settings**:

1. Enable custom SMTP.
2. Apne email provider se SMTP host, port, username aur password lein.
3. Set a verified sender address you control, such as an approved address on `dailwind.com`, and a sender name such as `Dailwind PMC`.
4. Complete the sender/domain verification requested by that provider. Add the exact DNS records it supplies; values guess na karein.
5. Put SMTP credentials **only in the provider/Supabase settings**, never in GitHub or browser JavaScript.
6. Save, then test with your own email before opening registration publicly.

If you do not have an email-delivery provider yet, first test using an eligible Supabase project-team email within the built-in limits. Other public users will need custom SMTP. This guide does not subscribe to or purchase a mail service for you.

## Step 7 — Site URL set karein

In Authentication → **URL Configuration**:

- **Site URL:** `https://dailwind.com/pmc/account/`
- Add that exact URL to the allowed redirect URLs.
- After the private service is deployed, also add `https://pmc.dailwind.com/` if needed.

The normal flow here uses a typed email code, not tokens in a URL. Do not add broad redirect wildcards just to troubleshoot.

## Step 8 — Website ki public configuration fill karein

In the website repository, edit **`assets/pmc-auth-config.js`**:

```javascript
'use strict';
window.PMCAuthConfig = {
  supabaseUrl: 'https://your-project-ref.supabase.co',
  publishableKey: 'sb_publishable_REPLACE_WITH_YOUR_ACTUAL_KEY',
  researchOrigin: ''
};
```

Replace the first two values with your real Project URL and **publishable** key, in the same commit. Keep `researchOrigin` empty while the private corpus server is not deployed. That will let users verify email and save profiles without sending them to a nonexistent research service.

Website source mein **only these public values** go. No SMTP secret, database password or service-role key is needed. Build/staging checks reject unsupported/secret keys and incomplete URL/key pairs.

## Step 9 — Upload and deploy v8.4 on GitHub

1. Apply **Dailwind-Update-v8.4.zip after v8.3.1**. Extract it and upload the contents into your existing repository root, preserving paths.
2. Replace matching files and keep every unchanged asset/tool file. Do not upload the ZIP itself or the PMC private-server folder.
3. Include the supplied **`publishing/security.py`** and **`publishing/site-files.json`**.
4. In GitHub Settings → Pages, use the provided **GitHub Actions** workflow (`Publish Dailwind`).
5. Commit your public config change and wait for the deployment's green success status in Actions.
6. Open `https://dailwind.com/pmc/account/`.

The provided workflow rebuilds script integrity hashes after config edits. Deploying directly from a branch without that staging step can leave an old integrity hash, causing the browser to block the edited config script. Use the provided workflow, not manual removal of integrity checks.

If you want help filling the config, you can share the **Project URL and publishable key only**. Do not share secret keys/passwords.

## Step 10 — Test signup and profile saving

1. Choose **Create account** and enter your own name, institute (optional) and email.
2. Read the Terms and Privacy notice, then request a verification code.
3. Enter the latest code from your inbox.
4. Check that your profile appears and can be edited/saved.
5. In Supabase, confirm your user under **Authentication → Users** and your row under **Table Editor → pmc_profiles**.
6. Sign out, then use **Sign in** with the same email. Your saved profile should load.
7. In a separate test account, verify that a user cannot read or edit another user's profile. Do not disable RLS if a request fails.

This page intentionally keeps tokens only in tab memory. Refreshing requires another code; the cloud profile stays saved. This does not yet mean that the real corpus is live. If the private service is not connected, the account page says research access is being prepared.

## Step 11 — Connect the actual private PMC research service

Skip this step until you have a private HTTPS server at **`https://pmc.dailwind.com`**. Supabase Auth does **not** automatically host the Python corpus engine.

1. Use **PMC-Private-Server-v0.2.zip** outside GitHub/public files. If replacing v0.1, back up first and preserve `private-input/`, `runtime/`, `master.key`, `session.key` and your SQLite database. Replace application files only. Do not initialize over lost keys.
2. Run the initializer once to apply additive schema changes. Old v0.1 login sessions are revoked during the auth upgrade; corpus data and saved records are retained. Old Google identities are not automatically merged with email accounts.
3. Install the supplied requirements in its private virtual environment.
4. Set server environment variables:

```text
PMC_ORIGIN=https://pmc.dailwind.com
PMC_WEBSITE_ORIGIN=https://dailwind.com
PMC_SUPABASE_URL=https://your-project-ref.supabase.co
PMC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_ACTUAL_KEY
PMC_RUNTIME=/absolute/private/path/to/runtime
```

5. Leave `PMC_LOCAL_DEMO` unset in production. Start `python server.py` behind a configured HTTPS reverse proxy; the internal server binds only to loopback.
6. Import only your permitted preview TXT portion using the private-server README. Real corpus files stay on that private server.
7. In the website's `assets/pmc-auth-config.js`, set `researchOrigin: 'https://pmc.dailwind.com'`.
8. You may also set that origin in `assets/pmc-access-config.js` to reveal the project-page entry link.
9. Deploy the website again. Sign in and select **Open PMC research workspace**.

The verified token is sent to the fixed, configured HTTPS research service in a POST body, not a URL. The server validates it with your Supabase project and creates its own short-lived HttpOnly session. It ignores paid-role claims in profile/user metadata. Saved research queries live under that verified identity on the private server. Public profiles live in Supabase.

Private sessions last at most 30 minutes and never longer than the verified identity token's remaining life. Public account-page and private-workspace sign-out are separate. An urgent access revocation should also be applied through the private server's account controls. Paid access is assigned by the operator; payment checkout is not implemented.

## Agar error aaye

| Message / problem | Kya check karein |
| --- | --- |
| Signup is being prepared | Both public config values are still empty, malformed or the config script was blocked. Check config + successful GitHub Actions staging. |
| Code does not arrive | SMTP sender verification, spam folder, provider logs and project limits. Built-in sender is limited to eligible team addresses. |
| Invalid/expired code | Use the newest email, recheck OTP expiry and wait before resend. Do not share codes. |
| Email verified, profile unavailable | Run `supabase/setup.sql`, confirm `pmc_profiles` exists and RLS policies are enabled. |
| Profile edits fail | Name must be 2–120 characters; institute ≤180. Check RLS and network. |
| No research-workspace button | `researchOrigin` is intentionally empty or the profile has not been saved. |
| Research sign-in origin rejected | `PMC_WEBSITE_ORIGIN` must exactly match the canonical HTTPS website origin, including `www` if actually used. |
| Account works but no corpus matches | The private server may have no imported preview data; test its local inventory. |

## What is and is not verified

Synthetic/mocked checks cover OTP request/verification handling, confirmed-email requirements, profile writes, trusted configuration, private-session exchange, origin checks, access isolation, expiry and secret-key rejection. No real Supabase project, SQL execution, real-email delivery, production DNS, billing or your corpus was available. The final activation must be tested in your own project. No real user email was sent during development.

Primary setup references:

- [Supabase email OTP](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- [Email templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [Publishable API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
