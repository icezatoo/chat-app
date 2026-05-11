# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Read the docs before writing code

This project uses **Next.js 16.2.6**, which has breaking changes from all prior versions in your training data. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## Commands

```bash
npm run dev        # Start dev server (Turbopack, outputs to .next/dev)
npm run build      # Production build (Turbopack by default)
npm run start      # Start production server
npm run lint       # Run ESLint (note: not `next lint` — that was removed in v16)
npx tsc --noEmit   # Type-check without emitting files
```

`next build` no longer runs linting. Run lint separately.

## Architecture

- **Framework**: Next.js 16 App Router (`src/app/`)
- **Bundler**: Turbopack is the default for both `next dev` and `next build`
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`
- **Path alias**: `@/*` maps to `./src/*`
- **TypeScript**: strict mode, `moduleResolution: bundler`

## Next.js 16 breaking changes

### Async-only request APIs
`cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` in pages/layouts/routes are **Promises** — synchronous access was removed. Always `await` them:

```ts
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```

Run `npx next typegen` to generate `PageProps`, `LayoutProps`, and `RouteContext` helpers for type-safe access.

### `middleware.ts` → `proxy.ts`
The `middleware` convention is deprecated. Use `proxy.ts` with a named `proxy` export. The `edge` runtime is not supported in `proxy` — only `nodejs`.

### Caching APIs
- `cacheLife` and `cacheTag` are stable — no `unstable_` prefix needed
- `revalidateTag` now requires a second `cacheLife` profile argument: `revalidateTag('tag', 'max')`
- `updateTag` (Server Actions only) provides read-your-writes semantics (immediate refresh)
- `refresh` from `next/cache` refreshes the client router from a Server Action
- Enable Cache Components / PPR with `cacheComponents: true` in `next.config.ts` (replaces `experimental.ppr` and `experimental.dynamicIO`)

### Instant navigation
Export `unstable_instant` from routes to validate and enable instant client-side navigation:
```ts
export const unstable_instant = { prefetch: 'static' }
```
Requires `cacheComponents: true`. See `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`.

### Other removals / renames
- `serverRuntimeConfig` / `publicRuntimeConfig` removed — use env vars; prefix with `NEXT_PUBLIC_` for client access
- `experimental.turbopack` moved to top-level `turbopack` in `next.config.ts`
- Parallel route slots require explicit `default.js` files or builds fail
- `next/legacy/image` deprecated — use `next/image`
- `images.domains` deprecated — use `images.remotePatterns`
- `images.minimumCacheTTL` default changed to 4 hours (was 60s)
- AMP support fully removed

## Agent skills

### Issue tracker

Issues live in GitHub Issues (uses the `gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
