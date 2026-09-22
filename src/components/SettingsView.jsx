import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    User,
    Lock,
    Trash2,
    Sun,
    Moon,
    LogOut,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Mail,
    ShieldCheck,
} from "lucide-react";
import {
    changePasswordSchema,
    deleteAccountSchema,
    profileSchema,
} from "../schemas/auth";
import { FormField, inputClass } from "./ui/FormField";
import { useAuth } from "../context/AuthContext";
import {
    changePassword,
    deleteAccount,
    getErrorMessage,
    updateProfile,
} from "../lib/api";

export const SettingsView = ({
    isDarkMode,
    onToggleDarkMode,
    onLogout,
    onOpenLegal,
}) => {
    const { user, setUser, logout } = useAuth();
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [profileError, setProfileError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name: user?.first_name ?? "",
            last_name: user?.last_name ?? "",
        },
    });

    const passwordForm = useForm({
        resolver: zodResolver(changePasswordSchema),
    });

    const deleteForm = useForm({
        resolver: zodResolver(deleteAccountSchema),
    });

    const onProfileSubmit = profileForm.handleSubmit(async (values) => {
        setProfileError(null);
        setProfileSuccess(false);
        try {
            const updated = await updateProfile(values);
            setUser(updated);
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
        } catch (err) {
            setProfileError(
                getErrorMessage(err, "Could not update your profile.")
            );
        }
    });

    const onPasswordSubmit = passwordForm.handleSubmit(async (values) => {
        setPasswordError(null);
        setPasswordSuccess(false);
        try {
            await changePassword(values);
            setPasswordSuccess(true);
            passwordForm.reset();
            setTimeout(() => setPasswordSuccess(false), 3000);
        } catch (err) {
            setPasswordError(
                getErrorMessage(
                    err,
                    "Could not change your password. Check your current password."
                )
            );
        }
    });

    const onDeleteSubmit = deleteForm.handleSubmit(async (values) => {
        setDeleteError(null);
        try {
            await deleteAccount(values.password);
            await logout();
        } catch (err) {
            setDeleteError(
                getErrorMessage(
                    err,
                    "Could not delete your account. Check your password."
                )
            );
        }
    });

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-6 animate-fade-in">
            {/* Account Profile */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/20">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-bold text-base text-on-surface">
                            Profile Details
                        </h2>
                        <p className="text-xs text-on-surface-variant">
                            Update your public candidate name
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-4 bg-surface-container-low rounded-xl px-3.5 py-2.5 border border-outline-variant/20">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-semibold text-on-surface">
                        {user?.email}
                    </span>
                    <span className="text-outline text-[11px]">
                        (verified email address)
                    </span>
                </div>

                <form
                    onSubmit={onProfileSubmit}
                    className="space-y-4"
                    noValidate
                >
                    {profileError && (
                        <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs sm:text-sm flex items-center gap-2 animate-shake">
                            <AlertCircle className="w-4 h-4 shrink-0" />{" "}
                            {profileError}
                        </div>
                    )}

                    {profileSuccess && (
                        <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl text-xs sm:text-sm flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />{" "}
                            Profile updated successfully.
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField
                            label="First Name"
                            required
                            error={
                                profileForm.formState.errors.first_name?.message
                            }
                        >
                            <input
                                className={inputClass(
                                    !!profileForm.formState.errors.first_name,
                                    false
                                )}
                                {...profileForm.register("first_name")}
                            />
                        </FormField>
                        <FormField
                            label="Last Name"
                            required
                            error={
                                profileForm.formState.errors.last_name?.message
                            }
                        >
                            <input
                                className={inputClass(
                                    !!profileForm.formState.errors.last_name,
                                    false
                                )}
                                {...profileForm.register("last_name")}
                            />
                        </FormField>
                    </div>

                    <button
                        type="submit"
                        disabled={profileForm.formState.isSubmitting}
                        className="px-5 py-2.5 bg-primary text-on-primary text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                        {profileForm.formState.isSubmitting && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        Save Profile Changes
                    </button>
                </form>
            </section>

            {/* Preferences */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/20">
                <h2 className="font-bold text-base text-on-surface mb-1">
                    Display &amp; Appearance
                </h2>
                <p className="text-xs text-on-surface-variant mb-4">
                    Choose your preferred workspace aesthetic
                </p>

                <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
                    <div className="flex items-center gap-2.5 text-sm font-semibold text-on-surface">
                        {isDarkMode ? (
                            <Moon className="w-4.5 h-4.5 text-primary" />
                        ) : (
                            <Sun className="w-4.5 h-4.5 text-amber-500" />
                        )}
                        <span>
                            {isDarkMode
                                ? "Dark Mode"
                                : "Light Mode"}
                        </span>
                    </div>
                    
                    <button
                        type="button"
                        onClick={onToggleDarkMode}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${isDarkMode ? "bg-primary" : "bg-outline-variant"}`}
                        aria-label="Toggle theme"
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isDarkMode ? "translate-x-6" : "translate-x-0"}`}
                        />
                    </button>
                </div>
            </section>

            {/* Security & Password */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-outline-variant/20">
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                        <Lock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-bold text-base text-on-surface">
                            Security &amp; Password
                        </h2>
                        <p className="text-xs text-on-surface-variant">
                            Update your account authentication credentials
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={onPasswordSubmit}
                    className="space-y-4"
                    noValidate
                >
                    {passwordError && (
                        <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs sm:text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />{" "}
                            {passwordError}
                        </div>
                    )}
                    {passwordSuccess && (
                        <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl text-xs sm:text-sm flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />{" "}
                            Password changed successfully.
                        </div>
                    )}
                    <FormField
                        label="Current Password"
                        required
                        error={
                            passwordForm.formState.errors.old_password?.message
                        }
                    >
                        <input
                            type="password"
                            autoComplete="current-password"
                            className={inputClass(
                                !!passwordForm.formState.errors.old_password,
                                false
                            )}
                            {...passwordForm.register("old_password")}
                        />
                    </FormField>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField
                            label="New Password"
                            required
                            error={
                                passwordForm.formState.errors.new_password
                                    ?.message
                            }
                        >
                            <input
                                type="password"
                                autoComplete="new-password"
                                className={inputClass(
                                    !!passwordForm.formState.errors
                                        .new_password,
                                    false
                                )}
                                {...passwordForm.register("new_password")}
                            />
                        </FormField>
                        <FormField
                            label="Confirm New Password"
                            required
                            error={
                                passwordForm.formState.errors.new_password2
                                    ?.message
                            }
                        >
                            <input
                                type="password"
                                autoComplete="new-password"
                                className={inputClass(
                                    !!passwordForm.formState.errors
                                        .new_password2,
                                    false
                                )}
                                {...passwordForm.register("new_password2")}
                            />
                        </FormField>
                    </div>
                    <button
                        type="submit"
                        disabled={passwordForm.formState.isSubmitting}
                        className="px-5 py-2.5 bg-primary text-on-primary text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                        {passwordForm.formState.isSubmitting && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        Update Password
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onLogout}
                        className="flex items-center gap-2 text-xs font-bold text-error hover:underline cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" /> Sign out of this session
                    </button>

                    {onOpenLegal && (
                        <button
                            type="button"
                            onClick={() => onOpenLegal("privacy")}
                            className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        >
                            <ShieldCheck className="w-3.5 h-3.5" /> Privacy
                            Policy &amp; Data Rights
                        </button>
                    )}
                </div>
            </section>

            {/* Danger zone */}
            <section className="bg-error-container/20 border border-error/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Trash2 className="w-5 h-5 text-error" />
                    <h2 className="font-bold text-error">Danger Zone</h2>
                </div>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                    Deleting your account permanently removes your profile and
                    every application, reminder, and status history you&apos;ve
                    recorded. This operation cannot be undone.
                </p>
                <form
                    onSubmit={onDeleteSubmit}
                    className="space-y-3"
                    noValidate
                >
                    {deleteError && (
                        <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />{" "}
                            {deleteError}
                        </div>
                    )}
                    <FormField
                        label="Enter your password to confirm deletion"
                        required
                        error={deleteForm.formState.errors.password?.message}
                    >
                        <input
                            type="password"
                            autoComplete="current-password"
                            className={inputClass(
                                !!deleteForm.formState.errors.password,
                                false
                            )}
                            {...deleteForm.register("password")}
                        />
                    </FormField>
                    <FormField
                        label='Type "DELETE" in capital letters'
                        required
                        error={
                            deleteForm.formState.errors.confirmation?.message
                        }
                    >
                        <input
                            type="text"
                            className={inputClass(
                                !!deleteForm.formState.errors.confirmation,
                                false
                            )}
                            {...deleteForm.register("confirmation")}
                        />
                    </FormField>
                    <button
                        type="submit"
                        disabled={deleteForm.formState.isSubmitting}
                        className="px-5 py-2.5 bg-error text-white text-xs font-bold rounded-xl hover:bg-error-hover transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                        {deleteForm.formState.isSubmitting && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        Permanently Delete My Account
                    </button>
                </form>
            </section>
        </div>
    );
};
