import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../context/DataContext';
import { STATUS_LABELS } from '../types/api';
import type { ApplicationStatus } from '../types/api';

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: '#6d28d9',
  oa: '#b45309',
  interview: '#2563eb',
  offer: '#0d9488',
  rejected: '#dc2626',
  withdrawn: '#79738f',
};

export const AnalyticsView: React.FC = () => {
  const { analytics, isLoading } = useData();

  const statusData = useMemo(() => {
    if (!analytics) return [];
    return Object.entries(analytics.status_breakdown).map(([status, count]) => ({
      name: STATUS_LABELS[status as ApplicationStatus],
      value: count as number,
      status: status as ApplicationStatus,
    }));
  }, [analytics]);

  if (isLoading && !analytics) {
    return <div className="p-10 text-center text-sm text-on-surface-variant">Loading analytics…</div>;
  }

  if (!analytics || analytics.total_applications === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-10 text-center shadow-xs">
        <p className="text-on-surface-variant text-sm">
          Add a few applications and this page will fill up with insights about your job search.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Applications" value={analytics.total_applications} />
        <MetricCard
          label="Avg. Days to First Response"
          value={analytics.avg_days_to_first_response !== null ? `${analytics.avg_days_to_first_response}d` : '—'}
        />
        <MetricCard label="Stale Applications" value={analytics.stale_count} accent="error" />
        <MetricCard
          label="Best Channel"
          value={analytics.channel_performance[0]?.label ?? '—'}
          small
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs">
          <h3 className="font-bold text-on-surface mb-4">Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {statusData.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {statusData.map((entry) => (
              <div key={entry.status} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.status] }} />
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs">
          <h3 className="font-bold text-on-surface mb-4">Response Rate by Channel</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.channel_performance} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--outline-variant)" />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Bar dataKey="response_rate" fill="#6d28d9" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs">
        <h3 className="font-bold text-on-surface mb-4">Channel Performance</h3>
        <div className="divide-y divide-outline-variant/20">
          {analytics.channel_performance.map((c) => (
            <div key={c.channel} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-on-surface font-medium">{c.label}</span>
              <span className="text-on-surface-variant">{c.total_applications} applications</span>
              <span className="font-bold text-primary">{c.response_rate}% response</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: number | string; accent?: 'primary' | 'error'; small?: boolean }> = ({
  label,
  value,
  accent = 'primary',
  small,
}) => (
  <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs">
    <p className={`${small ? 'text-base' : 'text-2xl'} font-bold ${accent === 'error' ? 'text-error' : 'text-on-surface'}`}>
      {value}
    </p>
    <p className="text-xs text-on-surface-variant mt-1">{label}</p>
  </div>
);
