import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  X,
  Building2,
  Briefcase,
  Calendar,
  Tag,
  FileText,
  Link2,
  Trash2,
  AlertCircle,
  Loader2,
  Clock,
} from 'lucide-react';
import { applicationSchema, type ApplicationFormValues } from '../schemas/application';
import { FormField, inputClass } from './ui/FormField';
import { useData } from '../context/DataContext';
import { getErrorMessage } from '../lib/api';
import type { Application, ApplicationStatus } from '../types/api';
import { CHANNEL_LABELS, STATUS_LABELS, STATUS_ORDER } from '../types/api';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationToEdit: Application | null;
  initialStatus?: ApplicationStatus;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  applicationToEdit,
}) => {
  const { addApplication, editApplication, removeApplication, changeStatus } = useData();
  const [serverError, setServerError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('applied');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company_name: '',
      role_title: '',
      channel: 'company_site',
      source_detail: '',
      date_applied: new Date().toISOString().slice(0, 10),
      resume_version: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (applicationToEdit) {
      reset({
        company_name: applicationToEdit.company_name,
        role_title: applicationToEdit.role_title,
        channel: applicationToEdit.channel,
        source_detail: applicationToEdit.source_detail,
        date_applied: applicationToEdit.date_applied,
        resume_version: applicationToEdit.resume_version,
        notes: applicationToEdit.notes,
      });
    } else {
      reset({
        company_name: '',
        role_title: '',
        channel: 'company_site',
        source_detail: '',
        date_applied: new Date().toISOString().slice(0, 10),
        resume_version: '',
        notes: '',
      });
    }
    setServerError(null);
    setConfirmDelete(false);
  }, [applicationToEdit, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const payload = values;
      if (applicationToEdit) {
        await editApplication(applicationToEdit.id, payload);
      } else {
        const created = await addApplication(payload);
        if (newStatus !== 'applied') {
          await changeStatus(created.id, newStatus);
        }
      }
      onClose();
    } catch (err) {
      setServerError(getErrorMessage(err, 'Could not save this application.'));
    }
  });

  const handleStatusChange = async (status: ApplicationStatus) => {
    if (!applicationToEdit) return;
    setStatusUpdating(true);
    setServerError(null);
    try {
      await changeStatus(applicationToEdit.id, status);
    } catch (err) {
      setServerError(getErrorMessage(err, 'Could not update status.'));
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!applicationToEdit) return;
    try {
      await removeApplication(applicationToEdit.id);
      onClose();
    } catch (err) {
      setServerError(getErrorMessage(err, 'Could not delete this application.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[92vh] flex flex-col">
        <div className="bg-primary px-6 py-4 text-on-primary relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-on-primary/80 hover:text-on-primary hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold">{applicationToEdit ? 'Edit Application' : 'Add Application'}</h2>
          <p className="text-xs text-on-primary/80">
            {applicationToEdit ? 'Update details or log a status change' : 'Track a new job application'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4 overflow-y-auto flex-1" noValidate>
          {serverError && (
            <div className="p-3 bg-error-container text-on-error-container rounded-xl text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {!applicationToEdit && (
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Starting Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                className={inputClass(false, false)}
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          )}

          {applicationToEdit && (
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Current Status
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_ORDER.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={statusUpdating}
                    onClick={() => handleStatusChange(s)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-all disabled:opacity-50 ${
                      applicationToEdit.current_status === s
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary'
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>

              {applicationToEdit.status_events.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {applicationToEdit.status_events
                    .slice()
                    .reverse()
                    .slice(0, 4)
                    .map((ev) => (
                      <div key={ev.id} className="flex items-center gap-2 text-xs text-on-surface-variant">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-outline" />
                        <span className="font-medium text-on-surface">{STATUS_LABELS[ev.status]}</span>
                        <span>· {new Date(ev.occurred_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Company" required icon={<Building2 className="w-5 h-5" />} error={errors.company_name?.message}>
              <input
                type="text"
                placeholder="e.g. Vodafone Ghana"
                className={inputClass(!!errors.company_name)}
                {...register('company_name')}
              />
            </FormField>
            <FormField label="Role Title" required icon={<Briefcase className="w-5 h-5" />} error={errors.role_title?.message}>
              <input
                type="text"
                placeholder="e.g. Backend Engineer"
                className={inputClass(!!errors.role_title)}
                {...register('role_title')}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Applied Via" required icon={<Tag className="w-5 h-5" />} error={errors.channel?.message}>
              <select className={inputClass(!!errors.channel)} {...register('channel')}>
                {Object.entries(CHANNEL_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Date Applied" required icon={<Calendar className="w-5 h-5" />} error={errors.date_applied?.message}>
              <input type="date" className={inputClass(!!errors.date_applied)} {...register('date_applied')} />
            </FormField>
          </div>

          <FormField
            label="Source Detail"
            icon={<Link2 className="w-5 h-5" />}
            error={errors.source_detail?.message}
            hint="Referrer name, job post URL, or event name"
          >
            <input
              type="text"
              placeholder="Optional"
              className={inputClass(!!errors.source_detail)}
              {...register('source_detail')}
            />
          </FormField>

          <FormField label="Resume Version" icon={<FileText className="w-5 h-5" />} error={errors.resume_version?.message}>
            <input
              type="text"
              placeholder="e.g. resume_v3_backend.pdf"
              className={inputClass(!!errors.resume_version)}
              {...register('resume_version')}
            />
          </FormField>

          <FormField label="Notes" error={errors.notes?.message}>
            <textarea
              rows={3}
              placeholder="Anything worth remembering about this application…"
              className="w-full px-3 py-2 text-sm bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-on-surface"
              {...register('notes')}
            />
          </FormField>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {applicationToEdit ? 'Save Changes' : 'Add Application'}
            </button>

            {applicationToEdit && (
              <button
                type="button"
                onClick={() => (confirmDelete ? handleDelete() : setConfirmDelete(true))}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 ${
                  confirmDelete
                    ? 'bg-error text-white'
                    : 'bg-error-container text-on-error-container hover:bg-error/20'
                }`}
              >
                <Trash2 className="w-4 h-4" /> {confirmDelete ? 'Confirm' : 'Delete'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
