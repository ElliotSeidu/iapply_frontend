# Frontend Production Deployment Guide

## 1. Public Build-Time Environment Variables

Only the two public environment variables below may be passed at build time (`vite build`). Never put secrets, private keys, client secrets, or database/Redis credentials in any `VITE_*` variable (everything prefixed `VITE_` is embedded in plaintext inside the compiled JS bundle).

```text
VITE_API_BASE_URL=https://<your-api-origin>
VITE_GOOGLE_CLIENT_ID=<your-google-oauth-web-client-id>.apps.googleusercontent.com
```

- `VITE_API_BASE_URL` must use `https://` in production (`src/lib/api.js` refuses `http://` when the page is served over HTTPS).
- Leave `VITE_GOOGLE_CLIENT_ID` unset only if you intentionally want the "Continue with Google" button hidden.
- Ensure `<your-frontend-origin>` is added to **Authorized JavaScript origins** in Google Cloud Console and to backend `CORS_ALLOWED_ORIGINS`.

## 2. Static Host Security Headers

Configure your static hosting provider / reverse proxy to send these HTTP response headers on every HTML/asset response. Replace `<API_ORIGIN>` with your exact `https://` backend API origin (for example `https://api.iapply.example.com`):

```text
Content-Security-Policy: default-src 'none'; script-src 'self' https://accounts.google.com/gsi/client; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com/gsi/style; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' <API_ORIGIN> https://accounts.google.com/gsi/; frame-src https://accounts.google.com/gsi/; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'
Cross-Origin-Opener-Policy: same-origin-allow-popups
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### CSP Directive Justification

- **`script-src` forbids `'unsafe-inline'` and `'unsafe-eval'`:** Only same-origin bundled scripts and Google Identity Services (`https://accounts.google.com/gsi/client`) may execute.
- **`style-src` includes `'unsafe-inline'`:** Required by Framer Motion animation styles, Recharts SVG inline styles, and the Google Identity Services button stylesheet (`https://accounts.google.com/gsi/style`). Revisit with nonces/hashes only if dynamic host injection is used.
- **`connect-src` restricts XHR/fetch:** Restricted strictly to `'self'`, your exact `<API_ORIGIN>`, and Google Identity Services (`https://accounts.google.com/gsi/`).
- **`Cross-Origin-Opener-Policy: same-origin-allow-popups`:** Required so the Google Sign-In popup window can communicate back to the opener tab.

### HSTS Note

Start with `max-age=300`, confirm HTTPS works across your domain and subdomains, then raise to `31536000` (`1 year`). Only append `; preload` and submit to `hstspreload.org` once you are certain every subdomain will remain HTTPS permanently.

---

## 3. Host Configuration Examples

No live `_headers` / `vercel.json` is enabled in the repository with a guessed `<API_ORIGIN>` placeholder. Before deploying, replace `<API_ORIGIN>` with your production backend origin and place the matching config in your host setup.

### Netlify (`public/_headers`)

```text
/*
  Content-Security-Policy: default-src 'none'; script-src 'self' https://accounts.google.com/gsi/client; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com/gsi/style; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' <API_ORIGIN> https://accounts.google.com/gsi/; frame-src https://accounts.google.com/gsi/; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'
  Cross-Origin-Opener-Policy: same-origin-allow-popups
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Vercel (`vercel.json`)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'none'; script-src 'self' https://accounts.google.com/gsi/client; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com/gsi/style; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' <API_ORIGIN> https://accounts.google.com/gsi/; frame-src https://accounts.google.com/gsi/; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'"
        },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin-allow-popups" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" }
      ]
    }
  ]
}
```

### nginx

```nginx
add_header Content-Security-Policy "default-src 'none'; script-src 'self' https://accounts.google.com/gsi/client; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com/gsi/style; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' <API_ORIGIN> https://accounts.google.com/gsi/; frame-src https://accounts.google.com/gsi/; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'" always;
add_header Cross-Origin-Opener-Policy "same-origin-allow-popups" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## 4. Service Worker & Cache Isolation

- `vite.config.ts` sets `workbox.navigateFallbackDenylist` and `NetworkOnly` runtime caching for `/account/`, `/tracker/`, and `/admin/` so authenticated API responses are never stored in the Workbox Cache Storage.
- Note: if the backend API is hosted on a separate origin (`<API_ORIGIN>`), cross-origin API calls are also not cached by the static host's Workbox precache.
- On logout, `AuthContext.logout()` clears in-memory access tokens, `sessionStorage`, React state, and iterates `window.caches.keys()` to delete all browser Cache Storage entries.
