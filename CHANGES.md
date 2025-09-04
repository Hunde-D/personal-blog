## Change Log and Architecture Notes

This document chronicles the end-to-end changes made to the project, organized by phases. Each section includes rationale, key edits, notable files, and error fixes. Use it to understand how the codebase evolved and where to look for specific functionality.

---

## Phase 1 — Consolidate & Standardize Hooks

Rationale:
- Remove duplicate hooks and centralize posts data fetching to improve maintainability and type safety.

Key Edits:
- Created `hooks/use-posts.ts`: unified infinite query hook supporting published-only and admin views, with stable caching (`staleTime`, `gcTime`).
- Added `components/ui/error-boundary.tsx`: reusable UI guard for rendering errors.
- Updated consumers to the new hook and added skeletons/error states:
  - `components/blog/blog-list.tsx`
  - `components/blog/latest-articles.tsx`
  - `components/blog/manage-post.tsx`
- Updated SSR prefetch:
  - `app/blog/page.tsx` → `api.post.listPublished.prefetchInfinite`
  - `app/editor/manage/page.tsx` → `api.post.listAll.prefetchInfinite` (later moved to `list`)
- Removed duplicates:
  - `hooks/use-all-post.ts`
  - `hooks/use-published-post.ts`

Fixes:
- Type import mismatches in `latest-articles.tsx` after removal of old hooks.
- Ran lint autofixes.

---

## Phase 2 — tRPC Router Improvements

Rationale:
- Standardize list/find endpoints, enforce validation, and improve error handling while preparing for richer filters.

Key Edits:
- `components/blog/validation.ts`: enhanced Zod schemas (`PostCreateSchema`, `PostMutateSchema`, `PostSelectSchema`), added helpful messages and `PostSearchSchema`/`PostFilterSchema`. Introduced `calculateReadTime`.
- `lib/search-utils.ts`: centralized search building (`processSearchQuery`, `buildPostSearchWhere`, `validateSearchParams`).
- `server/api/routers/post.ts`: consolidated API surface
  - `list` (with `publishedOnly` option) and convenience `listPublished`
  - `find` now includes `author` and `tags`
  - Mutations (`create`, `mutate`, `delete`) add: slug uniqueness checks, read time calculation, `publishedAt` handling, author permissions, robust `TRPCError` handling
- `hooks/use-posts.ts`: switched to new `api.post.list` procedure
- `hooks/use-editor-actions.ts`: cache invalidation renamed to `list`
- `lib/error-utils.ts`: `getErrorMessage`, `isTRPCClientError`, `formatError`, `logError` for consistent client UX

---

## Phase 3 — Enhanced State Management & Loading UX

Rationale:
- Resolve complex optimistic update type errors by simplifying strategy; standardize loading UI.

Key Edits:
- `hooks/use-editor-actions.ts`: simplified mutations to rely on cache invalidation + refetch; removed bespoke cache manipulation that caused type gaps for `author`/`tags`.
- `components/ui/loading-states.tsx`: reusable `LoadingSpinner`, `LoadingSkeleton`, `PostCardSkeleton`, `PostListSkeleton`, `LoadingButton`.
- Replaced manual skeletons with `PostListSkeleton` in post lists.
- Removed `hooks/use-cache-utils.ts`.

Fixes:
- Eliminated type errors caused by partial post shapes during optimistic updates.

---

## Phase 4 — Form Validation & Auth

Rationale:
- Enforce strong client/server validation and consolidate form utilities while improving auth flows.

Key Edits:
- `components/blog/validation.ts`: exported input types for create/mutate/select/search/filter.
- `lib/auth-validation.ts`: `SignInSchema`, `SignUpSchema`, `PasswordReset*`, `ProfileUpdateSchema`; `validatePassword`, `validateEmail`.
- `lib/form-utils.ts`: `formatValidationErrors`, field helpers, sanitization, URL validation, debounce/throttle, slug/date helpers.
- `components/ui/form-field.tsx`: reusable `InputField`, `TextareaField`, `CheckboxField`, `SelectField`, groups & actions.
- `components/auth/sign-in.tsx` and `components/auth/sign-up.tsx`: migrated to reusable form fields, real-time validation, loading UX.
- `components/blog/editor-form.tsx`: integrated validation, sanitization, word count, and read time.

