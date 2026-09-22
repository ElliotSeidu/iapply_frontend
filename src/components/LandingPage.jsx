import React, { useEffect } from "react";
import {
    ShieldCheck,
    BarChart3,
    BellRing,
    Kanban,
    CheckCircle2,
    ArrowRight,
    Lock,
    Zap,
    FileText,
    Shield,
    Cookie,
    Play,
    Briefcase,
    Plus,
    Send,
} from "lucide-react";

const revealSections = () => {
    const items = Array.from(document.querySelectorAll("[data-reveal]"));

    if (!items.length) return;

    items.forEach((item, index) => {
        const timeoutId = window.setTimeout(() => {
            item.classList.add("is-visible");
        }, index * 80);

        item.dataset.revealTimeout = String(timeoutId);
    });
};

// ─── Feature cards ────────────────────────────────────────────────────────────
const features = [
    {
        icon: Kanban,
        title: "Kanban Pipeline",
        description:
            "Drag applications through Applied → Interview → Offer → Rejected columns. Get an instant visual snapshot of where every opportunity stands.",
        iconBg: "bg-primary-container",
        iconColor: "text-on-primary-container",
    },
    {
        icon: BarChart3,
        title: "Rich Analytics",
        description:
            "Charts that break down your applications by channel, status, and time period — so you can double-down on what's working.",
        iconBg: "bg-secondary-container",
        iconColor: "text-on-secondary-container",
    },
    {
        icon: BellRing,
        title: "Smart Reminders",
        description:
            "Set follow-up reminders per application and get notified before deadlines slip. Never go cold on a hot lead again.",
        iconBg: "bg-tertiary-container",
        iconColor: "text-on-tertiary-container",
    },
];

// ─── Steps ────────────────────────────────────────────────────────────────────
const steps = [
    {
        number: "01",
        title: "Log every application",
        description:
            "Add the company, role, channel (LinkedIn, referral, company site…), date, and your resume version in seconds.",
    },
    {
        number: "02",
        title: "Advance the status",
        description:
            "One click to move from Applied to Phone Screen, Interview, Offer, or Rejected — with a full event history saved.",
    },
    {
        number: "03",
        title: "Stay organised & win",
        description:
            "Use the board, analytics, and reminders together to focus your energy on the roles most likely to convert.",
    },
];

// ─── Trust stats ─────────────────────────────────────────────────────────────
const stats = [
    {
        value: "100%",
        label: "Private — your data is yours only",
    },
    {
        value: "Free",
        label: "No credit card, no ads, no hidden fees",
    },
    {
        value: "Secure",
        label: "JWT auth with email verification",
    },
];

