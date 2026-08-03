# iApply — Frontend

A React + TypeScript + Tailwind CSS frontend for the iApply job-application tracker, wired to the
Django REST Framework + SimpleJWT backend.

## Stack

- React 19 + TypeScript (strict mode)
- Tailwind CSS v4 (design tokens in `src/index.css`)
- react-hook-form + Zod for all form validation
- Axios for API calls
- Recharts for analytics charts

## Setup

```bash
npm install
cp .env.example .env
# edit .env if your backend isn't running on http://127.0.0.1:8000
npm run dev
```

The dev server runs on `http://localhost:3000`. Make sure the Django backend is running and its
CORS settings allow that origin.

## Build

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

## Type checking

```bash
npm run lint   # tsc --noEmit
```

## Security notes

- **Access token**: kept in memory only (React state) — never written to `localStorage` or
  `sessionStorage`. It's gone the instant the tab closes or reloads.
- **Refresh token**: stored in `sessionStorage` (not `localStorage`) so it's cleared when the tab
  or browser closes and never shared across tabs. This is a pragmatic frontend-only mitigation —
  the strongest fix would be for the backend to issue the refresh token as an httpOnly, Secure,
  SameSite cookie so client-side JavaScript (and therefore XSS) can never read it at all. That
  requires a backend change and is outside this frontend's scope, but is worth doing later.
- 401 responses trigger a single-flight token refresh (via Axios interceptors) so concurrent
  requests don't each try to refresh independently.
- Logout blacklists the refresh token server-side (`/account/logout/`), not just client-side.
- All forms validate with Zod before anything reaches the network; the API layer also surfaces
  server-side validation errors from DRF without ever echoing back raw stack traces.
- The frontend model mirrors the backend serializers field-for-field — no fields are invented or
  silently dropped.

## Project structure

```
src/
  components/       UI components (views + modals)
  context/          AuthContext (session) and DataContext (applications/reminders/analytics)
  lib/              api.ts (Axios client + endpoints), tokenStore.ts (token storage)
  schemas/          Zod validation schemas
  types/api.ts      Types mirroring the Django serializers
```
