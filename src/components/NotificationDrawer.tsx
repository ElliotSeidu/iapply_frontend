import React, { useMemo } from 'react';
import { X, Clock3, BellRing, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Application } from '../types/api';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectApplication: (app: Application) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, onSelectApplication }) => {
  const { applications, reminders, editReminder } = useData();

  const staleApps = useMemo(() => applications.filter((a) => a.is_stale), [applications]);

  const upcomingReminders = useMemo(() => {
    const now = Date.now();
    return reminders
      .filter((r) => !r.is_done)
      .filter((r) => new Date(r.remind_at).getTime() <= now + 1000 * 60 * 60 * 24 * 3) // due within 3 days or overdue
      .sort((a, b) => (a.remind_at < b.remind_at ? -1 : 1));
  }, [reminders]);

  if (!isOpen) return null;

  const totalCount = staleApps.length + upcomingReminders.length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-on-surface/30 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface-container-lowest h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/20">
          <h3 className="font-bold text-on-surface flex items-center gap-2">
            <BellRing className="w-5 h-5 text-primary" /> Notifications
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-surface-container-low">
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {totalCount === 0 ? (
            <div className="p-8 text-center text-sm text-on-surface-variant">You're all caught up.</div>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {upcomingReminders.map((r) => {
                const app = applications.find((a) => a.id === r.application);
                const overdue = new Date(r.remind_at).getTime() < Date.now();
                return (
                  <div key={r.id} className="p-4 flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${overdue ? 'bg-error-container text-on-error-container' : 'bg-tertiary-container text-on-tertiary-container'}`}>
                      <Clock3 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-semibold text-on-surface truncate cursor-pointer hover:underline"
                        onClick={() => app && onSelectApplication(app)}
                      >
                        {r.message}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {app ? `${app.role_title} @ ${app.company_name}` : ''} ·{' '}
                        {new Date(r.remind_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => editReminder(r.id, { is_done: true })}
                      className="p-1.5 text-outline hover:text-secondary rounded-full shrink-0"
                      title="Mark done"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {staleApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 flex items-start gap-3 cursor-pointer hover:bg-surface-container-low"
                  onClick={() => onSelectApplication(app)}
                >
                  <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                    <Clock3 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-on-surface truncate">No movement in {app.days_since_applied} days</p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {app.role_title} @ {app.company_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
