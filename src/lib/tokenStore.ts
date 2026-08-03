/**
 * Token storage strategy
 * ----------------------
 * Access token  -> kept ONLY in memory (a module-level variable). It never touches
 *                  localStorage/sessionStorage, so it cannot be read by anything that
 *                  inspects browser storage, and it disappears the instant the tab
 *                  closes or the page is reloaded. Reloads are handled by silently
 *                  exchanging the refresh token for a new access token on boot.
 *
 * Refresh token -> the backend (SimpleJWT) currently returns it in the response body
 *                  rather than as an httpOnly cookie, so some JS-readable storage is
 *                  unavoidable without a backend change. We use sessionStorage instead
 *                  of localStorage: it is cleared as soon as the tab/browser closes and
 *                  is never shared across tabs, which meaningfully shrinks the window an
 *                  attacker has to exploit an XSS bug versus a token that lives forever
 *                  in localStorage.
 *
 * For a stronger guarantee than either of these, the ideal fix is a backend change:
 * issue the refresh token as an httpOnly, Secure, SameSite=strict cookie so JavaScript
 * (and therefore XSS) can never read it at all. That is outside this frontend's control
 * but is worth doing server-side later.
 */

const REFRESH_KEY = 'iapply_refresh_token';

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getRefreshToken(): string | null {
  try {
    return sessionStorage.getItem(REFRESH_KEY);
  } catch {
    // sessionStorage can throw in locked-down/private browsing contexts.
    return null;
  }
}

export function setRefreshToken(token: string | null): void {
  try {
    if (token) {
      sessionStorage.setItem(REFRESH_KEY, token);
    } else {
      sessionStorage.removeItem(REFRESH_KEY);
    }
  } catch {
    // Ignore storage failures — worst case, refresh-on-reload silently fails
    // and the user is asked to log in again, which is safe.
  }
}

export function clearTokens(): void {
  accessToken = null;
  setRefreshToken(null);
}
