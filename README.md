# Admin Dashboard Template

A React + TypeScript admin dashboard **design template**. No backend, no API
calls, no login to get past — every screen renders from local sample data the
moment you run it, so you can work on the design.

Stack: React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router v7 ·
lucide-react.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173 — opens straight into the dashboard
npm run build    # type-check + production build to dist/
```

There is no `.env` and nothing to configure before it runs.

## Design mode

- **You start signed in** as the demo admin, so no screen is behind a login.
- **Sign out** from the topbar menu to see the login design; signing back in
  accepts any input — nothing is validated.
- **Every control is live**: search, role filter and pagination on Users run
  in memory; block/unblock, profile save and content save flip local state and
  fire the real toast and dialog treatments.
- **Loading states are visible** — set `MOCK_DELAY` in
  [src/config/app.ts](src/config/app.ts) to `0` for instant renders, or raise
  it while you design the skeletons.

## The three files you edit first

1. **[src/config/app.ts](src/config/app.ts)** — app name, tagline, footer,
   rows per page, mock delay. The only place a project name appears.
2. **[src/index.css](src/index.css)** — the `@theme` block holds every colour
   and font. Retheme by editing those tokens; no component hard-codes a hex.
3. **[src/mock/data.ts](src/mock/data.ts)** — the sample admin, 23 users,
   overview figures and content-page copy. Change these to see the design
   under your own content.

Then [index.html](index.html) and [public/favicon.svg](public/favicon.svg) for
the tab title and icon.

## What's in the box

| Area | Files |
| --- | --- |
| Responsive shell — sidebar drawer, sticky topbar, account menu | [src/layouts/](src/layouts/) |
| Session + route guard (mocked) | [src/auth/](src/auth/) |
| Toasts, confirm dialog, pagination, empty state, stat card, status badge, form field, full-page loader | [src/components/](src/components/) |
| Money / date / time / relative-time formatters | [src/utils/format.ts](src/utils/format.ts) |
| Design tokens, panel + skeleton styles, rich-text preview | [src/index.css](src/index.css) |

Pages: **Login**, **Overview** (stat cards, breakdown bars, activity feed),
**Users** (search, filter, paginate, confirm dialog), **Site Pages**
(write/preview editor), **My Account** (profile + password forms).

## Adding a section

1. Create the page under `src/pages/<name>/`.
2. Add a route in [src/router/router.tsx](src/router/router.tsx).
3. Add an entry to `NAV_ITEMS` in [src/layouts/Sidebar.tsx](src/layouts/Sidebar.tsx)
   — the topbar title is derived from it automatically.

[Overview](src/pages/overview/Overview.tsx) is the reference for a data page
(skeleton → content). [Users](src/pages/users/Users.tsx) is the reference for a
searchable, filterable, paginated list with URL-backed state.

## Wiring a real backend later

The mock layer is deliberately shaped like an API client. Two seams:

- **Data** — [src/mock/data.ts](src/mock/data.ts) exports `loadOverview()`,
  `loadUsers()` and `loadContentPage()`, all async and all returning the types
  in [src/types/index.ts](src/types/index.ts). Replace their bodies with real
  requests and no page changes.
- **Session** — [src/auth/AuthContext.tsx](src/auth/AuthContext.tsx) is the
  only file that knows who is signed in. Restore a token check on boot and
  point `signIn` at your login endpoint; `ProtectedRoute` already gates on it.
