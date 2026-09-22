import React from "react";
import { ShieldCheck, Heart, Lock, FileText, Cookie } from "lucide-react";

export const Footer = ({ onOpenLegal }) => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="w-full border-t border-outline-variant/30 bg-surface-container-lowest transition-colors mt-auto">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand & Tagline */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-display italic text-lg font-bold text-primary">
                                iApply
                            </span>
                        </div>
                        <span className="hidden sm:inline text-outline-variant">
                            •
                        </span>
                        <p className="text-xs text-on-surface-variant">
                            Your private career pipeline &amp; job application
                            tracker.
                        </p>
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs font-medium text-on-surface-variant">
                        <button
                            type="button"
                            onClick={() => onOpenLegal("privacy")}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
                        >
                            <Lock className="w-3.5 h-3.5" />
                            Privacy Policy
                        </button>
                        <button
                            type="button"
                            onClick={() => onOpenLegal("terms")}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            Terms of Service
                        </button>
                        <button
                            type="button"
                            onClick={() => onOpenLegal("security")}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
                        >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Security
                        </button>
                        <button
                            type="button"
                            onClick={() => onOpenLegal("cookies")}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
                        >
                            <Cookie className="w-3.5 h-3.5" />
                            Cookie Notice
                        </button>
                    </div>

                    {/* Copyright */}
                    <div className="text-xs text-on-surface-variant/70 flex items-center gap-1">
                        <span>
                            &copy; {currentYear} 
                        </span>
                        <span>
                            iApply.
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
