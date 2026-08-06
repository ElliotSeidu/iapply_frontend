import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
    clearTokens,
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
} from "./tokenStore";
import type {
    AnalyticsData,
    Application,
    ApplicationInput,
    ApplicationStatus,
    PaginatedResponse,
    Reminder,
    ReminderInput,
    User,
} from "../types/api";

const API_BASE_URL =
    (import.meta as any).env?.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const api = axios.create({
    baseURL: API_BASE_URL,
    // We authenticate with a bearer token, not cookies, so there's no reason to send
    // credentials cross-site — this also sidesteps CSRF entirely for the API surface.
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
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
// If several requests 401 at once, we only want ONE refresh call in flight; every
// other failed request should wait for that single refresh and then retry.
let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
    const refresh = getRefreshToken();
    if (!refresh) return null;
    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/account/login/refresh/`,
            { refresh }
        );
        setAccessToken(data.access);
        // SIMPLE_JWT has ROTATE_REFRESH_TOKENS + BLACKLIST_AFTER_ROTATION enabled, so the
        // backend issues a new refresh token on every refresh and invalidates the old one.
        if (data.refresh) setRefreshToken(data.refresh);
        return data.access as string;
    } catch {
        clearTokens();
        return null;
    }
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original = error.config as RetriableConfig | undefined;
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
                    (original as any).headers = {};
                }
                (original.headers as any).Authorization =
                    `Bearer ${newAccessToken}`;
                return api(original);
            }

            // Refresh failed — session is truly over. Let subscribers know so the UI can
            // drop back to the login screen instead of showing stale/broken data.
            window.dispatchEvent(new CustomEvent("iapply:session-expired"));
        }

        return Promise.reject(error);
    }
);

// Extract a human-readable message from a DRF error response without ever echoing
// back raw stack traces or internal details to the UI.
export function getErrorMessage(
    err: unknown,
    fallback = "Something went wrong. Please try again."
): string {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (typeof data === "string") return data;
        if (data && typeof data === "object") {
            const values = Object.values(data as Record<string, unknown>);
            const first = values.find((v) => v !== undefined);
            if (Array.isArray(first)) return String(first[0]);
            if (typeof first === "string") return first;
            if (data.detail) return String((data as any).detail);
            if (data.message) return String((data as any).message);
        }
        if (err.code === "ERR_NETWORK")
            return "Could not reach the server. Check your connection and try again.";
    }
    return fallback;
}

// --- Auth ---------------------------------------------------------------------

export interface AuthTokens {
    access: string;
    refresh: string;
}

export async function registerRequest(payload: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password2: string;
}): Promise<User> {
    const { data } = await api.post("/account/register/", payload);
    return data as any;
}

export async function verifyRegisterRequest(payload: {
    email: string;
    code: string;
}): Promise<AuthTokens & Partial<User>> {
    const { data } = await api.post<AuthTokens & Partial<User>>(
        "/account/register/verify/",
        payload
    );
    return data;
}

export async function loginRequest(
    email: string,
    password: string
): Promise<AuthTokens & Partial<User>> {
    const { data } = await axios.post(`${API_BASE_URL}/account/login/`, {
        email,
        password,
    });
    return data;
}

export async function fetchMe(): Promise<User> {
    const { data } = await api.get<User>("/account/profile/");
    return data;
}

export async function updateProfile(
    payload: Partial<Pick<User, "first_name" | "last_name">>
): Promise<User> {
    const { data } = await api.patch<User>("/account/update-profile/", payload);
    return data;
}

export async function changePassword(payload: {
    old_password: string;
    new_password: string;
    new_password2: string;
}): Promise<void> {
    await api.patch("/account/change-password/", payload);
}

export async function deleteAccount(password: string): Promise<void> {
    await api.delete("/account/delete-account/", { data: { password } });
}

export async function logoutRequest(refresh: string): Promise<void> {
    await api.post("/account/logout/", { refresh });
}

// --- Applications ---------------------------------------------------------------

function unwrapList<T>(data: PaginatedResponse<T> | T[]): T[] {
    return Array.isArray(data) ? data : data.results;
}

export async function listApplications(): Promise<Application[]> {
    const { data } = await api.get<
        PaginatedResponse<Application> | Application[]
    >("/tracker/applications/", {
        params: { page_size: 500 },
    });
    return unwrapList(data);
}

export async function getApplication(id: string): Promise<Application> {
    const { data } = await api.get<Application>(`/tracker/applications/${id}/`);
    return data;
}

export async function createApplication(
    payload: ApplicationInput
): Promise<Application> {
    const { data } = await api.post<Application>(
        "/tracker/applications/",
        payload
    );
    return data;
}

export async function updateApplication(
    id: string,
    payload: Partial<ApplicationInput>
): Promise<Application> {
    const { data } = await api.patch<Application>(
        `/tracker/applications/${id}/`,
        payload
    );
    return data;
}

export async function deleteApplication(id: string): Promise<void> {
    await api.delete(`/tracker/applications/${id}/`);
}

export async function logStatusChange(
    id: string,
    status: ApplicationStatus,
    notes = ""
): Promise<Application> {
    await api.post(`/tracker/applications/${id}/log-status/`, {
        status,
        notes,
    });
    // The log-status action returns the StatusEvent, not the updated Application —
    // fetch the fresh application so the UI reflects the synced current_status.
    return getApplication(id);
}

export async function listStaleApplications(): Promise<Application[]> {
    const { data } = await api.get<
        PaginatedResponse<Application> | Application[]
    >("/tracker/applications/stale/");
    return unwrapList(data);
}

// --- Reminders --------------------------------------------------------------------

export async function listReminders(): Promise<Reminder[]> {
    const { data } = await api.get<PaginatedResponse<Reminder> | Reminder[]>(
        "/tracker/reminders/",
        {
            params: { page_size: 500 },
        }
    );
    return unwrapList(data);
}

export async function createReminder(
    payload: ReminderInput
): Promise<Reminder> {
    const { data } = await api.post<Reminder>("/tracker/reminders/", payload);
    return data;
}

export async function updateReminder(
    id: string,
    payload: Partial<ReminderInput>
): Promise<Reminder> {
    const { data } = await api.patch<Reminder>(
        `/tracker/reminders/${id}/`,
        payload
    );
    return data;
}

export async function deleteReminder(id: string): Promise<void> {
    await api.delete(`/tracker/reminders/${id}/`);
}

// --- Analytics ----------------------------------------------------------------

export async function fetchAnalytics(): Promise<AnalyticsData> {
    const { data } = await api.get<AnalyticsData>("/tracker/analytics/");
    return data;
}
