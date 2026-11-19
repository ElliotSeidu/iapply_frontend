import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthModal } from "../components/AuthModal";
import { AuthProvider } from "../context/AuthContext";
import * as api from "../lib/api";

describe("AuthModal password reset banner and verification submit guard", () => {
    beforeEach(() => {
        sessionStorage.clear();
        localStorage.clear();
    });

    afterEach(() => {
        sessionStorage.clear();
        vi.restoreAllMocks();
    });

    it("shows success banner instead of error banner after password reset succeeds", async () => {
        const user = userEvent.setup();
        vi.spyOn(api, "requestPasswordReset").mockResolvedValue({
            message: "If an account exists for that email, a reset code has been sent.",
        });
        vi.spyOn(api, "confirmPasswordReset").mockResolvedValue({
            message: "Password reset successfully.",
        });

        render(
            <AuthProvider>
                <AuthModal isOpen={true} onClose={vi.fn()} />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: /forgot your password\?/i })
            ).toBeInTheDocument();
        });

        await user.click(
            screen.getByRole("button", { name: /forgot your password\?/i })
        );
        await user.type(
            screen.getByPlaceholderText("alex@example.com"),
            "alice@example.com"
        );
        await user.click(
            screen.getByRole("button", { name: /send reset code/i })
        );

        const codeInput = await screen.findByPlaceholderText("123456");
        await user.type(codeInput, "654321");
        await user.click(screen.getByRole("button", { name: /verify code/i }));

        const passwordInputs = await screen.findAllByPlaceholderText(
            "••••••••••••"
        );
        await user.type(passwordInputs[0], "NewStrongPass1!");
        await user.type(passwordInputs[1], "NewStrongPass1!");
        await user.click(
            screen.getByRole("button", { name: /update password/i })
        );

        const bannerText = await screen.findByText(
            "Password updated. Sign in with your new password."
        );
        expect(bannerText).toBeInTheDocument();
        const bannerEl = bannerText.closest("div");
        expect(bannerEl).toHaveClass("bg-secondary-container");
        expect(bannerEl).not.toHaveClass("bg-error-container");
        expect(document.querySelector(".bg-error-container")).toBeNull();
    });

    it("sends only one verify request on rapid double-submit", async () => {
        const user = userEvent.setup();
        let resolveVerify;
        const verifyPromise = new Promise((resolve) => {
            resolveVerify = resolve;
        });

        vi.spyOn(api, "registerRequest").mockResolvedValue({
            message: "Verification code sent to email",
        });
        const verifySpy = vi
            .spyOn(api, "verifyRegisterRequest")
            .mockReturnValue(verifyPromise);
        vi.spyOn(api, "fetchMe").mockResolvedValue({
            id: "user-1",
            email: "alice@example.com",
            first_name: "Alice",
            last_name: "Rivers",
            has_password: true,
        });

        render(
            <AuthProvider>
                <AuthModal isOpen={true} onClose={vi.fn()} />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: /create account/i })
            ).toBeInTheDocument();
        });

        await user.click(screen.getByRole("button", { name: /create account/i }));
        await user.type(screen.getByPlaceholderText("Alex"), "Alice");
        await user.type(screen.getByPlaceholderText("Rivers"), "Rivers");
        await user.type(
            screen.getByPlaceholderText("alex@example.com"),
            "alice@example.com"
        );
        const passwordInputs = screen.getAllByPlaceholderText("••••••••••••");
        await user.type(passwordInputs[0], "StrongPass1!");
        await user.type(passwordInputs[1], "StrongPass1!");
        await user.click(
            screen.getByRole("button", { name: /create iapply account/i })
        );

        const codeInput = await screen.findByPlaceholderText("123456");
        await user.type(codeInput, "123456");

        const verifyBtn = screen.getByRole("button", {
            name: /verify & continue/i,
        });
        // Trigger two submissions inside a single batch before React re-renders disabled state
        act(() => {
            verifyBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            codeInput.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
            );
        });
        fireEvent.click(verifyBtn);

        expect(verifySpy).toHaveBeenCalledTimes(1);

        resolveVerify({
            access: "access-tok",
            refresh: "refresh-tok",
        });
        await waitFor(() => {
            expect(api.fetchMe).toHaveBeenCalledTimes(1);
        });
    });
});
