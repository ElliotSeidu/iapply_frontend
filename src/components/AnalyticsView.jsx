import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { useData } from "../context/DataContext";
import { STATUS_LABELS } from "../types/api";
import { BarChart3, PieChart as PieIcon, TrendingUp } from "lucide-react";

const STATUS_COLORS = {
    applied: "#6d28d9",
    oa: "#b45309",
    interview: "#0d9488",
    offer: "#16a34a",
    rejected: "#dc2626",
    withdrawn: "#79738f",
};

export const AnalyticsView = () => {
    const { analytics, isLoading } = useData();
    const statusData = useMemo(() => {
        if (!analytics) return [];
        return Object.entries(analytics.status_breakdown).map(
            ([status, count]) => ({
                name: STATUS_LABELS[status],
                value: count,
                status: status,
            })
        );
    }, [analytics]);

    if (isLoading && !analytics) {
        return (
            <div className="p-16 text-center text-sm text-on-surface-variant animate-pulse-subtle">
                Loading analytics…
            </div>
        );
    }

    if (!analytics || analytics.total_applications === 0) {
        return (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center shadow-xs border border-outline-variant/20 space-y-3 animate-fade-in">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-bold text-on-surface">
                    No data to analyze yet
                </h3>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                    Add your job applications and move them through your
                    pipeline to reveal response rates, status breakdowns, and
                    channel insights.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 md:pb-6 animate-fade-in">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Total Applications"
                    value={analytics.total_applications}
                />
                <MetricCard
                    label="Avg. Days to 1st Response"
                    value={
                        analytics.avg_days_to_first_response !== null
                            ? `${analytics.avg_days_to_first_response}d`
                            : "—"
                    }
                />
                <MetricCard
                    label="Stale Applications"
                    value={analytics.stale_count}
                    accent="error"
                />
                <MetricCard
                    label="Top Converting Channel"
                    value={analytics.channel_performance[0]?.label ?? "—"}
                    small
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Status Breakdown Pie */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/20 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-4">
                        <PieIcon className="w-4 h-4 text-primary" />
                        <h3 className="font-bold text-sm sm:text-base text-on-surface">
                            Status Breakdown
                        </h3>
                    </div>

                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={3}
                            >
                                {statusData.map((entry) => (
                                    <Cell
                                        key={entry.status}
                                        fill={STATUS_COLORS[entry.status]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor:
                                        "var(--surface-container-high)",
                                    borderRadius: 12,
                                    border: "1px solid var(--outline-variant)",
                                    color: "var(--on-surface)",
                                    fontSize: 12,
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="flex flex-wrap gap-2.5 justify-center mt-3 pt-3 border-t border-outline-variant/15">
                        {statusData.map((entry) => (
                            <div
                                key={entry.status}
                                className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium"
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{
                                        backgroundColor:
                                            STATUS_COLORS[entry.status],
                                    }}
                                />
                                <span>
                                    {entry.name} ({entry.value})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Response Rate Bar Chart */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/20 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                        <h3 className="font-bold text-sm sm:text-base text-on-surface">
                            Response Rate by Channel
                        </h3>
                    </div>

                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart
                            data={analytics.channel_performance}
                            layout="vertical"
                            margin={{
                                left: 10,
                                right: 20,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                                stroke="var(--outline-variant)"
                                opacity={0.3}
                            />
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                tickFormatter={(v) => `${v}%`}
                                tick={{
                                    fontSize: 11,
                                    fill: "var(--on-surface-variant)",
                                }}
                            />
                            <YAxis
                                type="category"
                                dataKey="label"
                                width={100}
                                tick={{
                                    fontSize: 11,
                                    fill: "var(--on-surface-variant)",
                                }}
                            />
                            <Tooltip
                                formatter={(v) => [`${v}%`, "Response Rate"]}
                                contentStyle={{
                                    backgroundColor:
                                        "var(--surface-container-high)",
                                    borderRadius: 12,
                                    border: "1px solid var(--outline-variant)",
                                    color: "var(--on-surface)",
                                    fontSize: 12,
                                }}
                            />
                            <Bar
                                dataKey="response_rate"
                                fill="#6d28d9"
                                radius={[0, 6, 6, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>

                    <p className="text-[11px] text-on-surface-variant text-center mt-3 pt-3 border-t border-outline-variant/15">
                        Percentage of applications that progressed past the
                        initial applied status.
                    </p>
                </div>
            </div>

            {/* Channel Performance Table */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/20">
                <h3 className="font-bold text-sm sm:text-base text-on-surface mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> Channel
                    Insights &amp; Volume
                </h3>

                <div className="divide-y divide-outline-variant/15">
                    {analytics.channel_performance.map((c) => (
                        <div
                            key={c.channel}
                            className="flex items-center justify-between py-3 text-xs sm:text-sm"
                        >
                            <span className="text-on-surface font-semibold">
                                {c.label}
                            </span>
                            <span className="text-on-surface-variant font-medium">
                                {c.total_applications} logged
                            </span>
                            <span className="font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary-container">
                                {c.response_rate}% response rate
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ label, value, accent = "primary", small }) => (
    <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-xs border border-outline-variant/20 hover:shadow-md transition-shadow">
        <p
            className={`${small ? "text-sm sm:text-base" : "text-2xl sm:text-3xl"} font-extrabold tracking-tight truncate ${accent === "error" ? "text-error" : "text-on-surface"}`}
        >
            {value}
        </p>
        <p className="text-xs font-medium text-on-surface-variant mt-1 truncate">
            {label}
        </p>
    </div>
);
