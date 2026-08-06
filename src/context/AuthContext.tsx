import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
    fetchMe,
    getErrorMessage,
    loginRequest,
    logoutRequest,
    registerRequest,
} from "../lib/api";
import {
    clearTokens,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
} from "../lib/tokenStore";
import type { User } from "../types/api";

interface JwtPayload {
    exp: number;
}

interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (payload: {
        email: string;
        first_name: string;
        last_name: string;
        password: string;
        password2: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isTokenValid(token: string): boolean {
    try {
        const { exp } = jwtDecode<JwtPayload>(token);
        return exp * 1000 > Date.now() + 5000; // 5s clock-skew buffer
    } catch {
        return false;
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const bootRan = useRef(false);

    const logout = useCallback(async () => {
        const refresh = getRefreshToken();
        clearTokens();
        setUser(null);
        if (refresh) {
            try {
                // Best-effort: blacklist the refresh token server-side so a copy that may
                // have leaked (e.g. via a browser history tool or shared machine) is dead too.
                await logoutRequest(refresh);
            } catch {
                // Token may already be expired/blacklisted — logging out client-side still
                // succeeds regardless.
            }
        }
    }, []);

    const refreshUser = useCallback(async () => {
        const me = await fetchMe();
        setUser(me);
    }, []);

    // On boot: if we have a (still valid) refresh token in sessionStorage, silently
    // exchange it for a fresh access token and hydrate the user. No tokens are ever
    // written to localStorage, so there is nothing else to inspect here.
    useEffect(() => {
        if (bootRan.current) return;
        bootRan.current = true;

        (async () => {
            const refresh = getRefreshToken();
            if (!refresh || !isTokenValid(refresh)) {
                clearTokens();
                setIsInitializing(false);
                return;
            }
            try {
                const { data } = await axios.post(
                    `${(import.meta as any).env?.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/account/login/refresh/`,
                    { refresh }
                );
                setAccessToken(data.access);
                if (data.refresh) setRefreshToken(data.refresh);
                await refreshUser();
            } catch {
                clearTokens();
            } finally {
                setIsInitializing(false);
            }
        })();
    }, [refreshUser]);

    // If any API call determines the session is unrecoverable (refresh failed), drop
    // back to a logged-out state everywhere in the app.
    useEffect(() => {
        const handler = () => {
            clearTokens();
            setUser(null);
        };
        window.addEventListener("iapply:session-expired", handler);
        return () =>
            window.removeEventListener("iapply:session-expired", handler);
    }, []);

    const login = useCallback(
        async (email: string, password: string) => {
            const data = await loginRequest(email, password);
            setAccessToken(data.access);
            setRefreshToken(data.refresh);
            await refreshUser();
        },
        [refreshUser]
    );

    const register = useCallback(
        async (payload: {
            email: string;
            first_name: string;
            last_name: string;
            password: string;
            password2: string;
        }) => {
            // Trigger verification email/code send. Actual account is created on verification.
            await registerRequest(payload);
        },
        [login]
    );

    const value: AuthContextValue = {
        user,
        isAuthenticated: !!user,
        isInitializing,
        login,
        register,
        logout,
        refreshUser,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

export { getErrorMessage };
