# Supabase Setup — Ichikara

## Projects

Ichikara uses two separate Supabase projects:

| Environment | Project name | Used by |
|-------------|-------------|---------|
| **Development** | `ichikara-dev` | Local dev, E2E tests |
| **Production** | `ichikara-prod` | App Store build, real users |

> **⚠️ Never use the production project for local development.** Real user data lives in prod.

## Applying migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Log in
supabase login

# Apply all migrations to dev project
supabase db push --project-ref <DEV_PROJECT_REF>

# Apply to prod (before releasing a new build)
supabase db push --project-ref <PROD_PROJECT_REF>
```

## Environment variables

Copy `.env.example` → `.env` (dev) and fill in dev project values:

```
VITE_SUPABASE_URL=https://<DEV_PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key from Project Settings → API>
```

For production builds:
- Use a separate `.env.production` file
- Or inject via CI/CD secrets
- The Xcode build script should set these via Info.plist or build settings

## Key security rules

1. **ANON key only in client** — the anon key has RLS enforced. Never use the service_role key in app code.
2. **Service role key = server only** — used by Supabase Edge Functions for:
   - Writing to `subscriptions` table (StoreKit receipt validation, QRT-201)
   - Admin operations (delete account, etc.)
3. **RLS on every user table** — see `supabase/migrations/` for policies.
   - `lesson_completions`: users can CRUD their own rows only
   - `bookmarks`: users can CRUD their own rows only
   - `subscriptions`: users can SELECT; Edge Function (service_role) writes

## RLS audit findings (QRT-210, 2026-02-21)

| Table | SELECT | INSERT | UPDATE | DELETE | Anon access |
|-------|--------|--------|--------|--------|-------------|
| `lesson_completions` | ✅ user_id | ✅ user_id | ✅ user_id | ✅ user_id | ❌ revoked |
| `bookmarks` | ✅ user_id | ✅ user_id | ✅ user_id | ✅ user_id | ❌ revoked |
| `subscriptions` | ✅ user_id | ❌ svc only | ❌ svc only | ❌ svc only | ❌ revoked |

**Key: ✅ = policy exists, ❌ = intentionally blocked**

Previous state: UPDATE policies were missing on lesson_completions and bookmarks. Fixed in migration `20260221_rls_audit_and_subscriptions.sql`.

## Supabase Auth providers

Enable in Supabase Dashboard → Authentication → Providers:

| Provider | Required | Notes |
|----------|----------|-------|
| Email | ✅ Yes | Enable "Confirm email" for prod |
| Apple | ✅ Yes | See below |

### Apple Sign In (Supabase side)

1. Go to [Apple Developer Portal](https://developer.apple.com) → Certificates, Identifiers & Profiles → Identifiers
2. Select your App ID → Sign In with Apple → Configure
3. Create a Service ID (e.g. `app.ichikara.web`) for web flow
4. Generate a client secret JWT (P8 key from Apple → convert to JWT)
5. In Supabase Dashboard → Auth → Providers → Apple:
   - Enable Apple
   - Client ID: `app.ichikara.web` (Service ID)
   - Client Secret: the JWT you generated
6. Add redirect URL in Apple Developer Portal: `https://<PROJECT_REF>.supabase.co/auth/v1/callback`

### Email confirmation (production)

In Supabase Dashboard → Auth → Settings:
- Enable "Require email confirmation" ✅
- Set Site URL: `https://ichikara.app`
- Add redirect URL: `app.ichikara.ichikara://login-callback`

## Edge Functions (QRT-201 — StoreKit)

The subscription receipt validation Edge Function should:
1. Receive StoreKit signed JWT from the app
2. Verify with Apple's /inAppPurchase/2.0/verifyReceipt or StoreKit 2 APIs
3. Upsert `subscriptions` table using service_role key
4. Update `auth.users.raw_user_meta_data` with `subscription_tier` for fast client reads

Naming convention: `supabase/functions/validate-receipt/index.ts`
