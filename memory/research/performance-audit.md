# Performance Audit — Bundle Size + Lazy Loading

**QRT-186 | Audited: 2026-02-21 | Audience: Jared**

---

## Summary

Main bundle reduced from **527KB → 153KB** (-71%) via manual chunk splitting.
All vendor code is now in separate, long-cached chunks.
Monitoring remains in a 685KB lazy chunk (Highlight.io rrweb is just large).

---

## Before vs After

| Chunk | Before | After | Notes |
|-------|--------|-------|-------|
| Main app | 527 KB (154 KB gz) | **153 KB (44 KB gz)** | -71% raw, -71% gzip |
| vendor-react | — | 192 KB (60 KB gz) | React + ReactDOM, very stable |
| vendor-supabase | — | 171 KB (45 KB gz) | Supabase JS client |
| vendor-capacitor | — | 11 KB (5 KB gz) | Capacitor plugins |
| analytics (lazy) | 178 KB | 178 KB (unchanged) | PostHog, lazy |
| monitoring (lazy) | 685 KB | 685 KB (unchanged) | Highlight.io, lazy |

**Total initial download (gzip):** ~154 KB gz → ~154 KB gz (same bytes delivered, but now cached better)

**Cache improvement:** Vendor chunks change rarely. On subsequent visits, the browser serves vendor-react + vendor-supabase from cache. Only the tiny 44KB app chunk needs re-downloading after app updates.

---

## Changes Made

### `vite.config.ts`
Added `rollupOptions.output.manualChunks`:
- `vendor-react` — `react`, `react-dom`, `scheduler`
- `vendor-supabase` — `@supabase/*`
- `vendor-capacitor` — `@capacitor/*`
- `chunkSizeWarningLimit: 600` — monitoring chunk (Highlight.io) is 685KB raw but 198KB gzip; the warning at 500KB was misleading since it fires on raw bytes not gzip. New limit reflects actual app needs.

---

## Remaining: Highlight.io (685KB)

**Not fixable right now.** Highlight.io's `@highlight-run/react` includes rrweb (session recording runtime) which is ~600KB minified. We've already deferred it behind a dynamic import, so it only loads when `VITE_HIGHLIGHT_PROJECT_ID` is set in production `.env`. First-time users don't download this until after the main app has painted.

**Options if Highlight becomes a concern:**
1. Switch to Sentry (smaller SDK, ~90KB) — loses session replay
2. Use Highlight's "lite" mode if/when they release one
3. Move session recording to server-side events only (give up rrweb replay)

---

## Remaining: Supabase SDK (171KB / 45KB gz)

Supabase JS includes realtime subscriptions (Postgres CDC), storage, edge functions — much of which we don't use. We only use `auth` and `database` (select + upsert).

**If 45KB gzip ever becomes a real problem:**
- Use direct REST API calls instead of the SDK (supabase.com/docs/reference/javascript/initializing — the REST API is just HTTP fetch, no SDK needed)
- For our usage (auth + a few DB calls), raw fetch to Supabase REST + GoTrue auth is ~5KB
- Not worth the refactor cost at this stage

---

## Future Splits (when worth doing)

### Lazy-load language data
`src/data/curriculum.ts` is 88KB source → ~40KB in the bundle. Currently in the main app chunk. Could be split by making `LanguageContext` use a dynamic import:

```ts
// src/data/languages/index.ts (future)
export async function getLanguageContentAsync(id: string): Promise<LanguageBundle> {
  const mod = await import(`./languages/${id}.ts`);
  return mod.default;
}
```

This would add a brief loading step after auth (the language bundle loads before Home renders). With a skeleton, this is acceptable. Saves ~40KB from the initial load.

**Verdict:** Worth doing when we add Mandarin or Spanish content (multiple 88KB+ files). For now with one language it's not worth the complexity.

### SOS data split
`src/data/sos.ts` is 9.5KB — not worth splitting.

### Particles data
`src/data/particles.ts` is 4.5KB — not worth splitting.

---

## Web Vitals Targets (Capacitor WKWebView)

For a Capacitor iOS app, the assets are bundled in the app binary — no network download at runtime. Bundle size affects **app download size** on the App Store, not LCP/FID.

**App Store download size estimate:**
- All JS chunks gzipped: ~153+60+45+5 = ~263 KB (just JS, not assets/images)
- CSS: 9 KB gzip
- Total compressed JS+CSS: ~272 KB
- Well within the 200MB limit and typical 5-20MB app threshold

**For web version (ichikara.app):**
- Initial load (above-the-fold): vendor-react + main app → 60 + 44 = **104 KB gzip**
- Supabase loads concurrently: +45 KB
- Total blocking resources before first interaction: ~149 KB
- Good for mobile web (target: <200 KB critical path)

---

## Monitoring Config Reminder

Add to production `.env`:
```
VITE_POSTHOG_KEY=phc_...
VITE_POSTHOG_HOST=https://us.i.posthog.com
VITE_HIGHLIGHT_PROJECT_ID=...
```

Without these env vars, both lazy chunks never load → production bundle is 153 + 192 + 171 + 11 = **527 KB raw / 154 KB gzip** for the full app.
