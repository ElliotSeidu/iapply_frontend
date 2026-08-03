import React, { useMemo, useState } from 'react';
import { Plus, Building2, Clock3 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { CHANNEL_LABELS, STATUS_LABELS, STATUS_ORDER } from '../types/api';
import type { Application, ApplicationStatus } from '../types/api';

interface BoardViewProps {
  onSelectApplication: (app: Application) => void;
  onOpenAddModal: (initialStatus?: ApplicationStatus) => void;
  searchQuery: string;
}

const COLUMN_STYLES: Record<ApplicationStatus, { border: string; badge: string }> = {
  applied: { border: 'border-primary', badge: 'bg-primary-container text-on-primary-container' },
  oa: { border: 'border-tertiary', badge: 'bg-tertiary-container text-on-tertiary-container' },
  interview: { border: 'border-blue-500', badge: 'bg-blue-100 text-blue-800' },
  offer: { border: 'border-secondary', badge: 'bg-secondary-container text-on-secondary-container' },
  rejected: { border: 'border-error', badge: 'bg-error-container text-on-error-container' },
  withdrawn: { border: 'border-outline', badge: 'bg-surface-container-high text-on-surface-variant' },
};

export const BoardView: React.FC<BoardViewProps> = ({ onSelectApplication, onOpenAddModal, searchQuery }) => {
  const { applications, changeStatus } = useData();
  const [draggingId, setDraggingId] = useState<string | null>(null);

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
    const map: Record<ApplicationStatus, Application[]> = {
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

  const handleDrop = async (status: ApplicationStatus) => {
    if (!draggingId) return;
    const app = applications.find((a) => a.id === draggingId);
    setDraggingId(null);
    if (!app || app.current_status === status) return;
    try {
      await changeStatus(app.id, status);
    } catch {
      // Errors surface via the global data error banner on the next refresh.
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Application Kanban Board</h2>
          <p className="text-xs text-on-surface-variant">Drag a card between columns to log a status change</p>
        </div>
        <button
          onClick={() => onOpenAddModal('applied')}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary-hover transition-all"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_ORDER.map((status) => {
          const style = COLUMN_STYLES[status];
          const items = grouped[status];
          return (
            <div
              key={status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(status)}
              className={`shrink-0 w-72 bg-surface-container-low rounded-2xl border-t-4 ${style.border} p-3 flex flex-col`}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-bold text-sm text-on-surface">{STATUS_LABELS[status]}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.badge}`}>{items.length}</span>
              </div>

              <div className="flex-1 space-y-2 min-h-[80px]">
                {items.map((app) => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={() => setDraggingId(app.id)}
                    onClick={() => onSelectApplication(app)}
                    className="bg-surface-container-lowest rounded-xl p-3 shadow-xs border border-outline-variant/20 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-on-surface truncate">{app.role_title}</p>
                        <p className="text-xs text-on-surface-variant truncate">{app.company_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[11px] text-on-surface-variant">
                      <span>{CHANNEL_LABELS[app.channel]}</span>
                      {app.is_stale && (
                        <span className="flex items-center gap-1 text-tertiary font-semibold">
                          <Clock3 className="w-3 h-3" /> Stale
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <button
                    onClick={() => onOpenAddModal(status)}
                    className="w-full py-6 text-xs text-on-surface-variant/60 hover:text-primary hover:border-primary border border-dashed border-outline-variant/40 rounded-xl transition-colors"
                  >
                    + Add here
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
