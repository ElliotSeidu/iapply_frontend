import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
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
} from '../lib/api';
import { useAuth } from './AuthContext';
import type {
  AnalyticsData,
  Application,
  ApplicationInput,
  ApplicationStatus,
  Reminder,
  ReminderInput,
} from '../types/api';

interface DataContextValue {
  applications: Application[];
  reminders: Reminder[];
  analytics: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addApplication: (payload: ApplicationInput) => Promise<Application>;
  editApplication: (id: string, payload: Partial<ApplicationInput>) => Promise<Application>;
  removeApplication: (id: string) => Promise<void>;
  changeStatus: (id: string, status: ApplicationStatus, notes?: string) => Promise<Application>;
  addReminder: (payload: ReminderInput) => Promise<Reminder>;
  editReminder: (id: string, payload: Partial<ReminderInput>) => Promise<Reminder>;
  removeReminder: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(getErrorMessage(err, 'Could not load your data. Please refresh the page.'));
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
  }, [isAuthenticated, refresh]);

  const addApplication = useCallback(async (payload: ApplicationInput) => {
    const created = await createApplication(payload);
    setApplications((prev) => [created, ...prev]);
    fetchAnalytics().then(setAnalytics).catch(() => {});
    return created;
  }, []);

  const editApplication = useCallback(async (id: string, payload: Partial<ApplicationInput>) => {
    const updated = await apiUpdateApplication(id, payload);
    setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  }, []);

  const removeApplication = useCallback(async (id: string) => {
    await apiDeleteApplication(id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setReminders((prev) => prev.filter((r) => r.application !== id));
    fetchAnalytics().then(setAnalytics).catch(() => {});
  }, []);

  const changeStatus = useCallback(async (id: string, status: ApplicationStatus, notes = '') => {
    const updated = await logStatusChange(id, status, notes);
    setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
    fetchAnalytics().then(setAnalytics).catch(() => {});
    return updated;
  }, []);

  const addReminder = useCallback(async (payload: ReminderInput) => {
    const created = await createReminder(payload);
    setReminders((prev) => [created, ...prev]);
    setApplications((prev) =>
      prev.map((a) => (a.id === created.application ? { ...a, reminders: [...a.reminders, created] } : a))
    );
    return created;
  }, []);

  const editReminder = useCallback(async (id: string, payload: Partial<ReminderInput>) => {
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

  const removeReminder = useCallback(async (id: string) => {
    await apiDeleteReminder(id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
    setApplications((prev) => prev.map((a) => ({ ...a, reminders: a.reminders.filter((r) => r.id !== id) })));
  }, []);

  const value: DataContextValue = {
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

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
