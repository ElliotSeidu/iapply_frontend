import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApplicationModal } from "../components/ApplicationModal";
import { useData } from "../context/DataContext";

vi.mock("../context/DataContext", () => ({
    useData: vi.fn(),
}));

describe("ApplicationModal focus stability and AnimatePresence exit", () => {
    it("does not drop focus or remount inputs while typing, and exits via AnimatePresence", async () => {
        const user = userEvent.setup();
        useData.mockReturnValue({
            addApplication: vi.fn(),
            editApplication: vi.fn(),
            removeApplication: vi.fn(),
            changeStatus: vi.fn(),
        });

        const { rerender } = render(
            <ApplicationModal
                isOpen={true}
                onClose={vi.fn()}
                applicationToEdit={null}
            />
        );

        const companyInput = screen.getByPlaceholderText("e.g. Vodafone Ghana");
        await user.click(companyInput);
        expect(document.activeElement).toBe(companyInput);

        await user.type(companyInput, "Acme Corp");
        expect(companyInput.value).toBe("Acme Corp");
        expect(document.activeElement).toBe(companyInput);

        rerender(
            <ApplicationModal
                isOpen={false}
                onClose={vi.fn()}
                applicationToEdit={null}
            />
        );

        // AnimatePresence keeps the exiting node mounted during its exit animation, then removes it
        expect(
            screen.getByText("Add New Application")
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(
                screen.queryByText("Add New Application")
            ).not.toBeInTheDocument();
        });
    });
});
