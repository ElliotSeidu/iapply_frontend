import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const FormField = ({
    label,
    required,
    error,
    valid,
    icon,
    children,
    hint,
}) => {
    return (
        <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                {label} {required && <span className="text-error">*</span>}
            </label>
            <div className="relative">
                {icon && (
                    <div
                        className={`absolute left-3 top-2.5 pointer-events-none transition-colors ${error ? "text-error" : valid ? "text-secondary" : "text-outline"}`}
                    >
                        {icon}
                    </div>
                )}
                {children}
                {valid && !error && (
                    <CheckCircle2 className="w-4 h-4 absolute right-3 top-3 text-secondary pointer-events-none" />
                )}
                {error && (
                    <AlertCircle className="w-4 h-4 absolute right-3 top-3 text-error pointer-events-none" />
                )}
            </div>
            {error ? (
                <p className="mt-1 text-xs text-error flex items-center gap-1 animate-[fadeIn_0.15s_ease]">
                    {error}
                </p>
            ) : hint ? (
                <p className="mt-1 text-xs text-on-surface-variant/70">
                    {hint}
                </p>
            ) : null}
        </div>
    );
};

/**
 * Returns a consistent set of Tailwind classes for form inputs.
 *
 * @param hasError  - Whether the field has a validation error
 * @param hasIcon   - Whether a leading icon is present (adds left padding)
 * @param valid     - Whether the field is in a valid/confirmed state
 */

export const inputClass = (hasError, hasIcon = true, valid) =>
    `w-full ${hasIcon ? "pl-10" : "pl-3"} pr-9 py-2.5 text-sm bg-surface-container-low border rounded-xl focus:outline-none focus:ring-2 transition-all text-on-surface placeholder:text-outline/60 ${hasError ? "border-error/70 focus:ring-error/20 bg-error-container/10" : valid ? "border-secondary/60 focus:ring-secondary/20 bg-secondary-container/10" : "border-outline-variant hover:border-outline focus:ring-primary/20"}`;
