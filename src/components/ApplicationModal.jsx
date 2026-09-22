import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    Plus,
    CheckCircle2,
    Globe,
    DollarSign,
    Pencil,
    ArrowLeft,
    MapPin,
    Hash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { applicationSchema } from "../schemas/application";
import { FormField, inputClass } from "./ui/FormField";
import { useData } from "../context/DataContext";
import { getErrorMessage } from "../lib/api";
import {
    CHANNEL_LABELS,
    STATUS_LABELS,
    STATUS_ORDER,
    WORK_MODEL_LABELS,
    JOB_TYPE_LABELS,
} from "../types/api";

// Colour-coded status chips
const STATUS_CHIP_COLORS = {
    applied:   "bg-primary/10 text-primary border-primary/20",
    oa:        "bg-tertiary/10 text-tertiary border-tertiary/20",
    interview: "bg-secondary/10 text-secondary border-secondary/20",
    offer:     "bg-success/10 text-success border-success/20",
    rejected:  "bg-error/10 text-error border-error/20",
    withdrawn: "bg-outline/10 text-outline border-outline/20",
};

const STATUS_CHIP_ACTIVE = {
    applied:   "bg-primary text-on-primary border-primary shadow-sm",
    oa:        "bg-tertiary text-white border-tertiary shadow-sm",
    interview: "bg-secondary text-white border-secondary shadow-sm",
    offer:     "bg-success text-white border-success shadow-sm",
    rejected:  "bg-error text-white border-error shadow-sm",
    withdrawn: "bg-outline text-white border-outline shadow-sm",
};

const overlayVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.18 } },
    exit:    { opacity: 0, transition: { duration: 0.15 } },
};

const modalVariants = {
    hidden:  { opacity: 0, scale: 0.93, y: 20 },
    visible: {
        opacity: 1, scale: 1, y: 0,
        transition: { type: "spring", stiffness: 380, damping: 30 },
    },
    exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } },
};

// Small read-only detail row
function DetailRow({ icon: Icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-2.5 border-b border-outline-variant/15 last:border-0">
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-on-surface-variant" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">{label}</p>
                <p className="text-sm font-medium text-on-surface mt-0.5">{value}</p>
            </div>
        </div>
    );
}

