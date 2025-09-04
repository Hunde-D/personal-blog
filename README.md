## Personal Blog (Next.js + tRPC + Prisma + Tailwind/shadcn)

Modern, type-safe personal blog built with the Next.js App Router, tRPC, Prisma, Tailwind CSS, and shadcn/ui. It features a rich editor, tag management and filtering, robust validation, authentication, SSR-friendly data fetching, and a clean, maintainable architecture following Bulletproof React principles.

### Highlights
- **Type-safe end-to-end**: Zod schemas power both forms and the tRPC API.
- **Prisma + Postgres**: Clean schema with `Post`, `Tag`, and `User` models.
- **tRPC v11 + React Query v5**: Infinite queries, SSR prefetch, cache-first UX.
- **Authentication (better-auth)**: Owner/admin flows with profile dialog UX.
- **Tagging & Filters**: Search, select, and filter posts by tags and status.
- **UX polish**: Skeletons, loading indicators, error boundaries, and toasts.
- **Security**: Input sanitization, slug uniqueness, permission checks.

---

## Tech Stack
- **Framework**: Next.js (App Router)
- **API**: tRPC v11
- **ORM**: Prisma v6 (PostgreSQL, `fullTextSearchPostgres` preview)
- **Auth**: better-auth
- **Validation**: Zod
- **Data**: React Query v5
- **UI**: Tailwind CSS, shadcn/ui, Radix UI primitives

---

## Project Structure

```text
app/                    # Next.js app router pages
  blog/                 # Public blog list and details
  editor/               # Admin/editor interface
components/
  auth/                 # Auth screens and widgets
  blog/                 # Blog UI, editor, manage, tag filter, types
  layout/               # Navigation and layout components
  ui/                   # Reusable UI (forms, loading, error boundary, select)
hooks/                  # Data-fetching and state hooks (e.g., use-posts)
lib/                    # Utilities (search, errors, auth validation, forms)
prisma/
  schema.prisma         # Database schema (Post, Tag, User, Session, etc.)
server/
  api/routers/          # tRPC routers (e.g., post)
  api/trpc.ts           # tRPC initialization
```

Key conventions:
- **Bulletproof React**-inspired separation of concerns: UI components, hooks, and routers are clearly scoped.
- **Zod-first**: Schemas live close to features, and types are derived from them.
- **Procedures**: Public vs protected procedures in tRPC to enforce permissions.

---

## Features Overview

- **Posts**
  - Create, edit, delete
  - Slug generation and uniqueness enforcement
  - Optional manual slug override in the editor (auto-syncs from title until edited)
  - Read-time calculation and excerpt handling
  - Publish/unpublish with `publishedAt`
  - Tagging with `connectOrCreate`

- **Filtering & Search**
  - Full-text search helpers via `lib/search-utils.ts`
  - `list` and `listWithFilters` tRPC procedures with cursor pagination
  - Filter by status, tags, and date range

- **Tag UX**
  - `TagFilter` and `FilterBar` components
  - Select/search tags, show active filters, clear-all
  - Tag badges on cards with quick-add behavior

- **Auth & Navigation**
  - `better-auth` for session management
  - Navigation that reflects auth state quickly and avoids stale UI
  - Profile dialog from avatar: user info, admin entry, sign out

- **UX & Reliability**
  - SSR-friendly with skeletons to avoid “empty state” flashes
  - Error boundaries and standardized error utilities
  - Centralized form and validation utilities

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- A PostgreSQL database (local or hosted)

### Installation
```bash
pnpm install
```

### Environment Variables
Create a `.env` file in the project root:
```bash
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public"

# better-auth (example — configure per your provider/setup)
AUTH_SECRET="your_generated_secret"
AUTH_URL="http://localhost:3000"
# Add any provider keys/secrets required by your better-auth setup
```

### Database Setup
```bash
pnpm prisma generate
pnpm prisma migrate dev
```

If you have seed scripts, run them now (optional):
```bash
pnpm prisma db seed
```

