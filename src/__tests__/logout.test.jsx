import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import App from "../App";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { DataProvider, useData } from "../context/DataContext";
import * as api from "../lib/api";
import {
    clearTokens,
    getAccessToken,
    getRefreshToken,
    setRefreshToken,
} from "../lib/tokenStore";

function createFakeJwt(expOffsetSeconds = 3600) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
        JSON.stringify({
            exp: Math.floor(Date.now() / 1000) + expOffsetSeconds,
            user_id: "user-1",
        })
    );
    return `${header}.${payload}.sig`;
}

function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

function ContextProbe({ onSnapshot }) {
    const auth = useAuth();
    const data = useData();
    onSnapshot({ auth, data });
    return null;
}

describe("Logout cleanup and post-logout fetch race safety", () => {
    const originalCaches = window.caches;

    beforeEach(() => {
        clearTokens();
        sessionStorage.clear();
        localStorage.clear();
        window.history.pushState({}, "", "/dashboard");
        window.scrollTo = vi.fn();
    });

    afterEach(() => {
        clearTokens();
        sessionStorage.clear();
        if (originalCaches === undefined) {
            delete window.caches;
        } else {
            Object.defineProperty(window, "caches", {
                configurable: true,
                writable: true,
                value: originalCaches,
            });
        }
        vi.restoreAllMocks();
    });

    it("clears tokens, cache storage, open modal, and searchQuery on logout", async () => {
        const refreshJwt = createFakeJwt(3600);
        setRefreshToken(refreshJwt);

        const cacheKeys = vi
            .fn()
            .mockResolvedValue(["workbox-precache-v2", "iapply-runtime"]);
        const cacheDelete = vi.fn().mockResolvedValue(true);
        Object.defineProperty(window, "caches", {
            configurable: true,
            writable: true,
            value: {
                keys: cacheKeys,
                delete: cacheDelete,
            },
        });

        vi.spyOn(axios, "post").mockResolvedValue({
            data: { access: "access-token-1", refresh: refreshJwt },
        });
        vi.spyOn(api, "fetchMe").mockResolvedValue({
            id: "user-1",
            email: "alice@example.com",
            first_name: "Alice",
            last_name: "Rivers",
            has_password: true,
        });
        vi.spyOn(api, "listApplications").mockResolvedValue([
            {
                id: "app-1",
                company_name: "Acme Corp",
                role_title: "Security Analyst",
                channel: "company_site",
                source_detail: "",
                date_applied: "2026-06-10",
                current_status: "applied",
                updated_at: "2026-06-10T10:00:00Z",
                reminders: [],
                status_events: [],
            },
        ]);
        vi.spyOn(api, "listReminders").mockResolvedValue([]);
        vi.spyOn(api, "fetchAnalytics").mockResolvedValue({
            total_applications: 1,
            stale_count: 0,
        });
        const logoutSpy = vi.spyOn(api, "logoutRequest").mockResolvedValue();

        render(<App />);

        const searchInput = await screen.findByPlaceholderText(
            "Search applications, companies…"
        );
        fireEvent.change(searchInput, { target: { value: "Acme" } });
        expect(searchInput.value).toBe("Acme");

        // Open ApplicationModal
        fireEvent.click(
            await screen.findByRole("button", { name: /add application/i })
        );
        expect(
            await screen.findByText("Add New Application")
        ).toBeInTheDocument();

        // Trigger Sign Out via profile menu + LogoutConfirmModal
        fireEvent.click(screen.getByText("AR"));
        fireEvent.click(screen.getByRole("button", { name: /sign out/i }));
        expect(
            await screen.findByText("Sign out of iApply?")
        ).toBeInTheDocument();

        const signOutButtons = screen.getAllByRole("button", {
            name: /sign out/i,
        });
        fireEvent.click(signOutButtons[signOutButtons.length - 1]);

        await waitFor(() => {
            expect(logoutSpy).toHaveBeenCalledWith(refreshJwt);
            expect(getAccessToken()).toBeNull();
            expect(getRefreshToken()).toBeNull();
            expect(sessionStorage.length).toBe(0);
            expect(cacheKeys).toHaveBeenCalledTimes(1);
            expect(cacheDelete).toHaveBeenCalledWith("workbox-precache-v2");
            expect(cacheDelete).toHaveBeenCalledWith("iapply-runtime");
        });

        await waitFor(() => {
            expect(
                screen.queryByPlaceholderText("Search applications, companies…")
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Add New Application")
            ).not.toBeInTheDocument();
        });
    });

    it("ignores in-flight data fetches that resolve after logout", async () => {
        const refreshJwt = createFakeJwt(3600);
        setRefreshToken(refreshJwt);

        const appsDeferred = deferred();
        const remsDeferred = deferred();
        const statsDeferred = deferred();

        vi.spyOn(axios, "post").mockResolvedValue({
            data: { access: "access-token-race", refresh: refreshJwt },
        });
        vi.spyOn(api, "fetchMe").mockResolvedValue({
            id: "user-1",
            email: "alice@example.com",
            first_name: "Alice",
            last_name: "Rivers",
            has_password: true,
        });
        vi.spyOn(api, "listApplications").mockReturnValue(appsDeferred.promise);
        vi.spyOn(api, "listReminders").mockReturnValue(remsDeferred.promise);
        vi.spyOn(api, "fetchAnalytics").mockReturnValue(statsDeferred.promise);
        vi.spyOn(api, "logoutRequest").mockResolvedValue();

        let latest = null;
        render(
            <AuthProvider>
                <DataProvider>
                    <ContextProbe
                        onSnapshot={(snap) => {
                            latest = snap;
                        }}
                    />
                </DataProvider>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(latest?.auth.isAuthenticated).toBe(true);
            expect(api.listApplications).toHaveBeenCalledTimes(1);
        });

        await act(async () => {
            await latest.auth.logout();
        });

        expect(getAccessToken()).toBeNull();
        expect(getRefreshToken()).toBeNull();
        expect(latest.auth.isAuthenticated).toBe(false);

        // Now resolve the pre-logout in-flight fetches with stale data
        await act(async () => {
            appsDeferred.resolve([
                { id: "stale-app", company_name: "StaleCo", role_title: "Dev" },
            ]);
            remsDeferred.resolve([{ id: "stale-rem", note: "Stale reminder" }]);
            statsDeferred.resolve({ total_applications: 99 });
            await Promise.resolve();
        });

        expect(latest.data.applications).toEqual([]);
        expect(latest.data.reminders).toEqual([]);
        expect(latest.data.analytics).toBeNull();
    });
});