Fixes:
- Resolved TypeScript errors for field `id`, change handlers, and error types in `formatValidationErrors` by adjusting props and guards.

---

## Phase 5 — Navigation & Authentication UX

Rationale:
- Improve perceived auth responsiveness and simplify primary nav. Provide an avatar-driven profile dialog with admin entry.

Key Edits:
- `components/layout/navigation.tsx`:
  - Removed separate sign-in/up buttons; avatar opens a profile dialog
  - Added icons and improved `OwnerNav` with loading states
  - Auth state sync via periodic checks + `window.focus` listener (as `better-auth` client lacked `onAuthStateChange`)
  - Profile dialog includes: user info, admin continue button, about section, and sign-out redirect

Fixes:
- Corrected auth modal imports to default imports.
- Replaced nonexistent `router` calls with `window.location.href = "/"`.

---

## Phase 6 — Tagging, Search, and Filtering

Rationale:
- Add full tagging functionality in both admin manage and public blog views with robust filtering and pagination.

Key Edits:
- API (`server/api/routers/post.ts`):
  - `getTags`: returns tags with computed post counts
  - `listWithFilters`: filters by status, tags, date range; supports `limit` and `cursor`
  - `create`/`mutate`: accept tags as `{ name }` objects for `connectOrCreate`
- Validation (`components/blog/validation.ts`):
  - `PostFilterSchema` includes `limit`, `cursor`
  - All schemas define `tags` as `Array<{ id?: string; name: string }>`
- Utils (`lib/search-utils.ts`): `buildTagFilterWhere` maps `filters.tags` to names
- UI Components:
  - `components/blog/tag-filter.tsx`: searchable tag selector with badges
  - `components/blog/filter-bar.tsx`: search input (debounced) + status + tags + active filters
  - `components/ui/select.tsx`: shadcn copy to fix missing module; installed `@radix-ui/react-select`
  - `components/blog/manage-post.tsx`, `components/blog/blog-list.tsx`: integrated filter bar, show tag badges, click-to-add tags
- Hooks (`hooks/use-posts.ts`): options now include `query`, `tags`, `status`; return normalized `author` and `tags` on posts with `transformPosts`
- Types (`components/blog/types.ts`): `PostT` includes `tags?: { id: string; name: string }[]`
- Editor (`components/blog/editor-client.tsx`, `components/blog/editor-form.tsx`): updated tag value shape and change handlers
- Preview (`components/blog/blog-post.tsx`): mapped test data tags to `{ id, name }` objects

Fixes:
- Addressed multiple type errors from changing `tags` shape across UI, tRPC, and Prisma.
- Ensured consistent `tags` typing for `PostCT` (create/mutate) and `PostT` (display).

---

## Notable Files Added
- `hooks/use-posts.ts`
- `components/ui/error-boundary.tsx`
- `components/ui/loading-states.tsx`
- `components/ui/form-field.tsx`
- `components/ui/select.tsx`
- `components/blog/tag-filter.tsx`
- `components/blog/filter-bar.tsx`
- `lib/search-utils.ts`
- `lib/error-utils.ts`
- `lib/auth-validation.ts`
- `lib/form-utils.ts`

---

## Patterns & Principles
- **Bulletproof React** structure: move data logic to hooks, keep components presentational.
- **Zod-first** design: derive types from schemas to keep UI and API aligned.
- **SSR-friendly UX**: prefetch data, render skeletons, avoid empty flashes on hydrate.
- **Safe mutations**: prefer cache invalidation + refetch when optimistic updates would require partial types.
- **Centralized utilities**: shared validation, search, and error utilities.

---

## Known Considerations & Follow-ups
- Auth: ensure all provider secrets are configured; polling fallback can be replaced with a native listener if available.
- Tags: tag names are unique; tag creation is via `connectOrCreate` on mutations.
- Performance: indexes for full-text search and tag joins may be added at the DB level if needed.

---

## How to Extend
- Add new filters: extend `PostFilterSchema`, update `buildTagFilterWhere`, and pass values via `use-posts` options.
- Add fields to `Post`: update Prisma model, regenerate, migrate, and update Zod schemas + editor form.
- Add new views: keep data fetching in hooks, compose with `loading-states` and `error-boundary`.


