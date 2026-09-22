import React, { useMemo, useState } from "react";
import {
    X,
    Clock3,
    BellRing,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    Calendar,
    Check,
    AlertTriangle,
    Inbox,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.18 } },
};

const drawerVariants = {
    hidden: { x: "100%", opacity: 0.6 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 340, damping: 32 },
    },
    exit: {
        x: "100%",
        opacity: 0.4,
        transition: { duration: 0.22, ease: "easeIn" },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.04, duration: 0.2 },
    }),
};

export const NotificationDrawer = ({
    isOpen,
    onClose,
    onSelectApplication,
}) => {
    const { applications, reminders, editReminder } = useData();

    const [activeTab, setActiveTab] = useState("all");
    const [completingId, setCompletingId] = useState(null);

    // Get stale applications
    const staleApps = useMemo(
        () => applications.filter((a) => a.is_stale),
        [applications]
    );

    // Get active reminders (not done, within next 7 days)
    const activeReminders = useMemo(() => {
        const now = Date.now();
        return reminders
            .filter((r) => !r.is_done)
            .filter(
                (r) =>
                    new Date(r.remind_at).getTime() <=
                    now + 1000 * 60 * 60 * 24 * 7
            )
            .sort((a, b) => (a.remind_at < b.remind_at ? -1 : 1));
    }, [reminders]);

    const overdueCount = activeReminders.filter(
        (r) => new Date(r.remind_at).getTime() < Date.now()
    ).length;

    const dueSoonCount = activeReminders.filter((r) => {
        const time = new Date(r.remind_at).getTime();
        const now = Date.now();
        return time >= now && time <= now + 1000 * 60 * 60 * 24;
    }).length;

    const handleMarkDone = async (reminderId) => {
        setCompletingId(reminderId);
        try {
            await editReminder(reminderId, { is_done: true });
        } finally {
            setCompletingId(null);
        }
    };

    const handleMarkAllDone = async () => {
        const ids = activeReminders.map((r) => r.id);
        if (!ids.length) return;
        await Promise.all(ids.map((id) => editReminder(id, { is_done: true })));
    };

    const totalCount = staleApps.length + activeReminders.length;

    const filteredReminders = activeTab === "stale" ? [] : activeReminders;
    const filteredStale = activeTab === "reminders" ? [] : staleApps;

    const isDisplayEmpty =
        filteredReminders.length === 0 && filteredStale.length === 0;

    const allItems = [
        ...filteredReminders.map((r) => ({ type: "reminder", data: r })),
        ...filteredStale.map((a) => ({ type: "stale", data: a })),
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="notif-backdrop"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        key="notif-drawer"
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-surface z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-outline-variant">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <BellRing className="h-6 w-6 text-on-surface" />
                                    {totalCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-on-primary flex items-center justify-center"
                                        >
                                            {totalCount}
                                        </motion.span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-on-surface">
                                        Notifications
                                    </h2>
                                    <p className="text-xs text-on-surface-variant">
                                        Your latest follow-ups
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Quick Actions */}
                        {activeReminders.length > 0 && (
                            <div className="px-4 py-2 border-b border-outline-variant">
                                <button
                                    onClick={handleMarkAllDone}
                                    className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-on-primary px-3 py-1.5 rounded-lg hover:bg-primary-container transition-colors"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Mark all done
                                </button>
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="flex gap-1 px-4 py-3 border-b border-outline-variant bg-surface-container-low">
                            {[
                                { id: "all", label: "All", count: totalCount, icon: Inbox },
                                { id: "reminders", label: "Reminders", count: activeReminders.length, icon: BellRing },
                                { id: "stale", label: "Stale", count: staleApps.length, icon: AlertTriangle },
                            ].map(({ id, label, count, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                                        activeTab === id
                                            ? "bg-primary text-on-primary shadow-sm"
                                            : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                                    }`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    {label}
                                    {count > 0 && (
                                        <span
                                            className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                                                activeTab === id
                                                    ? "bg-white/20 text-white"
                                                    : "bg-surface-container-high text-on-surface-variant"
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Notification List */}
                        <div className="flex-1 overflow-y-auto p-2">
                            <AnimatePresence mode="wait">
                                {isDisplayEmpty ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center h-full text-center p-8"
                                    >
                                        <div className="h-16 w-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
                                            <CheckCircle2 className="h-8 w-8 text-on-surface-variant" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-on-surface mb-1">
                                            You're all caught up
                                        </h3>
                                        <p className="text-xs text-on-surface-variant max-w-[200px]">
                                            No active follow-ups or stale applications.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-1"
                                    >
                                        {allItems.map(({ type, data }, i) =>
                                            type === "reminder" ? (
                                                <ReminderItem
                                                    key={data.id}
                                                    reminder={data}
                                                    index={i}
                                                    app={applications.find((a) => a.id === data.application)}
                                                    completingId={completingId}
                                                    onMarkDone={handleMarkDone}
                                                    onSelectApplication={onSelectApplication}
                                                />
                                            ) : (
                                                <StaleItem
                                                    key={data.id}
                                                    app={data}
                                                    index={i}
                                                    onSelectApplication={onSelectApplication}
                                                />
                                            )
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        {totalCount > 0 && (
                            <div className="p-3 border-t border-outline-variant bg-surface-container-low">
                                <p className="text-xs text-center text-on-surface-variant">
                                    Select a notification to view its application.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

function ReminderItem({ reminder: r, index, app, completingId, onMarkDone, onSelectApplication }) {
    const dueAt = new Date(r.remind_at).getTime();
    const overdue = dueAt < Date.now();
    const isCompleting = completingId === r.id;

    return (
        <motion.div
            custom={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="group flex gap-3 p-3 rounded-lg hover:bg-surface-container-high transition-colors border border-transparent hover:border-outline-variant"
        >
            <button
                onClick={() => onMarkDone(r.id)}
                disabled={isCompleting}
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isCompleting
                        ? "border-secondary bg-secondary text-white"
                        : "border-outline text-transparent hover:border-secondary hover:text-secondary"
                }`}
                title="Mark as done"
            >
                <Check className="h-4 w-4" />
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            overdue
                                ? "bg-error-container text-on-error-container"
                                : "bg-tertiary-container text-on-tertiary-container"
                        }`}
                    >
                        <Clock3 className="h-3 w-3" />
                        {overdue ? "Overdue" : "Follow-up"}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                        {new Date(r.remind_at).toLocaleDateString()}
                    </span>
                </div>

                <p className="text-sm font-medium text-on-surface line-clamp-2">
                    {r.message}
                </p>

                {app && (
                    <button
                        onClick={() => onSelectApplication(app)}
                        className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-on-primary transition-colors"
                    >
                        <ArrowUpRight className="h-3 w-3" />
                        <span className="truncate">
                            {app.role_title} @ {app.company_name}
                        </span>
                    </button>
                )}
            </div>
        </motion.div>
    );
}

function StaleItem({ app, index, onSelectApplication }) {
    return (
        <motion.button
            custom={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            onClick={() => onSelectApplication(app)}
            className="group flex w-full gap-3 p-3 rounded-lg hover:bg-surface-container-high transition-colors border border-transparent hover:border-outline-variant text-left"
        >
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-error-container">
                <AlertTriangle className="h-4 w-4 text-on-error-container" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold bg-error-container text-on-error-container">
                        <Calendar className="h-3 w-3" />
                        Stale application
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                        {app.days_since_applied}d ago
                    </span>
                </div>

                <p className="text-sm font-semibold text-on-surface truncate">
                    {app.company_name} — {app.role_title}
                </p>

                <p className="mt-1 text-xs text-on-surface-variant">
                    No status movement in {app.days_since_applied} days.
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-secondary">
                    <ArrowUpRight className="h-3 w-3" />
                    View application
                </div>
            </div>
        </motion.button>
    );
}
