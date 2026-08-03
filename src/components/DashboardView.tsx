import React, { useMemo } from 'react';
import { Briefcase, TrendingUp, Clock3, Award, Plus, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CHANNEL_LABELS, STATUS_LABELS } from '../types/api';
import type { ActiveTab } from '../types';
import type { Application } from '../types/api';

interface DashboardViewProps {
  onSelectApplication: (app: Application) => void;
  onOpenAddModal: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  searchQuery: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
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
          (a) => a.company_name.toLowerCase().includes(q) || a.role_title.toLowerCase().includes(q)
        )
      : applications;
    return [...pool].sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1)).slice(0, 6);
  }, [applications, searchQuery]);

  const activeCount = applications.filter((a) =>
    ['applied', 'oa', 'interview'].includes(a.current_status)
  ).length;
  const offerCount = applications.filter((a) => a.current_status === 'offer').length;

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="bg-primary text-on-primary rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">Welcome back{user ? `, ${user.first_name}` : ''}</h1>
          <p className="text-sm text-on-primary/80 mt-1">
            {analytics?.total_applications ?? 0} total applications · {activeCount} active in your pipeline
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-container-lowest text-primary text-sm font-bold rounded-xl hover:opacity-90 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Briefcase className="w-5 h-5" />}
          label="Total Applications"
          value={analytics?.total_applications ?? 0}
        />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Active Pipeline" value={activeCount} accent="secondary" />
        <StatCard icon={<Award className="w-5 h-5" />} label="Offers" value={offerCount} accent="tertiary" />
        <StatCard
          icon={<Clock3 className="w-5 h-5" />}
          label="Stale (21+ days)"
          value={analytics?.stale_count ?? 0}
          accent="error"
          onClick={() => onNavigateTab('applications')}
        />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-xs">
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/20">
          <h3 className="font-bold text-on-surface">Recent Activity</h3>
          <button onClick={() => onNavigateTab('applications')} className="text-xs font-semibold text-primary hover:underline">
            View all
          </button>
        </div>

        {isLoading && applications.length === 0 ? (
          <div className="p-8 text-center text-sm text-on-surface-variant">Loading your applications…</div>
        ) : recent.length === 0 ? (
          <div className="p-8 text-center text-sm text-on-surface-variant">
            No applications yet — add your first one to start tracking.
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/20">
            {recent.map((app) => (
              <div
                key={app.id}
                onClick={() => onSelectApplication(app)}
                className="flex items-center gap-3 p-4 hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-on-surface truncate">{app.role_title}</p>
                  <p className="text-xs text-on-surface-variant truncate">
                    {app.company_name} · {CHANNEL_LABELS[app.channel]}
                  </p>
                </div>
                <span className="text-xs font-semibold text-on-surface-variant shrink-0">
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

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: 'primary' | 'secondary' | 'tertiary' | 'error';
  onClick?: () => void;
}> = ({ icon, label, value, accent = 'primary', onClick }) => {
  const colors: Record<string, string> = {
    primary: 'bg-primary-container text-on-primary-container',
    secondary: 'bg-secondary-container text-on-secondary-container',
    tertiary: 'bg-tertiary-container text-on-tertiary-container',
    error: 'bg-error-container text-on-error-container',
  };
  return (
    <button
      onClick={onClick}
      className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs text-left hover:shadow-md transition-all disabled:cursor-default"
      disabled={!onClick}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${colors[accent]}`}>{icon}</div>
      <p className="text-2xl font-bold text-on-surface">{value}</p>
      <p className="text-xs text-on-surface-variant">{label}</p>
    </button>
  );
};
