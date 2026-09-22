import React from "react";
import { LogOut, X, AlertTriangle, Loader2 } from "lucide-react";

export const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    if (!isOpen) return null;
    const handleConfirm = async () => {
        setIsLoggingOut(true);
        try {
            await onConfirm();
        } finally {
            setIsLoggingOut(false);
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 animate-fade-in">
            <div className="relative w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col animate-scale-in">
                {/* Header */}
                <div className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-error-container text-on-error-container flex items-center justify-center shadow-xs">
                        <LogOut className="w-6 h-6 text-error" />
                    </div>

                    <h3 className="text-lg font-bold text-on-surface">
                        Sign out of iApply?
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                        Are you sure you want to end your current session? You
                        will need your email and password to sign back in.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoggingOut}
                        className="flex-1 py-2.5 px-4 text-xs font-semibold text-on-surface-variant hover:text-on-surface bg-surface-container-lowest border border-outline-variant/40 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoggingOut}
                        className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-error hover:bg-error-hover rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                        {isLoggingOut ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <LogOut className="w-4 h-4" />
                        )}
                        {isLoggingOut ? "Signing out…" : "Sign Out"}
                    </button>
                </div>
            </div>
        </div>
    );
};
