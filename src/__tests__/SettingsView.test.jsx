import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsView } from "../components/SettingsView";
import { useAuth } from "../context/AuthContext";
import * as api from "../lib/api";

vi.mock("../context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

describe("SettingsView Google-only and password account deletion flows", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("requires emailed OTP and DELETE confirmation for Google-only accounts", async () => {
        const user = userEvent.setup();
        const logout = vi.fn().mockResolvedValue(undefined);
        useAuth.mockReturnValue({
            user: {
                id: "u-google",
                email: "google.only@example.com",
                first_name: "Grace",
                last_name: "Hopper",
                has_password: false,
            },
            setUser: vi.fn(),
            logout,
        });

        const reqSpy = vi
            .spyOn(api, "requestAccountDeletionCode")
            .mockResolvedValue({
                message: "Verification code sent to your email.",
            });
        const delSpy = vi.spyOn(api, "deleteAccount").mockResolvedValue();

        render(
            <SettingsView
                isDarkMode={false}
                onToggleDarkMode={vi.fn()}
                onLogout={vi.fn()}
                onOpenLegal={vi.fn()}
            />
        );

        expect(
            screen.queryByLabelText(/enter your password to confirm deletion/i)
        ).not.toBeInTheDocument();

        const sendBtn = screen.getByRole("button", {
            name: /send deletion code/i,
        });
        await user.click(sendBtn);

        expect(reqSpy).toHaveBeenCalledTimes(1);
        expect(await screen.findByRole("status")).toHaveTextContent(
            "Verification code sent to your email."
        );

        const confirmInput = screen.getByLabelText(
            /type "delete" in capital letters/i
        );
        const submitBtn = screen.getByRole("button", {
            name: /permanently delete my account/i,
        });

        // Reject missing/invalid OTP code before calling deleteAccount
        await user.type(confirmInput, "DELETE");
        await user.click(submitBtn);
        expect(
            await screen.findByText(/enter the 6-digit code from your email/i)
        ).toBeInTheDocument();
        expect(delSpy).not.toHaveBeenCalled();

        // Valid 6-digit code + DELETE submits { code } and logs out
        const codeInput = screen.getByLabelText(/6-digit email code/i);
        await user.type(codeInput, "123456");
        await user.click(submitBtn);

        await waitFor(() => {
            expect(delSpy).toHaveBeenCalledWith({ code: "123456" });
            expect(logout).toHaveBeenCalledTimes(1);
        });
    });

    it("surfaces server error alert when Google-only deletion code fails", async () => {
        const user = userEvent.setup();
        const logout = vi.fn().mockResolvedValue(undefined);
        useAuth.mockReturnValue({
            user: {
                id: "u-google",
                email: "google.only@example.com",
                first_name: "Grace",
                last_name: "Hopper",
                has_password: false,
            },
            setUser: vi.fn(),
            logout,
        });

        vi.spyOn(api, "deleteAccount").mockRejectedValue(
            new Error("Incorrect code")
        );

        render(
            <SettingsView
                isDarkMode={false}
                onToggleDarkMode={vi.fn()}
                onLogout={vi.fn()}
                onOpenLegal={vi.fn()}
            />
        );

        await user.type(
            screen.getByLabelText(/6-digit email code/i),
            "999999"
        );
        await user.type(
            screen.getByLabelText(/type "delete" in capital letters/i),
            "DELETE"
        );
        await user.click(
            screen.getByRole("button", {
                name: /permanently delete my account/i,
            })
        );

        expect(await screen.findByRole("alert")).toHaveTextContent(
            /could not delete your account/i
        );
        expect(logout).not.toHaveBeenCalled();
    });

    it("keeps password confirmation for password-based accounts", async () => {
        const user = userEvent.setup();
        const logout = vi.fn().mockResolvedValue(undefined);
        useAuth.mockReturnValue({
            user: {
                id: "u-pw",
                email: "pw.user@example.com",
                first_name: "Ada",
                last_name: "Lovelace",
                has_password: true,
            },
            setUser: vi.fn(),
            logout,
        });

        const delSpy = vi.spyOn(api, "deleteAccount").mockResolvedValue();

        render(
            <SettingsView
                isDarkMode={false}
                onToggleDarkMode={vi.fn()}
                onLogout={vi.fn()}
                onOpenLegal={vi.fn()}
            />
        );

        expect(
            screen.queryByRole("button", { name: /send deletion code/i })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByLabelText(/6-digit email code/i)
        ).not.toBeInTheDocument();

        await user.type(
            screen.getByLabelText(/enter your password to confirm deletion/i),
            "StrongPassw0rd!"
        );
        await user.type(
            screen.getByLabelText(/type "delete" in capital letters/i),
            "DELETE"
        );
        await user.click(
            screen.getByRole("button", {
                name: /permanently delete my account/i,
            })
        );

        await waitFor(() => {
            expect(delSpy).toHaveBeenCalledWith({
                password: "StrongPassw0rd!",
            });
            expect(logout).toHaveBeenCalledTimes(1);
        });
    });
});
