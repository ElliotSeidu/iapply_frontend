import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import axios from "axios";
import { API_BASE_URL, googleLoginRequest } from "../lib/api";

describe("GoogleSignInButton and Google auth request", () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        delete window.google;
        document
            .querySelectorAll('script[src="https://accounts.google.com/gsi/client"]')
            .forEach((el) => el.remove());
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
        delete window.google;
    });

    it("disables rendering and script loading when VITE_GOOGLE_CLIENT_ID is empty", async () => {
        vi.stubEnv("VITE_GOOGLE_CLIENT_ID", "   ");
        vi.resetModules();

        const { GoogleSignInButton, isGoogleSignInEnabled } = await import(
            "../components/GoogleSignInButton"
        );

        expect(isGoogleSignInEnabled).toBe(false);
        const { container } = render(
            <GoogleSignInButton onCredential={vi.fn()} onError={vi.fn()} />
        );
        expect(container.firstChild).toBeNull();
        expect(
            document.querySelector(
                'script[src="https://accounts.google.com/gsi/client"]'
            )
        ).toBeNull();
    });

    it("passes raw credential to callback without storing it and posts only { credential }", async () => {
        vi.stubEnv(
            "VITE_GOOGLE_CLIENT_ID",
            "test-client-id.apps.googleusercontent.com"
        );
        vi.resetModules();

        let capturedCallback = null;
        const initialize = vi.fn((opts) => {
            capturedCallback = opts.callback;
        });
        const renderButton = vi.fn();
        window.google = {
            accounts: {
                id: { initialize, renderButton },
            },
        };

        const onCredential = vi.fn();
        const { GoogleSignInButton, isGoogleSignInEnabled } = await import(
            "../components/GoogleSignInButton"
        );

        expect(isGoogleSignInEnabled).toBe(true);
        render(
            <GoogleSignInButton
                mode="login"
                onCredential={onCredential}
                onError={vi.fn()}
            />
        );

        await waitFor(() => {
            expect(initialize).toHaveBeenCalledTimes(1);
        });
        expect(renderButton).toHaveBeenCalledTimes(1);

        const fakeCredential = "eyJhbGciOiJSUzI1NiJ9.payload.sig";
        capturedCallback({ credential: fakeCredential });

        expect(onCredential).toHaveBeenCalledWith(fakeCredential);
        expect(localStorage.length).toBe(0);
        expect(sessionStorage.length).toBe(0);

        const postSpy = vi
            .spyOn(axios, "post")
            .mockResolvedValue({ data: { access: "a", refresh: "r" } });

        await googleLoginRequest(fakeCredential);

        expect(postSpy).toHaveBeenCalledTimes(1);
        expect(postSpy).toHaveBeenCalledWith(
            `${API_BASE_URL}/account/google/`,
            { credential: fakeCredential },
            { timeout: 12000 }
        );
        expect(Object.keys(postSpy.mock.calls[0][1])).toEqual(["credential"]);
        expect(localStorage.length).toBe(0);
        expect(sessionStorage.length).toBe(0);
    });
});
