import React, { useMemo, useState } from 'react';
import { Plus, Search, Trash2, Building2, Clock3, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { CHANNEL_LABELS, STATUS_LABELS, STATUS_ORDER } from '../types/api';
import type { Application, ApplicationStatus } from '../types/api';

interface ApplicationsViewProps {
  onSelectApplication: (app: Application) => void;
  onOpenAddModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const STATUS_BADGE: Record<ApplicationStatus, string> = {
  applied: 'bg-primary-container text-on-primary-container',
  oa: 'bg-tertiary-container text-on-tertiary-container',
  interview: 'bg-blue-100 text-blue-800',
  offer: 'bg-secondary-container text-on-secondary-container',
  rejected: 'bg-error-container text-on-error-container',
  withdrawn: 'bg-surface-container-high text-on-surface-variant',
};

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  onSelectApplication,
  onOpenAddModal,
  searchQuery,
  setSearchQuery,
}) => {
  const { applications, removeApplication } = useData();
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return applications.filter((a) => {
      const matchesSearch =
        !q || a.company_name.toLowerCase().includes(q) || a.role_title.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || a.current_status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const handleDelete = async (id: string) => {
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
    <div className="space-y-4 pb-20 md:pb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-on-surface">All Applications</h2>
          <p className="text-xs text-on-surface-variant">{filtered.length} of {applications.length} shown</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-outline" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company or role…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
            />
          </div>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary-hover transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
            statusFilter === 'all'
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-surface-container-low text-on-surface-variant border-outline-variant'
          }`}
        >
          All
        </button>
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
              statusFilter === s
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-low text-on-surface-variant border-outline-variant'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-on-surface-variant text-sm">
            No applications match your filters yet.
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/20">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-3 p-4 hover:bg-surface-container-low transition-colors cursor-pointer"
                onClick={() => onSelectApplication(app)}
              >
                <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-on-surface truncate">{app.role_title}</p>
                  <p className="text-xs text-on-surface-variant truncate">
                    {app.company_name} · {CHANNEL_LABELS[app.channel]}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs text-on-surface-variant shrink-0">
                  {app.is_stale && (
                    <span className="flex items-center gap-1 text-tertiary font-semibold mr-2">
                      <Clock3 className="w-3.5 h-3.5" /> {app.days_since_applied}d
                    </span>
                  )}
                  <span className="text-outline">{new Date(app.date_applied).toLocaleDateString()}</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${STATUS_BADGE[app.current_status]}`}>
                  {STATUS_LABELS[app.current_status]}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(app.id);
                  }}
                  className={`p-2 rounded-full transition-colors shrink-0 ${
                    pendingDeleteId === app.id
                      ? 'bg-error text-white'
                      : 'text-outline hover:text-error hover:bg-error-container/30'
                  }`}
                  title={pendingDeleteId === app.id ? 'Click again to confirm' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4 text-outline hidden md:block" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
