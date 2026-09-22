import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    X,
    Mail,
    Lock,
    User,
    ShieldCheck,
    Eye,
    EyeOff,
    AlertCircle,
    Loader2,
    KeyRound,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import { loginSchema, registerSchema } from "../schemas/auth";
import { getPasswordStrength } from "../utils/validation";
import { FormField, inputClass } from "./ui/FormField";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage, verifyRegisterRequest } from "../lib/api";
import { setAccessToken, setRefreshToken } from "../lib/tokenStore";

// ─── Password strength bar (4 segments) ─────────────────────────────────────
function StrengthBar({ score }) {
    const segments = 4;
    const filled = Math.ceil((score / 100) * segments);
    const colors = ["bg-error", "bg-tertiary", "bg-tertiary", "bg-secondary"];
    return (
        <div className="flex gap-1">
            {Array.from({
                length: segments,
            }).map((_, i) => (
                <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < filled ? colors[Math.min(filled - 1, colors.length - 1)] : "bg-outline-variant/30"}`}
                />
            ))}
        </div>
    );
}

// ─── Requirement row ──────────────────────────────────────────────────────────
function Req({ met, label }) {
    return (
        <span
            className={`flex items-center gap-1 text-[11px] ${met ? "text-secondary" : "text-outline"}`}
        >
            {met ? (
                <CheckCircle2 className="w-3 h-3" />
            ) : (
                <span className="w-3 h-3 flex items-center justify-center text-[10px]">
                    ○
                </span>
            )}
            {label}
        </span>
    );
}

// ─── Brand panel (left side on wider modal) ───────────────────────────────────
// Fixed dark palette — not theme-reactive, same reasoning as the landing hero:
// this should look identically dramatic in light and dark mode rather than
// washing out when semantic tokens (bg-primary etc.) flip to pastel values.
function BrandPanel() {
    return (
        <div className="hidden sm:flex flex-col justify-between relative overflow-hidden p-8 w-56 shrink-0 rounded-l-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2b0a4d] via-[#4c1d95] to-[#1a0533]" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#c084fc] opacity-25 blur-3xl mix-blend-screen pointer-events-none" />
            <div className="absolute -bottom-12 -left-10 w-36 h-36 rounded-full bg-[#22d3ee] opacity-15 blur-3xl mix-blend-screen pointer-events-none" />
            <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                    <ShieldCheck className="w-6 h-6 text-[#c084fc]" />
                    <span className="font-display italic text-2xl font-bold text-white drop-shadow-sm">
                        iApply
                    </span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                    Your personal job search command centre. Track every
                    application, interview, and offer — privately.
                </p>
            </div>
            <div className="relative z-10 space-y-3 text-xs text-white/60">
                {["100% private", "Email verified", "Free forever"].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#c084fc]" />
                        {t}
                    </div>
                ))}
            </div>
        </div>
    );
}

export const AuthModal = ({ isOpen, onClose }) => {
    const { login, register: registerUser, refreshUser } = useAuth();
    const [awaitingVerification, setAwaitingVerification] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState(null);
    const [verificationCode, setVerificationCode] = useState("");
    const [mode, setMode] = useState("login");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [serverError, setServerError] = useState(null);

    const loginForm = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
    });

    const registerForm = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
    });

    if (!isOpen) return null;
    const watchedPassword = registerForm.watch("password") || "";
    const passwordStrength = getPasswordStrength(watchedPassword);

    const switchMode = (next) => {
        setMode(next);
        setServerError(null);
        loginForm.clearErrors();
        registerForm.clearErrors();
    };

    const onLoginSubmit = loginForm.handleSubmit(async (values) => {
        setServerError(null);
        try {
            await login(values.email, values.password);
            onClose();
            loginForm.reset();
        } catch (err) {
            setServerError(getErrorMessage(err, "Invalid email or password."));
        }
    });

    const onRegisterSubmit = registerForm.handleSubmit(async (values) => {
        setServerError(null);
        try {
            await registerUser(values);
            setVerificationEmail(values.email);
            setAwaitingVerification(true);
        } catch (err) {
            setServerError(
                getErrorMessage(
                    err,
                    "Could not create your account. Please try again."
                )
            );
        }
    });

    const onVerifySubmit = async () => {
        setServerError(null);
        if (!verificationEmail) return;
        try {
            const data = await verifyRegisterRequest({
                email: verificationEmail,
                code: verificationCode,
            });
            if (data.access) setAccessToken(data.access);
            if (data.refresh) setRefreshToken(data.refresh);
            await refreshUser();
            setAwaitingVerification(false);
            setVerificationEmail(null);
            setVerificationCode("");
            registerForm.reset();
            onClose();
        } catch (err) {
            setServerError(
                getErrorMessage(
                    err,
                    "Verification failed. Please check the code and try again."
                )
            );
        }
    };

    const isSubmitting =
        mode === "login"
            ? loginForm.formState.isSubmitting
            : registerForm.formState.isSubmitting;

    // Helper: is field touched + dirty + no error
    const lf = loginForm.formState;
    const rf = registerForm.formState;
    const loginValid = {
        email: lf.touchedFields.email && !lf.errors.email,
        password: lf.touchedFields.password && !lf.errors.password,
    };

    const regValid = {
        first_name: rf.touchedFields.first_name && !rf.errors.first_name,
        last_name: rf.touchedFields.last_name && !rf.errors.last_name,
        email: rf.touchedFields.email && !rf.errors.email,
        password:
            rf.touchedFields.password &&
            !rf.errors.password &&
            watchedPassword.length > 0,
        password2: rf.touchedFields.password2 && !rf.errors.password2,
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 animate-fade-in">
            <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[95vh] flex animate-scale-in">
                {/* Brand panel */}
                <BrandPanel />

                {/* Main panel */}
                <div className="flex flex-col flex-1 min-w-0 max-h-[95vh]">
                    {/* Mobile-only header strip — same fixed dark palette as BrandPanel/hero */}
                    <div className="sm:hidden relative overflow-hidden px-5 py-4 shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2b0a4d] via-[#4c1d95] to-[#1a0533]" />
                        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#c084fc] opacity-25 blur-3xl mix-blend-screen pointer-events-none" />

                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 z-10 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="relative z-10 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-[#c084fc]" />
                            <span className="font-display italic text-xl font-bold text-white drop-shadow-sm">
                                iApply
                            </span>
                        </div>
                        <p className="relative z-10 text-xs text-white/60 mt-0.5">
                            {mode === "login"
                                ? "Sign in to your pipeline"
                                : "Create your free account"}
                        </p>
                    </div>

                    {/* Desktop close button */}
                    <button
                        onClick={onClose}
                        className="hidden sm:flex absolute top-3 right-3 p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors z-10"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Tab switcher */}
                    <div className="flex border-b border-outline-variant/30 bg-surface-container-low shrink-0">
                        {["login", "register"].map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => switchMode(m)}
                                className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2 ${mode === m ? "border-primary text-primary bg-surface-container-lowest" : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/50"}`}
                            >
                                {m === "login" ? "Sign In" : "Create Account"}
                            </button>
                        ))}
                    </div>

                    {/* ── SIGN IN FORM ──────────────────────────────────────────────────── */}
                    {mode === "login" ? (
                        <form
                            onSubmit={onLoginSubmit}
                            className="p-6 space-y-4 overflow-y-auto flex-1"
                            noValidate
                        >
                            <div className="mb-2">
                                <h2 className="text-base font-bold text-on-surface">
                                    Welcome back
                                </h2>
                                <p className="text-xs text-on-surface-variant mt-0.5">
                                    Sign in to access your application pipeline.
                                </p>
                            </div>

                            {serverError && (
                                <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs font-medium flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{serverError}</span>
                                </div>
                            )}

                            <FormField
                                label="Email Address"
                                required
                                icon={<Mail className="w-4 h-4" />}
                                error={lf.errors.email?.message}
                                valid={loginValid.email}
                            >
                                <input
                                    type="email"
                                    autoComplete="email"
                                    placeholder="alex@example.com"
                                    className={inputClass(
                                        !!lf.errors.email,
                                        true,
                                        loginValid.email
                                    )}
                                    {...loginForm.register("email")}
                                />
                            </FormField>

                            <FormField
                                label="Password"
                                required
                                icon={<Lock className="w-4 h-4" />}
                                error={lf.errors.password?.message}
                                valid={loginValid.password}
                            >
                                <input
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••••••"
                                    className={inputClass(
                                        !!lf.errors.password,
                                        true,
                                        loginValid.password
                                    )}
                                    {...loginForm.register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-8 top-2.5 text-outline hover:text-on-surface transition-colors"
                                    tabIndex={-1}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </FormField>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-2 py-3 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="w-4 h-4" />
                                )}
                                {isSubmitting
                                    ? "Signing in…"
                                    : "Sign In Securely"}
                            </button>

                            <p className="text-center text-xs text-on-surface-variant pt-1">
                                No account?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode("register")}
                                    className="text-primary font-semibold hover:underline"
                                >
                                    Create one free
                                </button>
                            </p>
                        </form>
                    ) : !awaitingVerification /* ── CREATE ACCOUNT FORM ─────────────────────────────────────────── */ ? (
                        <form
                            onSubmit={onRegisterSubmit}
                            className="p-6 space-y-4 overflow-y-auto flex-1"
                            noValidate
                        >
                            <div className="mb-2">
                                <h2 className="text-base font-bold text-on-surface">
                                    Create your account
                                </h2>
                                <p className="text-xs text-on-surface-variant mt-0.5">
                                    Free forever. No credit card needed.
                                </p>
                            </div>

                            {serverError && (
                                <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs font-medium flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{serverError}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <FormField
                                    label="First Name"
                                    required
                                    icon={<User className="w-4 h-4" />}
                                    error={rf.errors.first_name?.message}
                                    valid={regValid.first_name}
                                >
                                    <input
                                        type="text"
                                        autoComplete="given-name"
                                        placeholder="Alex"
                                        className={inputClass(
                                            !!rf.errors.first_name,
                                            true,
                                            regValid.first_name
                                        )}
                                        {...registerForm.register("first_name")}
                                    />
                                </FormField>
                                <FormField
                                    label="Last Name"
                                    required
                                    error={rf.errors.last_name?.message}
                                    valid={regValid.last_name}
                                >
                                    <input
                                        type="text"
                                        autoComplete="family-name"
                                        placeholder="Rivers"
                                        className={inputClass(
                                            !!rf.errors.last_name,
                                            false,
                                            regValid.last_name
                                        )}
                                        {...registerForm.register("last_name")}
                                    />
                                </FormField>
                            </div>

                            <FormField
                                label="Email Address"
                                required
                                icon={<Mail className="w-4 h-4" />}
                                error={rf.errors.email?.message}
                                valid={regValid.email}
                            >
                                <input
                                    type="email"
                                    autoComplete="email"
                                    placeholder="alex@example.com"
                                    className={inputClass(
                                        !!rf.errors.email,
                                        true,
                                        regValid.email
                                    )}
                                    {...registerForm.register("email")}
                                />
                            </FormField>

                            {/* Password + strength */}
                            <div className="space-y-2">
                                <FormField
                                    label="Password"
                                    required
                                    icon={<Lock className="w-4 h-4" />}
                                    error={rf.errors.password?.message}
                                    valid={regValid.password}
                                >
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="new-password"
                                        placeholder="••••••••••••"
                                        className={inputClass(
                                            !!rf.errors.password,
                                            true,
                                            regValid.password
                                        )}
                                        {...registerForm.register("password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                        className="absolute right-8 top-2.5 text-outline hover:text-on-surface transition-colors"
                                        tabIndex={-1}
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </FormField>

                                {watchedPassword.length > 0 && (
                                    <div className="px-1 space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-on-surface-variant font-medium">
                                                Strength
                                            </span>
                                            <span
                                                className="font-bold"
                                                style={{
                                                    color: passwordStrength.color,
                                                }}
                                            >
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <StrengthBar
                                            score={passwordStrength.score}
                                        />
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-0.5">
                                            <Req
                                                met={
                                                    passwordStrength.hasMinLength
                                                }
                                                label="8+ characters"
                                            />
                                            <Req
                                                met={
                                                    passwordStrength.hasUppercase
                                                }
                                                label="Uppercase letter"
                                            />
                                            <Req
                                                met={passwordStrength.hasNumber}
                                                label="Number"
                                            />
                                            <Req
                                                met={
                                                    passwordStrength.hasSpecialChar
                                                }
                                                label="Special symbol"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <FormField
                                label="Confirm Password"
                                required
                                icon={<Lock className="w-4 h-4" />}
                                error={rf.errors.password2?.message}
                                valid={regValid.password2}
                            >
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    autoComplete="new-password"
                                    placeholder="••••••••••••"
                                    className={inputClass(
                                        !!rf.errors.password2,
                                        true,
                                        regValid.password2
                                    )}
                                    {...registerForm.register("password2")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    className="absolute right-8 top-2.5 text-outline hover:text-on-surface transition-colors"
                                    tabIndex={-1}
                                    aria-label={
                                        showConfirm
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirm ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </FormField>

                            <p className="text-[11px] text-on-surface-variant leading-snug">
                                By creating an account you agree to keep your
                                credentials confidential. iApply never shares
                                your application data with third parties.
                            </p>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="w-4 h-4" />
                                )}
                                {isSubmitting
                                    ? "Creating account…"
                                    : "Create iApply Account"}
                            </button>
                        </form> /* ── EMAIL VERIFICATION STEP ──────────────────────────────────────── */
                    ) : (
                        <div className="p-6 space-y-5 overflow-y-auto flex-1">
                            <div className="flex flex-col items-center text-center gap-3 pt-2">
                                <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
                                    <KeyRound className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-on-surface">
                                        Check your inbox
                                    </h2>
                                    <p className="text-xs text-on-surface-variant mt-1 max-w-[260px] mx-auto leading-relaxed">
                                        We sent a 6-digit code to{" "}
                                        <span className="font-semibold text-on-surface">
                                            {verificationEmail}
                                        </span>
                                        . Enter it below to complete signup.
                                    </p>
                                </div>
                            </div>

                            <FormField
                                label="Verification Code"
                                required
                                icon={<Mail className="w-4 h-4" />}
                                error={undefined}
                            >
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="123456"
                                    maxLength={8}
                                    className={`${inputClass(false)} text-center tracking-[0.3em] text-lg font-bold`}
                                    value={verificationCode}
                                    onChange={(e) =>
                                        setVerificationCode(
                                            e.target.value.replace(/\D/g, "")
                                        )
                                    }
                                />
                            </FormField>

                            {serverError && (
                                <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs font-medium flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{serverError}</span>
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={onVerifySubmit}
                                    disabled={verificationCode.length < 4}
                                    className="w-full py-3 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Verify &amp; Continue
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAwaitingVerification(false);
                                        setVerificationEmail(null);
                                        setServerError(null);
                                    }}
                                    className="w-full py-2.5 text-sm text-on-surface-variant hover:text-on-surface border border-outline-variant rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
