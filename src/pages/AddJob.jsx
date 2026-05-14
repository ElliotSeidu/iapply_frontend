import { useState } from "react";
import { FiSave, FiLink, FiBriefcase, FiCalendar, FiFileText } from "react-icons/fi";
import { MdOutlineBusinessCenter } from "react-icons/md";

const statusOptions = [
  { value: "applied", label: "Applied", color: "bg-blue-100 text-blue-700" },
  { value: "interview", label: "Interview", color: "bg-amber-100 text-amber-700" },
  { value: "offer", label: "Offer", color: "bg-green-100 text-green-700" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
  { value: "withdrawn", label: "Withdrawn", color: "bg-slate-100 text-slate-600" },
];

const Field = ({ label, icon, children }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
      {icon}
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-300";

const AddJob = () => {
  const [form, setForm] = useState({
    company: "", title: "", link: "", status: "", date: "", notes: "",
  });

  const handle = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-[calc(100vh-57px)] flex flex-col px-4 py-16 md:px-10">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Add Application</h1>
        <p className="text-sm text-slate-400 mt-1">Keep your career momentum organized, one role at a time.</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col gap-5">

        <div className="flex flex-col md:flex-row gap-5">
          <Field label="Company Name" icon={<MdOutlineBusinessCenter size={13} />}>
            <input
              name="company" value={form.company} onChange={handle}
              type="text" placeholder="e.g. Acme Corp"
              className={inputCls} required
            />
          </Field>
          <Field label="Job Title" icon={<FiBriefcase size={13} />}>
            <input
              name="title" value={form.title} onChange={handle}
              type="text" placeholder="e.g. Product Designer"
              className={inputCls} required
            />
          </Field>
        </div>

        <Field label="Job Link" icon={<FiLink size={13} />}>
          <input
            name="link" value={form.link} onChange={handle}
            type="url" placeholder="https://linkedin.com/jobs/..."
            className={inputCls}
          />
        </Field>

        <div className="flex flex-col md:flex-row gap-5">
          <Field label="Status" icon={<span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />}>
            <select
              name="status" value={form.status} onChange={handle}
              className={inputCls} required
            >
              <option value="" disabled>Select status…</option>
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Date Applied" icon={<FiCalendar size={13} />}>
            <input
              name="date" value={form.date} onChange={handle}
              type="date" max={today}
              className={inputCls} required
            />
          </Field>
        </div>

        <Field label="Notes" icon={<FiFileText size={13} />}>
          <textarea
            name="notes" value={form.notes} onChange={handle}
            placeholder="Key requirements, referral names, prep notes…"
            className={`${inputCls} resize-none`}
            rows={4}
          />
        </Field>

        <button
          type="button"
          onClick={() => alert("Saved! (wire up your save logic here)")}
          className="mt-1 w-full bg-[#6d28d9] hover:bg-[#5b21b6] active:scale-[.98] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-md shadow-purple-200"
        >
          <FiSave size={16} />
          Save Application
        </button>
      </div>

      <p
        className="text-center text-xs text-slate-300 mt-10"
        style={{ fontFamily: "-apple-system, 'SF Pro Text', BlinkMacSystemFont, sans-serif" }}
      >
        iApply Career Tracker © {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default AddJob;