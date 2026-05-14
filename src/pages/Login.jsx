import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const inputCls =
  "w-full bg-slate-50 border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 pl-10";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);

  const handle = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <span
            style={{ fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif" }}
            className="text-xl font-semibold tracking-tight text-[#5a32a3] select-none"
          >
            iApply
          </span>
          <Link
            to="/register"
            className="text-xs font-semibold text-[#6d28d9] border border-purple-200 hover:bg-purple-50 px-4 py-2 rounded-xl transition-all"
          >
            Create account
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-5">
        <div className="w-full max-w-md flex flex-col gap-6">

          {/* Hero text */}
          <div className="text-center">
            <div
              className="inline-block text-4xl font-bold tracking-tight text-[#5a32a3] mb-3 select-none"
              style={{ fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif" }}
            >
              iApply
            </div>
            <h1 className="text-xl font-bold text-slate-800">Welcome back</h1>
            <p className="text-sm text-slate-400 mt-1">Sign in to continue tracking your career.</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">

            {/* Google SSO */}
            <button className="w-full flex items-center justify-center gap-2.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[.98] text-sm font-semibold text-slate-700 py-2.5 rounded-xl transition-all">
              <FcGoogle size={18} />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-300 font-medium">or sign in with email</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handle}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#6d28d9] font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handle}
                  placeholder="••••••••"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setRemember((v) => !v)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  remember
                    ? "bg-[#6d28d9] border-[#6d28d9]"
                    : "border-slate-200 bg-white"
                }`}
              >
                {remember && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className="text-sm text-slate-500 select-none" onClick={() => setRemember((v) => !v)}>
                Remember me for 30 days
              </span>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={() => alert("Sign in logic goes here")}
              className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] active:scale-[.98] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-md shadow-purple-200 mt-1"
            >
              Sign In
            </button>
          </div>

          {/* Footer link */}
          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#6d28d9] font-semibold hover:underline">
              Sign up for free
            </Link>
          </p>

          <p
            className="text-center text-xs text-slate-300"
            style={{ fontFamily: "-apple-system, 'SF Pro Text', BlinkMacSystemFont, sans-serif" }}
          >
            iApply Career Tracker © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;