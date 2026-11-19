# Security Policy & Frontend Operational Security

## Reporting a Vulnerability

Do **not** open a public GitHub issue for security vulnerabilities in iApply. Report suspected vulnerabilities privately to the repository owner/security contact with steps to reproduce, affected endpoints or components, and impact. Acknowledge receipt within 48 hours and remediate high/critical issues prior to public disclosure.

## Public Build Environment Rules

Static frontend builds (`vite build`) embed every `VITE_*` variable directly into client-side JavaScript:

- Only `VITE_API_BASE_URL` (using `https://` in production) and `VITE_GOOGLE_CLIENT_ID` (OAuth 2.0 Web Client ID, public by design) may be supplied at build time.
- Never place backend secrets, API keys, SMTP passwords, database URLs, or `SECRET_KEY` in `VITE_*` variables or `.env` files committed to Git.
- Configure HTTP security headers (CSP, `Cross-Origin-Opener-Policy: same-origin-allow-popups`, `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`) on the static host as documented in `DEPLOYMENT.md`.

## Credential Rotation & Session Impact

- **Google OAuth Web Client ID (`VITE_GOOGLE_CLIENT_ID`) rotation:** Update the Client ID simultaneously in the backend environment (`GOOGLE_CLIENT_ID`) and the frontend build environment (`VITE_GOOGLE_CLIENT_ID`), then rebuild and redeploy the static frontend bundle so browsers request ID tokens matching the new `aud` claim. Wait until rollout completes before retiring the old OAuth Client ID in Google Cloud Console.
- **Session/JWT compromise response:** Access tokens live only in JS memory and refresh tokens live in `sessionStorage`; `Logout` calls `/account/logout/` to blacklist refresh tokens and clears browser `Cache Storage`. Rotating Django's `SECRET_KEY` on the backend immediately invalidates all issued SimpleJWT access and refresh tokens across users.
