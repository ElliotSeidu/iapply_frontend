import axios, { AxiosError } from "axios";
import {
    clearTokens,
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
} from "./tokenStore";

const rawBaseUrl =
    import.meta.env?.VITE_API_BASE_URL || "http://127.0.0.1:8000";

if (
    typeof window !== "undefined" &&
    import.meta.env.PROD &&
    window.location.protocol === "https:" &&
    rawBaseUrl.startsWith("http://")
) {
    throw new Error(
        "Refusing to send API credentials over HTTP from a secure page. Configure VITE_API_BASE_URL with HTTPS."
    );
}
export const API_BASE_URL = rawBaseUrl;

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 12000,
    // 12 seconds timeout to prevent pending requests hanging indefinitely
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Attach the current access token (from memory) to every outgoing request.
api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Single-flight refresh queue -------------------------------------------------
let refreshPromise = null;
async function performRefresh() {
    const refresh = getRefreshToken();
    if (!refresh) return null;
    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/account/login/refresh/`,
            {
                refresh,
            },
            {
                timeout: 8000,
            }
        );
        setAccessToken(data.access);
        if (data.refresh) setRefreshToken(data.refresh);
        return data.access;
    } catch {
        clearTokens();
        return null;
    }
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;
        const status = error.response?.status;

        // Never try to "refresh" the refresh call itself, and never retry more than once.
        const isAuthEndpoint = original?.url?.includes("/account/login");
        if (
            status === 401 &&
            original &&
            !original._retried &&
            !isAuthEndpoint
        ) {
            original._retried = true;
            if (!refreshPromise) {
                refreshPromise = performRefresh().finally(() => {
                    refreshPromise = null;
                });
            }
            const newAccessToken = await refreshPromise;
            if (newAccessToken) {
                if (!original.headers) {
                    original.headers = new axios.AxiosHeaders();
                }
                original.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(original);
            }

            // Refresh failed — session is expired. Notify the app.
            window.dispatchEvent(new CustomEvent("iapply:session-expired"));
        }
        return Promise.reject(error);
    }
);

// Extract a human-readable message from a DRF error response without echoing internal details
export function getErrorMessage(
    err,
    fallback = "Something went wrong. Please try again."
) {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (typeof data === "string") return data;
        if (data && typeof data === "object") {
            const dataObj = data;
            if (dataObj.detail && typeof dataObj.detail === "string")
                return dataObj.detail;
            if (dataObj.message && typeof dataObj.message === "string")
                return dataObj.message;
            const values = Object.values(dataObj);
            const first = values.find((v) => v !== undefined);
            if (Array.isArray(first) && first.length > 0)
                return String(first[0]);
            if (typeof first === "string") return first;
        }
        if (err.code === "ECONNABORTED") {
            return "Request timed out. The server took too long to respond.";
        }
        if (err.code === "ERR_NETWORK") {
            return "Could not reach the server. Check your connection and ensure the backend is running.";
        }
    }
    return fallback;
}

// --- Auth ---------------------------------------------------------------------

export async function registerRequest(payload) {
    const { data } = await api.post("/account/register/", payload);
    return data;
}

export async function verifyRegisterRequest(payload) {
    const { data } = await api.post("/account/register/verify/", payload);
    return data;
}

export async function loginRequest(email, password) {
    const { data } = await axios.post(
        `${API_BASE_URL}/account/login/`,
        {
            email,
            password,
        },
        {
            timeout: 10000,
        }
    );
    return data;
}

export async function requestPasswordReset(email) {
    const { data } = await api.post("/account/password-reset/request/", {
        email,
    });
    return data;
}

export async function confirmPasswordReset(payload) {
    const { data } = await api.post(
        "/account/password-reset/confirm/",
        payload
    );
    return data;
}

export async function fetchMe() {
    const { data } = await api.get("/account/profile/");
    return data;
}

export async function updateProfile(payload) {
    const { data } = await api.patch("/account/update-profile/", payload);
    return data;
}

export async function changePassword(payload) {
    await api.patch("/account/change-password/", payload);
}
export async function deleteAccount(password) {
    await api.delete("/account/delete-account/", {
        data: {
            password,
        },
    });
}
export async function logoutRequest(refresh) {
    await api.post("/account/logout/", {
        refresh,
    });
}

// --- Applications ---------------------------------------------------------------

function unwrapList(data) {
    return Array.isArray(data) ? data : data.results;
}

async function fetchAllPages(path) {
    const items = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
        const { data } = await api.get(path, {
            params: { page, page_size: 200 },
        });
        if (Array.isArray(data)) return data;
        items.push(...(data.results || []));
        hasNextPage = Boolean(data.next);
        page += 1;
    }
    return items;
}

export async function listApplications() {
    return fetchAllPages("/tracker/applications/");
}

export async function getApplication(id) {
    const { data } = await api.get(`/tracker/applications/${id}/`);
    return data;
}

export async function createApplication(payload) {
    const { data } = await api.post("/tracker/applications/", payload);
    return data;
}

export async function updateApplication(id, payload) {
    const { data } = await api.patch(`/tracker/applications/${id}/`, payload);
    return data;
}

export async function deleteApplication(id) {
    await api.delete(`/tracker/applications/${id}/`);
}

export async function logStatusChange(id, status, notes = "") {
    await api.post(`/tracker/applications/${id}/log-status/`, {
        status,
        notes,
    });
    return getApplication(id);
}

export async function listStaleApplications() {
    const { data } = await api.get("/tracker/applications/stale/");
    return unwrapList(data);
}

// --- Reminders --------------------------------------------------------------------

export async function listReminders() {
    return fetchAllPages("/tracker/reminders/");
}

export async function createReminder(payload) {
    const { data } = await api.post("/tracker/reminders/", payload);
    return data;
}

export async function updateReminder(id, payload) {
    const { data } = await api.patch(`/tracker/reminders/${id}/`, payload);
    return data;
}

export async function deleteReminder(id) {
    await api.delete(`/tracker/reminders/${id}/`);
}

// --- Analytics ----------------------------------------------------------------

export async function fetchAnalytics() {
    const { data } = await api.get("/tracker/analytics/");
    return data;
}
