import { Link } from "react-router-dom";
import { BsFileEarmarkText } from "react-icons/bs";
import { FaRegCheckCircle } from "react-icons/fa";
import { GrSchedule } from "react-icons/gr";
import { IoCloseCircleOutline } from "react-icons/io5";
import { TbBriefcase2 } from "react-icons/tb";
import { MdOpenInNew } from "react-icons/md";
import VelocityChart from "../graphs/VelocityChart";
import StatusChart from "../graphs/StatusChart";

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, subColor, accentBg }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accentBg}`}>
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5 font-medium">{label}</p>
    </div>
    <p className={`text-xs font-semibold ${subColor}`}>{sub}</p>
  </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Interviewing: "bg-amber-100 text-amber-700",
  Applied:      "bg-sky-100 text-sky-700",
  Offered:      "bg-emerald-100 text-emerald-700",
  Rejected:     "bg-red-100 text-red-600",
};

// ─── Activity row ─────────────────────────────────────────────────────────────
const ActivityRow = ({ company, title, status, date }) => (
  <div className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
    <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
      <TbBriefcase2 size={18} className="text-violet-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-800 truncate">{company}</p>
      <p className="text-xs text-slate-400 truncate">{title}</p>
    </div>
    <div className="flex flex-col items-end gap-1 flex-shrink-0">
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[status] || "bg-slate-100 text-slate-500"}`}>
        {status}
      </span>
      <span className="text-[11px] text-slate-300">{date}</span>
    </div>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const RECENT = [
  { company: "TechFlow",   title: "Senior UX Designer",   status: "Interviewing", date: "Oct 24" },
  { company: "Acme Corp",  title: "Product Manager",       status: "Applied",      date: "Nov 1" },
  { company: "StartupXYZ",title: "Frontend Engineer",      status: "Offered",      date: "Oct 30" },
  { company: "Globex",     title: "Data Analyst",          status: "Rejected",     date: "Oct 18" },
];

const Dashboard = () => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="px-4 py-16 md:px-10 flex flex-col gap-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{greeting}, Frank 👋</h1>
        <p className="text-sm text-slate-400 mt-1">You have 3 interviews scheduled this week — keep pushing.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<BsFileEarmarkText size={17} className="text-violet-600" />}
          accentBg="bg-violet-50"
          label="Total Applications" value="42"
          sub="+3 this week" subColor="text-emerald-500"
        />
        <StatCard
          icon={<GrSchedule size={17} className="text-sky-600" />}
          accentBg="bg-sky-50"
          label="Active Interviews" value="5"
          sub="Next: Tomorrow" subColor="text-sky-500"
        />
        <StatCard
          icon={<FaRegCheckCircle size={17} className="text-emerald-600" />}
          accentBg="bg-emerald-50"
          label="Offers Received" value="4"
          sub="9.5% offer rate" subColor="text-emerald-500"
        />
        <StatCard
          icon={<IoCloseCircleOutline size={17} className="text-red-500" />}
          accentBg="bg-red-50"
          label="Rejections" value="32"
          sub="Keep it pushing!" subColor="text-slate-400"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <VelocityChart />
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <StatusChart />
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-700">Recent Activity</p>
          <Link to="/applications" className="text-xs font-semibold text-[#7c3aed] hover:underline flex items-center gap-1">
            View all <MdOpenInNew size={13} />
          </Link>
        </div>
        {RECENT.map((r, i) => <ActivityRow key={i} {...r} />)}
      </div>
    </div>
  );
};

export default Dashboard;