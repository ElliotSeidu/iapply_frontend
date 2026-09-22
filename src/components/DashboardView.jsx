import React, { useMemo } from "react";
import {
    Briefcase,
    TrendingUp,
    Clock3,
    Award,
    Plus,
    Building2,
    ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { CHANNEL_LABELS, STATUS_LABELS } from "../types/api";
export const DashboardView = ({
    onSelectApplication,
    onOpenAddModal,
    onNavigateTab,
    searchQuery,
}) => {
    const { user } = useAuth();
    const { applications, analytics, isLoading } = useData();
    const recent = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        const pool = q
            ? applications.filter(
                  (a) =>
                      a.company_name.toLowerCase().includes(q) ||
                      a.role_title.toLowerCase().includes(q)
              )
            : applications;
        return [...pool]
            .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
            .slice(0, 6);
    }, [applications, searchQuery]);
    const activeCount = applications.filter((a) =>
        ["applied", "oa", "interview"].includes(a.current_status)
    ).length;
    const offerCount = applications.filter(
        (a) => a.current_status === "offer"
    ).length;
    return (
        <div className="space-y-6 pb-20 md:pb-6 animate-fade-in">
            {/* Hero Welcome Banner — Rich deep purple gradient */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#6d28d9] via-[#5b21b6] to-[#4c1d95] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl animate-slide-up">
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#c084fc]/20 blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Welcome back
                        {user?.first_name ? `, ${user.first_name}` : ""}
                    </h1>
                    <p className="text-xs sm:text-sm text-white/80">
                        {analytics?.total_applications ?? 0} total applications
                        · {activeCount} active in your pipeline
                    </p>
                </div>

                <button
                    onClick={onOpenAddModal}
                    className="relative z-10 flex items-center gap-1.5 px-5 py-3 bg-white text-[#4c1d95] text-xs sm:text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Add Application
                </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<Briefcase className="w-5 h-5" />}
                    label="Total Applications"
                    value={analytics?.total_applications ?? 0}
                    accent="primary"
                />
                <StatCard
                    icon={<TrendingUp className="w-5 h-5" />}
                    label="Active Pipeline"
                    value={activeCount}
                    accent="secondary"
                />
                <StatCard
                    icon={<Award className="w-5 h-5" />}
                    label="Offers"
                    value={offerCount}
                    accent="tertiary"
                />
                <StatCard
                    icon={<Clock3 className="w-5 h-5" />}
                    label="Stale (21+ days)"
                    value={analytics?.stale_count ?? 0}
                    accent="error"
                    onClick={() => onNavigateTab("applications")}
                />
            </div>

            {/* Recent Activity Card */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant/20 overflow-hidden animate-slide-up">
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-outline-variant/20">
                    <h3 className="font-bold text-sm sm:text-base text-on-surface">
                        Recent Activity
                    </h3>
                    <button
                        onClick={() => onNavigateTab("applications")}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                        <span>View all</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {isLoading && applications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-on-surface-variant animate-pulse-subtle">
                        Loading your applications…
                    </div>
                ) : recent.length === 0 ? (
                    <div className="p-10 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-sm font-semibold text-on-surface">
                            No applications yet
                        </p>
                        <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                            Add your first job opportunity to start tracking
                            status, notes, and deadlines.
                        </p>
                        <button
                            onClick={onOpenAddModal}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl shadow-xs hover:bg-primary-hover transition-all cursor-pointer mt-2"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add Job
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-outline-variant/20">
                        {recent.map((app) => (
                            <div
                                key={app.id}
                                onClick={() => onSelectApplication(app)}
                                className="flex items-center gap-3 p-4 hover:bg-surface-container-low transition-all cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                    <Building2 className="w-4.5 h-4.5 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                                        {app.role_title}
                                    </p>
                                    <p className="text-xs text-on-surface-variant truncate">
                                        {app.company_name} ·{" "}
                                        {CHANNEL_LABELS[app.channel]}
                                    </p>
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant shrink-0">
                                    {STATUS_LABELS[app.current_status]}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
const StatCard = ({ icon, label, value, accent = "primary", onClick }) => {
    const colors = {
        primary: "bg-primary-container text-on-primary-container",
        secondary: "bg-secondary-container text-on-secondary-container",
        tertiary: "bg-tertiary-container text-on-tertiary-container",
        error: "bg-error-container text-on-error-container",
    };
    return (
        <button
            onClick={onClick}
            className={`bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-xs border border-outline-variant/20 text-left transition-all duration-200 group ${onClick ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : "cursor-default"}`}
            disabled={!onClick}
        >
            <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105 ${colors[accent]}`}
            >
                {icon}
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                {value}
            </p>
            <p className="text-xs font-medium text-on-surface-variant mt-0.5">
                {label}
            </p>
        </button>
    );
};
