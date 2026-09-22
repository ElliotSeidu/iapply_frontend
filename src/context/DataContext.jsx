import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    createApplication,
    createReminder,
    deleteApplication as apiDeleteApplication,
    deleteReminder as apiDeleteReminder,
    fetchAnalytics,
    getErrorMessage,
    listApplications,
    listReminders,
    logStatusChange,
    updateApplication as apiUpdateApplication,
    updateReminder as apiUpdateReminder,
} from "../lib/api";
import { useAuth } from "./AuthContext";
const DataContext = createContext(undefined);
export function DataProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [applications, setApplications] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const analyticsTimerRef = useRef(null);

    // Debounced analytics sync to avoid hammering the backend while maintaining responsive UI
    const debouncedSyncAnalytics = useCallback(() => {
        if (analyticsTimerRef.current) {
            window.clearTimeout(analyticsTimerRef.current);
        }
        analyticsTimerRef.current = window.setTimeout(() => {
            fetchAnalytics()
                .then(setAnalytics)
                .catch(() => {});
        }, 400);
    }, []);
    const refresh = useCallback(async () => {
        if (!isAuthenticated) return;
        setIsLoading(true);
        setError(null);
        try {
            const [apps, rems, stats] = await Promise.all([
                listApplications(),
                listReminders(),
                fetchAnalytics(),
            ]);
            setApplications(apps);
            setReminders(rems);
            setAnalytics(stats);
        } catch (err) {
            setError(
                getErrorMessage(
                    err,
                    "Could not load your data. Please refresh the page."
                )
            );
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);
    useEffect(() => {
        if (isAuthenticated) {
            refresh();
        } else {
            setApplications([]);
            setReminders([]);
            setAnalytics(null);
        }
        return () => {
            if (analyticsTimerRef.current) {
                window.clearTimeout(analyticsTimerRef.current);
            }
        };
    }, [isAuthenticated, refresh]);
    const addApplication = useCallback(
        async (payload) => {
            const created = await createApplication(payload);
            setApplications((prev) => [created, ...prev]);
            debouncedSyncAnalytics();
            return created;
        },
        [debouncedSyncAnalytics]
    );
    const editApplication = useCallback(
        async (id, payload) => {
            const updated = await apiUpdateApplication(id, payload);
            setApplications((prev) =>
                prev.map((a) => (a.id === id ? updated : a))
            );
            debouncedSyncAnalytics();
            return updated;
        },
        [debouncedSyncAnalytics]
    );
    const removeApplication = useCallback(
        async (id) => {
            await apiDeleteApplication(id);
            setApplications((prev) => prev.filter((a) => a.id !== id));
            setReminders((prev) => prev.filter((r) => r.application !== id));
            debouncedSyncAnalytics();
        },
        [debouncedSyncAnalytics]
    );
    const changeStatus = useCallback(
        async (id, status, notes = "") => {
            const updated = await logStatusChange(id, status, notes);
            setApplications((prev) =>
                prev.map((a) => (a.id === id ? updated : a))
            );
            debouncedSyncAnalytics();
            return updated;
        },
        [debouncedSyncAnalytics]
    );
    const addReminder = useCallback(async (payload) => {
        const created = await createReminder(payload);
        setReminders((prev) => [created, ...prev]);
        setApplications((prev) =>
            prev.map((a) =>
                a.id === created.application
                    ? {
                          ...a,
                          reminders: [...a.reminders, created],
                      }
                    : a
            )
        );
        return created;
    }, []);
    const editReminder = useCallback(async (id, payload) => {
        const updated = await apiUpdateReminder(id, payload);
        setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)));
        setApplications((prev) =>
            prev.map((a) => ({
                ...a,
                reminders: a.reminders.map((r) => (r.id === id ? updated : r)),
            }))
        );
        return updated;
    }, []);
    const removeReminder = useCallback(async (id) => {
        await apiDeleteReminder(id);
        setReminders((prev) => prev.filter((r) => r.id !== id));
        setApplications((prev) =>
            prev.map((a) => ({
                ...a,
                reminders: a.reminders.filter((r) => r.id !== id),
            }))
        );
    }, []);
    const value = {
        applications,
        reminders,
        analytics,
        isLoading,
        error,
        refresh,
        addApplication,
        editApplication,
        removeApplication,
        changeStatus,
        addReminder,
        editReminder,
        removeReminder,
    };
    return (
        <DataContext.Provider value={value}>{children}</DataContext.Provider>
    );
}
export function useData() {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error("useData must be used within DataProvider");
    return ctx;
}
