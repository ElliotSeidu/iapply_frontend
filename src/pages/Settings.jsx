import { useState } from "react";
import { FiSave, FiLock, FiLogOut, FiTrash2 } from "react-icons/fi";

const inputCls =
  "w-full bg-slate-50 border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-300";

const labelCls = "block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5";

// ─── Toggle ───────────────────────────────────────────────────────────────────
const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-start justify-between gap-4 py-5 border-b border-slate-100 last:border-0">
    
    <div className="flex-1">
      <p className="text-sm font-semibold text-slate-800">
        {label}
      </p>

      <p className="text-sm text-slate-500 mt-1 leading-relaxed max-w-md">
        {description}
      </p>
    </div>

    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-7 w-14 items-center rounded-full
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-4 focus:ring-violet-200
        shadow-sm
        ${checked 
          ? "bg-gradient-to-r from-violet-600 to-purple-600" 
          : "bg-slate-300"}
      `}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white
          transition-all duration-300 ease-out
          shadow-md
          ${checked ? "translate-x-8" : "translate-x-1"}
        `}
      />
    </button>
  </div>
);

// ─── Section card ─────────────────────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

// ─── Settings ─────────────────────────────────────────────────────────────────
const Settings = () => {
  const [notifs, setNotifs] = useState({ email: true, push: false, weekly: true });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggle = (key) => setNotifs((n) => ({ ...n, [key]: !n[key] }));

  return (
    <div className="px-4 py-16 md:px-10 flex flex-col gap-6 max-w-4xl">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your profile, security, and preferences.</p>
      </div>

      {/* Profile card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative flex-shrink-0">
            <img src="pic.jpg" alt="Profile" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-purple-100" />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full ring-2 ring-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-800">Alex Rivera</h2>
            <p className="text-sm text-slate-400">alex@example.com</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-100 text-violet-700">12 Applications</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">3 Interviews</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Two-column section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account details */}
        <Card>
          <h3 className="text-base font-bold text-slate-800 mb-5">Account Details</h3>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full Name</label>
                <input type="text" placeholder="Franklin Moore" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" placeholder="moore@gmail.com" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Current Role</label>
                <input type="text" placeholder="e.g. UX Designer" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Location</label>
                <input type="text" placeholder="San Francisco, CA" className={inputCls} />
              </div>
            </div>
            <button className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] active:scale-[.98] text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-100 mt-1">
              <FiSave size={14} /> Save Changes
            </button>
          </div>
        </Card>

        {/* Password */}
        <Card>
          <h3 className="text-base font-bold text-slate-800 mb-5">Change Password</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelCls}>Current Password</label>
              <input type="password" placeholder="••••••••" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>New Password</label>
              <input type="password" placeholder="••••••••" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Confirm New Password</label>
              <input type="password" placeholder="••••••••" className={inputCls} />
            </div>
            <button className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] active:scale-[.98] text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-100">
              <FiLock size={14} /> Update Password
            </button>
          </div>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <h3 className="text-base font-bold text-slate-800 mb-1">Notification Preferences</h3>
        <p className="text-xs text-slate-400 mb-4">Choose how you want to be kept in the loop.</p>
        <Toggle
          label="Email Notifications"
          description="Receive activity alerts via email."
          checked={notifs.email}
          onChange={() => toggle("email")}
        />
        <Toggle
          label="Push Notifications"
          description="Instant updates on your browser or mobile device."
          checked={notifs.push}
          onChange={() => toggle("push")}
        />
        <Toggle
          label="Weekly Summary"
          description="A curated progress report delivered every Monday."
          checked={notifs.weekly}
          onChange={() => toggle("weekly")}
        />
      </Card>

      {/* Danger zone */}
      <Card>
        <h3 className="text-base font-bold text-slate-800 mb-1">Account Actions</h3>
        <p className="text-xs text-slate-400 mb-5">Manage your session or permanently remove your account.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[.98] transition-all">
            <FiLogOut size={15} /> Sign Out
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 active:scale-[.98] transition-all"
          >
            <FiTrash2 size={15} /> Delete Account
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm text-red-600 font-medium">This will permanently delete all your data. Are you sure?</p>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setShowDeleteConfirm(false)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white transition">
                Cancel
              </button>
              <button className="text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold">
                Yes, Delete
              </button>
            </div>
          </div>
        )}
      </Card>

      <div className="pb-8" />
    </div>
  );
};

export default Settings;