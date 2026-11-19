import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { applicationSchema } from "../schemas/application";
import { ApplicationsView } from "../components/ApplicationsView";
import { useData } from "../context/DataContext";

vi.mock("../context/DataContext", () => ({
    useData: vi.fn(),
}));

function buildBaseApplication(dateApplied) {
    return {
        company_name: "Acme Corp",
        role_title: "Backend Engineer",
        channel: "company_site",
        source_detail: "",
        date_applied: dateApplied,
        work_model: "",
        job_type: "",
        monthly_salary: "",
        resume_version: "",
        notes: "",
    };
}

describe("applicationSchema and ApplicationsView local date handling", () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it.each([
        {
            tz: "America/New_York",
            utcInstant: "2026-06-15T01:30:00Z", // Still 2026-06-14 21:30 EDT (negative UTC offset)
            localToday: "2026-06-14",
            localTomorrow: "2026-06-15",
        },
        {
            tz: "UTC",
            utcInstant: "2026-06-15T01:30:00Z", // 2026-06-15 01:30 UTC
            localToday: "2026-06-15",
            localTomorrow: "2026-06-16",
        },
        {
            tz: "Asia/Tokyo",
            utcInstant: "2026-06-15T22:30:00Z", // Already 2026-06-16 07:30 JST (positive UTC offset)
            localToday: "2026-06-16",
            localTomorrow: "2026-06-17",
        },
    ])(
        "accepts local today and rejects future dates in $tz at $utcInstant",
        ({ tz, utcInstant, localToday, localTomorrow }) => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date(utcInstant));

            const origToLocaleDateString = Date.prototype.toLocaleDateString;
            vi.spyOn(Date.prototype, "toLocaleDateString").mockImplementation(
                function mockLocaleDate(locale, options) {
                    if (locale === "en-CA") {
                        return new Intl.DateTimeFormat("en-CA", {
                            timeZone: tz,
                        }).format(this);
                    }
                    return origToLocaleDateString.call(this, locale, options);
                }
            );

            const todayResult = applicationSchema.safeParse(
                buildBaseApplication(localToday)
            );
            expect(todayResult.success).toBe(true);

            const tomorrowResult = applicationSchema.safeParse(
                buildBaseApplication(localTomorrow)
            );
            expect(tomorrowResult.success).toBe(false);
            if (!tomorrowResult.success) {
                const messages = tomorrowResult.error.issues.map(
                    (i) => i.message
                );
                expect(messages).toContain("Date applied cannot be in the future");
            }
        }
    );

    it("rejects nonexistent calendar dates and compares against runtime local today", () => {
        const badDate = applicationSchema.safeParse(
            buildBaseApplication("2026-02-30")
        );
        expect(badDate.success).toBe(false);

        const now = new Date();
        const localToday = now.toLocaleDateString("en-CA");
        const localTomorrow = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
        ).toLocaleDateString("en-CA");

        expect(
            applicationSchema.safeParse(buildBaseApplication(localToday)).success
        ).toBe(true);
        const futureResult = applicationSchema.safeParse(
            buildBaseApplication(localTomorrow)
        );
        expect(futureResult.success).toBe(false);
    });

    it("renders stored YYYY-MM-DD date in local calendar without UTC off-by-one shift", () => {
        useData.mockReturnValue({
            applications: [
                {
                    id: "app-1",
                    company_name: "Northstar Labs",
                    role_title: "Security Engineer",
                    channel: "company_site",
                    date_applied: "2026-06-15",
                    current_status: "applied",
                    is_stale: false,
                    days_since_applied: 0,
                },
            ],
            removeApplication: vi.fn(),
        });

        render(
            <ApplicationsView
                onSelectApplication={vi.fn()}
                onOpenAddModal={vi.fn()}
                searchQuery=""
                setSearchQuery={vi.fn()}
            />
        );

        const expectedLocalDisplay = new Date(2026, 5, 15).toLocaleDateString();
        const shiftedPrevDayDisplay = new Date(
            2026,
            5,
            14
        ).toLocaleDateString();

        expect(screen.getByText(expectedLocalDisplay)).toBeInTheDocument();
        expect(
            screen.queryByText(shiftedPrevDayDisplay)
        ).not.toBeInTheDocument();
    });
});
