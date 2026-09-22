import React, { useMemo, useState } from "react";
import {
    Plus,
    Search,
    Trash2,
    Building2,
    Clock3,
    ChevronRight,
    Briefcase,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { CHANNEL_LABELS, STATUS_LABELS, STATUS_ORDER } from "../types/api";

const STATUS_BADGE = {
    applied: "bg-primary-container text-on-primary-container",
    oa: "bg-tertiary-container text-on-tertiary-container",
    interview: "bg-secondary-container text-on-secondary-container",
    offer: "bg-success-container text-on-success-container",
    rejected: "bg-error-container text-on-error-container",
    withdrawn: "bg-surface-container-high text-on-surface-variant",
};

export const ApplicationsView = ({
    onSelectApplication,
    onOpenAddModal,
    searchQuery,
    setSearchQuery,
}) => {
    const { applications, removeApplication } = useData();
    const [statusFilter, setStatusFilter] = useState("all");
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return applications.filter((a) => {
            const matchesSearch =
                !q ||
                a.company_name.toLowerCase().includes(q) ||
                a.role_title.toLowerCase().includes(q);
            const matchesStatus =
                statusFilter === "all" || a.current_status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [applications, searchQuery, statusFilter]);

    const handleDelete = async (id) => {
        if (pendingDeleteId !== id) {
            setPendingDeleteId(id);
            return;
        }
        try {
            await removeApplication(id);
        } finally {
            setPendingDeleteId(null);
        }
    };

    return (
        <div className="space-y-4 pb-20 md:pb-6 animate-fade-in">
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/20 animate-slide-up">
                <div>
                    <h2 className="text-xl font-bold text-on-surface">
                        All Applications
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                        {filtered.length} of {applications.length} applications
                        shown
                    </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-outline" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search company or role…"
                            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface transition-all"
                        />
                    </div>

                    <button
                        onClick={onOpenAddModal}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />{" "}
                        <span className="hidden sm:inline">Add</span>
                    </button>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-1.5 flex-wrap">
                <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${statusFilter === "all" ? "bg-primary text-on-primary border-primary shadow-xs" : "bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container"}`}
                >
                    All ({applications.length})
                </button>
                {STATUS_ORDER.map((s) => {
                    const count = applications.filter(
                        (a) => a.current_status === s
                    ).length;
                    
                    return (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${statusFilter === s ? "bg-primary text-on-primary border-primary shadow-xs" : "bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container"}`}
                        >
                            {STATUS_LABELS[s]} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Applications List */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant/20 overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-surface-container text-on-surface-variant flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-outline" />
                        </div>
                        <p className="text-sm font-semibold text-on-surface">
                            No applications match your search
                        </p>
                        <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                            Try adjusting your search query or status filter to
                            see other opportunities.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-outline-variant/20">
                        {filtered.map((app) => (
                            <div
                                key={app.id}
                                className="flex items-center gap-3.5 p-4 sm:p-5 hover:bg-surface-container-low transition-all cursor-pointer group"
                                onClick={() => onSelectApplication(app)}
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                    <Building2 className="w-5 h-5 text-primary" />
                                </div>

                                <div className="min-w-0 flex-1 space-y-0.5">
                                    <p className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                                        {app.role_title}
                                    </p>
                                    <p className="text-xs text-on-surface-variant truncate font-medium">
                                        {app.company_name} ·{" "}
                                        {CHANNEL_LABELS[app.channel]}
                                    </p>
                                </div>

                                <div className="hidden sm:flex items-center gap-2 text-xs text-on-surface-variant shrink-0 font-medium">
                                    {app.is_stale && (
                                        <span className="flex items-center gap-1 text-tertiary font-bold px-2 py-0.5 rounded bg-tertiary-container/30">
                                            <Clock3 className="w-3.5 h-3.5" />{" "}
                                            {app.days_since_applied}d stale
                                        </span>
                                    )}
                                    <span className="text-on-surface-variant">
                                        {new Date(
                                            app.date_applied
                                        ).toLocaleDateString()}
                                    </span>
                                </div>

                                <span
                                    className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${STATUS_BADGE[app.current_status]}`}
                                >
                                    {STATUS_LABELS[app.current_status]}
                                </span>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(app.id);
                                    }}
                                    className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${pendingDeleteId === app.id ? "bg-error text-white shadow-sm" : "text-outline hover:text-error hover:bg-error-container/30"}`}
                                    title={
                                        pendingDeleteId === app.id
                                            ? "Click again to confirm delete"
                                            : "Delete"
                                    }
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <ChevronRight className="w-4 h-4 text-outline hidden md:block group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
