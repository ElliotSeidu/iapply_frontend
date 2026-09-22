import React, { useMemo, useState } from "react";
import { Plus, Building2, Clock3, Kanban } from "lucide-react";
import { useData } from "../context/DataContext";
import { CHANNEL_LABELS, STATUS_LABELS, STATUS_ORDER } from "../types/api";

const COLUMN_STYLES = {
    applied: {
        border: "border-primary",
        badge: "bg-primary-container text-on-primary-container",
        accent: "from-primary/20 to-transparent",
    },
    oa: {
        border: "border-tertiary",
        badge: "bg-tertiary-container text-on-tertiary-container",
        accent: "from-tertiary/20 to-transparent",
    },
    interview: {
        border: "border-secondary",
        badge: "bg-secondary-container text-on-secondary-container",
        accent: "from-secondary/20 to-transparent",
    },
    offer: {
        border: "border-success",
        badge: "bg-success-container text-on-success-container",
        accent: "from-success/20 to-transparent",
    },
    rejected: {
        border: "border-error",
        badge: "bg-error-container text-on-error-container",
        accent: "from-error/20 to-transparent",
    },
    withdrawn: {
        border: "border-outline",
        badge: "bg-surface-container-high text-on-surface-variant",
        accent: "from-outline/20 to-transparent",
    },
};

export const BoardView = ({
    onSelectApplication,
    onOpenAddModal,
    searchQuery,
}) => {
    const { applications, changeStatus } = useData();
    const [draggingId, setDraggingId] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);

    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return applications;
        return applications.filter(
            (a) =>
                a.company_name.toLowerCase().includes(q) ||
                a.role_title.toLowerCase().includes(q) ||
                STATUS_LABELS[a.current_status].toLowerCase().includes(q)
        );
    }, [applications, searchQuery]);

    const grouped = useMemo(() => {
        const map = {
            applied: [],
            oa: [],
            interview: [],
            offer: [],
            rejected: [],
            withdrawn: [],
        };
        filtered.forEach((a) => map[a.current_status].push(a));
        return map;
    }, [filtered]);

    const handleDrop = async (status) => {
        setDragOverColumn(null);
        if (!draggingId) return;
        const app = applications.find((a) => a.id === draggingId);
        setDraggingId(null);
        if (!app || app.current_status === status) return;
        try {
            await changeStatus(app.id, status);
        } catch {
            // Handled via context
        }
    };
    
    return (
        <div className="space-y-4 pb-20 md:pb-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-outline-variant/20 animate-slide-up">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                        <Kanban className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-on-surface">
                            Application Kanban Board
                        </h2>
                        <p className="text-xs text-on-surface-variant">
                            Drag and drop any card between columns to seamlessly
                            log a status change
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => onOpenAddModal("applied")}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-on-primary text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Add Application
                </button>
            </div>

            {/* Columns Container */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                {STATUS_ORDER.map((status) => {
                    const style = COLUMN_STYLES[status];
                    const items = grouped[status];
                    const isOver = dragOverColumn === status;
                    return (
                        <div
                            key={status}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOverColumn(status);
                            }}
                            onDragLeave={() => setDragOverColumn(null)}
                            onDrop={() => handleDrop(status)}
                            className={`shrink-0 w-72 rounded-2xl border-t-4 ${style.border} p-3 flex flex-col transition-all duration-200 ${isOver ? "bg-surface-container shadow-md scale-[1.01]" : `bg-surface-container-low/70 border ${status === "rejected" ? "border-error/50" : "border-outline-variant/15"}`}`}
                        >
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h3 className="font-bold text-xs sm:text-sm text-on-surface flex items-center gap-1.5">
                                    {STATUS_LABELS[status]}
                                </h3>
                                <span
                                    className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${style.badge}`}
                                >
                                    {items.length}
                                </span>
                            </div>

                            <div className="flex-1 space-y-2.5 min-h-[90px]">
                                {items.map((app) => (
                                    <div
                                        key={app.id}
                                        draggable
                                        onDragStart={() =>
                                            setDraggingId(app.id)
                                        }
                                        onClick={() => onSelectApplication(app)}
                                        className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-outline-variant/20 cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                                    >
                                        <div className="flex items-start gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                <Building2 className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                                                    {app.role_title}
                                                </p>
                                                <p className="text-[11px] text-on-surface-variant truncate font-medium">
                                                    {app.company_name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/15 text-[11px] text-on-surface-variant">
                                            <span className="font-medium">
                                                {CHANNEL_LABELS[app.channel]}
                                            </span>
                                            {app.is_stale && (
                                                <span className="flex items-center gap-1 text-tertiary font-bold text-[10px] px-1.5 py-0.5 rounded bg-tertiary-container/30">
                                                    <Clock3 className="w-3 h-3" />{" "}
                                                    Stale
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {items.length === 0 && (
                                    <button
                                        type="button"
                                        onClick={() => onOpenAddModal(status)}
                                        className="w-full py-8 text-xs text-on-surface-variant/60 hover:text-primary hover:border-primary border border-dashed border-outline-variant/40 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1"
                                    >
                                        <Plus className="w-4 h-4 opacity-70" />
                                        <span>
                                            Add to {STATUS_LABELS[status]}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