export const LandingPage = ({ onOpenAuth, onOpenLegal }) => {
    useEffect(() => {
        revealSections();

        return () => {
            document.querySelectorAll("[data-reveal]").forEach((item) => {
                if (item.dataset.revealTimeout) {
                    window.clearTimeout(Number(item.dataset.revealTimeout));
                }
                item.classList.remove("is-visible");
            });
        };
    }, []);

    return (
        <div className="flex flex-col w-full animate-fade-in">
            {/* ── Hero ──────────────────────────────────────────────────────────────── */}
            <section
                className="relative overflow-hidden bg-white dark:bg-black border-b border-black/[0.07] dark:border-white/[0.07]"
                data-reveal
            >
                <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
                        {/* LEFT SIDE */}
                        <div>
                            {/* Headline */}
                            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.035em] text-black dark:text-white leading-[1.08]">
                                Stay organized.
                                <br />
                                <span className="text-[#6d28d9] dark:text-[#a78bfa]">
                                    Land opportunities faster.
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="mt-6 text-base md:text-lg text-black/60 dark:text-white/60 max-w-xl leading-relaxed">
                                Manage applications, interviews, offers, and
                                follow-ups from one secure workspace designed to
                                simplify your job search.
                            </p>

                            {/* CTA */}
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <button
                                    onClick={onOpenAuth}
                                    className="
                group
                px-6 py-3
                bg-[#6d28d9]
                text-white
                font-medium text-sm
                rounded-lg
                hover:bg-[#5b21b6]
                transition-colors
                cursor-pointer
                inline-flex items-center gap-2
                "
                                >
                                    Get started free
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>

                                <span className="text-xs text-black/40 dark:text-white/40">
                                    No credit card required
                                </span>
                            </div>

                            {/* Features */}
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-8 text-sm text-black/55 dark:text-white/55">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
                                    Application tracking
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
                                    Interview management
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
                                    Offer tracking
                                </span>
                            </div>

                            {/* Trust */}
                            <div className="flex flex-wrap gap-3 mt-5 text-xs text-black/35 dark:text-white/35">
                                <span>Private by design</span>
                                <span>·</span>
                                <button
                                    type="button"
                                    onClick={() => onOpenLegal?.("security")}
                                    className="
                hover:text-[#6d28d9]
                dark:hover:text-[#a78bfa]
                transition-colors
                cursor-pointer
                "
                                >
                                    GDPR compliant
                                </button>
                            </div>
                        </div>

                        {/* RIGHT SIDE — DASHBOARD */}
                        <div className="relative">
                            {/* Thin purple accent */}
                            <div className="absolute -top-px left-8 right-8 h-px bg-[#7c3aed]" />

                            <div
                                className="
                rounded-2xl
                border border-black/10 dark:border-white/10
                bg-white dark:bg-[#111111]
                overflow-hidden
                shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]
                dark:shadow-none
            "
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.07] dark:border-white/[0.07]">
                                    <div>
                                        <h3 className="text-black dark:text-white font-semibold text-sm">
                                            Job pipeline
                                        </h3>
                                        <p className="text-[11px] text-black/40 dark:text-white/40 mt-0.5">
                                            Your applications at a glance
                                        </p>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-md bg-[#f3e8ff] dark:bg-[#6d28d9]/20 text-[#6d28d9] dark:text-[#c4b5fd] text-xs font-medium">
                                        48 active
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-b border-black/[0.07] dark:border-white/[0.07]">
                                    <div className="px-5 py-4 border-r border-black/[0.07] dark:border-white/[0.07]">
                                        <p className="text-black dark:text-white text-xl font-semibold">
                                            48
                                        </p>
                                        <p className="text-black/40 dark:text-white/40 text-xs mt-0.5">
                                            Applied
                                        </p>
                                    </div>
                                    <div className="px-5 py-4 sm:border-r border-black/[0.07] dark:border-white/[0.07]">
                                        <p className="text-black dark:text-white text-xl font-semibold">
                                            12
                                        </p>
                                        <p className="text-black/40 dark:text-white/40 text-xs mt-0.5">
                                            Interviews
                                        </p>
                                    </div>
                                    <div className="px-5 py-4 border-r border-black/[0.07] dark:border-white/[0.07]">
                                        <p className="text-black dark:text-white text-xl font-semibold">
                                            3
                                        </p>
                                        <p className="text-black/40 dark:text-white/40 text-xs mt-0.5">
                                            Offers
                                        </p>
                                    </div>
                                    <div className="px-5 py-4">
                                        <p className="text-[#6d28d9] dark:text-[#a78bfa] text-xl font-semibold">
                                            28%
                                        </p>
                                        <p className="text-black/40 dark:text-white/40 text-xs mt-0.5">
                                            Response
                                        </p>
                                    </div>
                                </div>

                                {/* Job List */}
                                <div className="p-4 space-y-2">
                                    {[
                                        {
                                            company: "Google",
                                            status: "Interview",
                                            color: "bg-blue-500",
                                        },
                                        {
                                            company: "Microsoft",
                                            status: "Applied",
                                            color: "bg-[#7c3aed]",
                                        },
                                        {
                                            company: "Amazon",
                                            status: "Review",
                                            color: "bg-amber-500",
                                        },
                                        {
                                            company: "Hubtel",
                                            status: "Offer",
                                            color: "bg-emerald-500",
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.company}
                                            className="
                    group
                    flex items-center justify-between
                    px-3.5 py-3
                    rounded-lg
                    border border-transparent
                    hover:border-[#ddd6fe]
                    dark:hover:border-[#6d28d9]/30
                    hover:bg-[#faf7ff]
                    dark:hover:bg-[#6d28d9]/[0.05]
                    transition-all
                    "
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${item.color}`}
                                                />
                                                <div>
                                                    <span className="text-black/85 dark:text-white/85 text-sm font-medium">
                                                        {item.company}
                                                    </span>
                                                    <p className="text-[10px] text-black/35 dark:text-white/35 mt-0.5">
                                                        Software Engineer
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`
                        text-xs
                        ${
                            item.status === "Interview"
                                ? "text-blue-600 dark:text-blue-400"
                                : item.status === "Offer"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : item.status === "Review"
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-[#6d28d9] dark:text-[#a78bfa]"
                        }
                    `}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Subtle floating status card */}
                            <div className="absolute -bottom-4 -right-3 hidden sm:flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#111111] border border-black/[0.08] dark:border-white/[0.08] rounded-lg shadow-lg">
                                <div className="w-6 h-6 rounded-md bg-[#f3e8ff] dark:bg-[#6d28d9]/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7c3aed]" />
                                </div>
                                <div>
                                    <p className="text-[9px] text-black/35 dark:text-white/35">
                                        Latest update
                                    </p>
                                    <p className="text-[10px] font-medium text-black/75 dark:text-white/75">
                                        Interview scheduled
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats strip ───────────────────────────────────────────────────────── */}
            <section
                className="border-b border-outline-variant/30 bg-surface-container-low"
                data-reveal
            >
                <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    {stats.map((s) => (
                        <div
                            key={s.value}
                            className="space-y-1 group hover:-translate-y-0.5 transition-transform"
                        >
                            <p className="text-3xl font-extrabold text-primary">
                                {s.value}
                            </p>
                            <p className="text-sm text-on-surface-variant">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
            {/* ── Features ──────────────────────────────────────────────────────────── */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-bold mb-4">
                            FEATURES
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-3">
                            Everything you need. Nothing you don't.
                        </h2>
                        <p className="text-on-surface-variant text-sm max-w-xl mx-auto">
                            iApply is purpose-built for the job hunt — no bloat,
                            no subscriptions, no distractions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map(
                            ({
                                icon: Icon,
                                title,
                                description,
                                iconBg,
                                iconColor,
                            }) => (
                                <div
                                    key={title}
                                    className="group rounded-3xl p-6 bg-surface-container-lowest border border-outline-variant/25 flex flex-col gap-4 shadow-xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200"
                                    data-reveal
                                >
                                    <div
                                        className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                                    >
                                        <Icon
                                            className={`w-5.5 h-5.5 ${iconColor}`}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base text-on-surface mb-1.5">
                                            {title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-on-surface-variant">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>
            {/* ── How it works ──────────────────────────────────────────────────────── */}
            <section
                className="py-20 px-6 bg-surface-container-low"
                data-reveal
            >
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold mb-4">
                            HOW IT WORKS
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-3">
                            Up and running in under two minutes
                        </h2>
                    </div>

                    <div className="relative flex flex-col md:flex-row gap-10 md:gap-8">
                        {/* Connector line on desktop */}
                        <div className="hidden md:block absolute top-8 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-0.5 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-30" />

                        {steps.map((step, i) => (
                            <div
                                key={step.number}
                                className="flex-1 flex flex-col items-center text-center gap-4 group"
                                data-reveal
                            >
                                {/* Number circle */}
                                <div
                                    className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform ${i === 0 ? "bg-primary text-on-primary" : i === 1 ? "bg-secondary text-white" : "bg-tertiary text-white"}`}
                                >
                                    {step.number}
                                </div>
                                <div>
                                    <h3 className="font-bold text-on-surface mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-on-surface-variant leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* ── CTA footer ────────────────────────────────────────────────────────── */}
            <section className="py-20 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-6 shadow-sm animate-float">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-3">
                        Ready to take control of your job search?
                    </h2>
                    <p className="text-on-surface-variant text-sm mb-8 max-w-md mx-auto">
                        Create a free account in seconds. No spam, no data
                        sharing, no nonsense.
                    </p>

                    <button
                        onClick={onOpenAuth}
                        className="group inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-on-primary font-bold rounded-2xl shadow-lg hover:bg-primary-hover hover:shadow-xl hover:scale-[1.03] active:scale-[0.99] transition-all cursor-pointer"
                    >
                        Create Your Free Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Trust badges */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-on-surface-variant">
                        {[
                            {
                                icon: Lock,
                                label: "Encrypted",
                                tab: "security",
                            },
                            {
                                icon: CheckCircle2,
                                label: "Email verified",
                                tab: "privacy",
                            },
                            {
                                icon: Zap,
                                label: "Instant setup",
                                tab: "terms",
                            },
                        ].map(({ icon: Icon, label, tab }) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => onOpenLegal?.(tab)}
                                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                            >
                                <Icon className="w-3.5 h-3.5 text-secondary" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