export const ApplicationModal = ({
    isOpen,
    onClose,
    applicationToEdit,
    initialStatus = "applied",
}) => {
    const { addApplication, editApplication, removeApplication, changeStatus } = useData();
    const [serverError, setServerError] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [newStatus, setNewStatus] = useState(initialStatus);
    // isEditing: false = read-only overview; true = edit form
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, touchedFields },
    } = useForm({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            company_name: "",
            role_title: "",
            channel: "company_site",
            source_detail: "",
            work_model: "",
            job_type: "",
            monthly_salary: "",
            date_applied: new Date().toISOString().slice(0, 10),
            resume_version: "",
            notes: "",
        },
    });

    useEffect(() => {
        if (applicationToEdit) {
            reset({
                company_name: applicationToEdit.company_name,
                role_title: applicationToEdit.role_title,
                channel: applicationToEdit.channel,
                source_detail: applicationToEdit.source_detail,
                work_model: applicationToEdit.work_model || "",
                job_type: applicationToEdit.job_type || "",
                monthly_salary: applicationToEdit.monthly_salary || "",
                date_applied: applicationToEdit.date_applied,
                resume_version: applicationToEdit.resume_version,
                notes: applicationToEdit.notes,
            });
            // Start in overview mode when editing
            setIsEditing(false);
        } else {
            reset({
                company_name: "",
                role_title: "",
                channel: "company_site",
                source_detail: "",
                work_model: "",
                job_type: "",
                monthly_salary: "",
                date_applied: new Date().toISOString().slice(0, 10),
                resume_version: "",
                notes: "",
            });
            // New application goes straight to form
            setIsEditing(true);
        }
        setServerError(null);
        setConfirmDelete(false);
        setNewStatus(initialStatus);
    }, [applicationToEdit, isOpen, reset, initialStatus]);

    if (!isOpen) return null;

    const onSubmit = handleSubmit(async (values) => {
        setServerError(null);
        try {
            if (applicationToEdit) {
                await editApplication(applicationToEdit.id, values);
            } else {
                const created = await addApplication(values);
                if (newStatus !== "applied") {
                    await changeStatus(created.id, newStatus);
                }
            }
            onClose();
        } catch (err) {
            setServerError(getErrorMessage(err, "Could not save this application."));
        }
    });

    const handleStatusChange = async (status) => {
        if (!applicationToEdit) return;
        setStatusUpdating(true);
        setServerError(null);
        try {
            await changeStatus(applicationToEdit.id, status);
        } catch (err) {
            setServerError(getErrorMessage(err, "Could not update status."));
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
            setServerError(getErrorMessage(err, "Could not delete this application."));
        }
    };

    const isValid = (field) => touchedFields[field] && !errors[field];

    // ─── Read-only overview panel ────────────────────────────────────────────
    const OverviewPanel = () => (
        <div className="overflow-y-auto flex-1">
            <div className="p-6 space-y-5">
                {serverError && (
                    <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs font-medium flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{serverError}</span>
                    </div>
                )}

                {/* Status section */}
                <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                        Current Status
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {STATUS_ORDER.map((s) => (
                            <button
                                key={s}
                                type="button"
                                disabled={statusUpdating}
                                onClick={() => handleStatusChange(s)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all disabled:opacity-50 ${
                                    applicationToEdit.current_status === s
                                        ? STATUS_CHIP_ACTIVE[s]
                                        : STATUS_CHIP_COLORS[s] + " hover:opacity-80"
                                }`}
                            >
                                {STATUS_LABELS[s]}
                            </button>
                        ))}
                    </div>

                    {applicationToEdit.status_events?.length > 0 && (
                        <div className="mt-3 bg-surface-container-low rounded-xl px-4 py-3 space-y-2">
                            <p className="text-[10px] uppercase font-semibold text-outline tracking-widest">
                                Status history
                            </p>
                            {applicationToEdit.status_events
                                .slice()
                                .reverse()
                                .slice(0, 5)
                                .map((ev) => (
                                    <div
                                        key={ev.id}
                                        className="flex items-center gap-2 text-xs text-on-surface-variant"
                                    >
                                        <Clock className="w-3 h-3 shrink-0 text-outline" />
                                        <span className="font-semibold text-on-surface">
                                            {STATUS_LABELS[ev.status]}
                                        </span>
                                        <span className="text-outline">·</span>
                                        <span>{new Date(ev.occurred_at).toLocaleDateString()}</span>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-outline-variant/20" />

                {/* Detail rows */}
                <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                        Application Details
                    </p>
                    <div>
                        <DetailRow icon={Building2} label="Company" value={applicationToEdit.company_name} />
                        <DetailRow icon={Briefcase} label="Role" value={applicationToEdit.role_title} />
                        <DetailRow icon={Calendar} label="Date Applied" value={applicationToEdit.date_applied} />
                        <DetailRow icon={Tag} label="Applied Via" value={CHANNEL_LABELS[applicationToEdit.channel]} />
                        <DetailRow icon={Globe} label="Work Model" value={applicationToEdit.work_model ? WORK_MODEL_LABELS[applicationToEdit.work_model] : null} />
                        <DetailRow icon={Briefcase} label="Job Type" value={applicationToEdit.job_type ? JOB_TYPE_LABELS[applicationToEdit.job_type] : null} />
                        <DetailRow icon={DollarSign} label="Monthly Salary" value={applicationToEdit.monthly_salary ? `$${Number(applicationToEdit.monthly_salary).toLocaleString()}` : null} />
                        <DetailRow icon={Link2} label="Source Detail" value={applicationToEdit.source_detail} />
                        <DetailRow icon={FileText} label="Resume Version" value={applicationToEdit.resume_version} />
                    </div>
                </div>

                {applicationToEdit.notes && (
                    <>
                        <div className="border-t border-outline-variant/20" />
                        <div>
                            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Notes</p>
                            <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap bg-surface-container-low rounded-xl p-3">
                                {applicationToEdit.notes}
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-surface-container-lowest border-t border-outline-variant/20 px-6 py-4 flex items-center gap-2 shrink-0">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-3 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary-hover transition-all flex items-center justify-center gap-2"
                >
                    <Pencil className="w-4 h-4" />
                    Edit Application
                </motion.button>

                {confirmDelete ? (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-4 py-3 bg-error text-white rounded-xl font-semibold text-sm transition-all hover:opacity-90 flex items-center gap-1.5"
                        >
                            <Trash2 className="w-4 h-4" /> Confirm Delete
                        </button>
                        <button
                            type="button"
                            onClick={() => setConfirmDelete(false)}
                            className="px-3 py-3 border border-outline-variant text-on-surface-variant rounded-xl text-sm hover:bg-surface-container transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="px-4 py-3 rounded-xl font-semibold text-sm bg-error-container text-on-error-container hover:bg-error/20 transition-all flex items-center gap-1.5"
                    >
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                )}
            </div>
        </div>
    );

    // ─── Edit form panel ─────────────────────────────────────────────────────
    const EditFormPanel = () => (
        <form onSubmit={onSubmit} className="overflow-y-auto flex-1" noValidate>
            <div className="p-6 space-y-5">
                {serverError && (
                    <div className="p-3 bg-error-container text-on-error-container rounded-xl text-xs font-medium flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{serverError}</span>
                    </div>
                )}

                {/* Status section */}
                <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                        {applicationToEdit ? "Current Status" : "Starting Status"}
                    </p>
                    {!applicationToEdit ? (
                        <div className="flex flex-wrap gap-1.5">
                            {STATUS_ORDER.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setNewStatus(s)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                                        newStatus === s
                                            ? STATUS_CHIP_ACTIVE[s]
                                            : STATUS_CHIP_COLORS[s] + " hover:opacity-80"
                                    }`}
                                >
                                    {STATUS_LABELS[s]}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-1.5">
                            {STATUS_ORDER.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    disabled={statusUpdating}
                                    onClick={() => handleStatusChange(s)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all disabled:opacity-50 ${
                                        applicationToEdit.current_status === s
                                            ? STATUS_CHIP_ACTIVE[s]
                                            : STATUS_CHIP_COLORS[s] + " hover:opacity-80"
                                    }`}
                                >
                                    {STATUS_LABELS[s]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-outline-variant/20" />

                {/* Core Details */}
                <div className="space-y-3">
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        Core Details
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Company" required icon={<Building2 className="w-4 h-4" />} error={errors.company_name?.message} valid={isValid("company_name")}>
                            <input type="text" placeholder="e.g. Vodafone Ghana" className={inputClass(!!errors.company_name, true, isValid("company_name"))} {...register("company_name")} />
                        </FormField>
                        <FormField label="Role Title" required icon={<Briefcase className="w-4 h-4" />} error={errors.role_title?.message} valid={isValid("role_title")}>
                            <input type="text" placeholder="e.g. Backend Engineer" className={inputClass(!!errors.role_title, true, isValid("role_title"))} {...register("role_title")} />
                        </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Applied Via" required icon={<Tag className="w-4 h-4" />} error={errors.channel?.message} valid={isValid("channel")}>
                            <select className={inputClass(!!errors.channel, true, isValid("channel"))} {...register("channel")}>
                                {Object.entries(CHANNEL_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label="Date Applied" required icon={<Calendar className="w-4 h-4" />} error={errors.date_applied?.message} valid={isValid("date_applied")}>
                            <input type="date" className={inputClass(!!errors.date_applied, true, isValid("date_applied"))} {...register("date_applied")} />
                        </FormField>
                    </div>
                </div>

                <div className="border-t border-outline-variant/20" />

                {/* Tracking Details */}
                <div className="space-y-3">
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        Tracking Details
                    </p>
                    <FormField label="Source Detail" icon={<Link2 className="w-4 h-4" />} error={errors.source_detail?.message} valid={isValid("source_detail")} hint="Referrer name, job post URL, or event name">
                        <input type="text" placeholder="Optional" className={inputClass(!!errors.source_detail, true, isValid("source_detail"))} {...register("source_detail")} />
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Work Model" icon={<Globe className="w-4 h-4" />} error={errors.work_model?.message} valid={isValid("work_model")}>
                            <select className={inputClass(!!errors.work_model, true, isValid("work_model"))} {...register("work_model")}>
                                <option value="">Select (Optional)</option>
                                {Object.entries(WORK_MODEL_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label="Job Type" icon={<Briefcase className="w-4 h-4" />} error={errors.job_type?.message} valid={isValid("job_type")}>
                            <select className={inputClass(!!errors.job_type, true, isValid("job_type"))} {...register("job_type")}>
                                <option value="">Select (Optional)</option>
                                {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </FormField>
                    </div>

                    <FormField label="Monthly Salary" icon={<DollarSign className="w-4 h-4" />} error={errors.monthly_salary?.message} valid={isValid("monthly_salary")}>
                        <input type="number" step="0.01" placeholder="Optional" className={inputClass(!!errors.monthly_salary, true, isValid("monthly_salary"))} {...register("monthly_salary")} />
                    </FormField>

                    <FormField label="Resume Version" icon={<FileText className="w-4 h-4" />} error={errors.resume_version?.message} valid={isValid("resume_version")}>
                        <input type="text" placeholder="e.g. resume_v3_backend.pdf" className={inputClass(!!errors.resume_version, true, isValid("resume_version"))} {...register("resume_version")} />
                    </FormField>

                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                            Notes
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Anything worth remembering about this application…"
                            className={`w-full px-3 py-2.5 text-sm bg-surface-container-low border border-outline-variant hover:border-outline rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-on-surface placeholder:text-outline/60 ${errors.notes ? "border-error/70 focus:ring-error/20" : ""}`}
                            {...register("notes")}
                        />
                        {errors.notes && (
                            <p className="mt-1 text-xs text-error">{errors.notes.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky footer */}
            <div className="sticky bottom-0 bg-surface-container-lowest border-t border-outline-variant/20 px-6 py-4 flex items-center gap-2 shrink-0">
                {applicationToEdit && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="p-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-1"
                        title="Back to overview"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <CheckCircle2 className="w-4 h-4" />
                    )}
                    {isSubmitting
                        ? applicationToEdit ? "Saving…" : "Adding…"
                        : applicationToEdit ? "Save Changes" : "Add Application"}
                </button>

                {applicationToEdit &&
                    (confirmDelete ? (
                        <div className="flex gap-2 animate-[fadeIn_0.15s_ease]">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-3 bg-error text-white rounded-xl font-semibold text-sm transition-all hover:opacity-90 flex items-center gap-1.5"
                            >
                                <Trash2 className="w-4 h-4" /> Confirm Delete
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirmDelete(false)}
                                className="px-3 py-3 border border-outline-variant text-on-surface-variant rounded-xl text-sm hover:bg-surface-container transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            className="px-4 py-3 rounded-xl font-semibold text-sm bg-error-container text-on-error-container hover:bg-error/20 transition-all flex items-center gap-1.5"
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    ))}
            </div>
        </form>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="app-modal-backdrop"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65"
                >
                    <motion.div
                        key="app-modal"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[94vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#6d28d9] via-[#5b21b6] to-[#4c1d95] px-6 py-4 text-white relative shrink-0">
                            <button
                                onClick={onClose}
                                className="absolute top-3.5 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center">
                                    {applicationToEdit ? (
                                        isEditing ? <Pencil className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-base font-bold leading-tight text-white">
                                        {applicationToEdit
                                            ? isEditing ? "Edit Application" : applicationToEdit.company_name
                                            : "Add New Application"}
                                    </h2>
                                    <p className="text-xs text-white/80">
                                        {applicationToEdit
                                            ? isEditing ? "Update your application details" : applicationToEdit.role_title
                                            : "Track a new job opportunity"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Body — switches between overview and edit */}
                        <AnimatePresence mode="wait">
                            {applicationToEdit && !isEditing ? (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0, transition: { duration: 0.2 } }}
                                    exit={{ opacity: 0, x: 20, transition: { duration: 0.15 } }}
                                    className="flex flex-col flex-1 overflow-hidden"
                                >
                                    <OverviewPanel />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="edit"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0, transition: { duration: 0.2 } }}
                                    exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
                                    className="flex flex-col flex-1 overflow-hidden"
                                >
                                    <EditFormPanel />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
