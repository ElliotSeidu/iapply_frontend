import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  valid?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required, error, valid, icon, children, hint }) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-2.5 text-outline pointer-events-none">{icon}</div>}
        {children}
        {valid && !error && (
          <CheckCircle2 className="w-5 h-5 absolute right-3 top-2.5 text-secondary pointer-events-none" />
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-error flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-on-surface-variant/70">{hint}</p>
      ) : null}
    </div>
  );
};

export const inputClass = (hasError?: boolean, hasIcon = true, valid?: boolean) =>
  `w-full ${hasIcon ? 'pl-10' : 'pl-3'} pr-10 py-2 text-sm bg-surface-container-low border rounded-xl focus:outline-none focus:ring-2 transition-all text-on-surface ${
    hasError
      ? 'border-error focus:ring-error/20'
      : valid
      ? 'border-secondary focus:ring-secondary/20'
      : 'border-outline-variant focus:ring-primary/20'
  }`;
