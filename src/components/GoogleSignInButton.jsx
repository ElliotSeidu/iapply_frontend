import React, { useEffect, useRef, useState } from "react";

const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const GOOGLE_CLIENT_ID = (import.meta.env?.VITE_GOOGLE_CLIENT_ID || "").trim();

export const isGoogleSignInEnabled = Boolean(GOOGLE_CLIENT_ID);

let gsiLoadPromise = null;

function loadGoogleIdentityScript() {
    if (typeof window === "undefined") {
        return Promise.reject(new Error("Window unavailable"));
    }
    if (window.google?.accounts?.id) {
        return Promise.resolve();
    }
    if (gsiLoadPromise) {
        return gsiLoadPromise;
    }

    gsiLoadPromise = new Promise((resolve, reject) => {
        let timeoutId = null;
        const cleanup = () => {
            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
            }
        };

        const onReady = () => {
            cleanup();
            if (window.google?.accounts?.id) {
                resolve();
            } else {
                gsiLoadPromise = null;
                reject(new Error("Google Identity Services did not initialize"));
            }
        };

        const onFail = () => {
            cleanup();
            gsiLoadPromise = null;
            reject(new Error("Failed to load Google Identity Services"));
        };

        timeoutId = window.setTimeout(onFail, 10000);

        const existing = document.querySelector(`script[src="${GIS_SCRIPT_SRC}"]`);
        if (existing) {
            existing.addEventListener("load", onReady, { once: true });
            existing.addEventListener("error", onFail, { once: true });
            return;
        }

        const script = document.createElement("script");
        script.src = GIS_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.addEventListener("load", onReady, { once: true });
        script.addEventListener("error", onFail, { once: true });
        document.head.appendChild(script);
    });

    return gsiLoadPromise;
}

export const GoogleSignInButton = ({
    mode = "login",
    disabled = false,
    onCredential,
    onError,
}) => {
    const containerRef = useRef(null);
    const onCredentialRef = useRef(onCredential);
    const onErrorRef = useRef(onError);
    onCredentialRef.current = onCredential;
    onErrorRef.current = onError;

    const [status, setStatus] = useState(
        isGoogleSignInEnabled ? "loading" : "disabled"
    );
    const [isDark, setIsDark] = useState(() =>
        typeof document !== "undefined"
            ? document.documentElement.classList.contains("dark")
            : false
    );

    useEffect(() => {
        if (typeof document === "undefined") return undefined;
        const root = document.documentElement;
        const observer = new MutationObserver(() => {
            setIsDark(root.classList.contains("dark"));
        });
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) return undefined;

        let cancelled = false;
        setStatus("loading");

        loadGoogleIdentityScript()
            .then(() => {
                if (cancelled || !containerRef.current || !window.google?.accounts?.id) {
                    return;
                }

                const container = containerRef.current;
                container.replaceChildren();
                const width = Math.max(
                    220,
                    Math.min(400, container.parentElement?.clientWidth || 320)
                );

                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                    callback: (response) => {
                        const credential = response?.credential;
                        if (typeof credential === "string" && credential.length > 0) {
                            onCredentialRef.current?.(credential);
                        } else {
                            onErrorRef.current?.(
                                "Could not sign in with Google. Please try again."
                            );
                        }
                    },
                });

                window.google.accounts.id.renderButton(container, {
                    type: "standard",
                    theme: isDark ? "filled_black" : "outline",
                    size: "large",
                    text: mode === "register" ? "signup_with" : "continue_with",
                    shape: "rectangular",
                    width,
                });

                setStatus("ready");
            })
            .catch(() => {
                if (!cancelled) {
                    setStatus("error");
                }
            });

        return () => {
            cancelled = true;
        };
    }, [mode, isDark]);

    if (!GOOGLE_CLIENT_ID) return null;

    if (status === "error") {
        return (
            <p className="text-center text-xs text-on-surface-variant py-2">
                Google sign-in is unavailable right now. Use your email and
                password instead.
            </p>
        );
    }

    return (
        <div
            className={`relative w-full flex flex-col items-center ${disabled ? "pointer-events-none opacity-60" : ""}`}
        >
            {status === "loading" && (
                <div
                    className="w-full max-w-[400px] h-10 rounded-lg bg-surface-container animate-pulse"
                    aria-hidden="true"
                />
            )}
            <div
                ref={containerRef}
                className={`w-full flex justify-center ${status === "loading" ? "hidden" : ""}`}
            />
        </div>
    );
};