### Development
```bash
pnpm dev
```
Open `http://localhost:3000`.

### Typecheck, Lint, Format
```bash
pnpm typecheck
pnpm lint
pnpm format
```

### Build & Start
```bash
pnpm build
pnpm start
```

---

## Data Model (Prisma)

Core models are defined in `prisma/schema.prisma`:
- `User` — authors/admins (with optional role, ban fields)
- `Post` — post content, slug, publishing state, `readTimeMin`, relations to `User` and `Tag`
- `Tag` — unique tag names and many-to-many relation with `Post`
- `Session`, `Account`, `Verification` — for authentication flows

---

## API Layer (tRPC)

Key router: `server/api/routers/post.ts`
- `list` / `listPublished` — infinite queries with SSR prefetch
- `listWithFilters` — accepts `PostFilterSchema` (status, tags, dateRange, limit, cursor)
- `find` — returns post with author and tags
- `getTags` — returns all tags with computed post counts
- Mutations (protected): `create`, `mutate`, `delete`, `publish`
  - `create`/`mutate` accept optional `slug`. Server validates uniqueness and returns a clear conflict message ("Slug already in use").

Error handling uses utilities in `lib/error-utils.ts` and returns typed `TRPCError`s for consistent client UX.

---

## Validation & Forms

- Zod schemas in `components/blog/validation.ts` and `lib/auth-validation.ts`
  - `PostCreateSchema`/`PostMutateSchema` include optional `slug` with format validation.
- Reusable form primitives in `components/ui/form-field.tsx`
- Helpers in `lib/form-utils.ts` for sanitization, URL validation, debounce/throttle, date formatting, etc.

Form flows provide real-time validation, error surfacing, and accessible inputs.

---

## Data Fetching & State

- `hooks/use-posts.ts`: unified infinite query for published/all posts with filters (`query`, `tags`, `status`, pagination), stable caching with `staleTime` and `gcTime`.
- SSR prefetch in pages (e.g., `app/blog/page.tsx`, `app/editor/manage/page.tsx`).
- Optimistic UX relies primarily on cache invalidation + refetch to maintain type safety.

---

## UI/UX Conventions

- **Loading**: `components/ui/loading-states.tsx` provides skeletons/spinners/buttons.
- **Errors**: `components/ui/error-boundary.tsx` wraps views with graceful fallbacks.
- **Navigation**: `components/layout/navigation.tsx` with avatar-triggered profile dialog.
- **Select**: `components/ui/select.tsx` (shadcn copy) + `@radix-ui/react-select`.
- **Editor**: Markdown Write/Preview toggle; live preview; preserved markdown characters in content.
- **Tags**: Tag input supports suggestion picking and creating new tags; tag filter closes on select/mouse leave.

---

## Security & Privacy
- Input sanitized before persisting or rendering where applicable.
- Server validates permissions for protected mutations.
- Slug uniqueness enforced and read-time calculated server-side.

---

## Deployment

General outline:
1. Provision PostgreSQL and set `DATABASE_URL`.
2. Set `AUTH_*` variables for `better-auth` providers/secrets.
3. `pnpm install && pnpm prisma migrate deploy && pnpm build`.
4. Run with your platform’s process manager (e.g., `pnpm start`).

Ensure platform supports Node 18+ and Next.js App Router.

---

## Troubleshooting

- Type errors: `pnpm typecheck` and verify Zod schemas match UI and API types.
- Prisma issues: check `DATABASE_URL`, run `pnpm prisma generate`, re-run migrations.
- Auth state desync: navigation uses interval/focus polling; confirm `AUTH_URL` and cookie domain.
- Missing UI deps: ensure `@radix-ui/react-select` is installed.

---

## Contributing

This is a personal blog, but contributions that improve type-safety, accessibility, and developer experience are welcome.

Guidelines:
- Prefer clarity over cleverness; follow existing patterns and naming.
- Keep components presentational; push data logic to hooks.
- Update or add Zod schemas when changing data models.
- Add loading/error states for any new asynchronous UI.

---

## License

MIT

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
