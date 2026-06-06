## 1. Prompt Hive — new top-level section

**Goal:** Promote the Prompt Diary into a full feature called "Prompt Hive" — a browsable, categorized library of sample prompts the community can copy and contribute to.

### Header nav
- Add "Prompt Hive" to `SiteHeader.tsx` desktop + mobile nav (between "Community" and "AI Tools & Guides"), linking to `/prompt-hive`.

### Homepage hook
- In `src/components/home/PromptDiary.tsx`, wire the existing "Open the diary →" link to `/prompt-hive` and add a primary CTA button "Explore Prompt Hive" below the 3 sample cards. Section heading kept; small eyebrow updated to "Prompt Diary · Prompt Hive".

### New routes
- `src/routes/prompt-hive.tsx` — layout (`<Outlet />`) with `head()` meta + JSON-LD CollectionPage.
- `src/routes/prompt-hive.index.tsx` — main library page:
  - Hero strip ("Battle-tested prompts from the hive").
  - Category chips (Writing, Career, Learning, Marketing, Coding, Productivity, Design, Daily Life) filtering the grid.
  - Search input (client-side filter on title/body/tag).
  - Sort: Top (by saves), New.
  - Grid of `PromptCard`s (reuse the existing card from `PromptDiary.tsx`, extracted into `src/components/prompt-hive/PromptCard.tsx`).
  - "Submit a prompt" CTA → `/prompt-hive/submit`.
- `src/routes/prompt-hive.$category.tsx` — category-scoped list (SEO-friendly URLs like `/prompt-hive/writing`).
- `src/routes/prompt-hive.submit.tsx` — login-gated form (reuses auth pattern from `/community/ask`): title, category, body (with `{variable}` support), anonymous toggle. Routes through the community backend (see Data below).

### Data
Reuse the existing community schema by adding a dedicated topic family — no new tables needed for v1:
- Seed topics `prompt-writing`, `prompt-career`, `prompt-learning`, etc., with a shared parent prefix `prompt-*`.
- Store prompts as `questions` rows with `kind = 'prompt'` (add this column via migration) so the Prompt Hive feed filters cleanly without colliding with Q&A.
- Reuse votes (saves = upvote count), comments (discussion), anonymous toggle, and moderation already built in Phase 1.

Migration (single call):
- `ALTER TABLE public.questions ADD COLUMN kind text NOT NULL DEFAULT 'question' CHECK (kind IN ('question','prompt'));`
- Index on `(kind, score DESC)` and `(kind, created_at DESC)`.
- Insert seed prompt topics.

### Server functions / lib
- Extend `src/lib/community.ts` `fetchQuestions` with optional `kind` filter, or add `src/lib/prompts.ts` `fetchPrompts({ category, sort, search })`.
- Submit form posts via a new `createPrompt` server fn that sets `kind='prompt'`.

### SEO
- Per-route `head()` with title/description/canonical and `og:type=website`. Category pages emit `BreadcrumbList` JSON-LD.

## 2. Footer + dead-link cleanup
- Replace footer `Privacy`, `Terms`, `Disclaimer & Disclosures`, `Cookies` `#` anchors with real routes: create stub pages `/privacy`, `/terms`, `/disclaimer`, `/cookies` with minimal placeholder copy + proper `head()`.
- Social icons (X, YT, IG, in): change to `rel="noopener noreferrer"` and either point to real handles (ask user later) or remove from DOM until handles exist. For v1, remove them to eliminate the squatting risk surfaced by the scan.
- Sweep `TrendingSearches.tsx` and similar for `href="#"` — replace with real targets or `<button>`.

## 3. Security headers + login fingerprint

The site is served by Cloudflare Workers via TanStack Start. Headers are injected by a request middleware so every response (SSR + assets) carries them.

- Create `src/lib/security-headers.middleware.ts` registering a `requestMiddleware` in `src/start.ts` that sets on every `Response`:
  - `Content-Security-Policy`: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://*.supabase.co https://*.lovable.app wss://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'` (tuned during QA; report-only first if needed).
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- Confirm `src/start.ts` keeps existing `attachSupabaseAuth` functionMiddleware and `errorMiddleware`; only append the new request middleware.

### login.php finding
- No `login.php` exists in source; the scanner likely flagged an external link or cached HTML. Audit:
  - Search every `href`/`to` for `.php` and remove.
  - Ensure all login entries point to the TanStack route `/login` (already correct in `SiteHeader.tsx`).
  - Add a `/login.php` → `/login` redirect route (`src/routes/api/login[.]php.ts`) returning `301` to neutralize any backlinks.

## 4. Out of scope (ask before doing)
- Rich text editor for prompt body (v1 uses plain textarea + `{variable}` parsing already in `PromptCard`).
- Real social handles.
- Full legal copy for Privacy/Terms (stubs only).

## Files touched
- New: `src/routes/prompt-hive.tsx`, `prompt-hive.index.tsx`, `prompt-hive.$category.tsx`, `prompt-hive.submit.tsx`, `src/components/prompt-hive/PromptCard.tsx`, `src/lib/prompts.ts`, `src/lib/security-headers.middleware.ts`, `src/routes/privacy.tsx`, `terms.tsx`, `disclaimer.tsx`, `cookies.tsx`, `src/routes/api/login[.]php.ts`, migration file.
- Edited: `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`, `src/components/home/PromptDiary.tsx`, `src/lib/community.ts`, `src/start.ts`.

Approve to implement.