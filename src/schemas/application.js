import { z } from "zod";

const CHANNELS = [
    "linkedin",
    "referral",
    "company_site",
    "email",
    "job_fair",
    "recruiter",
    "other",
];

export const applicationSchema = z.object({
    company_name: z.string().trim().min(1, "Company name is required").max(255),
    role_title: z.string().trim().min(1, "Role title is required").max(255),
    channel: z.enum(CHANNELS, {
        error: "Select how you applied",
    }),
    source_detail: z.string().trim().max(500, "Keep this under 500 characters"),
    date_applied: z
        .string()
        .min(1, "Date applied is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
        .refine((val) => {
            const [y, m, d] = val.split("-").map(Number);
            const dt = new Date(y, m - 1, d);
            return (
                dt.getFullYear() === y &&
                dt.getMonth() === m - 1 &&
                dt.getDate() === d
            );
        }, "Enter a valid date")
        .refine(
            (val) => val <= new Date().toLocaleDateString("en-CA"),
            "Date applied cannot be in the future"
        ),
    work_model: z
        .enum(["remote", "in_person", "hybrid", ""])
        .optional()
        .transform((val) => (val === "" ? null : val)),
    job_type: z
        .enum(["full_time", "part_time", "contract", "internship", ""])
        .optional()
        .transform((val) => (val === "" ? null : val)),
    monthly_salary: z
        .union([
            z
                .string()
                .regex(/^\d*(\.\d{1,2})?$/, "Must be a valid amount")
                .transform((v) => (v === "" ? null : Number(v))),
            z.number(),
        ])
        .nullable()
        .optional(),
    resume_version: z
        .string()
        .trim()
        .max(100, "Keep this under 100 characters"),
    notes: z.string().trim().max(4000, "Keep notes under 4000 characters"),
});
