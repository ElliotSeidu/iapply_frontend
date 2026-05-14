import { MdBarChart, MdTrendingUp, MdDonutLarge, MdCalendarToday } from "react-icons/md";

const StatCard = ({ icon, label, value, sub, accent }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
    {sub && <p className="text-[11px] text-slate-300 border-t border-slate-50 pt-2">{sub}</p>}
  </div>
);

const Analytics = () => {
  return (
    <div className="px-4 py-16 md:px-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Visualise your job search at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<MdBarChart size={18} className="text-violet-600" />} accent="bg-violet-50" label="Total Applications" value="24" sub="Last 30 days" />
        <StatCard icon={<MdTrendingUp size={18} className="text-emerald-600" />} accent="bg-emerald-50" label="Interview Rate" value="33%" sub="8 interviews" />
        <StatCard icon={<MdDonutLarge size={18} className="text-amber-600" />} accent="bg-amber-50" label="Offers Received" value="2" sub="8.3% offer rate" />
        <StatCard icon={<MdCalendarToday size={18} className="text-sky-600" />} accent="bg-sky-50" label="Avg. Response" value="9 days" sub="Across all apps" />
      </div>

      {/* Placeholder chart area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-center min-h-56 text-slate-300 text-sm">
        Charts coming soon — wire up your preferred chart library here.
      </div>
    </div>
  );
};

export default Analytics;