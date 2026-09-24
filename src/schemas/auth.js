import { z } from "zod";

// Mirrors Django's AUTH_PASSWORD_VALIDATORS (min length 8, not entirely numeric,
// not a common password — those two we can't fully replicate client-side, but we
// give the user a strong hint via the strength meter). This keeps client-side
// validation from giving false confidence while still catching obvious issues early.
const passwordField = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => !/^\d+$/.test(val), "Password cannot be entirely numeric")
    .refine(
        (val) => /[A-Za-z]/.test(val),
        "Password must include at least one letter"
    );

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export const passwordResetRequestSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Enter a valid email address"),
});

export const passwordResetSchema = z
    .object({
        password: passwordField,
        password2: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.password === data.password2, {
        message: "Passwords don't match",
        path: ["password2"],
    });

export const registerSchema = z
    .object({
        first_name: z.string().trim().min(1, "First name is required").max(150),
        last_name: z.string().trim().min(1, "Last name is required").max(150),
        email: z
            .string()
            .trim()
            .min(1, "Email is required")
            .email("Enter a valid email address"),
        password: passwordField,
        password2: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.password2, {
        message: "Passwords don't match",
        path: ["password2"],
    });

export const changePasswordSchema = z
    .object({
        old_password: z.string().min(1, "Current password is required"),
        new_password: passwordField,
        new_password2: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.new_password === data.new_password2, {
        message: "Passwords don't match",
        path: ["new_password2"],
    })
    .refine((data) => data.old_password !== data.new_password, {
        message: "New password must be different from your current password",
        path: ["new_password"],
    });

export const deleteAccountSchema = z.object({
    password: z.string().min(1, "Enter your password to confirm"),
    confirmation: z
        .string()
        .refine((val) => val === "DELETE", "Type DELETE to confirm"),
});

export const profileSchema = z.object({
    first_name: z.string().trim().min(1, "First name is required").max(150),
    last_name: z.string().trim().min(1, "Last name is required").max(150),
});
