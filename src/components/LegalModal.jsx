import React, { useState } from "react";
import {
    X,
    ShieldCheck,
    Lock,
    FileText,
    Cookie,
    CheckCircle2,
} from "lucide-react";

export const LegalModal = ({ isOpen, onClose, initialTab = "privacy" }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 animate-fade-in">
            <div className="relative w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col animate-scale-in">
                {/* Header — consistent rich brand purple in both light and dark mode */}
                <div className="bg-gradient-to-r from-[#6d28d9] via-[#5b21b6] to-[#4c1d95] px-6 py-5 text-white relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                        aria-label="Close legal modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-6 h-6 text-[#c084fc]" />
                        <span className="font-display italic text-2xl font-bold text-white">
                            iApply
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white font-semibold">
                            Legal &amp; Trust Center
                        </span>
                    </div>
                    <p className="text-xs text-white/80">
                        Transparency and privacy: how we protect your career
                        data.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-outline-variant/30 bg-surface-container-low shrink-0 overflow-x-auto">
                    {[
                        {
                            id: "privacy",
                            label: "Privacy Policy",
                            icon: Lock,
                        },
                        {
                            id: "terms",
                            label: "Terms of Service",
                            icon: FileText,
                        },
                        {
                            id: "security",
                            label: "Security & Encryption",
                            icon: ShieldCheck,
                        },
                        {
                            id: "cookies",
                            label: "Cookie Notice",
                            icon: Cookie,
                        },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${activeTab === id ? "border-primary text-primary bg-surface-container-lowest font-bold" : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/60"}`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Scrollable Content */}
                <div className="p-6 md:p-8 overflow-y-auto flex-1 text-on-surface space-y-6 text-sm leading-relaxed">
                    {activeTab === "privacy" && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="border-b border-outline-variant/30 pb-3">
                                <h3 className="text-lg font-bold text-on-surface">
                                    iApply Privacy Policy
                                </h3>
                                <p className="text-xs text-on-surface-variant">
                                    Last updated: August 2026
                                </p>
                            </div>

                            <section className="space-y-2">
                                <h4 className="font-semibold text-primary">
                                    1. Our Core Privacy Commitment
                                </h4>
                                <p className="text-on-surface-variant text-xs md:text-sm">
                                    iApply was built specifically to keep job
                                    application data confidential. We do{" "}
                                    <strong>not</strong> sell, rent, monetize,
                                    or share your resume versions, notes,
                                    company targets, or salary notes with any
                                    third parties or prospective employers.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h4 className="font-semibold text-primary">
                                    2. Information We Collect
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-on-surface-variant">
                                    <li>
                                        <strong>Account Credentials:</strong>{" "}
                                        Email address, name, and securely
                                        salted/hashed passwords.
                                    </li>
                                    <li>
                                        <strong>Application Records:</strong>{" "}
                                        Company names, job titles, dates,
                                        application channels, and personal notes
                                        you choose to log.
                                    </li>
                                    <li>
                                        <strong>Reminders:</strong> Dates and
                                        reminder messages you configure to
                                        follow up on applications.
                                    </li>
                                </ul>
                            </section>

                            <section className="space-y-2">
                                <h4 className="font-semibold text-primary">
                                    3. Data Storage &amp; Encryption
                                </h4>
                                <p className="text-on-surface-variant text-xs md:text-sm">
                                    All communications between your browser and
                                    our application servers are encrypted using
                                    TLS 1.3/HTTPS. Passwords are never stored in
                                    plaintext; they are hashed with
                                    industry-standard cryptographic algorithms
                                    (PBKDF2/Argon2) before touching any
                                    database.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h4 className="font-semibold text-primary">
                                    4. Account Deletion &amp; Data Portability
                                </h4>
                                <p className="text-on-surface-variant text-xs md:text-sm">
                                    You have the right to permanently delete
                                    your account at any time via Settings. When
                                    deleted, all your applications, notes,
                                    reminders, and user records are permanently
                                    purged from the database immediately.
                                </p>
                            </section>
                        </div>
                    )}

                    {activeTab === "terms" && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="border-b border-outline-variant/30 pb-3">
                                <h3 className="text-lg font-bold text-on-surface">
                                    Terms of Service
                                </h3>
                                <p className="text-xs text-on-surface-variant">
                                    Last updated: August 2026
                                </p>
                            </div>

                            <section className="space-y-2">
                                <h4 className="font-semibold text-primary">
                                    1. Acceptance of Terms
                                </h4>
                                <p className="text-on-surface-variant text-xs md:text-sm">
                                    By accessing or creating an account on
                                    iApply, you agree to these Terms of Service.
                                    If you disagree with any portion of these
                                    terms, please do not use the application.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h4 className="font-semibold text-primary">
                                    2. User Accounts &amp; Security
                                </h4>
                                <p className="text-on-surface-variant text-xs md:text-sm">
                                    You are responsible for maintaining the
                                    confidentiality of your login credentials.
                                    You agree to notify us immediately if you
                                    suspect unauthorized access to your account.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h4 className="font-semibold text-primary">
                                    3. Acceptable Use
                                </h4>
                                <p className="text-on-surface-variant text-xs md:text-sm">
                                    You agree not to misuse the service, attempt
                                    unauthorized vulnerability scans, disrupt
                                    backend availability, or reverse engineer
                                    any proprietary mechanisms of the platform.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h4 className="font-semibold text-primary">
                                    4. Service Availability
                                </h4>
                                <p className="text-on-surface-variant text-xs md:text-sm">
                                    While we strive for 99.9% uptime and
                                    reliable data persistence, iApply is
                                    provided &quot;as is&quot; without
                                    warranties of any kind regarding
                                    uninterrupted operation.
                                </p>
                            </section>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="border-b border-outline-variant/30 pb-3">
                                <h3 className="text-lg font-bold text-on-surface">
                                    Security &amp; Encryption Standards
                                </h3>
                                <p className="text-xs text-on-surface-variant">
                                    Defense-in-depth architecture
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    {
                                        title: "Cryptographic OTP Generation",
                                        desc: "One-Time Passcodes are generated via cryptographically secure pseudo-random generators (secrets.randbelow).",
                                    },
                                    {
                                        title: "Brute-Force Protection",
                                        desc: "Verification codes are locked and deleted after 5 failed attempts; IP throttles safeguard authentication endpoints.",
                                    },
                                    {
                                        title: "In-Memory Access Tokens",
                                        desc: "Short-lived JWT access tokens reside in memory only and are never persisted to disk or localStorage.",
                                    },
                                    {
                                        title: "Content Security Policy (CSP)",
                                        desc: "Strict HTTP response policies prevent cross-site scripting (XSS), clickjacking, and malicious frame injection.",
                                    },
                                ].map(({ title, desc }) => (
                                    <div
                                        key={title}
                                        className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1"
                                    >
                                        <div className="flex items-center gap-1.5 font-bold text-xs text-secondary">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            {title}
                                        </div>
                                        <p className="text-xs text-on-surface-variant leading-relaxed">
                                            {desc}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <section className="space-y-2">
                                <h4 className="font-semibold text-primary">
                                    Responsible Vulnerability Disclosure
                                </h4>
                                <p className="text-on-surface-variant text-xs md:text-sm">
                                    If you discover a potential vulnerability,
                                    please reach out to our security team at{" "}
                                    <span className="font-mono text-primary">
                                        security@iapply.app
                                    </span>{" "}
                                    for prompt investigation and patching.
                                </p>
                            </section>
                        </div>
                    )}

                    {activeTab === "cookies" && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="border-b border-outline-variant/30 pb-3">
                                <h3 className="text-lg font-bold text-on-surface">
                                    Cookie &amp; Local Storage Policy
                                </h3>
                                <p className="text-xs text-on-surface-variant">
                                    Zero tracking, zero analytics trackers
                                </p>
                            </div>

                            <section className="space-y-2">
                                <h4 className="font-semibold text-primary">
                                    1. Minimal Storage Policy
                                </h4>
                                <p className="text-on-surface-variant text-xs md:text-sm">
                                    iApply does <strong>not</strong> use
                                    advertising cookies, marketing pixels, or
                                    third-party behavioral trackers.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h4 className="font-semibold text-primary">
                                    2. What We Store
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-on-surface-variant">
                                    <li>
                                        <strong>
                                            Theme Preference (localStorage):
                                        </strong>{" "}
                                        Remembers whether you selected Dark or
                                        Light mode.
                                    </li>
                                    <li>
                                        <strong>
                                            Session Storage (sessionStorage):
                                        </strong>{" "}
                                        Holds your refresh token during your
                                        active browser session; cleared
                                        immediately when you close the tab.
                                    </li>
                                </ul>
                            </section>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex justify-end shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 bg-primary text-on-primary font-semibold text-xs md:text-sm rounded-xl shadow-md hover:bg-primary-hover transition-all cursor-pointer"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};
